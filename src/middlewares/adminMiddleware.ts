import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware';
import { Role } from '@prisma/client';

export const adminMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== Role.ADMIN) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};
