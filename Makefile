.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make dev          - Start development environment"
	@echo "  make build        - Build production image"
	@echo "  make up           - Start production environment"
	@echo "  make down         - Stop all services"
	@echo "  make logs         - Show logs"
	@echo "  make test         - Run tests"
	@echo "  make migrate      - Run database migrations"
	@echo "  make seed         - Seed database"

.PHONY: dev
dev:
	docker-compose -f docker-compose.dev.yml up -d
	npm run dev

.PHONY: build
build:
	docker build -t modern-backend:latest .

.PHONY: up
up:
	docker-compose up -d

.PHONY: down
down:
	docker-compose down
	docker-compose -f docker-compose.dev.yml down

.PHONY: logs
logs:
	docker-compose logs -f

.PHONY: test
test:
	npm test

.PHONY: migrate
migrate:
	npm run db:migrate

.PHONY: seed
seed:
	npm run db:seed

.PHONY: clean
clean:
	docker-compose down -v
	docker-compose -f docker-compose.dev.yml down -v
	rm -rf node_modules dist coverage
