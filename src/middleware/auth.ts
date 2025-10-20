import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: { userId: number };
    }
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const token = auth.split(' ')[1];
  const userId = Number(token);
  if (Number.isNaN(userId)) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.user = { userId };
  next();
}
