declare global {
  namespace Express {
    interface Request {
      newField?: string;
    }
  }
}

export {};
