import { FastifyInstance } from 'fastify';
import { Container } from 'typedi';
import { EmailWebhookController } from '../controllers/email-webhook.controller';

export default async function emailWebhookRoutes(fastify: FastifyInstance) {
  const webhookController = Container.get(EmailWebhookController);

  // Webhook endpoints - no authentication required as they are called by email providers
  fastify.post('/sendgrid', webhookController.handleSendGridWebhook.bind(webhookController));
  fastify.post('/ses', webhookController.handleSESWebhook.bind(webhookController));
  fastify.post('/mailgun', webhookController.handleMailgunWebhook.bind(webhookController));
  fastify.post('/postmark', webhookController.handlePostmarkWebhook.bind(webhookController));
}
