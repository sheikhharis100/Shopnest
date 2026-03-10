import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import userRoutes from './routes/userRoutes.js';
import Product from './models/Product.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';
dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => res.send('ShopNest API is running...'));
app.get('/api/seed', async (req, res) => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    const admin = await User.create({ name: 'Admin', email: 'admin@shopnest.com', password: bcrypt.hashSync('admin123', 10), isAdmin: true });
    const products = [
      { name: 'iPhone 15 Pro Max', brand: 'Apple', description: 'A17 Pro chip, titanium design', price: 1199, originalPrice: 1299, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500', category: 'Electronics', countInStock: 15, rating: 4.8, numReviews: 124, user: admin._id },
      { name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', description: 'Built-in S Pen, 200MP camera', price: 1099, originalPrice: 1199, image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500', category: 'Electronics', countInStock: 10, rating: 4.7, numReviews: 98, user: admin._id },
      { name: 'MacBook Pro 14" M3', brand: 'Apple', description: 'M3 Pro chip, Liquid Retina XDR', price: 1999, originalPrice: 2199, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', category: 'Electronics', countInStock: 8, rating: 4.9, numReviews: 76, user: admin._id },
      { name: 'Sony WH-1000XM5', brand: 'Sony', description: 'Industry-leading noise cancellation', price: 329, originalPrice: 399, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', category: 'Electronics', countInStock: 20, rating: 4.8, numReviews: 215, user: admin._id },
      { name: 'Samsung 55" 4K QLED TV', brand: 'Samsung', description: 'Quantum Dot technology', price: 799, originalPrice: 999, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=500', category: 'Electronics', countInStock: 6, rating: 4.6, numReviews: 89, user: admin._id },
      { name: 'Nike Air Max 270', brand: 'Nike', description: 'Biggest heel Air unit yet', price: 150, originalPrice: 180, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', category: 'Footwear', countInStock: 30, rating: 4.5, numReviews: 178, user: admin._id },
      { name: 'Adidas Ultraboost 23', brand: 'Adidas', description: 'Responsive BOOST midsole', price: 190, originalPrice: 220, image: 'https://images.unsplash.com/photo-1608231387042-66d1773d3028?w=500', category: 'Footwear', countInStock: 25, rating: 4.6, numReviews: 134, user: admin._id },
      { name: 'Jordan 1 Retro High OG', brand: 'Nike', description: 'Classic high-top silhouette', price: 180, originalPrice: 180, image: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=500', category: 'Footwear', countInStock: 18, rating: 4.8, numReviews: 256, user: admin._id },
      { name: 'Apple Watch Series 9', brand: 'Apple', description: 'Double Tap gesture, S9 chip', price: 399, originalPrice: 429, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', category: 'Accessories', countInStock: 22, rating: 4.7, numReviews: 187, user: admin._id },
      { name: 'Ray-Ban Aviator Classic', brand: 'Ray-Ban', description: '100% UV protection', price: 161, originalPrice: 180, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', category: 'Accessories', countInStock: 35, rating: 4.6, numReviews: 203, user: admin._id },
      { name: "Levi's 511 Slim Fit Jeans", brand: "Levi's", description: 'Stretch denim for comfort', price: 69, originalPrice: 89, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', category: 'Fashion', countInStock: 40, rating: 4.4, numReviews: 445, user: admin._id },
      { name: 'The North Face Puffer Jacket', brand: 'The North Face', description: '700-fill goose down insulation', price: 249, originalPrice: 299, image: 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=500', category: 'Fashion', countInStock: 18, rating: 4.7, numReviews: 156, user: admin._id },
      { name: 'Dyson V15 Detect Vacuum', brand: 'Dyson', description: 'Laser reveals microscopic dust', price: 749, originalPrice: 849, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', category: 'Home', countInStock: 9, rating: 4.8, numReviews: 234, user: admin._id },
      { name: 'Nespresso Vertuo Next', brand: 'Nespresso', description: 'Centrifusion technology', price: 179, originalPrice: 229, image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500', category: 'Home', countInStock: 16, rating: 4.5, numReviews: 189, user: admin._id },
    ];
    await Product.insertMany(products);
    res.json({ message: '✅ 14 products seeded!' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));