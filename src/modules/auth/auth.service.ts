import { Service } from 'typedi'
import { User, AuthProvider as AuthProviderModel, AuthProviderType, Token, Session } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { authenticator } from 'otplib'
import { OAuth2Client } from 'google-auth-library'
import { nanoid } from 'nanoid'
import { createHash, randomBytes } from 'crypto'
import { logger } from '@shared/logger'
import { config } from '@infrastructure/config'
import { prisma } from '@infrastructure/database/prisma.service'
import { redis } from '@infrastructure/cache/redis.service'
import { EmailService } from '@shared/services/email.service'
import { EventBus } from '@shared/events/event-bus'
import {
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  NotFoundException
} from '@shared/exceptions'
import {
  hashPassword,
  verifyPassword,
  generateSecureToken
} from '@shared/utils/crypto'

export interface RegisterDTO {
  email: string
  password: string
  firstName?: string
  lastName?: string
  username?: string
}

export interface LoginDTO {
  email: string
  password: string
  twoFactorCode?: string
  ip?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string
}

export interface JwtPayload {
  sub: string // user id
  email: string
  role: string
  sessionId?: string
  tenantId?: string
  permissions?: string[]
  type: 'access' | 'refresh'
  iat?: number
  exp?: number
}

export interface OAuthProfile {
  id: string
  email: string
  name?: string
  firstName?: string
  lastName?: string
  avatar?: string
  provider: 'google' | 'github' | 'facebook'
}

@Service()
export class AuthService {
  private googleClient: OAuth2Client

  constructor(
    private emailService: EmailService,
    private eventBus: EventBus
  ) {
    this.googleClient = new OAuth2Client(
      config.oauth.google.clientId,
      config.oauth.google.clientSecret,
      config.oauth.google.callbackUrl
    )
  }

  // User Registration
  async register(dto: RegisterDTO): Promise<{ user: User; tokens: AuthTokens }> {
    // Check if registration is enabled
    if (!config.features.registration) {
      throw new BadRequestException('Registration is currently disabled')
    }

    // Validate email format
    if (!this.isValidEmail(dto.email)) {
      throw new BadRequestException('Invalid email format')
    }

    // Check if user already exists
    const existingUser = await prisma.client.user.findFirst({
      where: {
        OR: [
          { email: dto.email.toLowerCase() },
          { username: dto.username }
        ]
      }
    })

    if (existingUser) {
      throw new ConflictException('User already exists')
    }

    // Validate password strength
    this.validatePasswordStrength(dto.password)

    // Hash password
    const hashedPassword = await hashPassword(dto.password)

    // Create user
    const user = await prisma.client.user.create({
      data: {
        email: dto.email.toLowerCase(),
        username: dto.username,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        displayName: `${dto.firstName || ''} ${dto.lastName || ''}`.trim() || dto.email.split('@')[0]
      }
    })

    // Generate tokens
    const tokens = await this.generateAuthTokens(user)

    // Send verification email
    if (config.features.emailVerification) {
      await this.sendVerificationEmail(user)
    }

    // Emit event
    await this.eventBus.emit('user.registered', {
      userId: user.id,
      email: user.email,
      timestamp: new Date()
    })

    // Audit log
    logger.audit('user.register', {
      userId: user.id,
      email: user.email
    })

    return { user, tokens }
  }

  // User Login
  async login(dto: LoginDTO): Promise<{ user: User; tokens: AuthTokens; requiresTwoFactor?: boolean }> {
    // Find user
    const user = await prisma.client.user.findUnique({
      where: { email: dto.email.toLowerCase() }
    })

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException(`Account is ${user.status.toLowerCase()}`)
    }

    // Verify password
    const isValidPassword = await verifyPassword(dto.password, user.password)
    if (!isValidPassword) {
      // Log failed attempt
      await this.logFailedLoginAttempt(user.id, dto.email)
      throw new UnauthorizedException('Invalid credentials')
    }

    // Check 2FA
    if (user.twoFactorEnabled) {
      if (!dto.twoFactorCode) {
        return {
          user,
          tokens: {} as AuthTokens,
          requiresTwoFactor: true
        }
      }

      const isValid2FA = this.verify2FACode(user.twoFactorSecret!, dto.twoFactorCode)
      if (!isValid2FA) {
        throw new UnauthorizedException('Invalid 2FA code')
      }
    }

    // Generate tokens
    const tokens = await this.generateAuthTokens(user)

    // Update last login
    await prisma.client.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: dto.ip || null,
        loginCount: { increment: 1 }
      }
    })

    // Emit event
    await this.eventBus.emit('user.loggedIn', {
      userId: user.id,
      timestamp: new Date()
    })

    // Audit log
    logger.audit('user.login', {
      userId: user.id,
      email: user.email
    })

    return { user, tokens }
  }

  // OAuth Login
  async oauthLogin(profile: OAuthProfile): Promise<{ user: User; tokens: AuthTokens }> {
    // Check if OAuth is enabled
    if (!config.features.oauth) {
      throw new BadRequestException('OAuth login is disabled')
    }

    // Find existing auth provider
    let authProvider = await prisma.client.authProvider.findUnique({
      where: {
        provider_providerId: {
          provider: profile.provider.toUpperCase() as AuthProviderType,
          providerId: profile.id
        }
      },
      include: { user: true }
    })

    let user: User

    if (authProvider) {
      // Existing user
      user = authProvider.user

      // Update provider data
      await prisma.client.authProvider.update({
        where: { id: authProvider.id },
        data: {
          providerEmail: profile.email,
          metadata: profile as any
        }
      })
    } else {
      // Check if user exists with same email
      user = await prisma.client.user.findUnique({
        where: { email: profile.email.toLowerCase() }
      }) || await prisma.client.user.create({
        data: {
          email: profile.email.toLowerCase(),
          firstName: profile.firstName,
          lastName: profile.lastName,
          displayName: profile.name || profile.email.split('@')[0],
          avatar: profile.avatar,
          emailVerified: true,
          emailVerifiedAt: new Date()
        }
      })

      // Create auth provider
      await prisma.client.authProvider.create({
        data: {
          userId: user.id,
          provider: profile.provider.toUpperCase() as AuthProviderType,
          providerId: profile.id,
          providerEmail: profile.email,
          metadata: profile as any
        }
      })
    }

    // Generate tokens
    const tokens = await this.generateAuthTokens(user)

    // Update last login
    await prisma.client.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        loginCount: { increment: 1 }
      }
    })

    // Emit event
    await this.eventBus.emit('user.oauthLogin', {
      userId: user.id,
      provider: profile.provider,
      timestamp: new Date()
    })

    return { user, tokens }
  }

  // Verify Google ID Token
  async verifyGoogleToken(idToken: string): Promise<OAuthProfile> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: config.oauth.google.clientId
      })

      const payload = ticket.getPayload()
      if (!payload) {
        throw new UnauthorizedException('Invalid Google token')
      }

      return {
        id: payload.sub,
        email: payload.email!,
        name: payload.name,
        firstName: payload.given_name,
        lastName: payload.family_name,
        avatar: payload.picture,
        provider: 'google'
      }
    } catch (error) {
      logger.error('Google token verification failed', error as Error)
      throw new UnauthorizedException('Invalid Google token')
    }
  }

  // Refresh Tokens
  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const payload = jwt.verify(
        refreshToken,
        config.security.jwt.refreshSecret
      ) as JwtPayload

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type')
      }

      // Check if token exists in database
      const tokenRecord = await prisma.client.token.findUnique({
        where: { token: refreshToken }
      })

      if (!tokenRecord || tokenRecord.usedAt) {
        throw new UnauthorizedException('Invalid refresh token')
      }

      // Check if session is valid
      const session = await prisma.client.session.findUnique({
        where: { id: payload.sessionId }
      })

      if (!session || session.expiresAt < new Date()) {
        throw new UnauthorizedException('Session expired')
      }

      // Get user
      const user = await prisma.client.user.findUnique({
        where: { id: payload.sub }
      })

      if (!user || user.status !== 'ACTIVE') {
        throw new UnauthorizedException('User not found or inactive')
      }

      // Mark old refresh token as used
      await prisma.client.token.update({
        where: { id: tokenRecord.id },
        data: { usedAt: new Date() }
      })

      // Generate new tokens
      return await this.generateAuthTokens(user, session.id)
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid refresh token')
      }
      throw error
    }
  }

  // Logout
  async logout(userId: string, sessionId?: string): Promise<void> {
    if (sessionId) {
      // Logout from specific session
      await prisma.client.session.delete({
        where: { id: sessionId }
      })

      // Invalidate tokens
      await redis.delete(`session:${sessionId}`)
    } else {
      // Logout from all sessions
      await prisma.client.session.deleteMany({
        where: { userId }
      })

      // Clear all user tokens from cache
      await redis.invalidateByPattern(`session:*:${userId}`)
    }

    // Emit event
    await this.eventBus.emit('user.loggedOut', {
      userId,
      sessionId,
      timestamp: new Date()
    })
  }

  // Enable 2FA
  async enable2FA(userId: string): Promise<{ secret: string; qrCode: string; backupCodes: string[] }> {
    const user = await prisma.client.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (user.twoFactorEnabled) {
      throw new BadRequestException('2FA is already enabled')
    }

    // Generate secret
    const secret = authenticator.generateSecret()

    // Generate QR code URL
    const otpauth = authenticator.keyuri(
      user.email,
      config.app.name,
      secret
    )

    // Generate QR code
    const QRCode = await import('qrcode')
    const qrCode = await QRCode.toDataURL(otpauth)

    // Generate backup codes
    const backupCodes = Array.from({ length: 10 }, () =>
      nanoid(8).toUpperCase()
    )

    // Store temporarily in cache (10 minutes)
    await redis.set(
      `2fa:setup:${userId}`,
      { secret, backupCodes },
      { ttl: 600 }
    )

    return { secret, qrCode, backupCodes }
  }

  // Confirm 2FA
  async confirm2FA(userId: string, code: string): Promise<void> {
    // Get setup data from cache
    const setupData = await redis.get<{ secret: string; backupCodes: string[] }>(
      `2fa:setup:${userId}`
    )

    if (!setupData) {
      throw new BadRequestException('2FA setup expired or not found')
    }

    // Verify code
    const isValid = authenticator.verify({
      token: code,
      secret: setupData.secret
    })

    if (!isValid) {
      throw new BadRequestException('Invalid 2FA code')
    }

    // Hash backup codes
    const hashedBackupCodes = await Promise.all(
      setupData.backupCodes.map(code => hashPassword(code))
    )

    // Update user
    await prisma.client.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: true,
        twoFactorSecret: setupData.secret,
        metadata: {
          twoFactorBackupCodes: hashedBackupCodes
        }
      }
    })

    // Clear setup data
    await redis.delete(`2fa:setup:${userId}`)

    // Emit event
    await this.eventBus.emit('user.2faEnabled', {
      userId,
      timestamp: new Date()
    })
  }

  // Disable 2FA
  async disable2FA(userId: string, password: string): Promise<void> {
    const user = await prisma.client.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (!user.twoFactorEnabled) {
      throw new BadRequestException('2FA is not enabled')
    }

    // Verify password
    if (user.password) {
      const isValid = await verifyPassword(password, user.password)
      if (!isValid) {
        throw new UnauthorizedException('Invalid password')
      }
    }

    // Update user
    await prisma.client.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        metadata: {
          twoFactorBackupCodes: null
        }
      }
    })

    // Emit event
    await this.eventBus.emit('user.2faDisabled', {
      userId,
      timestamp: new Date()
    })
  }

  // Password Reset Request
  async requestPasswordReset(email: string): Promise<void> {
    const user = await prisma.client.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      // Don't reveal if user exists
      return
    }

    // Generate reset token
    const resetToken = generateSecureToken()
    const hashedToken = createHash('sha256').update(resetToken).digest('hex')

    // Store token
    await prisma.client.token.create({
      data: {
        userId: user.id,
        type: 'PASSWORD_RESET',
        token: hashedToken,
        expiresAt: new Date(Date.now() + 3600000) // 1 hour
      }
    })

    // Send email
    await this.emailService.sendPasswordResetEmail(user.email, resetToken)

    // Emit event
    await this.eventBus.emit('user.passwordResetRequested', {
      userId: user.id,
      timestamp: new Date()
    })
  }

  // Reset Password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Hash token
    const hashedToken = createHash('sha256').update(token).digest('hex')

    // Find token
    const tokenRecord = await prisma.client.token.findUnique({
      where: { token: hashedToken },
      include: { user: true }
    })

    if (!tokenRecord || tokenRecord.type !== 'PASSWORD_RESET') {
      throw new BadRequestException('Invalid or expired reset token')
    }

    if (tokenRecord.expiresAt < new Date()) {
      throw new BadRequestException('Reset token has expired')
    }

    if (tokenRecord.usedAt) {
      throw new BadRequestException('Reset token has already been used')
    }

    // Validate password strength
    this.validatePasswordStrength(newPassword)

    // Hash new password
    const hashedPassword = await hashPassword(newPassword)

    // Update user password
    await prisma.client.user.update({
      where: { id: tokenRecord.userId! },
      data: { password: hashedPassword }
    })

    // Mark token as used
    await prisma.client.token.update({
      where: { id: tokenRecord.id },
      data: { usedAt: new Date() }
    })

    // Invalidate all sessions
    await this.logout(tokenRecord.userId!)

    // Send confirmation email
    await this.emailService.sendPasswordChangedEmail(tokenRecord.user!.email)

    // Emit event
    await this.eventBus.emit('user.passwordReset', {
      userId: tokenRecord.userId,
      timestamp: new Date()
    })
  }

  // Verify access token
  async verifyAccessToken(token: string): Promise<JwtPayload> {
    try {
      // Verify token
      const payload = jwt.verify(
        token,
        config.security.jwt.accessSecret
      ) as JwtPayload;

      // Check token type
      if (payload.type !== 'access') {
        throw new UnauthorizedException('Invalid token type');
      }

      // Check if session exists and is valid
      if (payload.sessionId) {
        const sessionExists = await redis.get(`session:${payload.sessionId}`);

        if (!sessionExists) {
          // Check database if not in cache
          const session = await prisma.client.session.findUnique({
            where: {
              id: payload.sessionId,
              expiresAt: { gt: new Date() }
            }
          });

          if (!session) {
            throw new UnauthorizedException('Session expired or invalid');
          }

          // Refresh cache
          await redis.set(
            `session:${payload.sessionId}`,
            { userId: payload.sub, role: payload.role },
            { ttl: 900 } // 15 minutes
          );
        }
      }

      return payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      }

      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      }

      throw new UnauthorizedException('Authentication failed');
    }
  }

  // Helper Methods

  private async generateAuthTokens(user: User, sessionId?: string): Promise<AuthTokens> {
    // Create or get session
    const session = sessionId
      ? await prisma.client.session.findUnique({ where: { id: sessionId } })
      : await prisma.client.session.create({
          data: {
            userId: user.id,
            token: nanoid(32),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
          }
        })

    if (!session) {
      throw new Error('Failed to create session')
    }

    // Create JWT payload
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      sessionId: session.id,
      type: 'access'
    }

    // Generate access token
    const accessToken = jwt.sign(
      payload,
      config.security.jwt.accessSecret,
      { expiresIn: config.security.jwt.accessExpiresIn } as jwt.SignOptions
    )

    // Generate refresh token
    const refreshPayload: JwtPayload = { ...payload, type: 'refresh' }
    const refreshToken = jwt.sign(
      refreshPayload,
      config.security.jwt.refreshSecret,
      { expiresIn: config.security.jwt.refreshExpiresIn } as jwt.SignOptions
    )

    // Store refresh token
    await prisma.client.token.create({
      data: {
        userId: user.id,
        type: 'REFRESH',
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })

    // Cache session
    await redis.set(
      `session:${session.id}`,
      { userId: user.id, role: user.role },
      { ttl: 900 } // 15 minutes
    )

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
      tokenType: 'Bearer'
    }
  }

  private verify2FACode(secret: string, code: string): boolean {
    return authenticator.verify({
      token: code,
      secret
    })
  }

  private async sendVerificationEmail(user: User): Promise<void> {
    const verificationToken = generateSecureToken()
    const hashedToken = createHash('sha256').update(verificationToken).digest('hex')

    await prisma.client.token.create({
      data: {
        userId: user.id,
        type: 'EMAIL_VERIFICATION',
        token: hashedToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    })

    await this.emailService.sendVerificationEmail(user.email, verificationToken)
  }

  private async logFailedLoginAttempt(userId: string, email: string): Promise<void> {
    // Increment failed login count
    const key = `failed_login:${email}`
    const attempts = await redis.increment(key)

    // Set expiry on first attempt
    if (attempts === 1) {
      await redis.expire(key, 900) // 15 minutes
    }

    // Lock account after 5 failed attempts
    if (attempts >= 5) {
      await prisma.client.user.update({
        where: { id: userId },
        data: { status: 'SUSPENDED' }
      })

      logger.security('account.locked', {
        userId,
        email,
        attempts
      })
    }
  }

  private validatePasswordStrength(password: string): void {
    if (password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long')
    }

    if (!/[A-Z]/.test(password)) {
      throw new BadRequestException('Password must contain at least one uppercase letter')
    }

    if (!/[a-z]/.test(password)) {
      throw new BadRequestException('Password must contain at least one lowercase letter')
    }

    if (!/[0-9]/.test(password)) {
      throw new BadRequestException('Password must contain at least one number')
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      throw new BadRequestException('Password must contain at least one special character')
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Additional public methods
  async verifyEmail(token: string): Promise<void> {
    const hashedToken = createHash('sha256').update(token).digest('hex')

    const tokenRecord = await prisma.client.token.findUnique({
      where: { token: hashedToken },
      include: { user: true }
    })

    if (!tokenRecord || tokenRecord.type !== 'EMAIL_VERIFICATION') {
      throw new BadRequestException('Invalid or expired verification token')
    }

    if (tokenRecord.expiresAt < new Date()) {
      throw new BadRequestException('Verification token has expired')
    }

    if (tokenRecord.usedAt) {
      throw new BadRequestException('Verification token has already been used')
    }

    // Update user
    await prisma.client.user.update({
      where: { id: tokenRecord.userId! },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date()
      }
    })

    // Mark token as used
    await prisma.client.token.update({
      where: { id: tokenRecord.id },
      data: { usedAt: new Date() }
    })

    await this.eventBus.emit('user.emailVerified', {
      userId: tokenRecord.userId,
      timestamp: new Date()
    })
  }

  async getUserById(userId: string): Promise<User> {
    const user = await prisma.client.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  getGoogleAuthUrl(): string {
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    url.searchParams.append('client_id', config.oauth.google.clientId!)
    url.searchParams.append('redirect_uri', config.oauth.google.callbackUrl!)
    url.searchParams.append('response_type', 'code')
    url.searchParams.append('scope', 'openid email profile')
    url.searchParams.append('access_type', 'offline')
    url.searchParams.append('prompt', 'consent')

    return url.toString()
  }

  async handleGoogleCallback(code: string): Promise<{ user: User; tokens: AuthTokens }> {
    // Exchange code for tokens
    const tokenUrl = 'https://oauth2.googleapis.com/token'
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        code,
        client_id: config.oauth.google.clientId!,
        client_secret: config.oauth.google.clientSecret!,
        redirect_uri: config.oauth.google.callbackUrl!,
        grant_type: 'authorization_code'
      })
    })

    if (!response.ok) {
      throw new UnauthorizedException('Failed to exchange code for tokens')
    }

    const { id_token } = await response.json()
    const profile = await this.verifyGoogleToken(id_token)

    return this.oauthLogin(profile)
  }
}
