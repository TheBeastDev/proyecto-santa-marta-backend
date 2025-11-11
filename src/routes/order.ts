import { Router } from 'express';
import { orderController } from '../controllers/orderController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';

const router = Router();

// All order routes require authentication
router.use(authMiddleware);

// POST /api/orders - Create a new order from the cart
router.post('/', orderController.createOrder);

// GET /api/orders/my-orders - Get the order history for the authenticated user
router.get('/my-orders', orderController.getMyOrders);

// --- Admin Routes ---

// GET /api/orders - Get all orders (admin only)
router.get('/', adminMiddleware, orderController.getAllOrders);

// GET /api/orders/:id - Get a specific order by ID (admin or owner)
router.get('/:id', orderController.getOrderById);

// PUT /api/orders/:id/status - Update the status of an order (admin only)
router.put('/:id/status', adminMiddleware, orderController.updateStatus);

export default router;
