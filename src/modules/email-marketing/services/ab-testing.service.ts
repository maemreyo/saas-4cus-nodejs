// Service for A/B testing email campaigns

import { Injectable } from '@/shared/decorators';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { EventBus } from '@/shared/events/event-bus';
import { RedisService } from '@/infrastructure/cache/redis.service';
import { AppError } from '@/shared/exceptions';
import { logger } from '@/shared/logger';
import {
  EmailCampaign,
  EmailABTestVariant,
  EmailCampaignMessage,
  EmailCampaignRecipient,
  Prisma,
} from '@prisma/client';

export interface ABTestConfig {
  testPercentage: number;
  winningMetric: 'opens' | 'clicks' | 'conversions';
  testDuration: number; // hours
  variants: Array<{
    name: string;
    weight: number;
    subject?: string;
    fromName?: string;
    preheader?: string;
    htmlContent?: string;
    textContent?: string;
  }>;
}

export interface ABTestResults {
  variantId: string;
  name: string;
  weight: number;
  sentCount: number;
  metrics: {
    openRate: number;
    clickRate: number;
    conversionRate: number;
  };
  isWinner: boolean;
  confidence?: number;
}

@Injectable()
export class ABTestingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBus,
    private readonly redis: RedisService,
  ) {}

  /**
   * Create A/B test variants for a campaign
   */
  async createVariants(campaignId: string, variants: ABTestConfig['variants']): Promise<EmailABTestVariant[]> {
    // Validate weights sum to 100
    const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
    if (totalWeight !== 100) {
      throw new AppError('Variant weights must sum to 100%', 400);
    }

    // Create variants
    const createdVariants = await Promise.all(
      variants.map(variant =>
        this.prisma.client.emailABTestVariant.create({
          data: {
            campaignId,
            name: variant.name,
            weight: variant.weight,
            subject: variant.subject,
            fromName: variant.fromName,
          },
        }),
      ),
    );

    // Create campaign messages for each variant
    await Promise.all(
      createdVariants.map((variant, index) =>
        this.prisma.client.emailCampaignMessage.create({
          data: {
            campaignId,
            variantId: variant.id,
            subject: variants[index].subject || '',
            preheader: variants[index].preheader,
            htmlContent: variants[index].htmlContent || '',
            textContent: variants[index].textContent,
            weight: variant.weight,
          },
        }),
      ),
    );

    await this.eventBus.emit('email.abtest.created', {
      campaignId,
      variantCount: createdVariants.length,
    });

    logger.info('A/B test variants created', {
      campaignId,
      variants: createdVariants.map(v => ({ id: v.id, name: v.name })),
    });

    return createdVariants;
  }

  /**
   * Assign recipients to variants
   */
  async assignRecipientsToVariants(
    campaignId: string,
    recipientIds: string[],
    testPercentage: number = 100,
  ): Promise<Map<string, string[]>> {
    const variants = await this.prisma.client.emailABTestVariant.findMany({
      where: { campaignId },
      orderBy: { createdAt: 'asc' },
    });

    if (variants.length === 0) {
      throw new AppError('No variants found for campaign', 404);
    }

    // Calculate test group size
    const testGroupSize = Math.floor(recipientIds.length * (testPercentage / 100));
    const testRecipients = this.shuffleArray(recipientIds).slice(0, testGroupSize);
    const controlRecipients = recipientIds.slice(testGroupSize);

    // Assign test recipients to variants based on weights
    const assignments = new Map<string, string[]>();
    let assignedCount = 0;

    for (const variant of variants) {
      const variantSize = Math.floor(testRecipients.length * (variant.weight / 100));
      const variantRecipients = testRecipients.slice(assignedCount, assignedCount + variantSize);

      assignments.set(variant.id, variantRecipients);
      assignedCount += variantSize;
    }

    // Assign remaining test recipients to last variant
    if (assignedCount < testRecipients.length) {
      const lastVariantId = variants[variants.length - 1].id;
      const lastVariantRecipients = assignments.get(lastVariantId) || [];
      assignments.set(lastVariantId, [...lastVariantRecipients, ...testRecipients.slice(assignedCount)]);
    }

    // Store control group for later
    if (controlRecipients.length > 0) {
      await this.redis.set(
        `abtest:control:${campaignId}`,
        controlRecipients,
        { ttl: 7 * 24 * 3600 }, // 7 days
      );
    }

    // Update recipient records with variant assignments
    for (const [variantId, recipients] of assignments) {
      if (recipients.length > 0) {
        await this.prisma.client.$executeRaw`
          UPDATE "email_campaign_recipients"
          SET metadata = jsonb_set(
            COALESCE(metadata, '{}'),
            '{variantId}',
            ${JSON.stringify(variantId)}::jsonb
          )
          WHERE id = ANY(${recipients}::text[])
        `;
      }
    }

    return assignments;
  }

  /**
   * Get variant for a recipient
   */
  async getRecipientVariant(campaignId: string, recipientId: string): Promise<EmailABTestVariant | null> {
    const recipient = await this.prisma.client.emailCampaignRecipient.findUnique({
      where: { id: recipientId },
    });

    if (!recipient || !recipient.metadata) {
      return null;
    }

    const variantId = (recipient.metadata as any).variantId;
    if (!variantId) {
      return null;
    }

    return this.prisma.client.emailABTestVariant.findUnique({
      where: { id: variantId },
    });
  }

  /**
   * Get campaign message for a variant
   */
  async getVariantMessage(campaignId: string, variantId: string): Promise<EmailCampaignMessage | null> {
    return this.prisma.client.emailCampaignMessage.findFirst({
      where: {
        campaignId,
        variantId,
      },
    });
  }

  /**
   * Calculate A/B test results
   */
  async calculateResults(campaignId: string): Promise<ABTestResults[]> {
    const variants = await this.prisma.client.emailABTestVariant.findMany({
      where: { campaignId },
    });

    const results: ABTestResults[] = [];

    for (const variant of variants) {
      // Get recipient stats for this variant
      const stats = await this.prisma.client.emailCampaignRecipient.aggregate({
        where: {
          campaignId,
          metadata: {
            path: ['variantId'],
            equals: variant.id,
          },
        },
        _count: {
          _all: true,
        },
      });

      const [opens, clicks, conversions] = await Promise.all([
        this.prisma.client.emailCampaignRecipient.count({
          where: {
            campaignId,
            metadata: {
              path: ['variantId'],
              equals: variant.id,
            },
            openedAt: { not: null },
          },
        }),
        this.prisma.client.emailCampaignRecipient.count({
          where: {
            campaignId,
            metadata: {
              path: ['variantId'],
              equals: variant.id,
            },
            clickedAt: { not: null },
          },
        }),
        // Conversions would need to be tracked separately
        Promise.resolve(0),
      ]);

      const sentCount = stats._count._all;

      results.push({
        variantId: variant.id,
        name: variant.name,
        weight: variant.weight,
        sentCount,
        metrics: {
          openRate: sentCount > 0 ? (opens / sentCount) * 100 : 0,
          clickRate: sentCount > 0 ? (clicks / sentCount) * 100 : 0,
          conversionRate: sentCount > 0 ? (conversions / sentCount) * 100 : 0,
        },
        isWinner: variant.isWinner,
      });
    }

    // Calculate statistical significance if needed
    if (results.length === 2) {
      const confidence = this.calculateConfidence(results[0], results[1]);
      results.forEach(r => (r.confidence = confidence));
    }

    return results.sort((a, b) => b.metrics.clickRate - a.metrics.clickRate);
  }

  /**
   * Determine and set winning variant
   */
  async determineWinner(campaignId: string, config: ABTestConfig): Promise<EmailABTestVariant | null> {
    const results = await this.calculateResults(campaignId);

    if (results.length === 0) {
      return null;
    }

    // Check if test duration has passed
    const campaign = await this.prisma.client.emailCampaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign || !campaign.sentAt) {
      return null;
    }

    const testEndTime = new Date(campaign.sentAt.getTime() + config.testDuration * 3600000);
    if (new Date() < testEndTime) {
      logger.info('A/B test still in progress', {
        campaignId,
        endsAt: testEndTime,
      });
      return null;
    }

    // Determine winner based on winning metric
    let winnerResult: ABTestResults;

    switch (config.winningMetric) {
      case 'opens':
        winnerResult = results.reduce((best, current) =>
          current.metrics.openRate > best.metrics.openRate ? current : best,
        );
        break;

      case 'clicks':
        winnerResult = results.reduce((best, current) =>
          current.metrics.clickRate > best.metrics.clickRate ? current : best,
        );
        break;

      case 'conversions':
        winnerResult = results.reduce((best, current) =>
          current.metrics.conversionRate > best.metrics.conversionRate ? current : best,
        );
        break;

      default:
        winnerResult = results[0];
    }

    // Check for minimum statistical significance
    const hasSignificance = results.length === 1 || (results.length === 2 && (winnerResult.confidence || 0) >= 95);

    if (!hasSignificance) {
      logger.warn('A/B test lacks statistical significance', {
        campaignId,
        confidence: winnerResult.confidence,
      });
    }

    // Update winning variant
    const winner = await this.prisma.client.emailABTestVariant.update({
      where: { id: winnerResult.variantId },
      data: {
        isWinner: true,
        openRate: winnerResult.metrics.openRate,
        clickRate: winnerResult.metrics.clickRate,
        conversionRate: winnerResult.metrics.conversionRate,
      },
    });

    // Update campaign with winning variant
    await this.prisma.client.emailCampaign.update({
      where: { id: campaignId },
      data: {
        winningVariantId: winner.id,
      },
    });

    await this.eventBus.emit('email.abtest.winner', {
      campaignId,
      variantId: winner.id,
      variantName: winner.name,
      metric: config.winningMetric,
      improvement: this.calculateImprovement(results),
    });

    logger.info('A/B test winner determined', {
      campaignId,
      winner: winner.name,
      metric: config.winningMetric,
    });

    return winner;
  }

  /**
   * Send to control group with winning variant
   */
  async sendToControlGroup(campaignId: string): Promise<void> {
    const campaign = await this.prisma.client.emailCampaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign || !campaign.winningVariantId) {
      throw new AppError('No winning variant set for campaign', 400);
    }

    // Get control group recipients
    const controlRecipients = await this.redis.get<string[]>(`abtest:control:${campaignId}`);

    if (!controlRecipients || controlRecipients.length === 0) {
      logger.info('No control group recipients found', { campaignId });
      return;
    }

    // Assign control group to winning variant
    await this.prisma.client.$executeRaw`
      UPDATE "email_campaign_recipients"
      SET metadata = jsonb_set(
        COALESCE(metadata, '{}'),
        '{variantId}',
        ${JSON.stringify(campaign.winningVariantId)}::jsonb
      )
      WHERE id = ANY(${controlRecipients}::text[])
    `;

    // Clean up control group cache
    await this.redis.delete(`abtest:control:${campaignId}`);

    await this.eventBus.emit('email.abtest.control.sending', {
      campaignId,
      recipientCount: controlRecipients.length,
      variantId: campaign.winningVariantId,
    });

    logger.info('Sending to control group with winning variant', {
      campaignId,
      recipientCount: controlRecipients.length,
    });
  }

  /**
   * Get A/B test summary
   */
  async getTestSummary(campaignId: string): Promise<{
    status: 'pending' | 'running' | 'completed';
    startedAt?: Date;
    completedAt?: Date;
    winningVariant?: string;
    results: ABTestResults[];
    improvement?: number;
  }> {
    const campaign = await this.prisma.client.emailCampaign.findUnique({
      where: { id: campaignId },
      include: {
        abTestVariants: true,
      },
    });

    if (!campaign || !campaign.isABTest) {
      throw new AppError('Campaign is not an A/B test', 400);
    }

    const results = await this.calculateResults(campaignId);

    let status: 'pending' | 'running' | 'completed' = 'pending';

    if (campaign.sentAt) {
      status = campaign.winningVariantId ? 'completed' : 'running';
    }

    const winner = campaign.abTestVariants.find(v => v.isWinner);

    return {
      status,
      startedAt: campaign.sentAt || undefined,
      completedAt: campaign.completedAt || undefined,
      winningVariant: winner?.name,
      results,
      improvement: status === 'completed' ? this.calculateImprovement(results) : undefined,
    };
  }

  /**
   * Calculate statistical confidence between two variants
   */
  private calculateConfidence(variantA: ABTestResults, variantB: ABTestResults): number {
    // Simplified confidence calculation
    // In production, use proper statistical tests (Chi-square, Z-test, etc.)

    const rateA = variantA.metrics.clickRate / 100;
    const rateB = variantB.metrics.clickRate / 100;
    const nA = variantA.sentCount;
    const nB = variantB.sentCount;

    if (nA === 0 || nB === 0) {
      return 0;
    }

    // Standard error
    const seA = Math.sqrt((rateA * (1 - rateA)) / nA);
    const seB = Math.sqrt((rateB * (1 - rateB)) / nB);
    const seDiff = Math.sqrt(seA * seA + seB * seB);

    if (seDiff === 0) {
      return 0;
    }

    // Z-score
    const z = Math.abs(rateA - rateB) / seDiff;

    // Convert to confidence percentage (simplified)
    const confidence = Math.min(99.9, z * 20);

    return Math.round(confidence * 10) / 10;
  }

  /**
   * Calculate improvement percentage
   */
  private calculateImprovement(results: ABTestResults[]): number {
    if (results.length < 2) {
      return 0;
    }

    const winner = results.find(r => r.isWinner) || results[0];
    const baseline = results.find(r => !r.isWinner && r !== winner) || results[1];

    if (baseline.metrics.clickRate === 0) {
      return 0;
    }

    const improvement = ((winner.metrics.clickRate - baseline.metrics.clickRate) / baseline.metrics.clickRate) * 100;

    return Math.round(improvement * 10) / 10;
  }

  /**
   * Shuffle array helper
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Create A/B test for a campaign
   */
  async createABTest(
    tenantId: string,
    campaignId: string,
    data: {
      variantB: {
        subject?: string;
        content?: string;
        senderName?: string;
      };
      testPercentage: number;
      winnerCriteria: 'open_rate' | 'click_rate' | 'conversion_rate';
      testDuration: number; // hours
    }
  ): Promise<any> {
    // Verify campaign exists and belongs to tenant
    const campaign = await this.prisma.client.emailCampaign.findFirst({
      where: {
        id: campaignId,
        tenantId,
      },
    });

    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }

    if (campaign.isABTest) {
      throw new AppError('Campaign already has an A/B test', 400);
    }

    // Map winner criteria
    const winningMetricMap = {
      'open_rate': 'opens',
      'click_rate': 'clicks',
      'conversion_rate': 'conversions'
    } as const;

    const winningMetric = winningMetricMap[data.winnerCriteria];

    // Create A/B test config
    const abTestConfig: ABTestConfig = {
      testPercentage: data.testPercentage,
      winningMetric,
      testDuration: data.testDuration,
      variants: [
        {
          name: 'Variant A (Original)',
          weight: 50,
          subject: campaign.subject,
          fromName: campaign.fromName,
          htmlContent: campaign.htmlContent,
          textContent: campaign.textContent,
        },
        {
          name: 'Variant B',
          weight: 50,
          subject: data.variantB.subject || campaign.subject,
          fromName: data.variantB.senderName || campaign.fromName,
          htmlContent: data.variantB.content || campaign.htmlContent,
          textContent: campaign.textContent,
        }
      ]
    };

    // Update campaign
    await this.prisma.client.emailCampaign.update({
      where: { id: campaignId },
      data: {
        isABTest: true,
        abTestConfig: abTestConfig as any,
      },
    });

    // Create variants
    const variants = await this.createVariants(campaignId, abTestConfig.variants);

    await this.eventBus.emit('email.abtest.setup', {
      tenantId,
      campaignId,
      testPercentage: data.testPercentage,
      testDuration: data.testDuration,
      winnerCriteria: data.winnerCriteria,
    });

    logger.info('A/B test created', {
      campaignId,
      variants: variants.map(v => v.name),
    });

    return {
      campaignId,
      testPercentage: data.testPercentage,
      testDuration: data.testDuration,
      winnerCriteria: data.winnerCriteria,
      variants: variants.map(v => ({
        id: v.id,
        name: v.name,
        weight: v.weight,
      })),
    };
  }

  /**
   * Get A/B test results for a campaign
   */
  async getABTestResults(tenantId: string, campaignId: string): Promise<{
    status: 'pending' | 'running' | 'completed';
    startedAt?: Date;
    completedAt?: Date;
    winningVariant?: string;
    results: ABTestResults[];
    improvement?: number;
  }> {
    // Verify campaign exists and belongs to tenant
    const campaign = await this.prisma.client.emailCampaign.findFirst({
      where: {
        id: campaignId,
        tenantId,
      },
      include: {
        abTestVariants: true,
      },
    });

    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }

    if (!campaign.isABTest) {
      throw new AppError('Campaign is not an A/B test', 400);
    }

    return this.getTestSummary(campaignId);
  }
}
