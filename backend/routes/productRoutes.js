import express from 'express';
import {
  getProducts, getTopProducts, getProductById,
  createProduct, updateProduct, deleteProduct, createReview, getAdminStats
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/top', getTopProducts);
router.get('/stats', protect, admin, getAdminStats);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.post('/:id/reviews', protect, createReview);

export default router;