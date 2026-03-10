import express from 'express';
import {
  createOrder, getMyOrders, getOrderById,
  getAllOrders, updateOrderStatus, markOrderDelivered, markOrderPaid
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/mine', protect, getMyOrders);
router.get('/', protect, admin, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id/deliver', protect, admin, markOrderDelivered);
router.put('/:id/pay', protect, markOrderPaid);

export default router;