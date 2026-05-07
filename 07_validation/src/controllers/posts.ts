import { Post } from '#models';
import type { createPostSchema, updatePostSchema } from '#schemas';
import type { RequestHandler } from 'express';
import type z from 'zod';

type PostCreate = z.infer<typeof createPostSchema>;
type PostUpdate = z.infer<typeof updatePostSchema>;
type IdParam = { id: string };

const getPosts: RequestHandler = async (req, res) => {
  const posts = await Post.find().populate('userId', 'firstName lastName email').lean();
  res.json(posts);
};

const createPost: RequestHandler<unknown, unknown, PostCreate> = async (req, res) => {
  const post = await Post.create(req.body);
  const populatedPost = await post.populate('userId', 'firstName lastName email');
  res.json(populatedPost);
};

const getPostById: RequestHandler = async (req, res) => {
  const {
    params: { id }
  } = req;
  const post = await Post.findById(id).populate('userId', 'firstName email');
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
};

const updatePost: RequestHandler<IdParam, unknown, PostUpdate> = async (req, res) => {
  const {
    body,
    params: { id }
  } = req;

  // MongoDB Updates sind standardmäßig parziell. Wenn nur title enthalten ist,
  // wird nur der title überschrieben; alles andere bleibt.
  const post = await Post.findByIdAndUpdate(id, body, { returnDocument: 'after' }).populate(
    'userId',
    'firstName email'
  );

  // const post = await Post.findById(id);
  // if (!post) return res.status(404).json({ error: 'Post not found' });

  // post.title = title;
  // post.content = content;
  // post.userId = userId;
  // await post.save();

  // const populatedPost = await post.populate('userId', 'firstName lastName email');

  res.json(post);
};

const deletePost: RequestHandler = async (req, res) => {
  const {
    params: { id }
  } = req;
  const post = await Post.findByIdAndDelete(id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json({ message: 'Post deleted' });
};

export { getPosts, createPost, getPostById, updatePost, deletePost };
