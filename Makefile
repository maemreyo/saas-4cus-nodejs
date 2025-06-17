# Database Bootstrap Makefile
# Usage: make db-init, make db-reset, etc.

.PHONY: help help-legacy db-init db-start db-stop db-reset db-clean-reset db-fresh db-migrate db-seed db-test db-studio db-clean db-fix-permissions

# Default target
help-legacy:
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


# Makefile - Updated with Deployment Support
# Modern Backend Template - Universal Deployment

.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
RESET := \033[0m

# =============================================================================
# 🚀 DEPLOYMENT COMMANDS (NEW!)
# =============================================================================

.PHONY: deploy deploy-render deploy-railway deploy-check deploy-status

## 🚀 Universal deployment script (interactive)
deploy:
	@echo "$(BLUE)🚀 Starting universal deployment...$(RESET)"
	@tsx scripts/deploy.ts

## 🆓 Deploy to Render (FREE tier)
deploy-render:
	@echo "$(BLUE)🆓 Deploying to Render (FREE)...$(RESET)"
	@tsx scripts/deploy.ts --provider=render

## 💰 Deploy to Railway ($5/month)
deploy-railway:
	@echo "$(BLUE)💰 Deploying to Railway...$(RESET)"
	@tsx scripts/deploy.ts --provider=railway

## 🔍 Check deployment health
deploy-check:
	@echo "$(BLUE)🔍 Checking deployment...$(RESET)"
	@read -p "Enter your deployment URL: " url; \
	tsx scripts/check-deployment.ts $$url

## 📊 Show deployment status
deploy-status:
	@echo "$(BLUE)📊 Checking deployment status...$(RESET)"
	@if command -v railway >/dev/null 2>&1; then \
		echo "$(GREEN)Railway Status:$(RESET)"; \
		railway status || echo "$(YELLOW)Not deployed to Railway$(RESET)"; \
	fi
	@echo ""
	@echo "$(GREEN)Render Status:$(RESET)"
	@echo "Check manually at: https://dashboard.render.com"

# =============================================================================
# 📦 PRE-DEPLOYMENT SETUP
# =============================================================================

.PHONY: deploy-prep deploy-test deploy-build deploy-env

## 🔧 Prepare for deployment
deploy-prep: deploy-env deploy-build deploy-test
	@echo "$(GREEN)✅ Deployment preparation completed!$(RESET)"

## 🔐 Generate deployment environment file
deploy-env:
	@echo "$(BLUE)🔐 Generating deployment environment...$(RESET)"
	@tsx scripts/generate-env.ts --production

## 🏗️ Build for production
deploy-build:
	@echo "$(BLUE)🏗️ Building for production...$(RESET)"
	@pnpm install --frozen-lockfile
	@pnpm build

## 🧪 Test before deployment
deploy-test:
	@echo "$(BLUE)🧪 Running pre-deployment tests...$(RESET)"
	@pnpm test
	@pnpm typecheck

# =============================================================================
# 🐳 DOCKER DEPLOYMENT
# =============================================================================

.PHONY: docker-deploy docker-build-prod docker-test-prod

## 🐳 Build production Docker image
docker-build-prod:
	@echo "$(BLUE)🐳 Building production Docker image...$(RESET)"
	@docker build -f Dockerfile.render -t saas-backend:latest .

## 🧪 Test Docker image locally
docker-test-prod: docker-build-prod
	@echo "$(BLUE)🧪 Testing production Docker image...$(RESET)"
	@docker-compose -f docker-compose.render.yml up -d
	@sleep 10
	@curl -f http://localhost:3000/health || echo "$(RED)❌ Health check failed$(RESET)"
	@docker-compose -f docker-compose.render.yml down

## 🚀 Deploy with Docker
docker-deploy: docker-build-prod
	@echo "$(BLUE)🚀 Deploying with Docker...$(RESET)"
	@echo "$(YELLOW)Choose your platform:$(RESET)"
	@echo "1. Local deployment (docker-compose)"
	@echo "2. Push to registry for cloud deployment"
	@read -p "Enter choice (1-2): " choice; \
	case $$choice in \
		1) docker-compose -f docker-compose.render.yml up -d ;; \
		2) echo "$(YELLOW)Push to your container registry manually$(RESET)" ;; \
		*) echo "$(RED)Invalid choice$(RESET)" ;; \
	esac

# =============================================================================
# 🌐 DOMAIN & SSL SETUP
# =============================================================================

.PHONY: domain-setup ssl-check

## 🌐 Setup custom domain (instructions)
domain-setup:
	@echo "$(BLUE)🌐 Custom Domain Setup Instructions$(RESET)"
	@echo ""
	@echo "$(GREEN)For Render:$(RESET)"
	@echo "1. Go to https://dashboard.render.com"
	@echo "2. Select your service"
	@echo "3. Go to Settings > Custom Domains"
	@echo "4. Add your domain"
	@echo "5. Point your domain's DNS to the provided CNAME"
	@echo ""
	@echo "$(GREEN)For Railway:$(RESET)"
	@echo "1. Go to https://railway.app"
	@echo "2. Select your project"
	@echo "3. Go to Settings > Domains"
	@echo "4. Add your custom domain"
	@echo "5. Update your DNS records as instructed"

## 🔒 Check SSL certificate
ssl-check:
	@read -p "Enter your domain (e.g. api.yourdomain.com): " domain; \
	echo "$(BLUE)🔒 Checking SSL for $$domain...$(RESET)"; \
	curl -I https://$$domain/health || echo "$(RED)❌ SSL check failed$(RESET)"

# =============================================================================
# 📊 MONITORING & LOGS
# =============================================================================

.PHONY: logs-render logs-railway monitor

## 📋 View Render logs (manual)
logs-render:
	@echo "$(BLUE)📋 Render Logs$(RESET)"
	@echo "Go to: https://dashboard.render.com"
	@echo "Select your service > Logs tab"

## 📋 View Railway logs
logs-railway:
	@echo "$(BLUE)📋 Railway Logs$(RESET)"
	@if command -v railway >/dev/null 2>&1; then \
		railway logs; \
	else \
		echo "$(RED)Railway CLI not installed$(RESET)"; \
		echo "Install: npm install -g @railway/cli"; \
	fi

## 📊 Monitor deployment
monitor:
	@echo "$(BLUE)📊 Monitoring deployed application...$(RESET)"
	@read -p "Enter your deployment URL: " url; \
	echo "Monitoring $$url/health every 30 seconds..."; \
	echo "Press Ctrl+C to stop"; \
	while true; do \
		if curl -s $$url/health > /dev/null; then \
			echo "$$(date): $(GREEN)✅ Healthy$(RESET)"; \
		else \
			echo "$$(date): $(RED)❌ Unhealthy$(RESET)"; \
		fi; \
		sleep 30; \
	done

# =============================================================================
# 🔧 CLI TOOLS INSTALLATION
# =============================================================================

.PHONY: install-cli install-railway install-render-cli

## 🔧 Install deployment CLI tools
install-cli: install-railway
	@echo "$(GREEN)✅ CLI tools installation completed$(RESET)"

## 🚂 Install Railway CLI
install-railway:
	@echo "$(BLUE)🚂 Installing Railway CLI...$(RESET)"
	@if command -v railway >/dev/null 2>&1; then \
		echo "$(GREEN)✅ Railway CLI already installed$(RESET)"; \
	else \
		npm install -g @railway/cli; \
		echo "$(GREEN)✅ Railway CLI installed$(RESET)"; \
	fi

## 🎨 Install Render CLI (not available, using manual approach)
install-render-cli:
	@echo "$(YELLOW)⚠️  Render CLI not available$(RESET)"
	@echo "Render deployments are managed via:"
	@echo "1. Git-based auto-deployment"
	@echo "2. Web dashboard: https://dashboard.render.com"

# =============================================================================
# 💰 COST OPTIMIZATION
# =============================================================================

.PHONY: cost-estimate cost-optimize

## 💰 Estimate deployment costs
cost-estimate:
	@echo "$(BLUE)💰 Deployment Cost Estimate$(RESET)"
	@echo ""
	@echo "$(GREEN)🆓 Render (FREE tier):$(RESET)"
	@echo "  - Web Service: $$0/month (750 hours limit)"
	@echo "  - PostgreSQL: $$0/month (1GB limit)"
	@echo "  - Limitations: Auto-sleep, slower cold starts"
	@echo ""
	@echo "$(YELLOW)💰 Railway:$(RESET)"
	@echo "  - Starter: $$5/month (after $$5 free credit)"
	@echo "  - Includes: PostgreSQL, Redis, better performance"
	@echo "  - Benefits: Always-on, faster deployments"
	@echo ""
	@echo "$(BLUE)📊 Break-even analysis:$(RESET)"
	@echo "  - Render: Free forever (with limitations)"
	@echo "  - Railway: Need 1 customer at $$29/month to break even"

## 🎯 Cost optimization tips
cost-optimize:
	@echo "$(BLUE)🎯 Cost Optimization Tips$(RESET)"
	@echo ""
	@echo "$(GREEN)Start with Render FREE:$(RESET)"
	@echo "✅ Perfect for MVP and validation"
	@echo "✅ No upfront costs"
	@echo "✅ Upgrade when you have paying customers"
	@echo ""
	@echo "$(GREEN)Upgrade to Railway when:$(RESET)"
	@echo "✅ You have consistent traffic"
	@echo "✅ Auto-sleep becomes problematic"
	@echo "✅ You need better performance"
	@echo "✅ You have revenue to justify $$5/month"
	@echo ""
	@echo "$(YELLOW)Free tier maximization:$(RESET)"
	@echo "- Use Render for backend (free)"
	@echo "- Use Vercel for frontend (free)"
	@echo "- Use SendGrid for email (100/day free)"
	@echo "- Use Cloudflare for CDN (free)"

# =============================================================================
# 🆘 TROUBLESHOOTING
# =============================================================================

.PHONY: deploy-troubleshoot deploy-logs deploy-debug

## 🆘 Deployment troubleshooting
deploy-troubleshoot:
	@echo "$(BLUE)🆘 Deployment Troubleshooting$(RESET)"
	@echo ""
	@echo "$(YELLOW)Common issues and solutions:$(RESET)"
	@echo ""
	@echo "$(RED)❌ Build failed:$(RESET)"
	@echo "  - Check your package.json scripts"
	@echo "  - Ensure all dependencies are listed"
	@echo "  - Test build locally: make deploy-build"
	@echo ""
	@echo "$(RED)❌ Database connection failed:$(RESET)"
	@echo "  - Check DATABASE_URL environment variable"
	@echo "  - Ensure database is created"
	@echo "  - Run migrations: npm run db:migrate:prod"
	@echo ""
	@echo "$(RED)❌ App won't start:$(RESET)"
	@echo "  - Check environment variables"
	@echo "  - Review application logs"
	@echo "  - Verify start command in package.json"

## 📋 Get deployment logs
deploy-logs:
	@echo "$(BLUE)📋 How to access deployment logs:$(RESET)"
	@echo ""
	@echo "$(GREEN)Render:$(RESET)"
	@echo "1. Go to https://dashboard.render.com"
	@echo "2. Select your service"
	@echo "3. Click 'Logs' tab"
	@echo ""
	@echo "$(GREEN)Railway:$(RESET)"
	@echo "1. Use CLI: railway logs"
	@echo "2. Or go to https://railway.app dashboard"

## 🐛 Debug deployment
deploy-debug:
	@echo "$(BLUE)🐛 Debug deployment locally$(RESET)"
	@docker-compose -f docker-compose.render.yml up
	@echo "Test your app at: http://localhost:3000"
	@echo "Stop with: Ctrl+C"

# =============================================================================
# 📚 HELP & DOCUMENTATION
# =============================================================================

## 📚 Show deployment help
help-deploy:
	@echo "$(BLUE)📚 Deployment Help$(RESET)"
	@echo ""
	@echo "$(GREEN)Quick Start:$(RESET)"
	@echo "  make deploy              # Interactive deployment"
	@echo "  make deploy-render       # Deploy to Render (FREE)"
	@echo "  make deploy-railway      # Deploy to Railway ($$5/month)"
	@echo ""
	@echo "$(GREEN)Preparation:$(RESET)"
	@echo "  make deploy-prep         # Prepare for deployment"
	@echo "  make deploy-test         # Test before deployment"
	@echo ""
	@echo "$(GREEN)Monitoring:$(RESET)"
	@echo "  make deploy-check        # Check deployment health"
	@echo "  make monitor             # Monitor deployment"
	@echo ""
	@echo "$(GREEN)Cost:$(RESET)"
	@echo "  make cost-estimate       # Estimate costs"
	@echo "  make cost-optimize       # Optimization tips"

# =============================================================================
# 🔄 EXISTING COMMANDS (Updated)
# =============================================================================

.PHONY: setup-full dev-prod build-app start-prod test-all clean-all

## 🎯 Complete setup for new developers (includes CLI tools)
setup-full: install install-cli db-fresh
	@echo "$(GREEN)🎉 Setup completed! Ready for development and deployment!$(RESET)"

## 🚀 Start development environment (production mode)
dev-prod: db-start
	@echo "$(BLUE)🚀 Starting development environment (production mode)...$(RESET)"
	@pnpm dev

## 🏗️ Build application
build-app:
	@echo "$(BLUE)🏗️ Building application...$(RESET)"
	@pnpm build

## ▶️ Start production server
start-prod:
	@echo "$(BLUE)▶️ Starting production server...$(RESET)"
	@pnpm start:prod

## 🧪 Run all tests
test-all:
	@echo "$(BLUE)🧪 Running all tests...$(RESET)"
	@pnpm test

## 🧹 Clean everything (full cleanup)
clean-all:
	@echo "$(BLUE)🧹 Cleaning up everything...$(RESET)"
	@docker-compose down -v
	@docker system prune -f
	@rm -rf node_modules dist coverage

# =============================================================================
# 📋 HELP
# =============================================================================

## 📋 Show this help message
help:
	@echo "$(BLUE)📋 Modern Backend Template - Makefile Commands$(RESET)"
	@echo ""
	@echo "$(GREEN)🚀 DEPLOYMENT (NEW!):$(RESET)"
	@awk 'BEGIN {FS = ":.*##"; printf ""} /^[a-zA-Z_-]+:.*?##/ { if ($$0 ~ /deploy/) printf "  $(YELLOW)%-20s$(RESET) %s\n", $$1, $$2 }' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(GREEN)🔧 DEVELOPMENT:$(RESET)"
	@awk 'BEGIN {FS = ":.*##"; printf ""} /^[a-zA-Z_-]+:.*?##/ { if ($$0 !~ /deploy/ && $$0 !~ /help/) printf "  $(YELLOW)%-20s$(RESET) %s\n", $$1, $$2 }' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(GREEN)📚 HELP:$(RESET)"
	@echo "  $(YELLOW)help-deploy$(RESET)          Show detailed deployment help"
	@echo "  $(YELLOW)help-legacy$(RESET)          Show legacy help message"
	@echo "  $(YELLOW)cost-estimate$(RESET)        Show cost estimates"
	@echo "  $(YELLOW)deploy-troubleshoot$(RESET)  Troubleshooting guide"
	@echo ""
	@echo "$(GREEN)🔄 UPDATED COMMANDS:$(RESET)"
	@echo "  $(YELLOW)setup-full$(RESET)           Complete setup with CLI tools"
	@echo "  $(YELLOW)dev-prod$(RESET)             Start development in production mode"
	@echo "  $(YELLOW)build-app$(RESET)            Build application"
	@echo "  $(YELLOW)start-prod$(RESET)           Start production server"
	@echo "  $(YELLOW)test-all$(RESET)             Run all tests"
	@echo "  $(YELLOW)clean-all$(RESET)            Full cleanup"
	@echo ""
	@echo "$(BLUE)💡 Quick start: make setup && make deploy$(RESET)"
