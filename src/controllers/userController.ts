import { Request, Response, NextFunction } from 'express';
import {
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
} from '../services/userService';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export const userController = {
  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const user = await getUserProfile(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { name, address, phone } = req.body;

      const updatedUser = await updateUserProfile(userId, { name, address, phone });
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  },

  async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Old and new passwords are required' });
      }

      const success = await changeUserPassword(userId, oldPassword, newPassword);

      if (!success) {
        return res.status(400).json({ message: 'Invalid old password' });
      }

      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      next(error);
    }
  },
};
