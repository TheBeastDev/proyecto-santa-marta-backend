import { Request, Response, NextFunction } from 'express';
import { cartService } from '../services/cartService';
import { AuthenticatedRequest } from '../middlewares/authMiddleware'; // Assuming you have this interface

export const cartController = {
  async getCart(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id; // userId should be available from authMiddleware
      const cart = await cartService.getOrCreateCart(userId);
      res.json(cart);
    } catch (error) {
      next(error);
    }
  },

  async addItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { productId, quantity } = req.body;

      if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Product ID and a positive quantity are required' });
      }

      const cartItem = await cartService.addItemToCart(userId, productId, quantity);
      res.status(201).json(cartItem);
    } catch (error) {
      next(error);
    }
  },

  async updateItemQuantity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { itemId } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity < 0) {
        return res.status(400).json({ message: 'A non-negative quantity is required' });
      }

      const updatedCartItem = await cartService.updateCartItemQuantity(userId, itemId, quantity);
      res.json(updatedCartItem);
    } catch (error: any) {
      if (error.message === 'Cart item not found or does not belong to the user\'s cart') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  },

  async removeItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { itemId } = req.params;

      await cartService.removeCartItem(userId, itemId);
      res.status(204).send(); // No Content
    } catch (error: any) {
      if (error.message === 'Cart item not found or does not belong to the user\'s cart') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  },

  async clearCart(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      await cartService.clearCart(userId);
      res.status(204).send(); // No Content
    } catch (error) {
      next(error);
    }
  },
};
