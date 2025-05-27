/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
// @ts-ignore
import { fromZodError } from 'zod-validation-error';
import { RequestValidationError } from '../errors';

const validateResource = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      if (!result.success) {
        throw new RequestValidationError(fromZodError(result.error));
      }
      next();
    } catch (e: unknown) {
      console.log('Validation error');
      next(e);
    }
  };
};

export default validateResource;
