# 🛠️ Scripts Guide

This document explains the enhanced scripts and tools available in this project, following **SEPARATION OF CONCERNS** principles.

## 📋 Overview

The project has been modernized with the following improvements:

- ✅ **Separated concerns**: Database bootstrap vs Services management
- ✅ **Modular design**: Each script has a specific responsibility
- ✅ **Clean code**: Well-structured, maintainable scripts
- ✅ **pnpm support**: Migrated from npm to pnpm
- ✅ **Modern tooling**: Removed outdated dependencies

## 🚀 Quick Start

```bash
# Complete setup for new developers
make setup

# Start development
make dev

# Check status
make status
```

## 📁 Scripts Structure

```
scripts/
├── db-bootstrap.ts      # Database management (enhanced)
├── services-manager.ts  # Docker services management (new)
├── cleanup-unused.ts    # Project cleanup tool (new)
└── setup.ts            # Project setup
```

## 🗄️ Database Bootstrap (`db-bootstrap.ts`)

Enhanced database management with comprehensive service support.

### Features
- ✅ Supports all Docker services (postgres, redis, mailhog, pgadmin)
- ✅ Intelligent health checks
- ✅ Comprehensive error handling
- ✅ Modular service configuration
- ✅ Detailed status reporting

### Usage
```bash
# Full bootstrap
tsx scripts/db-bootstrap.ts bootstrap

# Fresh start (recommended for issues)
tsx scripts/db-bootstrap.ts fresh

# Start specific services
tsx scripts/db-bootstrap.ts start

# Health check
tsx scripts/db-bootstrap.ts test

# Show status
tsx scripts/db-bootstrap.ts status
```

### Available Commands
- `bootstrap`, `init` - Full database setup
- `start` - Start Docker services only
- `reset` - Reset database (keep volumes)
- `clean-reset`, `nuclear` - Complete clean reset
- `fresh` - Nuclear reset + fix permissions
- `fix-permissions` - Fix database user permissions
- `test` - Comprehensive health check
- `migrate` - Run migrations only
- `seed` - Seed database only
- `status` - Show services status

## 🐳 Services Manager (`services-manager.ts`)

Dedicated Docker services management following separation of concerns.

### Features
- ✅ Independent service management
- ✅ Granular control over services
- ✅ Health checks for each service
- ✅ Service-specific configuration
- ✅ Web UI information

### Usage
```bash
# Start all services
tsx scripts/services-manager.ts start

# Start specific services
tsx scripts/services-manager.ts start postgres redis

# Stop services
tsx scripts/services-manager.ts stop

# Restart services
tsx scripts/services-manager.ts restart

# Check status
tsx scripts/services-manager.ts status

# Health check
tsx scripts/services-manager.ts health

# Start only required services
tsx scripts/services-manager.ts start-required

# Start only optional services
tsx scripts/services-manager.ts start-optional
```

### Available Services
- **postgres** - PostgreSQL Database Server (Required)
- **redis** - Redis Cache Server (Required)
- **mailhog** - Email Testing Server (Optional) - http://localhost:8025
- **pgadmin** - PostgreSQL Admin Interface (Optional) - http://localhost:5050

## 🧹 Cleanup Tool (`cleanup-unused.ts`)

Removes outdated files and dependencies from the project.

### Features
- ✅ Safe cleanup with verification
- ✅ Dry run mode
- ✅ Detailed explanations
- ✅ Project state verification

### Usage
```bash
# Show cleanup plan
tsx scripts/cleanup-unused.ts plan

# Verify project is ready
tsx scripts/cleanup-unused.ts verify

# Dry run (safe)
tsx scripts/cleanup-unused.ts run --dry-run

# Actual cleanup
tsx scripts/cleanup-unused.ts run
```

### What Gets Cleaned Up
- `optic.yml` - Replaced by Fastify Swagger
- `.optic/` - Replaced by Fastify Swagger
- `jest.config.js` - Using Vitest instead
- `nodemon.json` - Using tsx watch instead
- `package-lock.json` - Using pnpm instead

## 📦 Package.json Enhancements

### New Scripts
```json
{
  "services:start": "tsx scripts/services-manager.ts start",
  "services:stop": "tsx scripts/services-manager.ts stop",
  "services:restart": "tsx scripts/services-manager.ts restart",
  "services:status": "tsx scripts/services-manager.ts status",
  "services:health": "tsx scripts/services-manager.ts health",
  "bootstrap": "tsx scripts/db-bootstrap.ts bootstrap",
  "bootstrap:fresh": "tsx scripts/db-bootstrap.ts fresh",
  "bootstrap:reset": "tsx scripts/db-bootstrap.ts reset"
}
```

### pnpm Configuration
- ✅ Engine strict mode
- ✅ Auto install peers
- ✅ Exact versions
- ✅ Security auditing

## 🎯 Makefile Enhancements

### Quick Start Commands
```bash
make setup     # Complete setup for new developers
make start     # Quick start all services
make stop      # Quick stop all services
make restart   # Quick restart all services
make status    # Quick status check
make dev       # Start development environment
```

### Services Management
```bash
make services-start    # Start all Docker services
make services-stop     # Stop all Docker services
make services-restart  # Restart all Docker services
make services-status   # Show services status
make services-health   # Health check for all services
```

### Project Maintenance
```bash
make cleanup-plan      # Show cleanup plan
make cleanup-verify    # Verify project state
make cleanup-dry-run   # Safe cleanup preview
make cleanup-run       # Actual cleanup
make modernize         # Complete modernization
```

## 🔧 Migration Guide

### From npm to pnpm
1. Run cleanup: `make cleanup-run`
2. Install pnpm: `npm install -g pnpm`
3. Install dependencies: `pnpm install`

### From Optic to Swagger
- Optic files are automatically removed by cleanup
- Fastify Swagger is already configured
- Access API docs at: `http://localhost:3000/documentation`

### From Jest to Vitest
- Jest config is automatically removed
- Vitest is already configured
- Run tests: `pnpm test`

### From Nodemon to tsx
- Nodemon config is automatically removed
- tsx watch is already configured
- Start dev: `pnpm dev`

## 🏥 Health Checks

### Database Health
- PostgreSQL connection test
- Database permissions verification
- Schema existence check

### Services Health
- Container status verification
- Service-specific health checks
- Port availability checks

### Overall Health
```bash
# Comprehensive health check
make health

# Services-only health check
make services-health

# Database-only health check
make db-test
```

## 🚨 Troubleshooting

### Common Issues

#### Permission Errors
```bash
make fix-my-db
# or
make db-fix-permissions
```

#### Services Not Starting
```bash
make services-status
make services-health
```

#### Complete Reset
```bash
make emergency-fix
# or
make db-fresh
```

#### Clean Start
```bash
make clean
make setup
```

## 📊 Service Information

### PostgreSQL
- **Port**: 5555
- **Database**: myapp_dev
- **User**: postgres
- **Password**: postgres

### Redis
- **Port**: 6379
- **Persistence**: AOF enabled

### MailHog
- **SMTP Port**: 1025
- **Web UI**: http://localhost:8025

### PgAdmin
- **Web UI**: http://localhost:5050
- **Email**: admin@admin.com
- **Password**: admin

## 🎯 Best Practices

1. **Always run health checks** after starting services
2. **Use dry-run mode** before cleanup operations
3. **Check status** before troubleshooting
4. **Use fresh command** for permission issues
5. **Run setup** for new environment setup

## 🔄 Next Steps

After running the enhanced scripts:

1. **Verify setup**: `make status`
2. **Run tests**: `make test`
3. **Start development**: `make dev`
4. **Access services**:
   - API: http://localhost:3000
   - API Docs: http://localhost:3000/documentation
   - MailHog: http://localhost:8025
   - PgAdmin: http://localhost:5050
   - Prisma Studio: `make db-studio`

## 📝 Notes

- All scripts follow **TypeScript** and **ESM** standards
- **Error handling** is comprehensive with detailed messages
- **Logging** provides clear feedback on operations
- **Modular design** allows for easy maintenance and extension
