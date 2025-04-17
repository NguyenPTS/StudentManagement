import { Request, Response, NextFunction } from 'express';
import { RequestHandler } from 'express-serve-static-core';

export const authorize = (roles: string[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }

      if (!roles.includes(req.user.role)) {
        res.status(403).json({ message: 'Access forbidden' });
        return;
      }

      next();
    } catch (error) {
      console.error('Authorization middleware error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}; 