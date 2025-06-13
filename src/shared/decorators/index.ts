import { Service } from 'typedi';

/**
 * Injectable decorator for dependency injection
 * This is a wrapper around TypeDI's Service decorator
 */
export const Injectable = (): ClassDecorator => {
  return Service();
};
