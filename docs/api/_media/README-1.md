# User Module

A comprehensive user management system for profile management, preferences, sessions, and activity tracking.

## Features

### Core Features
- **Profile Management**: Update profile information, avatar, bio
- **Password Management**: Secure password change functionality
- **Preferences**: Theme, language, notification settings
- **Session Management**: View and revoke active sessions
- **Activity Tracking**: Monitor user activity and login history
- **Public Profiles**: Optional public user profiles
- **User Search**: Search users by name, email, or username

### Advanced Features
- **Avatar Upload**: Image upload with validation
- **Account Deletion**: Secure account deletion with verification
- **Activity Timeline**: Detailed activity history
- **Multi-device Sessions**: Track sessions across devices
- **Privacy Controls**: Control profile visibility
- **Audit Trail**: Complete history of profile changes

## API Endpoints

### Public Endpoints
```
GET    /api/users/search              - Search users
GET    /api/users/:userId             - Get public profile
```

### Protected Endpoints
```
GET    /api/users/me                  - Get current user profile
PUT    /api/users/me                  - Update profile
POST   /api/users/me/avatar           - Upload avatar
DELETE /api/users/me                  - Delete account
POST   /api/users/me/change-password  - Change password
PUT    /api/users/me/preferences      - Update preferences
GET    /api/users/me/activity         - Get activity history
GET    /api/users/me/sessions         - Get active sessions
DELETE /api/users/me/sessions/:id     - Revoke session
```

## Usage Examples

### Update Profile
```typescript
PUT /api/users/me
{
  "firstName": "John",
  "lastName": "Doe",
  "displayName": "John Doe",
  "username": "johndoe",
  "bio": "Software developer passionate about clean code",
  "website": "https://johndoe.com",
  "location": "San Francisco, CA"
}
```

### Change Password
```typescript
POST /api/users/me/change-password
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewSecurePass456!"
}
```

### Update Preferences
```typescript
PUT /api/users/me/preferences
{
  "theme": "dark",
  "language": "en",
  "timezone": "America/Los_Angeles",
  "emailNotifications": true,
  "pushNotifications": false,
  "marketingEmails": false,
  "publicProfile": true
}
```

### Search Users
```typescript
GET /api/users/search?query=john&role=USER&verified=true&page=1&limit=20

Response:
{
  "data": {
    "users": [
      {
        "id": "user-123",
        "email": "john@example.com",
        "username": "johndoe",
        "displayName": "John Doe",
        "avatar": "https://...",
        "role": "USER",
        "status": "ACTIVE",
        "emailVerified": true,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
```

### Upload Avatar
```typescript
POST /api/users/me/avatar
Content-Type: multipart/form-data

File: avatar.jpg

Response:
{
  "message": "Avatar uploaded successfully",
  "data": {
    "avatarUrl": "https://storage.example.com/avatars/user-123-1234567890.jpg"
  }
}
```

### Get Activity History
```typescript
GET /api/users/me/activity?days=30

Response:
{
  "data": {
    "loginHistory": [...],
    "apiUsage": [...],
    "actions": {
      "logs": [...],
      "summary": {
        "user": 45,
        "auth": 23,
        "profile": 12
      },
      "total": 80
    }
  }
}
```

## User Preferences

### Available Preferences
- **theme**: `light`, `dark`, `system`
- **language**: ISO 639-1 language code (e.g., `en`, `es`, `fr`)
- **timezone**: IANA timezone (e.g., `America/New_York`)
- **emailNotifications**: Receive email notifications
- **pushNotifications**: Receive push notifications
- **marketingEmails**: Receive marketing emails
- **publicProfile**: Make profile publicly visible

## Session Management

### Session Information
Each session includes:
- Session ID
- Device information
- IP address
- Location (approximate)
- Last active timestamp
- Creation timestamp

### Revoking Sessions
Users can revoke sessions to:
- Log out other devices
- Secure account after device loss
- Remove suspicious sessions

## Activity Tracking

The module tracks:
- Login/logout events
- Profile updates
- Password changes
- API usage
- Security events

## Security Features

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Account Deletion
- Requires password verification
- Soft delete (data retained for 30 days)
- All sessions invalidated
- Email changed to prevent reuse

### Privacy Controls
- Control profile visibility
- Manage data sharing
- Export personal data (GDPR)

## Events

The user module emits:
- `user.updated`
- `user.passwordChanged`
- `user.deleted`
- `user.avatarUploaded`
- `user.preferencesUpdated`
- `user.sessionRevoked`

## Configuration

### Avatar Upload
- **Max Size**: 5MB
- **Allowed Types**: JPEG, PNG, GIF, WebP
- **Storage**: Local or S3
- **Processing**: Automatic resizing

### Search Settings
- **Min Query Length**: 2 characters
- **Max Results**: 100
- **Default Page Size**: 20

## Best Practices

1. **Regular Password Updates**: Encourage users to change passwords periodically
2. **Session Review**: Prompt users to review active sessions
3. **Profile Completion**: Incentivize complete profiles
4. **Privacy First**: Default to private profiles
5. **Activity Monitoring**: Enable users to monitor their account activity

## Troubleshooting

### Common Issues

1. **Avatar Upload Fails**
   - Check file size (max 5MB)
   - Verify file type
   - Check storage permissions

2. **Password Change Errors**
   - Ensure old password is correct
   - Meet password requirements
   - Check for OAuth accounts

3. **Session Issues**
   - Clear browser cookies
   - Check for expired tokens
   - Verify device limits

4. **Search Not Working**
   - Minimum 2 characters required
   - Check search index
   - Verify permissions
