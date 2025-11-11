import { Router } from 'express';
import { categoryController } from '../controllers/categoryController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';

const router = Router();

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  categoryController.createCategory
);
router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  categoryController.updateCategory
);
router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  categoryController.deleteCategory
);

export default router;
