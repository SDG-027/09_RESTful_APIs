import { Router } from 'express';
import {
  createPost,
  deletePost,
  getAllPosts,
  getOnePost,
  updateOnePost,
} from '../controllers/posts.controller.ts';

// express.Router() is wie eine Mini-Instanz von Express
const postsRouter = Router();

// Liste unserer /posts-Endpunkte
postsRouter.get('/', getAllPosts);
postsRouter.post('/', createPost);
postsRouter.get('/:id', getOnePost);
postsRouter.put('/:id', updateOnePost);
postsRouter.delete('/:id', deletePost);

export default postsRouter;
