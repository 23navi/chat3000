/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CustomError } from './custom-error';

// @ts-ignore
import { ValidationError } from 'zod-validation-error';

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError) {
    super('Invalid request parameters');

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  // // This is for express validator
  // serializeErrors() {
  //   // This error parsing is for express-validator error result. We can use zod's error validator
  //   return this.errors.map((err) => {
  //     if (err.type === "field") {
  //       return { message: err.msg, field: err.path };
  //     }
  //     return { message: err.msg };
  //   });
  // }

  // This is for zod's error validator
  serializeErrors() {
    console.log('This is running');
    return this.errors.details;
  }
}
