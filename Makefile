# Database Bootstrap Makefile
# Usage: make db-init, make db-reset, etc.

.PHONY: help db-init db-start db-stop db-reset db-clean-reset db-fresh db-migrate db-seed db-test db-studio db-clean db-fix-permissions

# Default target
help:
	@echo "🔧 Database Management Commands"
	@echo ""
	@echo "Setup Commands:"
	@echo "  make db-init         - Initialize database (full bootstrap)"
	@echo "  make db-fresh        - Nuclear reset + fix permissions (recommended for issues)"
	@echo "  make db-start        - Start Docker services only"
	@echo "  make db-stop         - Stop Docker services"
	@echo "  make db-reset        - Reset database (keep Docker volumes)"
	@echo "  make db-clean-reset  - Complete clean reset (remove Docker volumes)"
	@echo ""
	@echo "Troubleshooting Commands:"
	@echo "  make db-fix-permissions - Fix database user permissions"
	@echo "  make db-debug          - Show debug information"
	@echo "  make db-logs           - Show PostgreSQL logs"
	@echo ""
	@echo "Development Commands:"
	@echo "  make db-migrate      - Run database migrations"
	@echo "  make db-seed         - Seed database with sample data"
	@echo "  make db-studio       - Open Prisma Studio"
	@echo "  make db-test         - Test database connection"
	@echo ""
	@echo "Maintenance Commands:"
	@echo "  make db-clean        - Clean up Docker volumes and containers"
	@echo "  make db-backup       - Backup database"
	@echo "  make db-restore      - Restore database from backup"
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
	@npm run db:studio

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
	@echo "  PostgreSQL: postgresql://postgres:postgres@localhost:5432/myapp_dev"
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


# .PHONY: help
# help:
# 	@echo "Available commands:"
# 	@echo "  make dev          - Start development environment"
# 	@echo "  make build        - Build production image"
# 	@echo "  make up           - Start production environment"
# 	@echo "  make down         - Stop all services"
# 	@echo "  make logs         - Show logs"
# 	@echo "  make test         - Run tests"
# 	@echo "  make migrate      - Run database migrations"
# 	@echo "  make seed         - Seed database"

# .PHONY: dev
# dev:
# 	docker-compose -f docker-compose.dev.yml up -d
# 	pnpm dev

# .PHONY: build
# build:
# 	docker build -t modern-backend:latest .

# .PHONY: up
# up:
# 	docker-compose up -d

# .PHONY: down
# down:
# 	docker-compose down
# 	docker-compose -f docker-compose.dev.yml down

# .PHONY: logs
# logs:
# 	docker-compose logs -f

# .PHONY: test
# test:
# 	pnpm test

# .PHONY: migrate
# migrate:
# 	pnpm db:migrate

# .PHONY: seed
# seed:
# 	pnpm db:seed

# .PHONY: clean
# clean:
# 	docker-compose down -v
# 	docker-compose -f docker-compose.dev.yml down -v
# 	rm -rf node_modules dist coverage
