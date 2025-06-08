import { FastifyRequest, FastifyReply } from 'fastify';
import { Service } from 'typedi';
import { ApiUsageService } from './api-usage.service';
import { validateSchema } from '@shared/validators';
import { GetUsageStatsDTO, GetUsageTimeSeriesDTO, GetEndpointAnalyticsDTO, ExportUsageDataDTO } from './api-usage.dto';

@Service()
export class ApiUsageController {
  constructor(private apiUsageService: ApiUsageService) {}

  /**
   * Get usage statistics
   */
  async getUsageStats(request: FastifyRequest<{ Querystring: GetUsageStatsDTO }>, reply: FastifyReply) {
    const { startDate, endDate, groupBy } = request.query;
    const userId = request.customUser?.id;
    const tenantId = (request as any).tenant?.id;

    // Admin can view all stats, users can only view their own
    const targetUserId = request.customUser?.role === 'ADMIN' ? undefined : userId;

    const stats = await this.apiUsageService.getUsageStats(targetUserId, tenantId, {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      groupBy,
    });

    reply.send({ data: stats });
  }

  /**
   * Get usage time series
   */
  async getUsageTimeSeries(request: FastifyRequest<{ Body: GetUsageTimeSeriesDTO }>, reply: FastifyReply) {
    const dto = await validateSchema(GetUsageTimeSeriesDTO.schema, request.body);
    const userId = request.customUser?.id;
    const tenantId = (request as any).tenant?.id;

    // Admin can view all stats, users can only view their own
    const targetUserId = request.customUser?.role === 'ADMIN' && dto.userId ? dto.userId : userId;

    const timeSeries = await this.apiUsageService.getUsageTimeSeries(
      {
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        groupBy: dto.groupBy,
        endpoint: dto.endpoint,
      } as any,
      targetUserId,
      tenantId,
    );

    reply.send({ data: timeSeries });
  }

  /**
   * Get current rate limit info
   */
  async getRateLimit(request: FastifyRequest<{ Querystring: { endpoint?: string } }>, reply: FastifyReply) {
    const userId = request.customUser!.id;
    const { endpoint } = request.query;

    const rateLimitInfo = await this.apiUsageService.checkRateLimit(userId, endpoint || '*');

    reply.send({ data: rateLimitInfo });
  }

  /**
   * Get usage quota
   */
  async getUsageQuota(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.customUser!.id;

    const quotas = await this.apiUsageService.getUsageQuota(userId);

    reply.send({ data: quotas });
  }

  /**
   * Get endpoint analytics
   */
  async getEndpointAnalytics(
    request: FastifyRequest<{ Params: { endpoint: string }; Querystring: GetEndpointAnalyticsDTO }>,
    reply: FastifyReply,
  ) {
    const { endpoint } = request.params;
    const { startDate, endDate } = request.query;
    const tenantId = (request as any).tenant?.id;

    // Decode endpoint (it might be URL encoded)
    const decodedEndpoint = decodeURIComponent(endpoint);

    const analytics = await this.apiUsageService.getEndpointAnalytics(decodedEndpoint, {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      tenantId,
    });

    reply.send({ data: analytics });
  }

  /**
   * Export usage data
   */
  async exportUsageData(request: FastifyRequest<{ Body: ExportUsageDataDTO }>, reply: FastifyReply) {
    const dto = await validateSchema(ExportUsageDataDTO.schema, request.body);
    const userId = request.customUser!.id;

    const data = await this.apiUsageService.exportUsageData(userId, {
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      format: dto.format,
    });

    const contentType = dto.format === 'csv' ? 'text/csv' : 'application/json';
    const filename = `api-usage-${dto.startDate}-${dto.endDate}.${dto.format}`;

    reply
      .header('Content-Type', contentType)
      .header('Content-Disposition', `attachment; filename="${filename}"`)
      .send(data);
  }

  /**
   * Get API health status
   */
  async getHealthStatus(request: FastifyRequest, reply: FastifyReply) {
    const health = await this.apiUsageService.healthCheck();

    const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503;

    reply.code(statusCode).send({ data: health });
  }

  /**
   * Get top users by API usage (admin only)
   */
  async getTopUsers(
    request: FastifyRequest<{
      Querystring: { limit?: number; startDate?: string; endDate?: string };
    }>,
    reply: FastifyReply,
  ) {
    const { limit = 10, startDate, endDate } = request.query;

    const topUsers = await this.apiUsageService.getUsageStats(undefined, undefined, {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    reply.send({ data: topUsers });
  }

  /**
   * Get system-wide API metrics (admin only)
   */
  async getSystemMetrics(request: FastifyRequest<{ Querystring: { period?: string } }>, reply: FastifyReply) {
    const { period = '24h' } = request.query;

    let startDate: Date;
    const endDate = new Date();

    switch (period) {
      case '1h':
        startDate = new Date(endDate.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
    }

    const [stats, timeSeries] = await Promise.all([
      this.apiUsageService.getUsageStats(undefined, undefined, { startDate, endDate }),
      this.apiUsageService.getUsageTimeSeries(
        {
          startDate,
          endDate,
          groupBy: period === '1h' ? 'hour' : period === '24h' ? 'hour' : 'day',
        } as any,
        undefined,
        undefined,
      ),
    ]);

    reply.send({
      data: {
        period,
        stats,
        timeSeries,
      },
    });
  }
}
