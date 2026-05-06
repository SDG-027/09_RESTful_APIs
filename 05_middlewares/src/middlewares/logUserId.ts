import type { RequestHandler } from 'express';

const logUserId: RequestHandler = (req, res, next) => {
  console.log('Hit GET /users/:id:', req.params.id);
  next();
};

export default logUserId;
