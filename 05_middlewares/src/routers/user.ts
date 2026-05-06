import { Router } from 'express';
import * as c from '#controllers';
import { logUserId } from '#middlewares';

const userRouter = Router();

// userRouter.use((req, res, next) => {
//   console.log('Hit user router');

//   console.log('Aus req.newField', req.newField);

//   if (Math.random() < 0.5) {
//     return res.status(418).json({ message: 'Pech gehabt' });
//   }

//   next();
// });

userRouter.get('/', c.getUsers);
userRouter.post('/', c.createUser);

userRouter.get(
  '/:id',
  // Middleware
  logUserId,
  c.getUserById // Controller
);

userRouter.put('/:id', c.updateUser);
userRouter.delete('/:id', logUserId, c.deleteUser);

export default userRouter;
