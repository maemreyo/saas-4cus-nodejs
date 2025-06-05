# Build Instructions & Troubleshooting

## First Time Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Generate Prisma client (IMPORTANT!)
npx prisma generate

# 3. Create .env file
cp .env.example .env

# 4. Start development database
docker-compose -f docker-compose.dev.yml up -d

# 5. Run migrations
pnpm db:migrate

# 6. Seed database
pnpm db:seed

# 7. Build the project
pnpm build
```

## Common Build Errors & Solutions

### 1. Prisma Client Errors
```
Error: Module '"@prisma/client"' has no exported member 'PrismaClient'
```
**Solution**: Run `npx prisma generate` before building

### 2. Type Declaration Conflicts
```
Error: All declarations of 'user' must have identical modifiers
```
**Solution**: We use `customUser` instead of `user` to avoid conflicts with @fastify/jwt

### 3. BullMQ QueueScheduler Error
```
Error: Module '"bullmq"' has no exported member 'QueueScheduler'
```
**Solution**: QueueScheduler is deprecated in BullMQ v4+. Already fixed in our code.

### 4. JWT Sign Type Errors
```
Error: Type 'string' is not assignable to type 'number | StringValue'
```
**Solution**: Cast SignOptions type explicitly (already fixed)

## Development Workflow

1. **Start services**:
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   pnpm dev
   ```

2. **Watch mode**:
   ```bash
   pnpm dev
   ```

3. **Run tests**:
   ```bash
   pnpm test
   ```

4. **Type checking**:
   ```bash
   pnpm typecheck
   ```

## Production Build

```bash
# Clean build
rm -rf dist
pnpm build

# Test production build locally
NODE_ENV=production pnpm start
```

## Docker Build

```bash
# Build image
docker build -t myapp:latest .

# Run with docker-compose
docker-compose up -d
```

## Environment Variables

Make sure these are set in your `.env`:

```env
# Required
DATABASE_URL=postgresql://user:pass@localhost:5555/mydb
JWT_ACCESS_SECRET=minimum-32-characters-secret-key
JWT_REFRESH_SECRET=another-minimum-32-characters-key
ENCRYPTION_KEY=exactly-32-character-encryption

# Optional but recommended
REDIS_HOST=localhost
REDIS_PORT=6379
SMTP_HOST=localhost
SMTP_PORT=1025
```

## Troubleshooting Tips

1. **Clear all caches**:
   ```bash
   rm -rf node_modules dist .tsbuildinfo
   pnpm install
   ```

2. **Reset database**:
   ```bash
   npx prisma migrate reset
   ```

3. **Check TypeScript version**:
   ```bash
   npx tsc --version  # Should be 5.x
   ```

4. **Verify Node version**:
   ```bash
   node --version  # Should be 20.x or higher
   ```
