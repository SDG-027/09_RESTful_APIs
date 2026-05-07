import z from 'zod';

const createUserSchema = z.object({
  firstName: z.string({ error: 'firstName must be a string' }).min(1).max(512),
  lastName: z.string({ error: 'lastName must be a string' }).min(1).max(512),
  email: z.email({ error: 'email must be valid' }),
  password: z
    .string({ error: 'password must be a string' })
    .min(8, { message: 'password must be at least 8 characters long' })
    .max(64, { message: 'password must be at most 64 characters long' })
    .regex(/[a-z]/, { message: 'password must include a lowercase letter' })
    .regex(/[A-Z]/, { message: 'password must include an uppercase letter' })
    .regex(/\d/, { message: 'password must include a number' })
    .regex(/[!@#$%^&*()_+={}|;:'",.<>?`~]/, {
      message: 'password must include a special character'
    })
});

const updateUserSchema = createUserSchema.partial();

export { createUserSchema, updateUserSchema };
