import { FastifyRequest, FastifyReply } from 'fastify';
import { Service } from 'typedi';
import { AnalyticsService } from './analytics.service';
import { ReportService } from './report.service';
import { validateSchema } from '@shared/validators';
import {
  TrackEventDTO,
  GetDashboardDTO,
  GetFunnelDTO,
  GetCohortDTO,
  GenerateReportDTO,
  ScheduleReportDTO
} from './analytics.dto';

@Service()
export class AnalyticsController {
  constructor(
    private analyticsService: AnalyticsService,
    private reportService: ReportService
  ) {}

  /**
   * Track analytics event
   */
  async trackEvent(
    request: FastifyRequest<{ Body: TrackEventDTO }>,
    reply: FastifyReply
  ) {
    const dto = await validateSchema(TrackEventDTO.schema, request.body);
    const userId = request.customUser?.id;
    const tenantId = (request as any).tenant?.id;

    await this.analyticsService.track({
      userId,
      tenantId,
      event: dto.event,
      properties: dto.properties,
      sessionId: dto.sessionId,
      deviceId: dto.deviceId,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
      referrer: request.headers.referer,
      utm: dto.utm
    });

    reply.code(204).send();
  }

  /**
   * Track page view
   */
  async trackPageView(
    request: FastifyRequest<{ Body: { page: string; properties?: any } }>,
    reply: FastifyReply
  ) {
    const { page, properties } = request.body;
    const userId = request.customUser?.id;

    await this.analyticsService.trackPageView(userId, page, properties);

    reply.code(204).send();
  }

  /**
   * Get dashboard metrics
   */
  async getDashboard(
    request: FastifyRequest<{ Querystring: GetDashboardDTO }>,
    reply: FastifyReply
  ) {
    const { dateRange, tenantId } = request.query;
    const actualTenantId = tenantId || (request as any).tenant?.id;

    const metrics = await this.analyticsService.getDashboardMetrics(
      actualTenantId,
      dateRange
    );

    reply.send({ data: metrics });
  }

  /**
   * Get funnel analytics
   */
  async getFunnel(
    request: FastifyRequest<{ Body: GetFunnelDTO }>,
    reply: FastifyReply
  ) {
    const dto = await validateSchema(GetFunnelDTO.schema, request.body);
    const tenantId = dto.tenantId || (request as any).tenant?.id;

    const funnel = await this.analyticsService.getFunnelAnalytics(dto.steps, {
      tenantId,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      groupBy: dto.groupBy
    });

    reply.send({ data: funnel });
  }

  /**
   * Get cohort retention
   */
  async getCohortRetention(
    request: FastifyRequest<{ Querystring: GetCohortDTO }>,
    reply: FastifyReply
  ) {
    const { cohortSize, periods, tenantId } = request.query;
    const actualTenantId = tenantId || (request as any).tenant?.id;

    const retention = await this.analyticsService.getCohortRetention({
      tenantId: actualTenantId,
      cohortSize,
      periods
    });

    reply.send({ data: retention });
  }

  /**
   * Get user journey
   */
  async getUserJourney(
    request: FastifyRequest<{
      Params: { userId: string };
      Querystring: { limit?: number; startDate?: string; endDate?: string };
    }>,
    reply: FastifyReply
  ) {
    const { userId } = request.params;
    const { limit, startDate, endDate } = request.query;

    // Check permissions
    if (request.customUser!.id !== userId && request.customUser!.role !== 'ADMIN') {
      return reply.code(403).send({ error: 'Forbidden' });
    }

    const journey = await this.analyticsService.getUserJourney(userId, {
      limit,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined
    });

    reply.send({ data: journey });
  }

  /**
   * Generate report
   */
  async generateReport(
    request: FastifyRequest<{ Body: GenerateReportDTO }>,
    reply: FastifyReply
  ) {
    const dto = await validateSchema(GenerateReportDTO.schema, request.body);
    const tenantId = dto.filters?.tenantId || (request as any).tenant?.id;

    const report = await this.reportService.generateReport({
      ...dto,
      filters: {
        ...dto.filters,
        tenantId
      }
    });

    reply.send({ data: report });
  }

  /**
   * Schedule recurring report
   */
  async scheduleReport(
    request: FastifyRequest<{ Body: ScheduleReportDTO }>,
    reply: FastifyReply
  ) {
    const dto = await validateSchema(ScheduleReportDTO.schema, request.body);
    const tenantId = dto.filters?.tenantId || (request as any).tenant?.id;

    const jobId = await this.reportService.scheduleReport({
      ...dto,
      filters: {
        ...dto.filters,
        tenantId
      }
    });

    reply.send({
      message: 'Report scheduled successfully',
      data: { jobId }
    });
  }
}