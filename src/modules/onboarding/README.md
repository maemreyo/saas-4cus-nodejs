# Onboarding Module

A flexible onboarding system for guiding users through initial setup and feature discovery.

## Features

### Core Features
- **Flow Templates**: Pre-defined onboarding flows for different user types
- **Progress Tracking**: Track completion of onboarding steps
- **Conditional Steps**: Show/hide steps based on user context
- **Skip Logic**: Allow skipping optional steps
- **Multi-device Support**: Resume onboarding on any device

### UI Features
- **Checklists**: Display progress as actionable checklists
- **Tooltips/Hints**: Context-aware hints on pages
- **Interactive Tours**: Guided tours with highlighting
- **Progress Indicators**: Visual progress representation

### Analytics Features
- **Completion Rates**: Track flow and step completion
- **Drop-off Analysis**: Identify where users abandon
- **Time Tracking**: Measure time to complete
- **A/B Testing**: Compare different flows

## API Endpoints

### Protected Endpoints
```
POST   /api/onboarding/start          - Start onboarding flow
GET    /api/onboarding/progress       - Get current progress
POST   /api/onboarding/skip           - Skip entire onboarding
POST   /api/onboarding/steps/complete - Complete a step
POST   /api/onboarding/steps/skip     - Skip a step
GET    /api/onboarding/checklist      - Get checklist view
GET    /api/onboarding/hints          - Get page hints
```

### Admin Endpoints
```
GET    /api/onboarding/analytics      - Get onboarding analytics
```

## Usage Examples

### Start Onboarding
```typescript
POST /api/onboarding/start
{
  "flowId": "new_user_basic",
  "context": {
    "source": "organic",
    "plan": "free"
  }
}

Response:
{
  "data": {
    "id": "flow-123",
    "flowTemplateId": "new_user_basic",
    "status": "IN_PROGRESS",
    "totalSteps": 5,
    "completedSteps": 0
  }
}
```

### Complete Step
```typescript
POST /api/onboarding/steps/complete
{
  "stepId": "complete_profile",
  "data": {
    "profileCompleted": true,
    "fieldsAdded": ["avatar", "bio"]
  }
}
```

### Get Checklist
```typescript
GET /api/onboarding/checklist

Response:
{
  "data": {
    "items": [
      {
        "id": "welcome",
        "title": "Welcome to Our Platform!",
        "description": "Let's get you started with a quick tour",
        "completed": true,
        "required": true
      },
      {
        "id": "complete_profile",
        "title": "Complete Your Profile",
        "description": "Add your name and profile picture",
        "completed": false,
        "required": true,
        "action": {
          "type": "navigation",
          "target": "/settings/profile"
        }
      }
    ],
    "progress": 20
  }
}
```

### Get Page Hints
```typescript
GET /api/onboarding/hints?page=/dashboard

Response:
{
  "data": [
    {
      "id": "tour-dashboard-1",
      "target": "#sidebar",
      "content": "Navigate between different sections here",
      "position": "right",
      "show": true
    }
  ]
}
```

## Flow Templates

### New User Flow
```typescript
{
  "id": "new_user_basic",
  "name": "New User Onboarding",
  "targetAudience": "new_user",
  "steps": [
    {
      "id": "welcome",
      "type": "welcome",
      "title": "Welcome!",
      "required": true
    },
    {
      "id": "complete_profile",
      "type": "profile",
      "title": "Complete Your Profile",
      "required": true
    },
    {
      "id": "create_first_project",
      "type": "task",
      "title": "Create Your First Project",
      "required": false
    }
  ]
}
```

## Step Types

- **welcome**: Welcome message with media
- **profile**: Profile completion tasks
- **tour**: Interactive page tours
- **task**: Action-based tasks
- **custom**: Custom step types

## Events

The onboarding module emits:
- `onboarding.started`
- `onboarding.step_completed`
- `onboarding.step_skipped`
- `onboarding.completed`
- `onboarding.skipped`

## Best Practices

1. **Keep It Short**: Limit to 5-7 essential steps
2. **Make It Valuable**: Each step should provide value
3. **Allow Skipping**: Make non-critical steps optional
4. **Progressive Disclosure**: Don't overwhelm users
5. **Contextual Help**: Provide help where needed
6. **Track Everything**: Monitor completion rates

## Configuration

```env
# Onboarding Settings
ONBOARDING_ENABLED=true
ONBOARDING_FORCE_COMPLETION=false
ONBOARDING_DEFAULT_FLOW=new_user_basic
ONBOARDING_TIMEOUT_DAYS=30
```

## Integration Example

```typescript
// In your frontend
import { OnboardingClient } from '@/lib/onboarding';

const onboarding = new OnboardingClient();

// Start onboarding after signup
await onboarding.start('new_user_basic');

// Check and show hints
const hints = await onboarding.getHints(window.location.pathname);
hints.forEach(hint => {
  showTooltip(hint.target, hint.content, hint.position);
});

// Complete steps
await onboarding.completeStep('profile_completed', {
  fields: ['name', 'avatar']
});

// Get progress
const progress = await onboarding.getProgress();
updateProgressBar(progress.percentComplete);
```

## Analytics Insights

Monitor key metrics:
- **Start Rate**: Users who begin onboarding
- **Completion Rate**: Users who finish all steps
- **Step Completion**: Success rate per step
- **Time to Complete**: Average duration
- **Drop-off Points**: Where users abandon
