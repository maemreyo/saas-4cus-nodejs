# Authentication Module

A comprehensive authentication system supporting JWT-based authentication, OAuth providers, 2FA, and session management.

## Features

### Core Features
- **JWT Authentication**: Access and refresh token implementation
- **OAuth Integration**: Google, GitHub, Facebook login support
- **Two-Factor Authentication**: TOTP-based 2FA with backup codes
- **Session Management**: Multi-device session tracking
- **Password Management**: Reset, change, and strength validation
- **Email Verification**: Secure email verification flow
- **Rate Limiting**: Brute force protection on auth endpoints

### Advanced Features
- **Remember Me**: Long-lived refresh tokens
- **Device Tracking**: Track login devices and locations
- **Security Alerts**: Notify users of suspicious activities
- **Account Lockout**: Automatic lockout after failed attempts
- **IP Whitelisting**: Optional IP-based access control
- **Audit Trail**: Complete authentication history

## API Endpoints

### Public Endpoints
```
POST   /api/auth/register              - User registration
POST   /api/auth/login                 - User login
POST   /api/auth/refresh               - Refresh access token
POST   /api/auth/forgot-password       - Request password reset
POST   /api/auth/reset-password        - Reset password
GET    /api/auth/verify-email          - Verify email address
GET    /api/auth/google                - Google OAuth login
GET    /api/auth/google/callback       - Google OAuth callback
```

### Protected Endpoints
```
POST   /api/auth/logout                - Logout current session
GET    /api/auth/me                    - Get current user
POST   /api/auth/2fa/enable            - Enable 2FA
POST   /api/auth/2fa/verify            - Verify 2FA setup
POST   /api/auth/2fa/disable           - Disable 2FA
```

## Usage Examples

### User Registration
```typescript
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe"
}

Response:
{
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "tokens": {
      "accessToken": "eyJ...",
      "refreshToken": "eyJ...",
      "expiresIn": 900,
      "tokenType": "Bearer"
    }
  }
}
```

### Login with 2FA
```typescript
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "twoFactorCode": "123456"
}
```

### Enable 2FA
```typescript
POST /api/auth/2fa/enable

Response:
{
  "message": "2FA setup initiated",
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "qrCode": "data:image/png;base64,...",
    "backupCodes": [
      "ABCD1234",
      "EFGH5678",
      ...
    ]
  }
}
```

### OAuth Login Flow
```typescript
// 1. Redirect user to OAuth provider
GET /api/auth/google

// 2. Handle callback after authentication
GET /api/auth/google/callback?code=...

// 3. Receive tokens in redirect URL
http://frontend.com/auth/success?accessToken=...&refreshToken=...
```

## Security Features

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Session Security
- Secure, httpOnly cookies
- CSRF protection
- Session fixation prevention
- Concurrent session limits
- Device fingerprinting

### Rate Limiting
- Registration: 5 requests per hour per IP
- Login: 5 failed attempts before 15-minute lockout
- Password reset: 3 requests per hour per email

### Token Management
- Access token: 15 minutes expiry
- Refresh token: 7 days expiry
- Automatic token rotation
- Revocation on logout

## Configuration

### Environment Variables
```env
# JWT Settings
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Security
BCRYPT_ROUNDS=12
SESSION_TIMEOUT=3600
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION=900

# Email Verification
EMAIL_VERIFICATION_REQUIRED=true
EMAIL_VERIFICATION_EXPIRES_IN=24h
```

## Error Handling

### Common Error Responses
```typescript
// Invalid credentials
{
  "error": "Unauthorized",
  "message": "Invalid credentials",
  "statusCode": 401
}

// Account locked
{
  "error": "Unauthorized",
  "message": "Account is suspended",
  "statusCode": 401
}

// 2FA required
{
  "message": "2FA required",
  "data": {
    "requiresTwoFactor": true
  }
}

// Email not verified
{
  "error": "Forbidden",
  "message": "Email not verified",
  "statusCode": 403
}
```

## Events

The auth module emits various events:
- `user.registered`
- `user.loggedIn`
- `user.loggedOut`
- `user.passwordReset`
- `user.emailVerified`
- `user.2faEnabled`
- `user.2faDisabled`
- `user.oauthLogin`

## Best Practices

1. **Use HTTPS**: Always use HTTPS in production
2. **Strong Passwords**: Enforce strong password policies
3. **Enable 2FA**: Encourage users to enable 2FA
4. **Monitor Failed Logins**: Set up alerts for suspicious activity
5. **Regular Token Rotation**: Implement token rotation for security
6. **Audit Logging**: Log all authentication events

## Troubleshooting

### Common Issues

1. **"Invalid token" errors**
   - Check token expiry
   - Verify JWT secrets match
   - Ensure clock sync between servers

2. **OAuth callback errors**
   - Verify callback URLs in provider settings
   - Check client ID and secret
   - Ensure proper CORS configuration

3. **2FA issues**
   - Verify time sync on authenticator app
   - Check backup codes
   - Ensure secret is properly stored

4. **Email verification not working**
   - Check SMTP configuration
   - Verify email queue is processing
   - Check spam folders

## Security Considerations

1. **Store passwords securely**: Use Argon2 hashing
2. **Implement rate limiting**: Prevent brute force attacks
3. **Use secure cookies**: httpOnly, secure, sameSite
4. **Validate input**: Sanitize all user input
5. **Log security events**: Track authentication attempts
6. **Regular security audits**: Review auth flow regularly
