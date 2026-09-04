import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from './error.middleware';

export const validateRequest = (schema: ZodSchema, target: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate = req[target];
      const result = schema.safeParse(dataToValidate);

      if (!result.success) {
        const errorMessages = result.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        throw new AppError(
          'Validation failed',
          400,
          true,
          errorMessages
        );
      }

      // Replace the validated data
      req[target] = result.data;
      next();
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new AppError('Validation error', 400));
      }
    }
  };
};