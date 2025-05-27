import { CustomError } from "./custom-error";
class PorpogateError extends CustomError {
  statusCode;
  message;

  constructor({
    message = "Something went wrong - Please check with service provider",
    statusCode = 500,
  }) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    Object.setPrototypeOf(this, PorpogateError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export default PorpogateError;

// Say we try and catch some error and inside that try we need to throw the error

// Dumb me, we don't even need this.....

// app.get("/test", (req, res, next) => {
//       try {
//         const user = { isAdmin: false };
//         if (!user) {
//           throw new NotFoundError();
//         }
//         if (!user?.isAdmin) {
//           throw new NotAuthorizedError();
//         }
//         res.send("Working");
//       } catch (err) {
//         throw err;
//       }
//     });

// In catch we can either do next(err) or throw err... both will propogate on it's own, we don't have to do it manually
