import z from 'zod';

const titleSchema = z
  .string({ error: 'Title must be a string' })
  .trim()
  .min(5, { error: 'Title must be at least 5 character long' })
  .max(120, { error: 'Title must be at most 120 character long' });

const contentSchema = z.string().min(5).max(25000);

const objectIdSchema = z.string().length(24); // .length() ist .min().max() zusammen

const createPostSchema = z.object({
  title: titleSchema,
  content: contentSchema,
  userId: objectIdSchema
});

// const updatePostSchema = z.object({
//   title: titleSchema.optional(),
//   content: contentSchema.optional(),
//   userId: objectIdSchema
// });
//
const updatePostSchema = createPostSchema.partial();

export { createPostSchema, updatePostSchema };
