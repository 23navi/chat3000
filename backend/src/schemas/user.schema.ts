import { object, string, TypeOf } from 'zod';

// User schema will have body, query param and path param validation
// createUserSchema will be used in user.router to pass to validateResources
export const createUserSchema = object({
  body: object({
    name: string({
      required_error: 'Name is required',
    }),
    password: string({
      required_error: 'Password is required',
    }).min(6, 'Password too short - should be 6 chars minimum'),
    passwordConfirmation: string({
      required_error: 'Password confirmation is required',
    }),
    username: string({
      required_error: 'Username is required',
    }),
    email: string({
      required_error: 'Email is required',
    }).email('Not a valid email'),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  }),
});

// CreateUserInput will be used in the middleware as type
export type CreateUserInput = TypeOf<typeof createUserSchema>['body'];
