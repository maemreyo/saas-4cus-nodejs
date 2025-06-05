import { Service } from 'typedi'
import nodemailer, { Transporter } from 'nodemailer'
import { config } from '@infrastructure/config'
import { logger } from '@shared/logger'
import { QueueService } from '@shared/queue/queue.service'
import path from 'path'
import fs from 'fs/promises'

export interface EmailOptions {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  template?: string
  context?: Record<string, any>
  attachments?: Array<{
    filename: string
    content?: string | Buffer
    path?: string
  }>
  cc?: string | string[]
  bcc?: string | string[]
  replyTo?: string
}

interface EmailTemplate {
  subject: string
  html: string
  text?: string
}

@Service()
export class EmailService {
  private transporter: Transporter
  private templates: Map<string, EmailTemplate> = new Map()

  constructor(private queueService: QueueService) {
    this.transporter = nodemailer.createTransport({
      host: config.email.smtp.host,
      port: config.email.smtp.port,
      secure: config.email.smtp.secure,
      auth: {
        user: config.email.smtp.auth.user,
        pass: config.email.smtp.auth.pass
      }
    })

    this.loadTemplates()
  }

  private async loadTemplates() {
    // Load email templates
    const templates = {
      welcome: {
        subject: 'Welcome to {{appName}}!',
        html: `
          <h1>Welcome {{name}}!</h1>
          <p>Thank you for joining {{appName}}. We're excited to have you on board!</p>
          <p>To get started, please verify your email by clicking the link below:</p>
          <a href="{{verifyUrl}}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
        `,
        text: 'Welcome {{name}}! Thank you for joining {{appName}}. Please verify your email: {{verifyUrl}}'
      },
      passwordReset: {
        subject: 'Reset Your Password',
        html: `
          <h1>Password Reset Request</h1>
          <p>Hi {{name}},</p>
          <p>We received a request to reset your password. Click the link below to create a new password:</p>
          <a href="{{resetUrl}}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
        text: 'Hi {{name}}, Reset your password here: {{resetUrl}}. This link expires in 1 hour.'
      },
      passwordChanged: {
        subject: 'Your Password Has Been Changed',
        html: `
          <h1>Password Changed Successfully</h1>
          <p>Hi {{name}},</p>
          <p>Your password has been changed successfully.</p>
          <p>If you didn't make this change, please contact our support team immediately.</p>
        `,
        text: 'Hi {{name}}, Your password has been changed successfully.'
      },
      twoFactorEnabled: {
        subject: 'Two-Factor Authentication Enabled',
        html: `
          <h1>2FA Enabled</h1>
          <p>Hi {{name}},</p>
          <p>Two-factor authentication has been enabled on your account.</p>
          <p>Your backup codes:</p>
          <ul>
            {{#each backupCodes}}
            <li><code>{{this}}</code></li>
            {{/each}}
          </ul>
          <p>Keep these codes safe. You can use them to access your account if you lose your authenticator device.</p>
        `
      }
    }

    for (const [name, template] of Object.entries(templates)) {
      this.templates.set(name, template)
    }
  }

  // Send email directly
  async send(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: config.email.from,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        cc: options.cc,
        bcc: options.bcc,
        replyTo: options.replyTo || config.email.replyTo,
        attachments: options.attachments
      }

      if (options.template && options.context) {
        const template = this.templates.get(options.template)
        if (template) {
          mailOptions.subject = this.renderTemplate(template.subject, options.context)
          mailOptions.html = this.renderTemplate(template.html, options.context)
          mailOptions.text = template.text ? this.renderTemplate(template.text, options.context) : undefined
        }
      }

      await this.transporter.sendMail(mailOptions)

      logger.info('Email sent successfully', {
        to: options.to,
        subject: options.subject,
        template: options.template
      })
    } catch (error) {
      logger.error('Failed to send email', error as Error, {
        to: options.to,
        subject: options.subject
      })
      throw error
    }
  }

  // Queue email for async sending
  async queue(options: EmailOptions, delay?: number): Promise<void> {
    await this.queueService.addJob('email', 'send', options, { delay })
  }

  // Template methods
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verifyUrl = `${process.env.APP_URL}/auth/verify-email?token=${token}`

    await this.queue({
      to: email,
      template: 'welcome',
      subject: 'Verify your email',
      context: {
        appName: config.app.name,
        name: email.split('@')[0],
        verifyUrl
      }
    })
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${process.env.APP_URL}/auth/reset-password?token=${token}`

    await this.queue({
      to: email,
      template: 'passwordReset',
      subject: 'Reset your password',
      context: {
        name: email.split('@')[0],
        resetUrl
      }
    })
  }

  async sendPasswordChangedEmail(email: string): Promise<void> {
    await this.queue({
      to: email,
      template: 'passwordChanged',
      subject: 'Password changed',
      context: {
        name: email.split('@')[0]
      }
    })
  }

  async send2FAEnabledEmail(email: string, backupCodes: string[]): Promise<void> {
    await this.queue({
      to: email,
      template: 'twoFactorEnabled',
      subject: '2FA enabled',
      context: {
        name: email.split('@')[0],
        backupCodes
      }
    })
  }

  // Helper to render template with context
  private renderTemplate(template: string, context: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return context[key] || match
    })
  }

  // Verify SMTP connection
  async verify(): Promise<boolean> {
    try {
      await this.transporter.verify()
      return true
    } catch (error) {
      logger.error('SMTP verification failed', error as Error)
      return false
    }
  }
}