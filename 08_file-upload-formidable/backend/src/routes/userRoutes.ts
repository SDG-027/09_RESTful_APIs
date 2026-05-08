import { Router } from 'express';
import { createUser, deleteUser, getUserById, getUsers, updateUser } from '#controllers';
import { cloudinaryUpload, processForm, validateBody } from '#middleware';
import { userSchema } from '#schemas';

const userRoutes = Router();

userRoutes.route('/').get(getUsers).post(validateBody(userSchema), createUser);
userRoutes
  .route('/:id')
  .get(getUserById)
  .put(processForm, cloudinaryUpload, validateBody(userSchema), updateUser)
  .delete(deleteUser);

export default userRoutes;

// cloudinaryUploader
