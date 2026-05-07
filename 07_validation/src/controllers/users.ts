import { User } from '#models';
import type { UserType } from '#types';
import type { RequestHandler } from 'express';

const getUsers: RequestHandler = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

const createUser: RequestHandler = async (req, res) => {
  const { firstName, lastName, email, password, isActive } = req.body as UserType;
  if (!firstName || !lastName || !email || !password) throw new Error('all data required', { cause: { status: 400 } });
  const found = await User.findOne({ email });
  if (found) return res.status(400).json({ error: 'User already exists' });
  const user = await User.create({ firstName, lastName, email, password, isActive });
  res.json(user);
};

const getUserById: RequestHandler = async (req, res) => {
  const {
    params: { id }
  } = req;
  const user = await User.findById(id);
  if (!user) throw new Error('User not found', { cause: { status: 404 } });
  res.json(user);
};

const updateUser: RequestHandler = async (req, res) => {
  const {
    body,
    params: { id }
  } = req;
  const { firstName, lastName, email } = body as UserType;
  if (!firstName || !lastName || !email)
    return res.status(400).json({ error: 'firstName, lastName, and email are required' });
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  await user.save();
  res.json(user);
};

const deleteUser: RequestHandler = async (req, res) => {
  const {
    params: { id }
  } = req;
  const user = await User.findByIdAndDelete(id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ message: 'User deleted' });
};

export { getUsers, createUser, getUserById, updateUser, deleteUser };
