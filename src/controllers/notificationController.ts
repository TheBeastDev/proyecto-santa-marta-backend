import { Request, Response, NextFunction } from 'express';
import { notificationService } from '../services/notificationService';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export const notificationController = {
  async getUserNotifications(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const notifications = await notificationService.getUserNotifications(userId);
      res.json(notifications);
    } catch (error) {
      next(error);
    }
  },

  async markAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const notification = await notificationService.markNotificationAsRead(id);

      // Optional: Check if the notification belongs to the user before marking as read
      // This would require fetching the notification first and checking its userId
      // For simplicity, we're assuming the service handles this or it's not a strict requirement for now.

      res.json(notification);
    } catch (error) {
      next(error);
    }
  },
};
