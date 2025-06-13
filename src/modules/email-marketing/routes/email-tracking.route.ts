import { FastifyInstance } from 'fastify';
import { Container } from 'typedi';
import { EmailTrackingController } from '../controllers/email-tracking.controller';

export default async function emailTrackingRoutes(fastify: FastifyInstance) {
  const trackingController = Container.get(EmailTrackingController);

  // Tracking endpoints - no authentication required as they are used in emails
  fastify.get('/pixel/:encoded.gif', trackingController.trackOpen.bind(trackingController));
  fastify.get('/click/:encoded', trackingController.trackClick.bind(trackingController));
}
