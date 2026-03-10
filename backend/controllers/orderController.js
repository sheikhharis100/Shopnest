import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;
  if (!orderItems || orderItems.length === 0)
    return res.status(400).json({ message: 'No order items' });
  const order = new Order({
    user: req.user._id, orderItems, shippingAddress,
    paymentMethod: paymentMethod || 'Card',
    itemsPrice, shippingPrice, taxPrice: taxPrice || 0, totalPrice,
  });
  const created = await order.save();
  res.status(201).json(created);
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (order) res.json(order);
  else res.status(404).json({ message: 'Order not found' });
};

export const getAllOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
};

export const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.status = req.body.status || order.status;
    order.isDelivered = req.body.status === 'Delivered';
    order.deliveredAt = req.body.status === 'Delivered' ? Date.now() : order.deliveredAt;
    const updated = await order.save();
    res.json(updated);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

export const markOrderDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'Delivered';
    const updated = await order.save();
    res.json(updated);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

export const markOrderPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = req.body;
    order.status = 'Processing';
    const updated = await order.save();
    res.json(updated);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};