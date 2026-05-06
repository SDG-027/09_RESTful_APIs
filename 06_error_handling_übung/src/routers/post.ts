import { Router } from 'express';
import * as c from '#controllers';

const postRouter = Router();

postRouter.get('/', c.getPosts);
postRouter.post('/', c.createPost);
postRouter.get('/:id', c.getPostById);
postRouter.put('/:id', c.updatePost);
postRouter.delete('/:id', c.deletePost);

export default postRouter;
