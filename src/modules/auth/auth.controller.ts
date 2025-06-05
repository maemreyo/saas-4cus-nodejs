import { FastifyRequest, FastifyReply } from 'fastify'
import { Service } from 'typedi'
import { AuthService } from './auth.service'
import {
  RegisterDTO,
  LoginDTO,
  RefreshTokenDTO,
  ResetPasswordRequestDTO,
  ResetPasswordDTO,
  Enable2FADTO,
  Verify2FADTO
} from './auth.dto'
import { validateSchema } from '@shared/validators'
import { config } from '@infrastructure/config'

@Service()
export class AuthController {
  constructor(private authService: AuthService) {}

  async register(request: FastifyRequest<{ Body: RegisterDTO }>, reply: FastifyReply) {
    const dto = await validateSchema(RegisterDTO.schema, request.body) as RegisterDTO
    const result = await this.authService.register(dto)

    reply.code(201).send({
      message: 'Registration successful',
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName
        },
        tokens: result.tokens
      }
    })
  }

  async login(request: FastifyRequest<{ Body: LoginDTO }>, reply: FastifyReply) {
    const dto = await validateSchema(LoginDTO.schema, request.body) as LoginDTO
    dto.ip = request.ip

    const result = await this.authService.login(dto)

    if (result.requiresTwoFactor) {
      reply.code(200).send({
        message: '2FA required',
        data: {
          requiresTwoFactor: true
        }
      })
      return
    }

    reply.code(200).send({
      message: 'Login successful',
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          role: result.user.role
        },
        tokens: result.tokens
      }
    })
  }

  async refreshToken(request: FastifyRequest<{ Body: RefreshTokenDTO }>, reply: FastifyReply) {
    const dto = await validateSchema(RefreshTokenDTO.schema, request.body) as RefreshTokenDTO
    const tokens = await this.authService.refreshTokens(dto.refreshToken)

    reply.code(200).send({
      message: 'Token refreshed',
      data: { tokens }
    })
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    const sessionId = request.headers['x-session-id'] as string
    await this.authService.logout(request.customUser!.id, sessionId)

    reply.code(200).send({
      message: 'Logout successful'
    })
  }

  async forgotPassword(request: FastifyRequest<{ Body: ResetPasswordRequestDTO }>, reply: FastifyReply) {
    const dto = await validateSchema(ResetPasswordRequestDTO.schema, request.body) as ResetPasswordRequestDTO
    await this.authService.requestPasswordReset(dto.email)

    reply.code(200).send({
      message: 'If the email exists, a reset link has been sent'
    })
  }

  async resetPassword(request: FastifyRequest<{ Body: ResetPasswordDTO }>, reply: FastifyReply) {
    const dto = await validateSchema(ResetPasswordDTO.schema, request.body) as ResetPasswordDTO
    await this.authService.resetPassword(dto.token, dto.password)

    reply.code(200).send({
      message: 'Password reset successful'
    })
  }

  async verifyEmail(request: FastifyRequest<{ Querystring: { token: string } }>, reply: FastifyReply) {
    await this.authService.verifyEmail(request.query.token)

    reply.code(200).send({
      message: 'Email verified successfully'
    })
  }

  async getCurrentUser(request: FastifyRequest, reply: FastifyReply) {
    const user = await this.authService.getUserById(request.customUser!.id)

    reply.code(200).send({
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          displayName: user.displayName,
          avatar: user.avatar,
          role: user.role,
          emailVerified: user.emailVerified,
          twoFactorEnabled: user.twoFactorEnabled,
          createdAt: user.createdAt
        }
      }
    })
  }

  async enable2FA(request: FastifyRequest, reply: FastifyReply) {
    const result = await this.authService.enable2FA(request.customUser!.id)

    reply.code(200).send({
      message: '2FA setup initiated',
      data: result
    })
  }

  async verify2FA(request: FastifyRequest<{ Body: Verify2FADTO }>, reply: FastifyReply) {
    const dto = await validateSchema(Verify2FADTO.schema, request.body) as Verify2FADTO
    await this.authService.confirm2FA(request.customUser!.id, dto.code)

    reply.code(200).send({
      message: '2FA enabled successfully'
    })
  }

  async disable2FA(request: FastifyRequest<{ Body: { password: string } }>, reply: FastifyReply) {
    await this.authService.disable2FA(request.customUser!.id, request.body.password)

    reply.code(200).send({
      message: '2FA disabled successfully'
    })
  }

  async googleAuth(request: FastifyRequest, reply: FastifyReply) {
    const authUrl = this.authService.getGoogleAuthUrl()
    reply.redirect(authUrl)
  }

  async googleCallback(request: FastifyRequest<{ Querystring: { code: string } }>, reply: FastifyReply) {
    const result = await this.authService.handleGoogleCallback(request.query.code)

    // Redirect to frontend with tokens
    const redirectUrl = new URL(`${config.oauth.google.callbackUrl}/success`)
    redirectUrl.searchParams.append('accessToken', result.tokens.accessToken)
    redirectUrl.searchParams.append('refreshToken', result.tokens.refreshToken)

    reply.redirect(redirectUrl.toString())
  }
}
