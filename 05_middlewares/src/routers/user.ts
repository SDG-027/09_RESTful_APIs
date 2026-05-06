import { Router } from 'express';
import * as c from '#controllers';

const userRouter = Router();

userRouter.get('/', c.getUsers);
userRouter.post('/', c.createUser);
userRouter.get('/:id', c.getUserById);
userRouter.put('/:id', c.updateUser);
userRouter.delete('/:id', c.deleteUser);

export default userRouter;
