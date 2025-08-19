import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface AuthedRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const h = req.headers.authorization;
  const token = h?.startsWith('Bearer ') ? h.slice(7) : undefined;
  if (!token) return res.status(401).json({ error: { message: 'Unauthorized' } });
  try {
    req.user = jwt.verify(token, config.jwtSecret) as any;
    next();
  } catch {
    res.status(401).json({ error: { message: 'Invalid token' } });
  }
}