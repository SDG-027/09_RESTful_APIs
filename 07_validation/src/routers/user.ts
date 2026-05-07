import { Router } from 'express';
import * as c from '#controllers';
import { validate } from '#middlewares';
import { createUserSchema, updateUserSchema } from '#schemas';

const userRouter = Router();

userRouter.get('/', c.getUsers);
userRouter.post('/', validate(createUserSchema), c.createUser);
userRouter.get('/:id', c.getUserById);
userRouter.put('/:id', validate(updateUserSchema), c.updateUser);
userRouter.delete('/:id', c.deleteUser);

export default userRouter;
