  # Production Deployment Guide

This guide covers deploying the Modern Backend Template to production environments.

## 🚀 Deployment Options

### 1. Docker Deployment (Recommended)

#### Single Server Deployment

```bash
# 1. Build production image
docker build -t myapp:latest -f Dockerfile.prod .

# 2. Create production docker-compose.yml
cat > docker-compose.prod.yml << EOF
version: '3.8'
services:
  app:
    image: myapp:latest
    ports:
      - "80:3000"
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis
    restart: always

  postgres:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: myapp_prod
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: \${DB_PASSWORD}
    restart: always

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: always

volumes:
  postgres_data:
  redis_data:
EOF

# 3. Deploy
docker-compose -f docker-compose.prod.yml up -d
```

#### Docker Swarm Deployment

```bash
# 1. Initialize swarm
docker swarm init

# 2. Create secrets
echo "your-db-password" | docker secret create db_password -
echo "your-jwt-secret" | docker secret create jwt_secret -

# 3. Deploy stack
docker stack deploy -c docker-stack.yml myapp
```

### 2. Kubernetes Deployment

#### Using Helm

```bash
# 1. Create values file
cat > values.yaml << EOF
app:
  name: myapp
  image: myapp:latest
  replicas: 3

ingress:
  enabled: true
  host: api.myapp.com
  tls: true

postgresql:
  enabled: true
  auth:
    database: myapp_prod

redis:
  enabled: true
  auth:
    enabled: true
EOF

# 2. Install
helm install myapp ./helm-chart -f values.yaml
```

#### Manual Kubernetes

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp-api
  template:
    metadata:
      labels:
        app: myapp-api
    spec:
      containers:
      - name: api
        image: myapp:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: myapp-secrets
              key: database-url
        livenessProbe:
          httpGet:
            path: /health/live
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### 3. Platform-as-a-Service (PaaS)

#### Heroku

```bash
# 1. Create app
heroku create myapp-api

# 2. Add buildpacks
heroku buildpacks:set heroku/nodejs

# 3. Add addons
heroku addons:create heroku-postgresql:standard-0
heroku addons:create heroku-redis:premium-0

# 4. Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_ACCESS_SECRET=your-secret

# 5. Deploy
git push heroku main

# 6. Run migrations
heroku run pnpm db:migrate:prod
```

#### Railway

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login and init
railway login
railway init

# 3. Add services
railway add postgresql
railway add redis

# 4. Deploy
railway up
```

#### Render

```yaml
# render.yaml
services:
  - type: web
    name: myapp-api
    env: node
    buildCommand: pnpm install && pnpm build
    startCommand: pnpm start:prod
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: myapp-db
          property: connectionString

databases:
  - name: myapp-db
    plan: standard
```

### 4. Cloud Providers

#### AWS ECS

```bash
# 1. Build and push to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_URI
docker build -t myapp .
docker tag myapp:latest $ECR_URI/myapp:latest
docker push $ECR_URI/myapp:latest

# 2. Create task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# 3. Create service
aws ecs create-service \
  --cluster production \
  --service-name myapp-api \
  --task-definition myapp:1 \
  --desired-count 3
```

#### Google Cloud Run

```bash
# 1. Build and push to GCR
gcloud builds submit --tag gcr.io/PROJECT_ID/myapp

# 2. Deploy
gcloud run deploy myapp \
  --image gcr.io/PROJECT_ID/myapp \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## 📋 Pre-deployment Checklist

### 1. Environment Variables

```bash
# Required production variables
NODE_ENV=production
APP_NAME=MyApp
APP_VERSION=1.0.0

# Security (use strong, unique values)
JWT_ACCESS_SECRET=<strong-secret>
JWT_REFRESH_SECRET=<strong-secret>
ENCRYPTION_KEY=<32-character-key>
COOKIE_SECRET=<strong-secret>

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname?sslmode=require

# Redis (with TLS)
REDIS_URL=rediss://user:pass@host:6379

# Monitoring
SENTRY_DSN=https://...@sentry.io/...
```

### 2. Database Migrations

```bash
# Run migrations
pnpm db:migrate:prod

# Verify migration status
pnpm prisma migrate status
```

### 3. Security Hardening

- [ ] Enable HTTPS/TLS
- [ ] Set secure headers (Helmet)
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up WAF (Web Application Firewall)
- [ ] Configure security groups/firewall rules
- [ ] Enable audit logging
- [ ] Set up intrusion detection

### 4. Monitoring Setup

- [ ] Configure APM (Sentry/DataDog/New Relic)
- [ ] Set up log aggregation (ELK/CloudWatch/Stackdriver)
- [ ] Configure metrics collection (Prometheus/CloudWatch)
- [ ] Set up uptime monitoring (Pingdom/UptimeRobot)
- [ ] Create alerts for critical metrics

### 5. Backup Strategy

```bash
# PostgreSQL backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Automated backups
0 2 * * * pg_dump $DATABASE_URL | gzip > /backups/db-$(date +\%Y\%m\%d).sql.gz
```

### 6. Performance Optimization

- [ ] Enable Redis caching
- [ ] Configure CDN for static assets
- [ ] Enable gzip compression
- [ ] Optimize database queries
- [ ] Configure connection pooling
- [ ] Set up horizontal scaling

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: pnpm install
      - run: pnpm test
      - run: pnpm build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build and push Docker image
        env:
          DOCKER_REGISTRY: ${{ secrets.DOCKER_REGISTRY }}
        run: |
          docker build -t $DOCKER_REGISTRY/myapp:$GITHUB_SHA .
          docker push $DOCKER_REGISTRY/myapp:$GITHUB_SHA

      - name: Deploy to Kubernetes
        env:
          KUBE_CONFIG: ${{ secrets.KUBE_CONFIG }}
        run: |
          echo "$KUBE_CONFIG" | base64 -d > kubeconfig
          kubectl --kubeconfig=kubeconfig set image deployment/myapp-api api=$DOCKER_REGISTRY/myapp:$GITHUB_SHA
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  script:
    - pnpm install
    - pnpm test

build:
  stage: build
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

deploy:
  stage: deploy
  only:
    - main
  script:
    - kubectl set image deployment/myapp-api api=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
```

## 📊 Post-deployment

### 1. Smoke Tests

```bash
# Health check
curl https://api.myapp.com/health

# API test
curl -X POST https://api.myapp.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}'
```

### 2. Performance Testing

```bash
# Load testing with k6
k6 run load-test.js

# Stress testing
k6 run --vus 1000 --duration 5m stress-test.js
```

### 3. Monitor Key Metrics

- Response times (p50, p95, p99)
- Error rates
- Request rates
- CPU and memory usage
- Database connection pool
- Queue lengths
- Cache hit rates

### 4. Set Up Alerts

```javascript
// Example DataDog alert
{
  name: "High Error Rate",
  query: "avg(last_5m):sum:app.errors{env:production} > 100",
  message: "@slack-alerts High error rate detected!",
  thresholds: {
    critical: 100,
    warning: 50
  }
}
```

## 🔐 Security Considerations

### SSL/TLS Configuration

```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    ssl_certificate /etc/ssl/certs/myapp.crt;
    ssl_certificate_key /etc/ssl/private/myapp.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
}
```

### Environment Isolation

```bash
# Separate environments
- Production: api.myapp.com
- Staging: api-staging.myapp.com
- Development: api-dev.myapp.com

# Separate databases
- myapp_prod
- myapp_staging
- myapp_dev
```

### Secrets Management

```bash
# Using Kubernetes secrets
kubectl create secret generic myapp-secrets \
  --from-literal=jwt-secret=$JWT_SECRET \
  --from-literal=db-password=$DB_PASSWORD

# Using AWS Secrets Manager
aws secretsmanager create-secret \
  --name myapp/production \
  --secret-string file://secrets.json
```

## 🚨 Rollback Strategy

```bash
# Kubernetes rollback
kubectl rollout undo deployment/myapp-api

# Docker rollback
docker service update --image myapp:previous-version myapp_api

# Database rollback
pnpm prisma migrate resolve --rolled-back
```

## 📞 Support

For deployment issues:
- Check logs: `kubectl logs -f deployment/myapp-api`
- Review metrics dashboard
- Contact DevOps team
- Create issue in repository

---

**Remember**: Always test in staging before deploying to production! 🚀
