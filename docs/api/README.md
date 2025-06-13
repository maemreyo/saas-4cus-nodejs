**modern-backend-template v2.0.0**

***

# Modern Backend Template 2025 🚀

A production-ready Node.js backend template with TypeScript, featuring 12 comprehensive modules for building scalable SaaS applications.

## 🌟 Why Use This Template?

- **Complete SaaS Foundation**: All essential features pre-built
- **Modular Architecture**: Use only what you need
- **Production Ready**: Security, monitoring, and scaling built-in
- **Developer Friendly**: Great DX with TypeScript, hot reload, and comprehensive docs
- **Battle Tested**: Based on real-world production applications

## 📦 Included Modules

### Core Modules
- **🔐 [Auth](_media/README.md)** - JWT, OAuth (Google/GitHub), 2FA, sessions
- **👤 [User](_media/README-1.md)** - Profiles, preferences, activity tracking
- **🏢 [Tenant](_media/README-2.md)** - Multi-tenancy, teams, invitations
- **💳 [Billing](_media/README-3.md)** - Stripe integration, subscriptions, invoices

### Feature Modules
- **🚩 [Features](_media/README-4.md)** - Feature flags, entitlements, usage limits
- **📧 [Notification](_media/README-5.md)** - Email, push, SMS, in-app notifications
- **📊 [Analytics](_media/README-6.md)** - Event tracking, metrics, reporting
- **🔗 [Webhooks](_media/README-7.md)** - Real-time event delivery

### Growth Modules
- **🎯 [Onboarding](_media/README-8.md)** - User onboarding flows, checklists
- **🎫 [Support](_media/README-9.md)** - Ticket system, knowledge base, SLA
- **📈 [API Usage](_media/README-10.md)** - Rate limiting, usage tracking, quotas
- **🛠️ [Admin](_media/README-11.md)** - Admin dashboard, user management, system config

## 🚀 Quick Start

### Using the Interactive Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/maemreyo/saas-4cus-nodejs.git my-app
cd my-app

# Run interactive setup
pnpm setup

# This will:
# - Let you choose which modules to include
# - Configure your database and services
# - Generate .env file
# - Remove unused code
# - Install dependencies
```

### Manual Setup

```bash
# 1. Clone and install
git clone https://github.com/maemreyo/saas-4cus-nodejs.git my-app
cd my-app
pnpm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your settings

# 3. Start services
docker-compose -f docker-compose.dev.yml up -d

# 4. Setup database
pnpm db:migrate
pnpm db:seed

# 5. Start development
pnpm dev
```

## 🏗️ Architecture

### Technology Stack
- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: Fastify (high performance)
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis for caching and sessions
- **Queue**: BullMQ for background jobs
- **Search**: Elasticsearch (optional)
- **Monitoring**: Sentry, OpenTelemetry

### Project Structure
```
src/
├── modules/              # Feature modules
│   ├── auth/            # Authentication module
│   ├── user/            # User management
│   ├── billing/         # Subscription & payments
│   └── ...              # Other modules
├── infrastructure/      # Core infrastructure
│   ├── config/          # Configuration
│   ├── database/        # Database setup
│   ├── server/          # Server setup
│   └── cache/           # Redis setup
├── shared/              # Shared utilities
│   ├── exceptions/      # Custom exceptions
│   ├── logger/          # Logging system
│   ├── queue/           # Job queue
│   └── events/          # Event bus
└── app.ts              # Application entry
```

## 🔧 Configuration

### Module Selection

Enable/disable modules in your setup:

```typescript
// config/modules.config.ts
export const ENABLED_MODULES = {
  auth: true,           // Required
  user: true,           // Required
  tenant: true,         // Multi-tenancy
  billing: true,        // Stripe payments
  features: true,       // Feature flags
  notification: true,   // Notifications
  analytics: true,      // Analytics
  webhooks: true,       // Webhooks
  onboarding: true,     // User onboarding
  support: true,        // Help desk
  apiUsage: true,       // API metering
  admin: true          // Admin panel
};
```

### Environment Variables

Key configurations:

```env
# Application
NODE_ENV=development
APP_NAME="My SaaS App"
PORT=3000

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/myapp_dev"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Authentication
JWT_ACCESS_SECRET=your-secure-secret
JWT_REFRESH_SECRET=your-secure-refresh-secret

# Stripe (if using billing)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
SMTP_HOST=localhost
SMTP_PORT=1025
EMAIL_FROM="My App <noreply@myapp.com>"
```

## 🚦 Module Usage Examples

### Authentication Flow

```typescript
// Register
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}

// Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

// Use token
GET /api/users/me
Authorization: Bearer <access_token>
```

### Multi-Tenancy

```typescript
// Create organization
POST /api/tenants
{
  "name": "Acme Corp",
  "slug": "acme-corp"
}

// Invite team member
POST /api/tenants/:tenantId/members/invite
{
  "email": "colleague@acme.com",
  "role": "MEMBER"
}
```

### Subscription Management

```typescript
// Create checkout session
POST /api/billing/checkout
{
  "priceId": "price_pro_monthly"
}

// Check feature access
GET /api/features/entitlements/check?feature=api_calls
```

### Support Tickets

```typescript
// Create ticket
POST /api/tickets
{
  "subject": "Need help with billing",
  "description": "Cannot update payment method",
  "type": "BILLING_ISSUE"
}
```

## 📊 Monitoring & Observability

### Health Checks
```bash
GET /health                 # Overall health
GET /health/ready          # Readiness probe
GET /health/live           # Liveness probe
```

### Metrics
- Request rate and latency
- Error rates by endpoint
- Database query performance
- Queue processing times
- Cache hit rates

### Logging
Structured JSON logging with levels:
- `fatal`: System failures
- `error`: Errors requiring attention
- `warn`: Warning conditions
- `info`: General information
- `debug`: Debug information

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run specific test suites
pnpm test:unit
pnpm test:integration
pnpm test:e2e

# Coverage report
pnpm test:coverage
```

### Test Structure
```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
├── e2e/           # End-to-end tests
└── fixtures/      # Test data
```

## 🚀 Deployment

### Docker Deployment

```bash
# Build image
docker build -t my-app .

# Run with docker-compose
docker-compose up -d
```

### Environment-Specific Configs

```bash
# Development
pnpm dev

# Staging
NODE_ENV=staging pnpm start

# Production
NODE_ENV=production pnpm start:prod
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-api
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: api
        image: my-app:latest
        env:
        - name: NODE_ENV
          value: "production"
```

## 🛡️ Security

Built-in security features:
- 🔐 Secure authentication with JWT
- 🔑 OAuth2 integration
- 📱 Two-factor authentication
- 🛡️ Rate limiting and DDoS protection
- 🔒 CORS and security headers
- 🚨 SQL injection prevention
- 🔏 XSS protection
- 🔐 Encryption at rest and in transit

## 📚 Documentation

- [Module Integration Guide](./docs/MODULES.md)
- [API Documentation](http://localhost:3000/docs) (Swagger)
- Individual module READMEs in each module directory
- [Contributing Guide](./CONTRIBUTING.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow

```bash
# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and test
pnpm test

# Commit with conventional commits
git commit -m "feat: add amazing feature"

# Push and create PR
git push origin feature/amazing-feature
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](_media/LICENSE) file for details.

## 🙏 Acknowledgments

Built with ❤️ using:
- [Fastify](https://www.fastify.io/) - Fast and low overhead web framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [TypeDI](https://github.com/typestack/typedi) - Dependency injection
- [BullMQ](https://docs.bullmq.io/) - Premium queue system
- And many other amazing open source projects

## 💬 Support

- 📧 Email: support@example.com
- 💬 Discord: [Join our community](https://discord.gg/example)
- 📖 Documentation: [docs.example.com](https://docs.example.com)
- 🐛 Issues: [GitHub Issues](https://github.com/maemreyo/saas-4cus-nodejs/issues)

---

**Ready to build your next SaaS?** Star ⭐ this repo and start coding!
