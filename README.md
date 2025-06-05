# Modern Backend Template 2025

A production-ready Node.js backend template with TypeScript, featuring modern architecture patterns, comprehensive security, and scalability features.

## 🚀 Features

### Core Technologies
- **Node.js 20+** with TypeScript
- **Fastify** - High-performance web framework
- **Prisma** - Type-safe database ORM
- **Redis** - Caching and session management
- **BullMQ** - Robust job queue system
- **Docker** - Containerization support

### Security Features
- 🔐 JWT authentication with refresh tokens
- 🔑 OAuth2 integration (Google, GitHub)
- 📱 Two-factor authentication (2FA)
- 🛡️ Rate limiting and DDoS protection
- 🔒 Security headers with Helmet
- 🚨 CORS configuration
- 🔏 Password hashing with Argon2
- 🔐 API key authentication for B2B

### Performance & Scalability
- ⚡ Multi-layer caching (Memory + Redis)
- 🔄 Database connection pooling
- 📊 Query optimization with indexes
- 🎯 Pagination helpers
- 🔍 Full-text search support
- 📈 Horizontal scaling ready
- 🚀 Async job processing
- 💾 Soft deletes

### Developer Experience
- 📝 Swagger API documentation
- 🧪 Comprehensive testing setup
- 🔍 Structured logging with Pino
- 📊 Health checks and metrics
- 🐳 Docker Compose for local dev
- 🔧 CLI tools for common tasks
- 🎨 Code formatting with Prettier
- 📋 ESLint configuration

### Monitoring & Observability
- 📊 OpenTelemetry integration
- 🔍 Distributed tracing
- 📈 Custom metrics
- 🚨 Sentry error tracking
- 📝 Audit logging
- 🔔 Real-time monitoring
- 📊 Performance profiling

## 📦 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 15+ (or use Docker)
- Redis 7+ (or use Docker)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/modern-backend-template.git
cd modern-backend-template

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start development services (PostgreSQL, Redis, MailHog)
docker-compose -f docker-compose.dev.yml up -d

# Run database migrations
pnpm db:migrate

# Seed the database
pnpm db:seed

# Start development server
pnpm dev
```

### Using Docker

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## 🏗️ Project Structure

```
src/
├── modules/              # Feature modules
│   ├── auth/            # Authentication module
│   ├── user/            # User management
│   └── notification/    # Notification system
├── shared/              # Shared utilities
│   ├── cache/          # Caching layer
│   ├── database/       # Database utilities
│   ├── events/         # Event bus
│   ├── exceptions/     # Custom exceptions
│   ├── logger/         # Logging system
│   ├── queue/          # Job queue
│   ├── services/       # Shared services
│   ├── utils/          # Helper functions
│   └── validators/     # Validation schemas
├── infrastructure/      # Infrastructure code
│   ├── config/         # Configuration
│   ├── database/       # Database setup
│   ├── server/         # Server setup
│   └── monitoring/     # Monitoring setup
└── app.ts              # Application entry
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Application
NODE_ENV=development
APP_NAME="My App"
PORT=3000

# Security
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret

# Database
DATABASE_URL=postgresql://user:pass@localhost:5555/mydb

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Email
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=test
SMTP_PASS=test

# See .env.example for all options
```

## 📚 API Documentation

### Swagger UI
When running in development, access Swagger documentation at:
```
http://localhost:3000/docs
```

### Authentication Endpoints

#### Register
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### Refresh Token
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run unit tests
pnpm test:unit

# Run integration tests
pnpm test:integration

# Run with coverage
pnpm test:coverage

# Run in watch mode
pnpm test:watch
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

### Production Build
```bash
# Build the application
pnpm build

# Start production server
pnpm start:prod
```

### Docker Deployment
```bash
# Build production image
docker build -t myapp:latest .

# Run container
docker run -p 3000:3000 --env-file .env myapp:latest
```

### Environment-specific Configurations
- **Development**: Hot reload, verbose logging
- **Staging**: Production-like with debug features
- **Production**: Optimized, minimal logging

## 📊 Monitoring

### Health Checks
- `/health` - Comprehensive health status
- `/health/live` - Kubernetes liveness probe
- `/health/ready` - Kubernetes readiness probe
- `/health/metrics` - Application metrics

### Logging
Structured JSON logging with different levels:
- `fatal` - System is unusable
- `error` - Error conditions
- `warn` - Warning conditions
- `info` - Informational messages
- `debug` - Debug messages
- `trace` - Trace messages

### Metrics
Custom metrics exposed for Prometheus:
- Request duration
- Active users
- Queue sizes
- Cache hit rates
- Database pool stats

## 🔒 Security Best Practices

1. **Authentication**
   - JWT with short-lived access tokens
   - Refresh token rotation
   - Session management

2. **Authorization**
   - Role-based access control (RBAC)
   - Resource-based permissions
   - API key authentication for services

3. **Data Protection**
   - Encryption at rest
   - Encryption in transit (TLS)
   - Field-level encryption for sensitive data

4. **Input Validation**
   - Request validation with Zod
   - SQL injection prevention
   - XSS protection

5. **Rate Limiting**
   - Per-user rate limits
   - Global rate limits
   - Distributed rate limiting

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards
- Follow TypeScript best practices
- Write comprehensive tests
- Document your code
- Use conventional commits

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by bulletproof-nodejs
- Built with modern Node.js ecosystem
- Community best practices

## 📞 Support

- Documentation: [docs.example.com](https://docs.example.com)
- Issues: [GitHub Issues](https://github.com/yourusername/modern-backend-template/issues)
- Discord: [Join our community](https://discord.gg/example)

---

Built with ❤️ by the Modern Backend Template team
