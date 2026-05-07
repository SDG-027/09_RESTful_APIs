import { Router } from 'express';
import * as c from '#controllers';
import { validate } from '#middlewares';
import { createPostSchema, updatePostSchema } from '#schemas';

const postRouter = Router();

postRouter.get('/', c.getPosts);
postRouter.post('/', validate(createPostSchema), c.createPost);
postRouter.get('/:id', c.getPostById);
postRouter.put('/:id', validate(updatePostSchema), c.updatePost);
postRouter.delete('/:id', c.deletePost);

export default postRouter;
