import { Router } from 'express';
import { cartController } from '../controllers/cartController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// All cart routes require authentication
router.use(authMiddleware);

router.get('/', cartController.getCart);
router.post('/items', cartController.addItem);
router.put('/items/:itemId', cartController.updateItemQuantity);
router.delete('/items/:itemId', cartController.removeItem);
router.delete('/', cartController.clearCart); // Optional: to clear the entire cart

export default router;
