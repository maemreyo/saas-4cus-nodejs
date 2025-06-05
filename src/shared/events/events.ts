export const Events = {
  // User events
  USER_REGISTERED: 'user.registered',
  USER_LOGGED_IN: 'user.loggedIn',
  USER_LOGGED_OUT: 'user.loggedOut',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  USER_PASSWORD_RESET_REQUESTED: 'user.passwordResetRequested',
  USER_PASSWORD_RESET: 'user.passwordReset',
  USER_EMAIL_VERIFIED: 'user.emailVerified',
  USER_2FA_ENABLED: 'user.2faEnabled',
  USER_2FA_DISABLED: 'user.2faDisabled',

  // Auth events
  AUTH_TOKEN_CREATED: 'auth.tokenCreated',
  AUTH_TOKEN_REFRESHED: 'auth.tokenRefreshed',
  AUTH_TOKEN_REVOKED: 'auth.tokenRevoked',
  AUTH_OAUTH_LOGIN: 'auth.oauthLogin',

  // File events
  FILE_UPLOADED: 'file.uploaded',
  FILE_DELETED: 'file.deleted',

  // Notification events
  NOTIFICATION_CREATED: 'notification.created',
  NOTIFICATION_SENT: 'notification.sent',
  NOTIFICATION_READ: 'notification.read',

  // System events
  SYSTEM_HEALTH_CHECK: 'system.healthCheck',
  SYSTEM_CACHE_CLEARED: 'system.cacheCleared',
  SYSTEM_MAINTENANCE_MODE: 'system.maintenanceMode'
} as const

export type EventName = typeof Events[keyof typeof Events]