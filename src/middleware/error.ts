import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);
  res.status(err.status || 500).json({
    error: { 
      message: err.message || 'Internal Server Error', 
      code: err.code || 'INTERNAL_ERROR', 
      details: err.details 
    }
  });
}