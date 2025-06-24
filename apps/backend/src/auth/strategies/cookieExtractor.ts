import { Request } from 'express';

const cookieExtractor = (req: Request, key = 'auth-token'): string | null => {
  if (req && req.cookies) {
    return req.cookies[key];
  }
  return null;
};

export default cookieExtractor;
