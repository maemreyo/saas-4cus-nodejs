#!/usr/bin/env tsx

/**
 * Cleanup Unused Services and Files
 *
 * This script removes unused services and files from the project
 * Following CLEAN CODE principles
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync, unlinkSync, rmSync } from 'fs';
import { join } from 'path';

const execAsync = promisify(exec);

interface CleanupItem {
  path: string;
  type: 'file' | 'directory';
  description: string;
  reason: string;
}

class ProjectCleanup {
  private itemsToRemove: CleanupItem[] = [
    {
      path: 'optic.yml',
      type: 'file',
      description: 'Optic API documentation config',
      reason: 'Replaced by Fastify Swagger/OpenAPI'
    },
    {
      path: '.optic',
      type: 'directory',
      description: 'Optic configuration directory',
      reason: 'Replaced by Fastify Swagger/OpenAPI'
    },
    {
      path: 'jest.config.js',
      type: 'file',
      description: 'Jest configuration',
      reason: 'Using Vitest instead of Jest'
    },
    {
      path: 'nodemon.json',
      type: 'file',
      description: 'Nodemon configuration',
      reason: 'Using tsx watch instead of nodemon'
    },
    {
      path: 'package-lock.json',
      type: 'file',
      description: 'NPM lock file',
      reason: 'Using pnpm instead of npm'
    }
  ];

  /**
   * Run cleanup process
   */
  async cleanup(dryRun: boolean = false): Promise<void> {
    console.log('🧹 Starting project cleanup...\n');

    if (dryRun) {
      console.log('🔍 DRY RUN MODE - No files will be deleted\n');
    }

    let removedCount = 0;
    let skippedCount = 0;

    for (const item of this.itemsToRemove) {
      const fullPath = join(process.cwd(), item.path);

      if (existsSync(fullPath)) {
        console.log(`${dryRun ? '🔍' : '🗑️'} ${item.type}: ${item.path}`);
        console.log(`   📝 ${item.description}`);
        console.log(`   💡 Reason: ${item.reason}`);

        if (!dryRun) {
          try {
            if (item.type === 'file') {
              unlinkSync(fullPath);
            } else {
              rmSync(fullPath, { recursive: true, force: true });
            }
            console.log(`   ✅ Removed successfully`);
            removedCount++;
          } catch (error) {
            console.log(`   ❌ Failed to remove: ${error}`);
          }
        } else {
          console.log(`   🔍 Would be removed`);
          removedCount++;
        }
      } else {
        console.log(`ℹ️  ${item.type}: ${item.path} (not found)`);
        skippedCount++;
      }
      console.log('');
    }

    // Clean up node_modules if switching to pnpm
    if (!dryRun && existsSync('node_modules') && !existsSync('pnpm-lock.yaml')) {
      console.log('🧹 Cleaning node_modules for pnpm migration...');
      try {
        rmSync('node_modules', { recursive: true, force: true });
        console.log('✅ node_modules removed');
        console.log('💡 Run "pnpm install" to reinstall with pnpm');
      } catch (error) {
        console.log(`❌ Failed to remove node_modules: ${error}`);
      }
    }

    console.log('📊 Cleanup Summary:');
    console.log(`   ${dryRun ? 'Would remove' : 'Removed'}: ${removedCount} items`);
    console.log(`   Skipped: ${skippedCount} items`);

    if (dryRun) {
      console.log('\n💡 Run without --dry-run to actually remove files');
    } else {
      console.log('\n✅ Cleanup completed!');
    }
  }

  /**
   * Show what would be cleaned up
   */
  async showCleanupPlan(): Promise<void> {
    console.log('📋 Cleanup Plan:\n');

    for (const item of this.itemsToRemove) {
      const fullPath = join(process.cwd(), item.path);
      const exists = existsSync(fullPath);
      const status = exists ? '🎯 Will remove' : 'ℹ️  Not found';

      console.log(`${status} ${item.type}: ${item.path}`);
      console.log(`   📝 ${item.description}`);
      console.log(`   💡 Reason: ${item.reason}`);
      console.log('');
    }
  }

  /**
   * Verify project is ready for cleanup
   */
  async verifyProject(): Promise<boolean> {
    console.log('🔍 Verifying project state...\n');

    const checks = [
      {
        name: 'Fastify Swagger is configured',
        check: () => {
          try {
            const packageJson = require('../package.json');
            return packageJson.dependencies['@fastify/swagger'] &&
                   packageJson.dependencies['@fastify/swagger-ui'];
          } catch {
            return false;
          }
        }
      },
      {
        name: 'Vitest is configured',
        check: () => {
          try {
            const packageJson = require('../package.json');
            return packageJson.devDependencies['vitest'];
          } catch {
            return false;
          }
        }
      },
      {
        name: 'tsx is available',
        check: () => {
          try {
            const packageJson = require('../package.json');
            return packageJson.devDependencies['tsx'];
          } catch {
            return false;
          }
        }
      }
    ];

    let allPassed = true;

    for (const check of checks) {
      const passed = check.check();
      console.log(`${passed ? '✅' : '❌'} ${check.name}`);
      if (!passed) allPassed = false;
    }

    console.log('');

    if (allPassed) {
      console.log('✅ Project is ready for cleanup');
    } else {
      console.log('❌ Project is not ready for cleanup');
      console.log('💡 Please ensure all modern alternatives are properly configured');
    }

    return allPassed;
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'plan';
  const dryRun = args.includes('--dry-run');

  const cleanup = new ProjectCleanup();

  switch (command) {
    case 'plan':
      await cleanup.showCleanupPlan();
      break;

    case 'verify':
      await cleanup.verifyProject();
      break;

    case 'run':
      const isReady = await cleanup.verifyProject();
      if (isReady) {
        console.log('');
        await cleanup.cleanup(dryRun);
      } else {
        console.log('\n❌ Cleanup aborted - project not ready');
        process.exit(1);
      }
      break;

    default:
      console.log(`
🧹 Project Cleanup Tool

Usage: tsx scripts/cleanup-unused.ts <command> [options]

Commands:
  plan     - Show what would be cleaned up (default)
  verify   - Verify project is ready for cleanup
  run      - Run the cleanup process

Options:
  --dry-run  - Show what would be done without actually doing it

Examples:
  tsx scripts/cleanup-unused.ts plan
  tsx scripts/cleanup-unused.ts verify
  tsx scripts/cleanup-unused.ts run --dry-run
  tsx scripts/cleanup-unused.ts run

⚠️  Always run 'verify' and 'plan' before 'run'
      `);
  }
}

// Export for programmatic use
export default ProjectCleanup;

// Run CLI if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
