# Support Ticket Module

A comprehensive support ticket system for managing customer inquiries, issues, and requests.

## Features

### Core Features
- **Ticket Management**: Create, update, assign, and track support tickets
- **Priority & SLA Management**: Automatic priority detection and SLA monitoring
- **Message Threading**: Customer and agent communication with internal notes
- **Categories & Tags**: Organize tickets by category and tags
- **Templates**: Pre-defined templates for common issues
- **Satisfaction Ratings**: Collect customer feedback after resolution

### Advanced Features
- **Auto-Assignment**: Intelligent ticket routing based on category and workload
- **SLA Monitoring**: Track and alert on first response and resolution times
- **Auto-Close**: Automatically close inactive tickets with warnings
- **Knowledge Base Integration**: Suggest solutions from knowledge base
- **Analytics & Reporting**: Track metrics, agent performance, and satisfaction scores
- **Webhook Notifications**: Real-time updates for ticket events

## Architecture

### Database Schema
```prisma
- Ticket: Main ticket entity with status, priority, SLA tracking
- TicketMessage: Messages and internal notes
- TicketActivity: Audit trail of all ticket actions
- TicketCategory: Hierarchical categorization
- TicketTemplate: Pre-defined templates
- TicketWatcher: Users watching ticket updates
```

### Services
- **TicketService**: Core ticket operations and business logic
- **CategoryService**: Category management
- **TemplateService**: Template management
- **KnowledgeBaseService**: AI-powered solution suggestions
- **TicketQueueProcessor**: Background job processing
- **TicketScheduler**: Scheduled tasks and maintenance

## API Endpoints

### Public Endpoints
```
GET    /api/tickets                    - List user's tickets
POST   /api/tickets                    - Create new ticket
GET    /api/tickets/:ticketId          - Get ticket details
PUT    /api/tickets/:ticketId          - Update ticket
POST   /api/tickets/:ticketId/messages - Add message
POST   /api/tickets/:ticketId/close    - Close ticket
POST   /api/tickets/:ticketId/rate     - Rate ticket satisfaction
```

### Agent Endpoints (Admin/Support only)
```
POST   /api/tickets/:ticketId/assign   - Assign ticket to agent
POST   /api/tickets/bulk-update        - Bulk update multiple tickets
GET    /api/tickets/stats              - Get ticket statistics
```

## Usage Examples

### Creating a Ticket
```typescript
const ticket = await ticketService.createTicket(userId, {
  subject: 'Cannot reset password',
  description: 'I am unable to reset my password...',
  type: TicketType.TECHNICAL_ISSUE,
  priority: TicketPriority.HIGH,
  categoryId: 'account-category-id',
  tags: ['password', 'login'],
  attachments: ['file-id-1', 'file-id-2']
});
```

### Adding a Message
```typescript
const message = await ticketService.addMessage(
  ticketId,
  userId,
  'Thank you for your response. I have tried...',
  {
    attachments: ['screenshot-id'],
    internal: false // Customer-visible message
  }
);
```

### Assigning Ticket (Agent)
```typescript
await ticketService.assignTicket(
  ticketId,
  agentId,
  assignedById
);
```

### Searching Solutions
```typescript
const solutions = await knowledgeBaseService.getSuggestedArticles(
  ticket.subject,
  ticket.description,
  ticket.categoryId
);
```

## SLA Configuration

Default SLA times by priority:
- **Critical**: 30 min first response, 4 hours resolution
- **Urgent**: 1 hour first response, 8 hours resolution
- **High**: 2 hours first response, 24 hours resolution
- **Medium**: 4 hours first response, 48 hours resolution
- **Low**: 8 hours first response, 96 hours resolution

## Ticket Lifecycle

1. **Open**: New ticket created
2. **In Progress**: Assigned to agent
3. **Waiting for Customer**: Agent responded, waiting for customer
4. **Waiting for Support**: Customer responded, waiting for agent
5. **Resolved**: Issue resolved, awaiting confirmation
6. **Closed**: Ticket closed (manually or auto-closed)

## Events

The module emits various events for integration:
- `ticket.created`
- `ticket.updated`
- `ticket.assigned`
- `ticket.message.added`
- `ticket.closed`
- `ticket.rated`
- `ticket.sla.warning`
- `ticket.sla.breached`

## Background Jobs

### Scheduled Tasks
- **Auto-close inactive**: Daily at 2 AM
- **SLA report generation**: Daily at 6 AM
- **Agent performance summary**: Weekly on Mondays
- **Pending response check**: Every 4 hours
- **Statistics update**: Every hour

### Queue Jobs
- SLA monitoring (first response & resolution)
- Email notifications
- Satisfaction surveys (24 hours after closure)
- Ticket escalation

## Configuration

### Environment Variables
```env
# Support System
SUPPORT_EMAIL=support@example.com
SUPPORT_AUTO_CLOSE_DAYS=7
SUPPORT_AUTO_CLOSE_WARNING_DAYS=5
SUPPORT_SATISFACTION_SURVEY_DELAY=86400000

# SLA Settings
SLA_FIRST_RESPONSE_CRITICAL=30
SLA_FIRST_RESPONSE_URGENT=60
SLA_FIRST_RESPONSE_HIGH=120
SLA_FIRST_RESPONSE_MEDIUM=240
SLA_FIRST_RESPONSE_LOW=480
```

## Best Practices

1. **Categories**: Keep categories simple and well-organized (max 2 levels)
2. **Templates**: Create templates for common issues to save time
3. **Tags**: Use consistent tags for better searchability
4. **Internal Notes**: Use internal notes for agent collaboration
5. **SLA Monitoring**: Set up alerts for SLA warnings
6. **Auto-responses**: Configure knowledge base for common issues

## Metrics & Analytics

Track key metrics:
- Average first response time
- Average resolution time
- Customer satisfaction score
- Tickets by category/priority
- Agent performance metrics
- SLA compliance rate

## Security

- Customers can only view/modify their own tickets
- Agents can view all tickets in their assigned categories
- Internal notes are never visible to customers
- Rate limiting on ticket creation (10 per hour per user)
- File attachments are validated and scanned

## Webhooks

Configure webhooks for real-time updates:
```javascript
// Example webhook payload
{
  "event": "ticket.created",
  "data": {
    "ticketId": "123",
    "number": "2024-01-00001",
    "subject": "Issue with login",
    "priority": "HIGH",
    "userId": "user-123"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Troubleshooting

### Common Issues

1. **SLA Breaches**: Check agent availability and workload distribution
2. **Auto-close Issues**: Verify ticket status transitions and activity
3. **Missing Notifications**: Check email queue and SMTP configuration
4. **Search Not Working**: Ensure Elasticsearch is properly configured

### Debug Mode
Enable debug logging for detailed troubleshooting:
```env
LOG_LEVEL=debug
TICKET_DEBUG=true
```

## Future Enhancements

- AI-powered auto-categorization
- Sentiment analysis for priority detection
- Live chat integration
- Mobile app support
- Video call support for complex issues
- Multi-language support
- Customer portal customization


===============================================

# Support Ticket Module Implementation Summary

## ✅ What Has Been Implemented

### 1. **Database Schema (Prisma Models)**
- `Ticket` - Main ticket entity with full lifecycle tracking
- `TicketMessage` - Threaded messages with internal note support
- `TicketActivity` - Complete audit trail
- `TicketCategory` - Hierarchical categorization
- `TicketTemplate` - Pre-defined response templates
- `TicketWatcher` - Users watching tickets
- Proper relations with User and Tenant models

### 2. **Core Services**
- **TicketService** - Complete ticket lifecycle management
  - Create, update, assign, close, reopen tickets
  - SLA tracking and breach detection
  - Auto-priority detection
  - Bulk operations support

- **CategoryService** - Category management
  - Hierarchical categories (max 2 levels)
  - Usage statistics
  - Popular categories tracking

- **TemplateService** - Response templates
  - Variable substitution
  - Template duplication
  - Frequently used templates

- **KnowledgeBaseService** - AI-powered solutions
  - Elasticsearch integration for search
  - Solution suggestions
  - Article helpfulness tracking
  - Common issue detection

### 3. **Controllers & Routes**
- **TicketController** - RESTful API endpoints
- **Complete route structure** with authentication
- **Agent-only routes** for administrative tasks
- **Middleware** for access control and rate limiting

### 4. **Background Processing**
- **Queue Processor** for async tasks
  - SLA monitoring and alerts
  - Email notifications
  - Auto-close inactive tickets
  - Satisfaction surveys

- **Scheduler** for recurring tasks
  - Daily inactive ticket cleanup
  - SLA report generation
  - Agent performance summaries
  - Statistics updates

### 5. **Event System**
- Complete event handlers for all ticket events
- Analytics tracking
- Webhook integration
- Real-time metrics updates

### 6. **Features Implemented**
- ✅ Full ticket lifecycle (Open → In Progress → Resolved → Closed)
- ✅ Priority-based SLA management
- ✅ Message threading with internal notes
- ✅ File attachment support
- ✅ Customer satisfaction ratings
- ✅ Auto-assignment capabilities
- ✅ Bulk update operations
- ✅ Rate limiting (10 tickets/hour per user)
- ✅ Knowledge base integration
- ✅ Email notifications
- ✅ Webhook events
- ✅ Analytics and reporting

### 7. **DTOs & Validation**
- Complete DTOs for all operations
- Zod schema validation
- Type-safe request/response handling

### 8. **Integration Points**
- Email service integration
- Analytics service integration
- Webhook service integration
- Elasticsearch integration (optional)
- Redis for caching and rate limiting

## 📋 Setup Instructions

### 1. **Database Migration**
```bash
# Add the schema changes to your prisma/schema.prisma
# Then run:
npx prisma migrate dev --name add-support-ticket-system
```

### 2. **Environment Variables**
Add the support configuration to your `.env` file (see env-support-config artifact).

### 3. **Dependencies**
The module uses existing dependencies, but optionally requires:
```bash
npm install @elastic/elasticsearch  # For knowledge base search
```

### 4. **Initialization**
The module is automatically initialized in `app.ts` via:
```typescript
import { initializeSupportModule } from './modules/support';
await initializeSupportModule();
```

### 5. **Routes Registration**
Routes are automatically registered at `/api/tickets/*`

## 🚀 Usage Examples

### Create a Ticket
```bash
POST /api/tickets
{
  "subject": "Cannot login to my account",
  "description": "I'm getting an error when trying to login...",
  "type": "TECHNICAL_ISSUE",
  "categoryId": "account-category-id"
}
```

### Add a Message
```bash
POST /api/tickets/{ticketId}/messages
{
  "content": "I have tried resetting my password but still can't login",
  "attachments": ["file-id-1"]
}
```

### List Tickets
```bash
GET /api/tickets?status=OPEN&priority=HIGH&page=1&limit=20
```

## 🔧 Configuration Options

### SLA Times (Customizable via ENV)
- Critical: 30min response, 4hr resolution
- Urgent: 1hr response, 8hr resolution
- High: 2hr response, 24hr resolution
- Medium: 4hr response, 48hr resolution
- Low: 8hr response, 96hr resolution

### Auto-Close Settings
- Warning after 5 days of inactivity
- Auto-close after 7 days of inactivity
- Satisfaction survey 24 hours after closure

## 🎯 Next Steps

1. **Frontend Implementation**
   - Customer ticket portal
   - Agent dashboard
   - Admin management interface

2. **Advanced Features** (Optional)
   - Live chat integration
   - AI-powered auto-responses
   - Multi-language support
   - Custom fields per category
   - Ticket merging
   - Email-to-ticket creation

3. **Monitoring**
   - Set up alerts for SLA breaches
   - Dashboard for real-time metrics
   - Performance monitoring

## 📚 Module Structure
```
src/modules/support/
├── ticket.dto.ts          # Data Transfer Objects
├── ticket.events.ts       # Event definitions
├── ticket.service.ts      # Core business logic
├── ticket.controller.ts   # API endpoints
├── ticket.route.ts        # Route definitions
├── ticket.queue.ts        # Background jobs
├── ticket.scheduler.ts    # Scheduled tasks
├── ticket.middleware.ts   # Access control
├── ticket.events.handlers.ts  # Event handlers
├── category.service.ts    # Category management
├── template.service.ts    # Template management
├── knowledge-base.service.ts  # KB integration
└── index.ts              # Module exports
```

The Support Ticket module is now fully implemented and ready for use! 🎉
