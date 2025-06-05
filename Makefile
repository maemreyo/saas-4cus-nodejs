# Database Bootstrap Makefile
# Usage: make db-init, make db-reset, etc.

.PHONY: help db-init db-start db-stop db-reset db-clean-reset db-fresh db-migrate db-seed db-test db-studio db-clean db-fix-permissions

# Default target
help:
	@echo "🚀 Modern Backend Template - Enhanced Makefile"
	@echo ""
	@echo "🎯 QUICK START COMMANDS:"
	@echo "  make setup           - Complete setup for new developers"
	@echo "  make start           - Quick start all services"
	@echo "  make stop            - Quick stop all services"
	@echo "  make restart         - Quick restart all services"
	@echo "  make status          - Quick status check"
	@echo "  make dev             - Start development environment"
	@echo ""
	@echo "🗄️  DATABASE COMMANDS:"
	@echo "  make db-init         - Initialize database (full bootstrap)"
	@echo "  make db-fresh        - Nuclear reset + fix permissions (recommended for issues)"
	@echo "  make db-start        - Start Docker services only"
	@echo "  make db-stop         - Stop Docker services"
	@echo "  make db-reset        - Reset database (keep Docker volumes)"
	@echo "  make db-clean-reset  - Complete clean reset (remove Docker volumes)"
	@echo "  make db-migrate      - Run database migrations"
	@echo "  make db-seed         - Seed database with sample data"
	@echo "  make db-studio       - Open Prisma Studio"
	@echo "  make db-test         - Test database connection"
	@echo ""
	@echo "🐳 SERVICES MANAGEMENT:"
	@echo "  make services-start  - Start all Docker services"
	@echo "  make services-stop   - Stop all Docker services"
	@echo "  make services-restart- Restart all Docker services"
	@echo "  make services-status - Show services status"
	@echo "  make services-health - Health check for all services"
	@echo ""
	@echo "🚀 DEVELOPMENT WORKFLOW:"
	@echo "  make install         - Install dependencies with pnpm"
	@echo "  make build           - Build production image"
	@echo "  make up              - Start production environment"
	@echo "  make down            - Stop all services"
	@echo "  make test            - Run tests"
	@echo "  make logs            - Show logs"
	@echo "  make clean           - Clean up everything"
	@echo ""
	@echo "🧹 PROJECT MAINTENANCE:"
	@echo "  make cleanup-plan    - Show what would be cleaned up"
	@echo "  make cleanup-verify  - Verify project is ready for cleanup"
	@echo "  make cleanup-dry-run - Run cleanup (dry run)"
	@echo "  make cleanup-run     - Run actual cleanup"
	@echo "  make modernize       - Complete project modernization"
	@echo ""
	@echo "🚨 TROUBLESHOOTING:"
	@echo "  make db-fix-permissions - Fix database user permissions"
	@echo "  make db-debug          - Show debug information"
	@echo "  make db-logs           - Show PostgreSQL logs"
	@echo "  make fix-my-db         - Fix database permissions"
	@echo "  make emergency-fix     - Emergency fix for broken setup"
	@echo ""
	@echo "📊 INFORMATION:"
	@echo "  make db-info         - Show database connection info"
	@echo "  make health          - Run comprehensive health checks"
	@echo ""

# Initialize database (full setup)
db-init:
	@echo "🚀 Initializing database..."
	@tsx scripts/db-bootstrap.ts bootstrap

# Fresh start (recommended for permission issues)
db-fresh:
	@echo "🆕 Fresh database setup (nuclear option)..."
	@tsx scripts/db-bootstrap.ts fresh

# Start Docker services
db-start:
	@echo "🐳 Starting Docker services..."
	@docker-compose -f docker-compose.dev.yml up -d postgres redis mailhog pgadmin
	@tsx scripts/db-bootstrap.ts test || echo "⏳ Waiting for services to be ready..."

# Stop Docker services
db-stop:
	@echo "🛑 Stopping Docker services..."
	@docker-compose -f docker-compose.dev.yml down

# Reset database (keep volumes)
db-reset:
	@echo "🗑️ Resetting database..."
	@tsx scripts/db-bootstrap.ts reset

# Clean reset (remove volumes)
db-clean-reset:
	@echo "🧹 Clean resetting database..."
	@tsx scripts/db-bootstrap.ts clean-reset

# Fix database permissions
db-fix-permissions:
	@echo "🔐 Fixing database permissions..."
	@tsx scripts/db-bootstrap.ts fix-permissions

# Debug information
db-debug:
	@echo "🔍 Database Debug Information:"
	@echo "Docker containers:"
	@docker-compose -f docker-compose.dev.yml ps
	@echo ""
	@echo "Environment variables:"
	@grep -E "DATABASE_URL|DB_" .env || echo "No database env vars found"
	@echo ""
	@echo "PostgreSQL process:"
	@docker exec $(docker-compose -f docker-compose.dev.yml ps -q postgres) ps aux | grep postgres || echo "Cannot check PostgreSQL process"

# Show PostgreSQL logs
db-logs:
	@echo "📋 PostgreSQL Logs:"
	@docker-compose -f docker-compose.dev.yml logs postgres

# Run migrations only
db-migrate:
	@echo "🔄 Running database migrations..."
	@tsx scripts/db-bootstrap.ts migrate

# Seed database
db-seed:
	@echo "🌱 Seeding database..."
	@tsx scripts/db-bootstrap.ts seed

# Test database connection
db-test:
	@echo "🔍 Testing database connection..."
	@tsx scripts/db-bootstrap.ts test

# Open Prisma Studio
db-studio:
	@echo "📊 Opening Prisma Studio..."
	@pnpm run db:studio

# Clean up Docker resources
db-clean:
	@echo "🧹 Cleaning up Docker resources..."
	@docker-compose -f docker-compose.dev.yml down -v
	@docker system prune -f
	@docker volume prune -f

# Backup database
db-backup:
	@echo "💾 Creating database backup..."
	@mkdir -p backups
	@docker exec $(docker-compose -f docker-compose.dev.yml ps -q postgres) \
		pg_dump -U postgres myapp_dev > backups/backup_$(date +%Y%m%d_%H%M%S).sql
	@echo "✅ Backup created in backups/ directory"

# Restore database from latest backup
db-restore:
	@echo "🔄 Restoring database from backup..."
	@if [ -z "$(ls -A backups/ 2>/dev/null)" ]; then \
		echo "❌ No backup files found in backups/ directory"; \
		exit 1; \
	fi
	@LATEST_BACKUP=$(ls -t backups/*.sql | head -n1); \
	docker exec -i $(docker-compose -f docker-compose.dev.yml ps -q postgres) \
		psql -U postgres -d myapp_dev < $LATEST_BACKUP
	@echo "✅ Database restored successfully"

# Development workflow - quick setup
dev-setup: db-clean db-init
	@echo "🎉 Development environment ready!"

# Emergency fix - for when everything is broken
emergency-fix: db-clean-reset db-fresh
	@echo "🚨 Emergency fix completed!"

# Health check
health:
	@echo "🏥 Running health checks..."
	@tsx scripts/db-bootstrap.ts test
	@curl -s http://localhost:8025 > /dev/null && echo "✅ MailHog is running" || echo "❌ MailHog is not running"
	@curl -s http://localhost:5050 > /dev/null && echo "✅ PgAdmin is running" || echo "❌ PgAdmin is not running"

# Show database info
db-info:
	@echo "📋 Database Information:"
	@echo "  PostgreSQL: postgresql://postgres:postgres@localhost:5555/myapp_dev"
	@echo "  PgAdmin: http://localhost:5050 (admin@admin.com / admin)"
	@echo "  MailHog: http://localhost:8025"
	@echo "  Redis: localhost:6379"

# Quick commands for common tasks
quick-start: db-start db-test
	@echo "⚡ Quick start completed!"

quick-reset: db-stop db-start db-reset
	@echo "⚡ Quick reset completed!"

# When you get permission errors
fix-my-db: db-fix-permissions db-test
	@echo "🔧 Database permissions fixed!"

# =============================================================================
# 🚀 DEVELOPMENT WORKFLOW COMMANDS
# =============================================================================

.PHONY: dev build up down logs test clean install

# Start development environment
dev: db-start
	@echo "🚀 Starting development environment..."
	@pnpm dev

# Build production image
build:
	@echo "🏗️  Building production image..."
	@docker build -t modern-backend:latest .

# Start production environment
up:
	@echo "🚀 Starting production environment..."
	@docker-compose up -d

# Stop all services
down:
	@echo "🛑 Stopping all services..."
	@docker-compose down
	@docker-compose -f docker-compose.dev.yml down

# Show logs
logs:
	@echo "📋 Showing logs..."
	@docker-compose logs -f

# Run tests
test:
	@echo "🧪 Running tests..."
	@pnpm test

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	@pnpm install

# Clean up everything
clean:
	@echo "🧹 Cleaning up everything..."
	@docker-compose down -v
	@docker-compose -f docker-compose.dev.yml down -v
	@docker system prune -f
	@rm -rf node_modules dist coverage

# =============================================================================
# 📊 SERVICES MANAGEMENT (using new services-manager)
# =============================================================================

.PHONY: services-start services-stop services-restart services-status services-health

# Start all services
services-start:
	@echo "🐳 Starting all services..."
	@tsx scripts/services-manager.ts start

# Stop all services
services-stop:
	@echo "🛑 Stopping all services..."
	@tsx scripts/services-manager.ts stop

# Restart all services
services-restart:
	@echo "🔄 Restarting all services..."
	@tsx scripts/services-manager.ts restart

# Show services status
services-status:
	@echo "📊 Checking services status..."
	@tsx scripts/services-manager.ts status

# Health check for all services
services-health:
	@echo "🏥 Running services health check..."
	@tsx scripts/services-manager.ts health

# =============================================================================
# 🎯 QUICK SHORTCUTS
# =============================================================================

.PHONY: setup start stop restart status

# Complete setup for new developers
setup: install db-fresh
	@echo "🎉 Setup completed! Ready for development!"

# Quick start (most common command)
start: services-start
	@echo "⚡ Quick start completed!"

# Quick stop
stop: services-stop
	@echo "⚡ Quick stop completed!"

# Quick restart
restart: services-restart
	@echo "⚡ Quick restart completed!"

# Quick status check
status: services-status db-info
	@echo "⚡ Status check completed!"

# =============================================================================
# 🧹 PROJECT MAINTENANCE
# =============================================================================

.PHONY: cleanup-plan cleanup-verify cleanup-run cleanup-dry-run

# Show cleanup plan
cleanup-plan:
	@echo "📋 Showing cleanup plan..."
	@tsx scripts/cleanup-unused.ts plan

# Verify project is ready for cleanup
cleanup-verify:
	@echo "🔍 Verifying project state..."
	@tsx scripts/cleanup-unused.ts verify

# Run cleanup (dry run)
cleanup-dry-run:
	@echo "🧹 Running cleanup (dry run)..."
	@tsx scripts/cleanup-unused.ts run --dry-run

# Run actual cleanup
cleanup-run:
	@echo "🧹 Running cleanup..."
	@tsx scripts/cleanup-unused.ts run

# Complete project modernization
modernize: cleanup-verify cleanup-run install
	@echo "🚀 Project modernization completed!"
