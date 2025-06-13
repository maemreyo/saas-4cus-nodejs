// Controller for email segmentation

import { FastifyRequest, FastifyReply } from 'fastify';
import { Injectable } from '@/shared/decorators';
import { EmailSegmentService } from '../services/email-segment.service';
import { getTenantId } from '@/modules/tenant/tenant.utils';
import {
  createSegmentSchema,
  updateSegmentSchema,
  testSegmentSchema
} from '../dto/email-segment.dto';
import { z } from 'zod';

@Injectable()
export class EmailSegmentController {
  constructor(
    private readonly segmentService: EmailSegmentService
  ) {}

  /**
   * Create segment
   */
  async createSegment(
    request: FastifyRequest<{
      Params: { listId: string },
      Body: z.infer<typeof createSegmentSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const { listId } = request.params;
    const data = createSegmentSchema.parse(request.body);

    const segment = await this.segmentService.createSegment(listId, data);

    reply.code(201).send({
      success: true,
      data: segment
    });
  }

  /**
   * Get segments
   */
  async getSegments(
    request: FastifyRequest<{
      Params: { listId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const { listId } = request.params;

    const segments = await this.segmentService.getListSegments(listId);

    reply.send({
      success: true,
      data: segments
    });
  }

  /**
   * Get segment
   */
  async getSegment(
    request: FastifyRequest<{
      Params: { listId: string, segmentId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const { segmentId } = request.params;

    const segment = await this.segmentService.getSegment(segmentId);

    reply.send({
      success: true,
      data: segment
    });
  }

  /**
   * Update segment
   */
  async updateSegment(
    request: FastifyRequest<{
      Params: { listId: string, segmentId: string },
      Body: z.infer<typeof updateSegmentSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const { segmentId } = request.params;
    const data = updateSegmentSchema.parse(request.body);

    const segment = await this.segmentService.updateSegment(segmentId, data);

    reply.send({
      success: true,
      data: segment
    });
  }

  /**
   * Delete segment
   */
  async deleteSegment(
    request: FastifyRequest<{
      Params: { listId: string, segmentId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const { segmentId } = request.params;

    await this.segmentService.deleteSegment(segmentId);

    reply.send({
      success: true,
      message: 'Segment deleted successfully'
    });
  }

  /**
   * Test segment
   */
  async testSegment(
    request: FastifyRequest<{
      Params: { listId: string },
      Body: z.infer<typeof testSegmentSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const { listId } = request.params;
    const data = testSegmentSchema.parse(request.body);

    const result = await this.segmentService.testSegment(listId, data);

    reply.send({
      success: true,
      data: result
    });
  }

  /**
   * Refresh segment
   */
  async refreshSegment(
    request: FastifyRequest<{
      Params: { listId: string, segmentId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const { segmentId } = request.params;

    const segment = await this.segmentService.refreshSegment(segmentId);

    reply.send({
      success: true,
      data: segment
    });
  }
}
