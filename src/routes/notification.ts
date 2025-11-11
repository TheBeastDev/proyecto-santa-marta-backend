import { Router } from 'express';
import { notificationController } from '../controllers/notificationController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// All notification routes require authentication
router.use(authMiddleware);

// GET /api/notifications - Get all notifications for the authenticated user
router.get('/', notificationController.getUserNotifications);

// PUT /api/notifications/:id/read - Mark a specific notification as read
router.put('/:id/read', notificationController.markAsRead);

export default router;
