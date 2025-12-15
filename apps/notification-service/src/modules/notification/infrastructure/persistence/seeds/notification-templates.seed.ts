import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ICacheService } from '../../../domain/ports/cache.port';
import { CACHE_TTL } from '../../../../../shared/constants/cache.constants';

interface EmailTemplate {
  name: string;
  subject: string;
  description: string;
  requiredVariables: string[];
  category: string;
}

@Injectable()
export class NotificationTemplatesSeed implements OnModuleInit {
  private readonly logger = new Logger(NotificationTemplatesSeed.name);

  constructor(private readonly cacheService: ICacheService) {}

  async onModuleInit() {
    if (process.env.NODE_ENV === 'development') {
      await this.seedTemplates();
    }
  }

  async seedTemplates() {
    this.logger.log('Seeding notification templates...');

    const templates: EmailTemplate[] = [
      {
        name: 'welcome',
        subject: 'Welcome to {{appName}}!',
        description: 'Welcome email with email verification',
        requiredVariables: ['userName', 'verificationUrl', 'verificationToken', 'appName'],
        category: 'authentication',
      },
      {
        name: 'verification',
        subject: 'Email Verification',
        description: 'Email verification request',
        requiredVariables: ['userName', 'verificationUrl', 'verificationToken'],
        category: 'authentication',
      },
      {
        name: 'password-reset',
        subject: 'Password Reset Request',
        description: 'Password reset email',
        requiredVariables: ['userName', 'resetUrl', 'appName'],
        category: 'authentication',
      },
      {
        name: 'order-confirmation',
        subject: 'Order Confirmation - {{orderId}}',
        description: 'Order confirmation email',
        requiredVariables: ['userName', 'orderId', 'items', 'total', 'appName'],
        category: 'transactional',
      },
      {
        name: 'reminder',
        subject: 'Reminder: {{reminderTitle}}',
        description: 'Generic reminder email',
        requiredVariables: ['userName', 'reminderTitle', 'reminderMessage', 'scheduledDate'],
        category: 'reminder',
      },
      {
        name: 'payment-success',
        subject: 'Payment Successful',
        description: 'Payment confirmation',
        requiredVariables: ['userName', 'paymentId', 'amount', 'currency'],
        category: 'transactional',
      },
      {
        name: 'payment-failed',
        subject: 'Payment Failed',
        description: 'Payment failure notification',
        requiredVariables: ['userName', 'paymentId', 'errorReason'],
        category: 'transactional',
      },
      {
        name: 'subscription-expiring',
        subject: 'Your Subscription is Expiring Soon',
        description: 'Subscription expiration reminder',
        requiredVariables: ['userName', 'expiryDate', 'renewUrl'],
        category: 'reminder',
      },
      {
        name: 'account-locked',
        subject: 'Your Account Has Been Locked',
        description: 'Account security notification',
        requiredVariables: ['userName', 'reason', 'unlockUrl'],
        category: 'security',
      },
      {
        name: 'security-alert',
        subject: 'Security Alert - New Login Detected',
        description: 'Security alert for new login',
        requiredVariables: ['userName', 'loginTime', 'location', 'device'],
        category: 'security',
      },
    ];

    try {
      // Store templates in cache
      for (const template of templates) {
        const cacheKey = `template:${template.name}`;
        await this.cacheService.set(cacheKey, template, CACHE_TTL.VERY_LONG);
      }

      // Store template list
      const templateNames = templates.map((t) => t.name);
      await this.cacheService.set('template:list', templateNames, CACHE_TTL.VERY_LONG);

      this.logger.log(`Successfully seeded ${templates.length} email templates`);
    } catch (error) {
      this.logger.error('Failed to seed templates', error);
    }
  }

  async getTemplate(name: string): Promise<EmailTemplate | null> {
    try {
      return await this.cacheService.get<EmailTemplate>(`template:${name}`);
    } catch (error) {
      this.logger.error(`Failed to get template ${name}`, error);
      return null;
    }
  }

  async getAllTemplates(): Promise<EmailTemplate[]> {
    try {
      const templateNames = await this.cacheService.get<string[]>('template:list');
      
      if (!templateNames) return [];

      const templates = await Promise.all(
        templateNames.map((name) => this.getTemplate(name)),
      );

      return templates.filter((t): t is EmailTemplate => t !== null);
    } catch (error) {
      this.logger.error('Failed to get all templates', error);
      return [];
    }
  }

  async validateTemplateData(templateName: string, data: Record<string, any>): Promise<{
    valid: boolean;
    missingVariables: string[];
  }> {
    const template = await this.getTemplate(templateName);

    if (!template) {
      return { valid: false, missingVariables: [] };
    }

    const missingVariables = template.requiredVariables.filter(
      (variable) => !(variable in data),
    );

    return {
      valid: missingVariables.length === 0,
      missingVariables,
    };
  }
}