import type { RequestHandler } from 'express';
import z from 'zod';

const zodPostSchema = z.object({
  title: z
    .string({ error: 'Title must be a string' })
    .trim()
    .min(5, { error: 'Title must be at least 5 character long' })
    .max(120, { error: 'Title must be at most 120 character long' }),
  content: z.string().min(5).max(25000),
  userId: z.string().min(24).max(24)
});

const validatePosts: RequestHandler = (req, res, next) => {
  const { success, data, error } = zodPostSchema.safeParse(res.body);

  if (!success) {
    // return res.status(400).json({message: "invalid Post"})
    const errMessage = z.prettifyError(error);

    throw new Error(errMessage, { cause: { status: 400 } });
  }
  req.body = data;
  next();
};

export default validatePosts;
