import type { RequestHandler } from 'express';

// Jede Mittleware besitzt diese Funktionssignatur (req, res, next)
const logUserId: RequestHandler = (req, res, next) => {
  console.log('Hit GET /users/:id:', req.params.id);
  next();
};

export default logUserId;
