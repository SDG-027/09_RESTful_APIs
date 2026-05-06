import type { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  let errorMessage = 'Internal server error';
  let statusCode = 500;

  if (error instanceof Error) {
    if (error.cause && typeof error.cause === 'object' && 'status' in error.cause) {
      statusCode = error.cause.status as number;
    }
    errorMessage = error.message;

    if (error.name === 'CastError') {
      statusCode = 400;
      errorMessage = 'Invalid Id';
    }
  }

  res.status(statusCode).json({ error: errorMessage });
};

export default errorHandler;
