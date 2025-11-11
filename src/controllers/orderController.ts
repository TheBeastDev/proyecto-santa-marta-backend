import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/orderService';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { OrderStatus, PaymentMethod } from '@prisma/client';

export const orderController = {
  async createOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { paymentMethod, deliveryAddress, phone } = req.body;

      if (!paymentMethod || !deliveryAddress || !phone) {
        return res.status(400).json({ message: 'Payment method, delivery address, and phone are required' });
      }

      if (!Object.values(PaymentMethod).includes(paymentMethod)) {
        return res.status(400).json({ message: 'Invalid payment method' });
      }

      const order = await orderService.createOrderFromCart(userId, paymentMethod, deliveryAddress, phone);
      res.status(201).json(order);
    } catch (error: any) {
      if (error.message === 'Cart is empty') {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  },

  async getMyOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const orders = await orderService.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  },

  async getAllOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orders = await orderService.getAllOrders();
      res.json(orders);
    } catch (error) {
      next(error);
    }
  },

  async getOrderById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const order = await orderService.getOrderById(id);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Optional: Check if the user is an admin or the owner of the order
      if (req.user!.role !== 'ADMIN' && order.userId !== req.user!.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      res.json(order);
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !Object.values(OrderStatus).includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      const updatedOrder = await orderService.updateOrderStatus(id, status);
      res.json(updatedOrder);
    } catch (error) {
      next(error);
    }
  },
};
