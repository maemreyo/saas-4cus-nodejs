// Cron expression utilities

import { z } from 'zod';
import { ValidationException } from '@shared/exceptions';

/**
 * Common cron expressions
 */
export const CronExpression = {
  EVERY_MINUTE: '* * * * *',
  EVERY_5_MINUTES: '*/5 * * * *',
  EVERY_10_MINUTES: '*/10 * * * *',
  EVERY_15_MINUTES: '*/15 * * * *',
  EVERY_30_MINUTES: '*/30 * * * *',
  EVERY_HOUR: '0 * * * *',
  EVERY_2_HOURS: '0 */2 * * *',
  EVERY_6_HOURS: '0 */6 * * *',
  EVERY_12_HOURS: '0 */12 * * *',
  EVERY_DAY_AT_MIDNIGHT: '0 0 * * *',
  EVERY_DAY_AT_NOON: '0 12 * * *',
  EVERY_DAY_AT_8AM: '0 8 * * *',
  EVERY_DAY_AT_6PM: '0 18 * * *',
  EVERY_WEEK_MONDAY: '0 0 * * 1',
  EVERY_WEEK_FRIDAY: '0 0 * * 5',
  EVERY_MONTH_FIRST_DAY: '0 0 1 * *',
  EVERY_MONTH_LAST_DAY: '0 0 L * *',
  EVERY_YEAR_JAN_1: '0 0 1 1 *',
} as const;

/**
 * Cron expression parts
 */
interface CronParts {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

/**
 * Validate cron expression
 */
export function validateCronExpression(expression: string): boolean {
  const parts = expression.split(' ');

  if (parts.length !== 5) {
    return false;
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  // Basic validation patterns
  const patterns = {
    minute: /^(\*|([0-5]?[0-9])(,[0-5]?[0-9])*)$/,
    hour: /^(\*|([01]?[0-9]|2[0-3])(,([01]?[0-9]|2[0-3]))*)$/,
    dayOfMonth: /^(\*|([1-9]|[12][0-9]|3[01]|L)(,([1-9]|[12][0-9]|3[01]))*)$/,
    month: /^(\*|([1-9]|1[0-2])(,([1-9]|1[0-2]))*)$/,
    dayOfWeek: /^(\*|[0-7](,[0-7])*)$/,
  };

  return (
    patterns.minute.test(minute) &&
    patterns.hour.test(hour) &&
    patterns.dayOfMonth.test(dayOfMonth) &&
    patterns.month.test(month) &&
    patterns.dayOfWeek.test(dayOfWeek)
  );
}

/**
 * Parse cron expression into parts
 */
export function parseCronExpression(expression: string): CronParts {
  if (!validateCronExpression(expression)) {
    throw new ValidationException('Invalid cron expression');
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek] = expression.split(' ');

  return {
    minute,
    hour,
    dayOfMonth,
    month,
    dayOfWeek,
  };
}

/**
 * Build cron expression from parts
 */
export function buildCronExpression(parts: Partial<CronParts>): string {
  const defaults: CronParts = {
    minute: '*',
    hour: '*',
    dayOfMonth: '*',
    month: '*',
    dayOfWeek: '*',
  };

  const merged = { ...defaults, ...parts };

  return `${merged.minute} ${merged.hour} ${merged.dayOfMonth} ${merged.month} ${merged.dayOfWeek}`;
}

/**
 * Get human-readable description of cron expression
 */
export function describeCronExpression(expression: string): string {
  // Common expressions
  const descriptions: Record<string, string> = {
    [CronExpression.EVERY_MINUTE]: 'Every minute',
    [CronExpression.EVERY_5_MINUTES]: 'Every 5 minutes',
    [CronExpression.EVERY_10_MINUTES]: 'Every 10 minutes',
    [CronExpression.EVERY_15_MINUTES]: 'Every 15 minutes',
    [CronExpression.EVERY_30_MINUTES]: 'Every 30 minutes',
    [CronExpression.EVERY_HOUR]: 'Every hour',
    [CronExpression.EVERY_2_HOURS]: 'Every 2 hours',
    [CronExpression.EVERY_6_HOURS]: 'Every 6 hours',
    [CronExpression.EVERY_12_HOURS]: 'Every 12 hours',
    [CronExpression.EVERY_DAY_AT_MIDNIGHT]: 'Every day at midnight',
    [CronExpression.EVERY_DAY_AT_NOON]: 'Every day at noon',
    [CronExpression.EVERY_DAY_AT_8AM]: 'Every day at 8:00 AM',
    [CronExpression.EVERY_DAY_AT_6PM]: 'Every day at 6:00 PM',
    [CronExpression.EVERY_WEEK_MONDAY]: 'Every Monday at midnight',
    [CronExpression.EVERY_WEEK_FRIDAY]: 'Every Friday at midnight',
    [CronExpression.EVERY_MONTH_FIRST_DAY]: 'First day of every month at midnight',
    [CronExpression.EVERY_MONTH_LAST_DAY]: 'Last day of every month at midnight',
    [CronExpression.EVERY_YEAR_JAN_1]: 'Every January 1st at midnight',
  };

  if (descriptions[expression]) {
    return descriptions[expression];
  }

  // Try to generate description for custom expressions
  try {
    const parts = parseCronExpression(expression);
    const descriptions: string[] = [];

    // Time
    if (parts.minute !== '*' && parts.hour !== '*') {
      descriptions.push(`at ${parts.hour}:${parts.minute.padStart(2, '0')}`);
    } else if (parts.minute !== '*') {
      descriptions.push(`at minute ${parts.minute}`);
    } else if (parts.hour !== '*') {
      descriptions.push(`at hour ${parts.hour}`);
    }

    // Day
    if (parts.dayOfMonth !== '*') {
      descriptions.push(`on day ${parts.dayOfMonth}`);
    }

    // Month
    if (parts.month !== '*') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthNum = parseInt(parts.month, 10) - 1;
      if (monthNum >= 0 && monthNum < 12) {
        descriptions.push(`in ${months[monthNum]}`);
      }
    }

    // Day of week
    if (parts.dayOfWeek !== '*') {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayNum = parseInt(parts.dayOfWeek, 10);
      if (dayNum >= 0 && dayNum <= 6) {
        descriptions.push(`on ${days[dayNum]}`);
      }
    }

    return descriptions.length > 0 ? descriptions.join(' ') : 'Custom schedule';
  } catch {
    return 'Invalid cron expression';
  }
}

/**
 * Calculate next run time for cron expression
 */
export function getNextRunTime(expression: string, fromDate: Date = new Date()): Date | null {
  if (!validateCronExpression(expression)) {
    return null;
  }

  // This is a simplified implementation
  // In production, use a library like node-cron or cron-parser
  const parts = parseCronExpression(expression);
  const next = new Date(fromDate);

  // Simple implementation for common cases
  if (expression === CronExpression.EVERY_MINUTE) {
    next.setMinutes(next.getMinutes() + 1);
    next.setSeconds(0);
    next.setMilliseconds(0);
    return next;
  }

  if (expression === CronExpression.EVERY_HOUR) {
    next.setHours(next.getHours() + 1);
    next.setMinutes(0);
    next.setSeconds(0);
    next.setMilliseconds(0);
    return next;
  }

  if (expression === CronExpression.EVERY_DAY_AT_MIDNIGHT) {
    next.setDate(next.getDate() + 1);
    next.setHours(0);
    next.setMinutes(0);
    next.setSeconds(0);
    next.setMilliseconds(0);
    return next;
  }

  // For complex expressions, return null (would need proper library)
  return null;
}

/**
 * Cron expression schema for validation
 */
export const cronExpressionSchema = z.string().refine(
  (val) => validateCronExpression(val),
  {
    message: 'Invalid cron expression',
  }
);