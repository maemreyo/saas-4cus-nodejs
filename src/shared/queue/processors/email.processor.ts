import { Job } from 'bullmq';
import { Service } from 'typedi';
import { EmailService, EmailOptions } from '@shared/services/email.service';
import { queueService } from '../queue.service';

@Service()
export class EmailProcessor {
  constructor(private emailService: EmailService) {
    this.registerProcessors();
  }

  private registerProcessors() {
    queueService.registerProcessor('email', 'send', this.processSendEmail.bind(this));
    queueService.registerProcessor('email', 'sendBulk', this.processSendBulkEmail.bind(this));
  }

  async processSendEmail(job: Job<EmailOptions>) {
    const { data } = job;

    await job.updateProgress(10);
    await this.emailService.send(data);
    await job.updateProgress(100);

    return { sent: true, to: data.to };
  }

  async processSendBulkEmail(job: Job<{ emails: EmailOptions[] }>) {
    const { emails } = job.data;
    const results = [];

    for (let i = 0; i < emails.length; i++) {
      try {
        await this.emailService.send(emails[i]);
        results.push({ success: true, email: emails[i].to });
      } catch (error) {
        results.push({ success: false, email: emails[i].to, error: (error as Error).message });
      }

      await job.updateProgress(Math.floor(((i + 1) / emails.length) * 100));
    }

    return results;
  }
}
