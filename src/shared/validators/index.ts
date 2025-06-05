import { z } from 'zod'
import { ValidationException } from '@shared/exceptions'

// Common schemas
export const emailSchema = z.string().email().toLowerCase()

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

export const uuidSchema = z.string().uuid()

export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/)

export const usernameSchema = z.string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must not exceed 30 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores and hyphens')

// Pagination schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc')
})

// Date range schema
export const dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
}).refine(data => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) <= new Date(data.endDate)
  }
  return true
}, {
  message: 'Start date must be before end date'
})

// File upload schema
export const fileUploadSchema = z.object({
  filename: z.string(),
  mimetype: z.string(),
  size: z.number().positive().max(10 * 1024 * 1024) // 10MB
})

// Validation helper
export async function validateSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<T> {
  try {
    return await schema.parseAsync(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationException('Validation failed', {
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      })
    }
    throw error
  }
}
