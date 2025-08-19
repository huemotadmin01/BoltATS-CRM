import { Request } from 'express';

export type AuthedRequest = Request & {
  user?: {
    id: string;
    email: string;
    role: 'Admin' | 'Recruiter' | 'Sales';
  };
};
