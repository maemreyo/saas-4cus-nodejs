import { Service } from 'typedi';

/**
 * Injectable decorator for dependency injection
 * This is a wrapper around TypeDI's Service decorator
 */
export function Injectable(): ClassDecorator {
  return Service;
}
