// Controller for email segmentation

import { FastifyRequest, FastifyReply } from 'fastify';
import { Controller, GET, POST, PUT, DELETE } from '@/shared/decorators';
import { EmailSegmentService } from '../services/email-segment.service';
import { authenticate } from '@/shared/middleware/auth.middleware';
import { requireTenant } from '@/modules/tenant/middleware/tenant.middleware';
import {
  createSegmentSchema,
  updateSegmentSchema,
  testSegmentSchema
} from '../dto/email-segment.dto';
import { z } from 'zod';

@Controller('/api/email-marketing/lists/:listId/segments')
export class EmailSegmentController {
  constructor(
    private readonly segmentService: EmailSegmentService
  ) {}

  /**
   * Create segment
   */
  @POST('/', {
    preHandler: [authenticate, requireTenant]
  })
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
  @GET('/', {
    preHandler: [authenticate, requireTenant]
  })
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
  @GET('/:segmentId', {
    preHandler: [authenticate, requireTenant]
  })
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
  @PUT('/:segmentId', {
    preHandler: [authenticate, requireTenant]
  })
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
  @DELETE('/:segmentId', {
    preHandler: [authenticate, requireTenant]
  })
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
  @POST('/test', {
    preHandler: [authenticate, requireTenant]
  })
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
  @POST('/:segmentId/refresh', {
    preHandler: [authenticate, requireTenant]
  })
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