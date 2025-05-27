import { CustomError } from './custom-error';

export class ForbiddenRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: string = 'Forbidden request') {
    super(message);
    Object.setPrototypeOf(this, ForbiddenRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
