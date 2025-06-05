// scripts/setup.ts
import { execSync } from 'child_process'

console.log('🚀 Setting up project...')

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...')
  execSync('npx prisma generate', { stdio: 'inherit' })

  console.log('✅ Setup completed successfully!')
} catch (error) {
  console.error('❌ Setup failed:', error)
  process.exit(1)
}
