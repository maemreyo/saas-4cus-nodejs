import { Service } from 'typedi';
import { prisma } from '@infrastructure/database/prisma.service';
import { redis } from '@infrastructure/cache/redis.service';
import { logger } from '@shared/logger';
import { EventBus } from '@shared/events/event-bus';
import { Cacheable, CacheInvalidate } from '@infrastructure/cache/redis.service';
import { config as appConfig } from '@infrastructure/config';

export interface SystemConfig {
  maintenance: {
    enabled: boolean;
    message?: string;
    allowedIps?: string[];
    scheduledFor?: Date;
    estimatedDuration?: number; // minutes
  };
  features: {
    registration: boolean;
    oauth: boolean;
    twoFactorAuth: boolean; // Changed from twoFactor to match config
    emailVerification: boolean;
    apiAccess: boolean;
    fileUpload: boolean;
    publicProfiles: boolean;
  };
  limits: {
    maxUsersPerTenant: number;
    maxProjectsPerUser: number;
    maxFileSize: number; // in bytes
    maxStoragePerUser: number; // in bytes
    apiRateLimit: number; // requests per minute
    maxTeamSize: number;
    maxConcurrentSessions: number;
  };
  security: {
    passwordMinLength: number;
    passwordRequireUppercase: boolean;
    passwordRequireLowercase: boolean;
    passwordRequireNumbers: boolean;
    passwordRequireSpecial: boolean;
    sessionTimeout: number; // minutes
    maxLoginAttempts: number;
    lockoutDuration: number; // minutes
    enforceIpWhitelist: boolean;
    allowedIps?: string[];
    requireEmailVerification: boolean;
    require2FAForAdmins: boolean;
  };
  email: {
    provider: 'smtp' | 'sendgrid' | 'ses';
    fromName: string;
    fromEmail: string;
    replyToEmail?: string;
    dailyLimit: number;
    templates: {
      welcome: boolean;
      passwordReset: boolean;
      emailVerification: boolean;
      invoiceNotification: boolean;
    };
  };
  billing: {
    enabled: boolean;
    provider: 'stripe' | 'paddle';
    currency: string;
    taxRate: number;
    trialDays: number;
    gracePeriodDays: number;
    autoChargeFailedPayments: boolean;
    sendInvoiceEmails: boolean;
    allowDiscounts: boolean;
  };
  integrations: {
    slack: {
      enabled: boolean;
      webhookUrl?: string;
      channels: {
        alerts: string;
        support: string;
        billing: string;
      };
    };
    analytics: {
      googleAnalytics?: string;
      mixpanel?: string;
      segment?: string;
      amplitude?: string;
    };
    monitoring: {
      sentry: boolean;
      datadog: boolean;
      newRelic: boolean;
      customWebhook?: string;
    };
  };
  ui: {
    theme: 'light' | 'dark' | 'auto';
    primaryColor: string;
    logo?: string;
    favicon?: string;
    customCss?: string;
    showPoweredBy: boolean;
    customFooterText?: string;
  };
}

@Service()
export class SystemConfigService {
  private readonly CONFIG_KEY = 'system:config';
  private readonly CONFIG_CACHE_TTL = 3600; // 1 hour

  constructor(private eventBus: EventBus) {}

  /**
   * Get system configuration
   */
  @Cacheable({ ttl: 3600, namespace: 'system:config' })
  async getConfig(): Promise<SystemConfig> {
    // Try to get from database
    const settings = await prisma.client.setting.findMany();

    if (settings.length === 0) {
      // Return default configuration
      return this.getDefaultConfig();
    }

    // Build config from settings
    const config: any = {};

    settings.forEach(setting => {
      const keys = setting.key.split('.');
      let current = config;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = setting.value;
    });

    return this.mergeWithDefaults(config);
  }

  /**
   * Update system configuration
   */
  @CacheInvalidate(['system:config'])
  async updateConfig(updates: Partial<SystemConfig>): Promise<SystemConfig> {
    const currentConfig = await this.getConfig();

    // Ensure we're properly merging nested objects
    const processedUpdates = this.ensureCompleteNestedObjects(updates, currentConfig);
    const newConfig = this.deepMerge(currentConfig, processedUpdates);

    // Validate configuration
    this.validateConfig(newConfig);

    // Save to database
    const flatConfig = this.flattenConfig(newConfig);

    for (const [key, value] of Object.entries(flatConfig)) {
      await prisma.client.setting.upsert({
        where: { key },
        create: {
          key,
          value,
          description: this.getConfigDescription(key)
        },
        update: { value }
      });
    }

    // Clear cache
    await redis.delete(this.CONFIG_KEY);

    logger.info('System configuration updated', { updates });

    // Emit event for configuration changes
    await this.eventBus.emit('admin.config.updated', {
      changes: updates,
      timestamp: new Date()
    });

    // Apply immediate changes
    await this.applyConfigChanges(currentConfig, newConfig);

    return newConfig;
  }

  /**
   * Ensures that partial nested objects are properly merged with current config
   * to avoid TypeScript errors with required properties
   */
  private ensureCompleteNestedObjects(updates: Partial<SystemConfig>, currentConfig: SystemConfig): Partial<SystemConfig> {
    const result: Partial<SystemConfig> = { ...updates };

    // Handle features object if it exists in updates
    if (updates.features) {
      result.features = { ...currentConfig.features, ...updates.features };
    }

    // Handle security object if it exists in updates
    if (updates.security) {
      result.security = { ...currentConfig.security, ...updates.security };
    }

    // Handle other nested objects as needed
    if (updates.limits) {
      result.limits = { ...currentConfig.limits, ...updates.limits };
    }

    if (updates.email) {
      result.email = { ...currentConfig.email, ...updates.email };
      // Handle nested templates if they exist
      if (updates.email.templates) {
        result.email.templates = { ...currentConfig.email.templates, ...updates.email.templates };
      }
    }

    if (updates.billing) {
      result.billing = { ...currentConfig.billing, ...updates.billing };
    }

    if (updates.integrations) {
      result.integrations = { ...currentConfig.integrations };

      // Handle nested integration objects
      if (updates.integrations.slack) {
        result.integrations.slack = {
          ...currentConfig.integrations.slack,
          ...updates.integrations.slack
        };

        // Handle nested channels if they exist
        if (updates.integrations.slack.channels) {
          result.integrations.slack.channels = {
            ...currentConfig.integrations.slack.channels,
            ...updates.integrations.slack.channels
          };
        }
      }

      if (updates.integrations.analytics) {
        result.integrations.analytics = {
          ...currentConfig.integrations.analytics,
          ...updates.integrations.analytics
        };
      }

      if (updates.integrations.monitoring) {
        result.integrations.monitoring = {
          ...currentConfig.integrations.monitoring,
          ...updates.integrations.monitoring
        };
      }
    }

    if (updates.ui) {
      result.ui = { ...currentConfig.ui, ...updates.ui };
    }

    return result;
  }

  /**
   * Get specific configuration value
   */
  async getConfigValue(path: string): Promise<any> {
    const config = await this.getConfig();
    const keys = path.split('.');
    let value: any = config;

    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) break;
    }

    return value;
  }

  /**
   * Toggle maintenance mode
   */
  async toggleMaintenanceMode(
    enabled: boolean,
    options?: {
      message?: string;
      allowedIps?: string[];
      scheduledFor?: Date;
      estimatedDuration?: number;
    }
  ): Promise<void> {
    await this.updateConfig({
      maintenance: {
        enabled,
        message: options?.message,
        allowedIps: options?.allowedIps,
        scheduledFor: options?.scheduledFor,
        estimatedDuration: options?.estimatedDuration
      }
    });

    if (enabled) {
      logger.warn('Maintenance mode enabled', options);
      await this.eventBus.emit('system.maintenance.enabled', {
        ...options,
        timestamp: new Date()
      });
    } else {
      logger.info('Maintenance mode disabled');
      await this.eventBus.emit('system.maintenance.disabled', {
        timestamp: new Date()
      });
    }
  }

  /**
   * Update feature flags
   */
  async updateFeatureFlags(features: Partial<SystemConfig['features']>): Promise<void> {
    const currentConfig = await this.getConfig();
    const mergedFeatures = { ...currentConfig.features, ...features };
    await this.updateConfig({ features: mergedFeatures });
  }

  /**
   * Update security settings
   */
  async updateSecuritySettings(security: Partial<SystemConfig['security']>): Promise<void> {
    const currentConfig = await this.getConfig();
    const mergedSecurity = { ...currentConfig.security, ...security };
    await this.updateConfig({ security: mergedSecurity });

    // Log security changes for audit
    logger.security('Security settings updated', security);
  }

  /**
   * Check if system is in maintenance mode
   */
  async isInMaintenanceMode(ipAddress?: string): Promise<boolean> {
    const config = await this.getConfig();

    if (!config.maintenance.enabled) {
      return false;
    }

    // Check if IP is in allowed list
    if (ipAddress && config.maintenance.allowedIps?.includes(ipAddress)) {
      return false;
    }

    // Check if maintenance is scheduled for future
    if (config.maintenance.scheduledFor) {
      const scheduledTime = new Date(config.maintenance.scheduledFor);
      if (scheduledTime > new Date()) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get feature availability
   */
  async isFeatureEnabled(feature: keyof SystemConfig['features']): Promise<boolean> {
    const config = await this.getConfig();
    return config.features[feature] ?? false;
  }

  /**
   * Legacy method for backward compatibility
   * @deprecated Use isFeatureEnabled with 'twoFactorAuth' instead
   */
  async isTwoFactorEnabled(): Promise<boolean> {
    return this.isFeatureEnabled('twoFactorAuth');
  }

  /**
   * Get rate limit for a specific resource
   */
  async getRateLimit(resource: string = 'api'): Promise<number> {
    const config = await this.getConfig();

    switch (resource) {
      case 'api':
        return config.limits.apiRateLimit;
      case 'email':
        return config.email.dailyLimit;
      default:
        return config.limits.apiRateLimit;
    }
  }

  /**
   * Export configuration
   */
  async exportConfig(): Promise<{
    config: SystemConfig;
    exportedAt: Date;
    version: string;
  }> {
    const config = await this.getConfig();

    return {
      config,
      exportedAt: new Date(),
      version: '1.0.0'
    };
  }

  /**
   * Import configuration
   */
  async importConfig(
    configData: Partial<SystemConfig>,
    options?: {
      merge?: boolean;
      validate?: boolean;
    }
  ): Promise<SystemConfig> {
    if (options?.validate !== false) {
      this.validateConfig(configData as SystemConfig);
    }

    if (options?.merge) {
      const currentConfig = await this.getConfig();
      configData = this.deepMerge(currentConfig, configData);
    }

    return await this.updateConfig(configData);
  }

  // Private helper methods

  private getDefaultConfig(): SystemConfig {
    return {
      maintenance: {
        enabled: false,
        message: 'The system is currently under maintenance. Please check back later.'
      },
      features: {
        registration: appConfig.features.registration,
        oauth: appConfig.features.oauth,
        twoFactorAuth: appConfig.features.twoFactorAuth, // Changed from twoFactor to twoFactorAuth
        emailVerification: appConfig.features.emailVerification,
        apiAccess: true,
        fileUpload: true,
        publicProfiles: false
      },
      limits: {
        maxUsersPerTenant: 100,
        maxProjectsPerUser: 50,
        maxFileSize: 10 * 1024 * 1024, // 10MB
        maxStoragePerUser: 1024 * 1024 * 1024, // 1GB
        apiRateLimit: 100,
        maxTeamSize: 50,
        maxConcurrentSessions: 5
      },
      security: {
        passwordMinLength: 8,
        passwordRequireUppercase: true,
        passwordRequireLowercase: true,
        passwordRequireNumbers: true,
        passwordRequireSpecial: true,
        sessionTimeout: 60, // 1 hour
        maxLoginAttempts: 5,
        lockoutDuration: 15, // 15 minutes
        enforceIpWhitelist: false,
        requireEmailVerification: true,
        require2FAForAdmins: false
      },
      email: {
        provider: 'smtp',
        fromName: appConfig.email.from.split('<')[0].trim(),
        fromEmail: appConfig.email.from.match(/<(.+)>/)?.[1] || appConfig.email.from,
        dailyLimit: 1000,
        templates: {
          welcome: true,
          passwordReset: true,
          emailVerification: true,
          invoiceNotification: true
        }
      },
      billing: {
        enabled: true,
        provider: 'stripe',
        currency: 'usd',
        taxRate: 0,
        trialDays: 14,
        gracePeriodDays: 3,
        autoChargeFailedPayments: true,
        sendInvoiceEmails: true,
        allowDiscounts: true
      },
      integrations: {
        slack: {
          enabled: false,
          channels: {
            alerts: '#alerts',
            support: '#support',
            billing: '#billing'
          }
        },
        analytics: {},
        monitoring: {
          sentry: appConfig.monitoring.sentry.enabled,
          datadog: false,
          newRelic: false
        }
      },
      ui: {
        theme: 'light',
        primaryColor: '#007bff',
        showPoweredBy: true
      }
    };
  }

  private mergeWithDefaults(config: any): SystemConfig {
    return this.deepMerge(this.getDefaultConfig(), config);
  }

  private deepMerge(target: any, source: any): any {
    const output = { ...target };

    for (const key in source) {
      if (source[key] instanceof Object && key in target) {
        output[key] = this.deepMerge(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    }

    return output;
  }

  private flattenConfig(config: any, prefix = ''): Record<string, any> {
    const flattened: Record<string, any> = {};

    for (const [key, value] of Object.entries(config)) {
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (value instanceof Object && !Array.isArray(value) && Object.keys(value).length > 0) {
        Object.assign(flattened, this.flattenConfig(value, newKey));
      } else {
        flattened[newKey] = value;
      }
    }

    return flattened;
  }

  private validateConfig(config: SystemConfig): void {
    // Validate required fields
    if (!config.email.fromEmail) {
      throw new Error('Email from address is required');
    }

    // Validate limits
    if (config.limits.maxFileSize <= 0) {
      throw new Error('Max file size must be positive');
    }

    // Validate security settings
    if (config.security.passwordMinLength < 6) {
      throw new Error('Password minimum length must be at least 6');
    }

    // Additional validations...
  }

  private getConfigDescription(key: string): string {
    const descriptions: Record<string, string> = {
      'maintenance.enabled': 'Enable or disable maintenance mode',
      'features.registration': 'Allow new user registrations',
      'features.oauth': 'Enable OAuth authentication providers',
      'security.passwordMinLength': 'Minimum password length requirement',
      'limits.apiRateLimit': 'API rate limit per minute',
      // Add more descriptions...
    };

    return descriptions[key] || '';
  }

  private async applyConfigChanges(
    oldConfig: SystemConfig,
    newConfig: SystemConfig
  ): Promise<void> {
    // Apply rate limit changes
    if (oldConfig.limits.apiRateLimit !== newConfig.limits.apiRateLimit) {
      // Update rate limiter configuration
      await redis.set('config:rate_limit', newConfig.limits.apiRateLimit);
    }

    // Apply security changes
    if (oldConfig.security.sessionTimeout !== newConfig.security.sessionTimeout) {
      // Update session timeout
      await redis.set('config:session_timeout', newConfig.security.sessionTimeout * 60);
    }

    // Apply feature changes
    if (oldConfig.features.registration !== newConfig.features.registration) {
      // Update registration feature flag
      await redis.set('feature:registration', newConfig.features.registration);
    }

    // Additional immediate changes...
  }
}
