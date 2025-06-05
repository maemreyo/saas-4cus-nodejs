import { prisma } from './prisma.service'
import { logger } from '@shared/logger'
import { hashPassword } from '@shared/utils/crypto'

async function seed() {
  logger.info('Starting database seed...')

  try {
    // Create admin user
    const adminPassword = await hashPassword('admin123')
    const admin = await prisma.client.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        username: 'admin',
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'SUPER_ADMIN',
        emailVerified: true,
        emailVerifiedAt: new Date()
      }
    })

    logger.info('Admin user created', { userId: admin.id })

    // Create test users
    const testUsers = []
    for (let i = 1; i <= 5; i++) {
      const password = await hashPassword(`password${i}`)
      const user = await prisma.client.user.upsert({
        where: { email: `user${i}@example.com` },
        update: {},
        create: {
          email: `user${i}@example.com`,
          username: `user${i}`,
          password,
          firstName: `User`,
          lastName: `${i}`,
          role: 'USER',
          emailVerified: true,
          emailVerifiedAt: new Date()
        }
      })
      testUsers.push(user)
    }

    logger.info('Test users created', { count: testUsers.length })

    // Create settings
    const settings = [
      {
        key: 'app.name',
        value: { value: 'Modern Backend API' },
        description: 'Application name'
      },
      {
        key: 'app.maintenance',
        value: { enabled: false },
        description: 'Maintenance mode'
      },
      {
        key: 'auth.registration',
        value: { enabled: true },
        description: 'User registration enabled'
      }
    ]

    for (const setting of settings) {
      await prisma.client.setting.upsert({
        where: { key: setting.key },
        update: setting,
        create: setting
      })
    }

    logger.info('Settings created', { count: settings.length })

    logger.info('Database seed completed successfully')
  } catch (error) {
    logger.error('Database seed failed', error as Error)
    throw error
  } finally {
    await prisma.disconnect()
  }
}

// Run seed if executed directly
if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export { seed }