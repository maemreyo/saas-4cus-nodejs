import { Service } from 'typedi';
import { logger } from '@shared/logger';
import {
  HealthCheckEntry,
  HealthCheckFn,
  HealthCheckResult,
  HealthStatus,
  HealthSummary
} from './health.types';

@Service()
export class HealthService {
  private checks: Map<string, HealthCheckEntry> = new Map();
  private lastResults: Map<string, HealthCheckResult> = new Map();
  private lastCheckTime: Map<string, number> = new Map();

  // Cache results for 30 seconds by default
  private cacheTime = 30 * 1000;

  /**
   * Register a health check
   */
  register(name: string, check: HealthCheckFn, description?: string, tags?: string[]): void {
    if (this.checks.has(name)) {
      logger.warn(`Health check with name ${name} already registered, overwriting`);
    }

    this.checks.set(name, { name, check, description, tags });
    logger.debug(`Registered health check: ${name}`);
  }

  /**
   * Unregister a health check
   */
  unregister(name: string): boolean {
    const result = this.checks.delete(name);
    if (result) {
      this.lastResults.delete(name);
      this.lastCheckTime.delete(name);
      logger.debug(`Unregistered health check: ${name}`);
    }
    return result;
  }

  /**
   * Run a specific health check
   */
  async check(name: string): Promise<HealthCheckResult> {
    const entry = this.checks.get(name);

    if (!entry) {
      return {
        status: HealthStatus.UNHEALTHY,
        message: `Health check '${name}' not found`
      };
    }

    // Check if we have a cached result that's still valid
    const lastCheck = this.lastCheckTime.get(name);
    if (lastCheck && Date.now() - lastCheck < this.cacheTime) {
      const cachedResult = this.lastResults.get(name);
      if (cachedResult) {
        return cachedResult;
      }
    }

    try {
      const result = await entry.check();

      // Cache the result
      this.lastResults.set(name, result);
      this.lastCheckTime.set(name, Date.now());

      return result;
    } catch (error) {
      const result: HealthCheckResult = {
        status: HealthStatus.UNHEALTHY,
        message: `Health check '${name}' failed with error`,
        error: (error as Error).message
      };

      // Cache the error result
      this.lastResults.set(name, result);
      this.lastCheckTime.set(name, Date.now());

      return result;
    }
  }

  /**
   * Run all health checks
   */
  async checkAll(): Promise<HealthSummary> {
    const results: Record<string, HealthCheckResult> = {};
    let overallStatus = HealthStatus.HEALTHY;

    const checkPromises = Array.from(this.checks.keys()).map(async (name) => {
      const result = await this.check(name);
      results[name] = result;

      // Update overall status
      if (result.status === HealthStatus.UNHEALTHY) {
        overallStatus = HealthStatus.UNHEALTHY;
      } else if (result.status === HealthStatus.DEGRADED && overallStatus === HealthStatus.HEALTHY) {
        overallStatus = HealthStatus.DEGRADED;
      }
    });

    await Promise.all(checkPromises);

    return {
      status: overallStatus,
      checks: results,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get all registered health checks
   */
  getRegisteredChecks(): HealthCheckEntry[] {
    return Array.from(this.checks.values());
  }

  /**
   * Set cache time for health check results
   */
  setCacheTime(milliseconds: number): void {
    this.cacheTime = milliseconds;
  }
}
