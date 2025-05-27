import { CustomError } from "./custom-error";

export class ResourceAlreadyExistError extends CustomError {
  statusCode = 409; //Conflicts (Example, user with given email already exists)

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, ResourceAlreadyExistError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
