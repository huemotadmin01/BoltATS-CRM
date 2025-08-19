// Makes the global name AuthedRequest available everywhere,
// and ensures it has all Request fields (body, params, headers, etc.)
import type { Request } from 'express';

type UserRole = 'Admin' | 'Recruiter' | 'Sales';

declare global {
  type AuthedRequest<P = any, ResBody = any, ReqBody = any, ReqQuery = any> =
    Request<P, ResBody, ReqBody, ReqQuery> & {
      user?: {
        id: string;
        email: string;
        name: string;
        role: UserRole;
      };
    };
}

export {};
