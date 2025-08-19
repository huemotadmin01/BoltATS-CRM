import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';
import { AuthedRequest } from '@/types/AuthedRequest';

// ⬇️ add this re-export so controllers that do
//    `import { AuthedRequest } from '../middleware/auth'` compile.
export type { AuthedRequest } from '@/types/AuthedRequest';

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const hdr = req.headers?.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : '';

  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
