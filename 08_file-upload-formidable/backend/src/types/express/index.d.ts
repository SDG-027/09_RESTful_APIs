declare global {
  namespace Express {
    export interface Request {
      file?: {
        filepath: string;
      };
    }
  }
}
export {};
