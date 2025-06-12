// Route definitions for email marketing module with proper auth and tenant middleware

import { FastifyInstance } from 'fastify';
import { Container } from 'typedi';
import { EmailMarketingController } from './email-marketing.controller';
import { requireAuth, requireRole } from '@shared/middleware/auth.middleware';
import { requireTenant, requireTenantRole } from '@modules/tenant/tenant.middleware';
import { validateSchema } from '@shared/middleware/validation.middleware';
import {
  CreateListDTO,
  UpdateListDTO,
  CreateSubscriberDTO,
  ImportSubscribersDTO,
  CreateCampaignDTO,
  UpdateCampaignDTO,
  CreateTemplateDTO,
  UpdateTemplateDTO,
  CreateAutomationDTO,
  AddAutomationStepDTO,
  UpdateAutomationStepDTO
} from './email-marketing.dto';

export default async function emailMarketingRoutes(app: FastifyInstance): Promise<void> {
  const controller = Container.get(EmailMarketingController);

  // ===== PUBLIC ROUTES (No auth required) =====

  // Unsubscribe
  app.get('/unsubscribe/:token', controller.unsubscribe.bind(controller));
  app.post('/unsubscribe/:token', controller.unsubscribe.bind(controller));

  // Email tracking pixels
  app.get('/track/open/:trackingId', controller.trackOpen.bind(controller));
  app.get('/track/click/:trackingId', controller.trackClick.bind(controller));

  // Webhook endpoints for email service providers
  app.post('/webhooks/bounce', controller.handleBounce.bind(controller));
  app.post('/webhooks/complaint', controller.handleComplaint.bind(controller));

  // ===== AUTHENTICATED ROUTES WITH TENANT CONTEXT =====

  // List Management
  app.register(async function listRoutes(listApp) {
    // Apply auth and tenant middleware to all routes
    listApp.addHook('preHandler', requireAuth);
    listApp.addHook('preHandler', requireTenant());

    // Lists
    listApp.post('/lists', {
      preHandler: [requireTenantRole(['OWNER', 'ADMIN'])],
      schema: {
        body: CreateListDTO.schema,
        tags: ['Email Marketing'],
        summary: 'Create a new email list'
      }
    }, controller.createList.bind(controller));

    listApp.get('/lists', {
      schema: {
        tags: ['Email Marketing'],
        summary: 'Get all email lists'
      }
    }, controller.getLists.bind(controller));

    listApp.get('/lists/:listId', {
      schema: {
        tags: ['Email Marketing'],
        summary: 'Get email list details'
      }
    }, controller.getList.bind(controller));

    listApp.put('/lists/:listId', {
      preHandler: [requireTenantRole(['OWNER', 'ADMIN'])],
      schema: {
        body: UpdateListDTO.schema,
        tags: ['Email Marketing'],
        summary: 'Update email list'
      }
    }, controller.updateList.bind(controller));

    listApp.delete('/lists/:listId', {
      preHandler: [requireTenantRole(['OWNER', 'ADMIN'])],
      schema: {
        tags: ['Email Marketing'],
        summary: 'Delete email list'
      }
    }, controller.deleteList.bind(controller));

    listApp.get('/lists/:listId/statistics', {
      schema: {
        tags: ['Email Marketing'],
        summary: 'Get list statistics'
      }
    }, controller.getListStatistics.bind(controller));

    // Subscribers
    listApp.post('/lists/:listId/subscribers', {
      preHandler: [requireTenantRole(['OWNER', 'ADMIN', 'MEMBER'])],
      schema: {
        body: CreateSubscriberDTO.schema,
        tags: ['Email Marketing'],
        summary: 'Add subscriber to list'
      }
    }, controller.addSubscriber.bind(controller));

    listApp.post('/lists/:listId/subscribers/import', {
      preHandler: [requireTenantRole(['OWNER', 'ADMIN'])],
      schema: {
        body: ImportSubscribersDTO.schema,
        tags: ['Email Marketing'],
        summary: 'Import subscribers from CSV'
      }
    }, controller.importSubscribers.bind(controller));

    listApp.get('/lists/:listId/subscribers', {
      schema: {
        tags: ['Email Marketing'],
        summary: 'Get list subscribers'
      }
    }, controller.getSubscribers.bind(controller));

    listApp.put('/subscribers/:subscriberId', {
      preHandler: [requireTenantRole(['OWNER', 'ADMIN'])],
      schema: {
        tags: ['Email Marketing'],
        summary: 'Update subscriber'
      }
    }, controller.updateSubscriber.bind(controller));

    listApp.delete('/subscribers/:subscriberId', {
      preHandler: [requireTenantRole(['OWNER', 'ADMIN'])],
      schema: {
        tags: ['Email Marketing'],
        summary: 'Delete subscriber'
      }
    }, controller.deleteSubscriber.bind(controller));
  });

  // Campaign Management
  app.register(async function campaignRoutes(campaignApp) {
    campaignApp.addHook('preHandler', requireAuth);
    campaignApp.addHook('preHandler', requireTenant());

    // Campaigns
    campaignApp.post('/campaigns', {
      preHandler: [requireTenantRole(['OWNER', 'ADMIN'])],
      schema: {
        body: CreateCampaignDTO.schema,
        tags: ['Email Marketing'],
        summary: 'Create email campaign'
      }
    }, controller.createCampaign.bind(controller));

    campaignApp.get('/campaigns', {
      schema: {
        tags: ['Email Marketing'],
        summary: 'Get all campaigns'
      }
    }, controller.getCampaigns.bind(controller));

    campaignApp.get('/campaigns/:campaignId', {
      schema: {
        tags: ['Email Marketing'],
        summary: 'Get campaign details'
      }
    }, controller.getCampaign.bind(controller));

    campaignApp.put('/campaigns/:campaignId', {
      preHandler: [requireTenantRole(['OWNER', 'ADMIN'])],
      schema: {
        body: UpdateCampaignDTO.schema,
        tags: ['Email Marketing'],
        summary: 'Update campaign'
      }
    }, controller.updateCampaign.bind(controller));

    campaignApp.delete('/campaigns/:campaignId', {
      preHandler: [requireTenantRole(['OWNER', 'ADMIN'])],
      schema: {
        tags: ['Email Marketing'],
        summary: 'Delete campaign'
      }
    }, controller.deleteCampaign.bind(controller));

    campaignApp.post('/campaigns/:campaignId/schedule', {
      preHandler: [requireTenantRole(['OWNER', 'ADMIN'])],
      schema: {
        body: {
          type: 'object',
          properties: {
            scheduledAt: { type: 'string', format: 'date-time' }
          },
          required: ['scheduledAt']
        },
        tags: ['Email Marketing'],
        summary: 'Schedule campaign'
      }
    }, controller.scheduleCampaign.bind(controller));

    campaignApp.post('/campaigns/:campaignId/send', {
      preHandler: [requireTenantRole(['OWNER', 'ADMIN'])],
      schema: {
        tags: ['Email Marketing'],
        summary: 'Send campaign immediately'
      }
    }, controller.sendCampaign.bind(controller));

    campaignApp.get('/campaigns/:campaignId/statistics', {
      schema: {
        tags: ['Email Marketing'],
        summary: 'Get campaign statistics'
      }
    }, controller.getCampaignStatistics.bind(controller));
  });

  // Template Management
  app.register(async function templateRoutes(templateApp) {
    templateApp.addHook('preHandler', requireAuth);
    templateApp.addHook('preHandler', requireTenant());

    templateApp.post('/templates', {
      preHandler: [requireTenantRole(['OWNER', 'ADMIN'])],
      schema: {
        body: CreateTemplateDTO.schema,
        tags: ['Email Marketing'],
        summary: 'Create email template'
      }
    }, controller.createTemplate.bind(controller));

    templateApp.get('/templates', {
      schema: {
        tags: ['Email Marketing'],
        summary: 'Get all templates'
      }
    }, controller.getTemplates.bind(controller));

    templateApp.put('/templates/:templateId', {
      preHandler: [requireTenantRole(['OWNER', 'ADMIN'])],
      schema: {
        body: UpdateTemplateDTO.schema,
        tags: ['Email Marketing'],
        summary: 'Update template'
      }
    }, controller.updateTemplate.bind(controller));

    templateApp.delete('/templates/:templateId', {
      preHandler: [requireTenantRole(['OWNER', 'ADMIN'])],
      schema: {
        tags: ['Email Marketing'],
        summary: 'Delete template'
      }
    }, controller.deleteTemplate.bind(controller));
  });

  // Automation Management
  app.register(async function automationRoutes(automationApp) {
    automationApp.addHook('preHandler', requireAuth);
    automationApp.addHook('preHandler', requireTenant());

    automationApp.post('/automations', {
      preHandler: [requireTenantRole(['OWNER', 'ADMIN'])],
      schema: {
        body: CreateAutomationDTO.schema,
        tags: ['Email Marketing'],
        summary: 'Create automation workflow'
      }
    }, controller.createAutomation.bind(controller));

    automationApp.get('/automations', {
      schema: {
        tags: ['Email Marketing'],
        summary: 'Get all automations'
      }
    }, controller.getAutomations.bind(controller));

    automationApp.post('/automations/:automationId/activate', {
      preHandler: [requireTenantRole(['OWNER', 'ADMIN'])],
      schema: {
        tags: ['Email Marketing'],
        summary: 'Activate automation'
      }
    }, controller.activateAutomation.bind(controller));

    automationApp.post('/automations/:automationId/deactivate', {
      preHandler: [requireTenantRole(['OWNER', 'ADMIN'])],
      schema: {
        tags: ['Email Marketing'],
        summary: 'Deactivate automation'
      }
    }, controller.deactivateAutomation.bind(controller));

    automationApp.get('/automations/:automationId/statistics', {
      schema: {
        tags: ['Email Marketing'],
        summary: 'Get automation statistics'
      }
    }, controller.getAutomationStatistics.bind(controller));
  });
}