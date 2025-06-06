import { Container } from 'typedi';
import { TicketService } from './ticket.service';
import { CategoryService } from './category.service';
import { TemplateService } from './template.service';
import { KnowledgeBaseService } from './knowledge-base.service';
import { TicketController } from './ticket.controller';
import { TicketEventHandlers } from './ticket.events.handlers';
import { ticketQueueProcessor } from './ticket.queue';
import { ticketScheduler } from './ticket.scheduler';
import ticketRoutes from './ticket.route';

// Export all services
export {
  TicketService,
  CategoryService,
  TemplateService,
  KnowledgeBaseService,
  TicketController,
  TicketEventHandlers
};

// Export routes
export { ticketRoutes };

// Export types and DTOs
export * from './ticket.dto';
export * from './ticket.events';

// Initialize support module
export async function initializeSupportModule(): Promise<void> {
  // Register services in container
  Container.get(TicketService);
  Container.get(CategoryService);
  Container.get(TemplateService);
  Container.get(KnowledgeBaseService);
  Container.get(TicketController);
  Container.get(TicketEventHandlers);

  // Initialize queue processor (already instantiated)
  // ticketQueueProcessor is already running

  // Initialize scheduler
  await ticketScheduler.initialize();

  // Create default categories if none exist
  const categoryService = Container.get(CategoryService);
  const categories = await categoryService.getCategories();

  if (categories.length === 0) {
    // Create default categories
    const defaultCategories = [
      {
        name: 'General Inquiry',
        slug: 'general-inquiry',
        description: 'General questions and inquiries',
        icon: 'help-circle',
        order: 1
      },
      {
        name: 'Technical Issue',
        slug: 'technical-issue',
        description: 'Technical problems and bugs',
        icon: 'alert-circle',
        order: 2
      },
      {
        name: 'Billing',
        slug: 'billing',
        description: 'Billing and payment related issues',
        icon: 'credit-card',
        order: 3
      },
      {
        name: 'Feature Request',
        slug: 'feature-request',
        description: 'Request new features or improvements',
        icon: 'lightbulb',
        order: 4
      },
      {
        name: 'Account',
        slug: 'account',
        description: 'Account related issues',
        icon: 'user',
        order: 5
      }
    ];

    for (const category of defaultCategories) {
      await categoryService.createCategory(category);
    }
  }

  // Create default templates if none exist
  const templateService = Container.get(TemplateService);
  const templates = await templateService.getTemplates();

  if (templates.length === 0) {
    // Create default templates
    const defaultTemplates = [
      {
        name: 'Password Reset Issue',
        description: 'Template for password reset problems',
        subject: 'Unable to reset password',
        content: 'I am having trouble resetting my password. When I click on the "Forgot Password" link and enter my email address, I am not receiving the reset email.\n\nEmail address: [Your email]\nLast successful login: [Date if known]\n\nI have checked my spam folder but cannot find the email.',
        category: 'account',
        tags: ['password', 'reset', 'login', 'email']
      },
      {
        name: 'Feature Not Working',
        description: 'Template for reporting broken features',
        subject: '[Feature name] is not working properly',
        content: 'I am experiencing an issue with [feature name]. When I try to [action], the following happens:\n\n1. [Step 1]\n2. [Step 2]\n3. [What happens - error message or unexpected behavior]\n\nExpected behavior: [What should happen]\n\nBrowser/Device: [Your browser and device]\nTime of issue: [When this started happening]',
        category: 'technical-issue',
        tags: ['bug', 'error', 'feature', 'technical']
      },
      {
        name: 'Refund Request',
        description: 'Template for requesting refunds',
        subject: 'Refund request for [order/subscription]',
        content: 'I would like to request a refund for my recent [purchase/subscription].\n\nOrder/Invoice number: [Number]\nPurchase date: [Date]\nAmount: [Amount]\n\nReason for refund request:\n[Explain why you are requesting a refund]\n\nPlease process this refund to the original payment method.',
        category: 'billing',
        tags: ['refund', 'payment', 'billing', 'money']
      }
    ];

    for (const template of defaultTemplates) {
      await templateService.createTemplate(template);
    }
  }
}

// Shutdown function
export async function shutdownSupportModule(): Promise<void> {
  await ticketScheduler.shutdown();
}