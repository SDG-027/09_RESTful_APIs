import { Post } from '#models';
import type { PostType } from '#types';
import type { RequestHandler } from 'express';

const getPosts: RequestHandler = async (req, res) => {
  throw new Error('No tea left', { cause: { status: 418 } });

  const posts = await Post.find().populate('userId', 'firstName lastName email').lean();
  res.json(posts);
};

const createPost: RequestHandler = async (req, res) => {
  const { title, content, userId } = req.body as PostType;
  if (!title || !content || !userId) return res.status(400).json({ error: 'title, content, and userId are required' });
  const post = await Post.create<PostType>({ title, content, userId });
  const populatedPost = await post.populate('userId', 'firstName lastName email');
  res.json(populatedPost);
};

const getPostById: RequestHandler = async (req, res) => {
  const {
    params: { id }
  } = req;
  const post = await Post.findById(id).populate('userId', 'firstName lastName email');
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
};

const updatePost: RequestHandler = async (req, res) => {
  const {
    body: { title, content, userId },
    params: { id }
  } = req;
  if (!title || !content || !userId) return res.status(400).json({ error: 'title, content, and userId are required' });

  const post = await Post.findById(id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  post.title = title;
  post.content = content;
  post.userId = userId;
  await post.save();

  const populatedPost = await post.populate('userId', 'firstName lastName email');
  res.json(populatedPost);
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
