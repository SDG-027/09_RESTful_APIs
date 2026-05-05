import express, { type Request } from 'express';
import mongoose from 'mongoose';

type PostRequestBody = {
  title: string;
  content: string;
};

mongoose.connect(process.env.MONGO_URI!, { dbName: 'posts' });

const Post = mongoose.model(
  'Post',
  new mongoose.Schema({
    title: String,
    content: String,
  })
);

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Running' });
});

app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json({ message: 'GET /posts', data: posts });
  } catch {
    console.log(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

app.post('/posts', async (req: Request<{}, {}, PostRequestBody>, res) => {
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
});

app.get('/posts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: `Post not found; id : ${id}` });
    }

    res.json({ message: 'GET /posts/:id', data: post });
  } catch (error) {
    console.log(error);

    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid id' });
    }

    res.status(500).json({ error: 'Server Error' });
  }
});

app.put('/posts/:id', async (req, res) => {
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
});

app.delete('/posts/:id', async (req, res) => {
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
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
