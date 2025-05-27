import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  console.error({ unhandledError: err });
  // if the err is not instance of CustomError, then it is a server error.
  res.status(400).send({
    errors: [{ message: 'Unhandled error' }],
  });

  // Log the error if we get some error which was not handled by Custom Error handler.
};

export default errorHandler;
