import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const notificationService = {
  async createNotification(userId: string, message: string) {
    return prisma.notification.create({
      data: {
        userId,
        message,
      },
    });
  },

  async getUserNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },

  async markNotificationAsRead(notificationId: string) {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  },
};
