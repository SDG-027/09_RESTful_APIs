import Post from '../models/Post.ts';
import type { RequestHandler, Request } from 'express';
import type { PostRequestBody } from '../types/index.ts';

// Hier sammeln wir die eigentlichen RequestHandler
//  (häufig auch "controller" genannt)
// Ihr könntet sie auch noch weiter in eigene Ordner und Datein organisieren
const getAllPosts: RequestHandler = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json({ message: 'GET /posts', data: posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

const createPost: RequestHandler = async (
  req: Request<{}, {}, PostRequestBody>,
  res
) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Bad request' });
  }
  try {
    const newPost = await Post.create(req.body);
    res.status(201).json({ message: 'success', data: newPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

const getOnePost: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: `Post not found; id : ${id}` });
    }

    res.json({ message: 'GET /posts/:id', data: post });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid id' });
      }

      res.status(500).json({ error: 'Server Error' });
    } else {
      res.status(500).json({ error: 'Unknown Error' });
    }
  }
};

const updateOnePost: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Bad request' });
  }

  try {
    const post = await Post.findByIdAndUpdate(
      id,
      { title, content },
      { returnDocument: 'after' }
    );

    if (!post) {
      return res.status(404).json({ message: `Post not found; id : ${id}` });
    }
    res.json({ message: 'PUT /posts/:id', data: post });
  } catch (error) {
    console.log(error);

    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid id' });
    }

    res.status(500).json({ error: 'Server Error' });
  }
};

const deletePost: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({ message: `Post not found; id : ${id}` });
    }

    res.json({ message: 'DELETE /posts/:id', data: post });
  } catch (error) {
    console.log(error);

    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid id' });
    }

    res.status(500).json({ error: 'Server Error' });
  }
};

export { getAllPosts, createPost, getOnePost, updateOnePost, deletePost };
