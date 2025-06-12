// Validation utilities for DTOs and request data

import { z } from 'zod';
import { ValidationException } from '@shared/exceptions';
import { logger } from '@shared/logger';

/**
 * Validate DTO against schema
 * @param schema - Zod schema
 * @param data - Data to validate
 * @returns Validated and typed data
 * @throws ValidationException if validation fails
 */
export async function validateDto<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<T> {
  try {
    return await schema.parseAsync(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code
      }));

      logger.debug('Validation failed', { errors: formattedErrors });

      throw new ValidationException('Validation failed', {
        errors: formattedErrors
      });
    }
    throw error;
  }
}

/**
 * Validate DTO synchronously
 * @param schema - Zod schema
 * @param data - Data to validate
 * @returns Validated and typed data
 * @throws ValidationException if validation fails
 */
export function validateDtoSync<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code
      }));

      logger.debug('Validation failed', { errors: formattedErrors });

      throw new ValidationException('Validation failed', {
        errors: formattedErrors
      });
    }
    throw error;
  }
}

/**
 * Partial validation - only validate provided fields
 * @param schema - Zod schema
 * @param data - Partial data to validate
 * @returns Validated partial data
 */
export async function validatePartialDto<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<Partial<T>> {
  // Use type assertion since partial() is available on ZodObject but not on ZodSchema
  const partialSchema = (schema as any).partial();
  return validateDto(partialSchema, data);
}

/**
 * Safe parse - returns result object instead of throwing
 * @param schema - Zod schema
 * @param data - Data to validate
 * @returns Result object with success flag and data/error
 */
export async function safeParse<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; error: z.ZodError }> {
  const result = await schema.safeParseAsync(data);
  return result;
}

/**
 * Sanitize data - strip unknown fields
 * @param schema - Zod schema
 * @param data - Data to sanitize
 * @returns Sanitized data with only known fields
 */
export function sanitizeDto<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): unknown {
  try {
    // Use type assertion since strict() is available on ZodObject but not on ZodSchema
    const strictSchema = (schema as any).strict();
    return strictSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Strip unknown keys and retry
      const shape = (schema as any)._def.shape();
      if (shape && typeof data === 'object' && data !== null) {
        const cleaned: any = {};
        for (const key in shape) {
          if (key in data) {
            cleaned[key] = (data as any)[key];
          }
        }
        return schema.parse(cleaned);
      }
    }
    throw error;
  }
}

/**
 * Validate array of DTOs
 * @param schema - Zod schema for single item
 * @param data - Array of data to validate
 * @returns Array of validated items
 */
export async function validateArrayDto<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<T[]> {
  const arraySchema = z.array(schema);
  return validateDto(arraySchema, data);
}

/**
 * Coerce and validate - useful for query parameters
 * @param schema - Zod schema
 * @param data - Data to coerce and validate
 * @returns Coerced and validated data
 */
export function coerceAndValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  // Common coercions for query parameters
  const coerced = coerceTypes(data);
  return validateDtoSync(schema, coerced);
}

/**
 * Helper to coerce common types from strings
 */
function coerceTypes(data: unknown): unknown {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const coerced: any = Array.isArray(data) ? [] : {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Try to coerce to boolean
      if (value === 'true') {
        coerced[key] = true;
      } else if (value === 'false') {
        coerced[key] = false;
      }
      // Try to coerce to number
      else if (/^-?\d+$/.test(value)) {
        coerced[key] = parseInt(value, 10);
      } else if (/^-?\d+\.\d+$/.test(value)) {
        coerced[key] = parseFloat(value);
      }
      // Keep as string
      else {
        coerced[key] = value;
      }
    } else if (typeof value === 'object') {
      // Recursively coerce nested objects
      coerced[key] = coerceTypes(value);
    } else {
      coerced[key] = value;
    }
  }

  return coerced;
}
