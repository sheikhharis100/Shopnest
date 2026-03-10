import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const products = [
  // Electronics
  {
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    description: 'The most powerful iPhone ever with A17 Pro chip, titanium design, 48MP camera system, and USB-C connectivity. Features Action Button and ProMotion display.',
    price: 1199,
    originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500',
    category: 'Electronics',
    countInStock: 15,
    rating: 4.8,
    numReviews: 124,
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    description: 'Ultimate Android experience with built-in S Pen, 200MP camera, Snapdragon 8 Gen 3, and 5000mAh battery. Perfect for power users.',
    price: 1099,
    originalPrice: 1199,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500',
    category: 'Electronics',
    countInStock: 10,
    rating: 4.7,
    numReviews: 98,
  },
  {
    name: 'MacBook Pro 14" M3',
    brand: 'Apple',
    description: 'Supercharged by M3 Pro chip, stunning Liquid Retina XDR display, up to 18 hours battery life. The ultimate pro laptop for developers and creators.',
    price: 1999,
    originalPrice: 2199,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
    category: 'Electronics',
    countInStock: 8,
    rating: 4.9,
    numReviews: 76,
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    brand: 'Sony',
    description: 'Industry-leading noise cancellation with 8 microphones, 30-hour battery, crystal clear hands-free calling, and multipoint connection for two devices.',
    price: 329,
    originalPrice: 399,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'Electronics',
    countInStock: 20,
    rating: 4.8,
    numReviews: 215,
  },
  {
    name: 'Samsung 55" 4K QLED Smart TV',
    brand: 'Samsung',
    description: 'Quantum Dot technology delivers brilliant color with 100% Color Volume. Alexa and Google Assistant built-in. Gaming Hub with cloud gaming support.',
    price: 799,
    originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=500',
    category: 'Electronics',
    countInStock: 6,
    rating: 4.6,
    numReviews: 89,
  },
  {
    name: 'iPad Pro 12.9" M2',
    brand: 'Apple',
    description: 'Supercharged by the M2 chip with Liquid Retina XDR display, ProMotion 120Hz, Apple Pencil hover, and Wi-Fi 6E. The most advanced iPad ever.',
    price: 1099,
    originalPrice: 1199,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
    category: 'Electronics',
    countInStock: 12,
    rating: 4.7,
    numReviews: 67,
  },
  {
    name: 'Dell XPS 15 Laptop',
    brand: 'Dell',
    description: 'Intel Core i9 13th Gen, 32GB RAM, 1TB SSD, NVIDIA RTX 4070, 15.6" OLED 3.5K display. The perfect laptop for professionals and gamers.',
    price: 2299,
    originalPrice: 2499,
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500',
    category: 'Electronics',
    countInStock: 5,
    rating: 4.6,
    numReviews: 43,
  },
  {
    name: 'Canon EOS R6 Mark II',
    brand: 'Canon',
    description: '24.2MP full-frame mirrorless camera with 40fps burst shooting, 6K RAW video, in-body stabilization, and dual card slots. Professional photography made easy.',
    price: 2499,
    originalPrice: 2799,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500',
    category: 'Electronics',
    countInStock: 4,
    rating: 4.9,
    numReviews: 31,
  },
  // Footwear
  {
    name: 'Nike Air Max 270',
    brand: 'Nike',
    description: "Inspired by Air Max 93 and 180, the Nike Air Max 270 features Nike's biggest heel Air unit yet for a super comfortable ride all day long.",
    price: 150,
    originalPrice: 180,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    category: 'Footwear',
    countInStock: 30,
    rating: 4.5,
    numReviews: 178,
  },
  {
    name: 'Adidas Ultraboost 23',
    brand: 'Adidas',
    description: 'Responsive BOOST midsole and Primeknit+ upper for the ultimate running experience. Linear Energy Push system returns energy with every stride.',
    price: 190,
    originalPrice: 220,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773d3028?w=500',
    category: 'Footwear',
    countInStock: 25,
    rating: 4.6,
    numReviews: 134,
  },
  {
    name: 'Jordan 1 Retro High OG',
    brand: 'Nike',
    description: 'The shoe that started it all. Classic high-top silhouette with premium leather upper and Air-Sole unit for lasting comfort. An icon reimagined.',
    price: 180,
    originalPrice: 180,
    image: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=500',
    category: 'Footwear',
    countInStock: 18,
    rating: 4.8,
    numReviews: 256,
  },
  {
    name: 'New Balance 990v6',
    brand: 'New Balance',
    description: 'Made in USA. Premium suede and mesh upper with ENCAP midsole technology combining cushioning with support. The perfect everyday sneaker.',
    price: 185,
    originalPrice: 185,
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=500',
    category: 'Footwear',
    countInStock: 14,
    rating: 4.7,
    numReviews: 89,
  },
  // Accessories
  {
    name: 'Apple Watch Series 9',
    brand: 'Apple',
    description: 'The most powerful Apple Watch with S9 SiP chip, Double Tap gesture, brighter always-on display, carbon neutral option, and advanced health sensors.',
    price: 399,
    originalPrice: 429,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    category: 'Accessories',
    countInStock: 22,
    rating: 4.7,
    numReviews: 187,
  },
  {
    name: 'Premium Leather Laptop Bag',
    brand: 'Bellroy',
    description: 'Full-grain leather laptop bag fits up to 16" laptops. Multiple compartments, water-resistant lining, padded shoulder strap. Built to last a lifetime.',
    price: 189,
    originalPrice: 229,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
    category: 'Accessories',
    countInStock: 15,
    rating: 4.5,
    numReviews: 67,
  },
  {
    name: 'Ray-Ban Aviator Classic',
    brand: 'Ray-Ban',
    description: 'Iconic aviator sunglasses with crystal green lenses and gold metal frame. 100% UV protection, classic style that never goes out of fashion.',
    price: 161,
    originalPrice: 180,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
    category: 'Accessories',
    countInStock: 35,
    rating: 4.6,
    numReviews: 203,
  },
  {
    name: 'Anker 65W USB-C Charger',
    brand: 'Anker',
    description: 'Compact 65W GaN charger with 3 ports (2 USB-C + 1 USB-A). Charges MacBook, iPhone, and iPad simultaneously. Travel-friendly foldable plug.',
    price: 45,
    originalPrice: 59,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500',
    category: 'Accessories',
    countInStock: 50,
    rating: 4.6,
    numReviews: 312,
  },
  // Fashion
  {
    name: "Levi's 511 Slim Fit Jeans",
    brand: "Levi's",
    description: 'Sits below waist with slim fit through thigh and leg. Made with stretch denim for comfort and mobility. A modern classic for everyday wear.',
    price: 69,
    originalPrice: 89,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
    category: 'Fashion',
    countInStock: 40,
    rating: 4.4,
    numReviews: 445,
  },
  {
    name: 'The North Face Puffer Jacket',
    brand: 'The North Face',
    description: '700-fill goose down insulation keeps you warm in extreme cold. Water-resistant DWR finish, packable design, and multiple pockets for storage.',
    price: 249,
    originalPrice: 299,
    image: 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=500',
    category: 'Fashion',
    countInStock: 18,
    rating: 4.7,
    numReviews: 156,
  },
  // Home
  {
    name: 'Dyson V15 Detect Vacuum',
    brand: 'Dyson',
    description: 'Laser reveals microscopic dust. Acoustic piezo sensor counts and sizes particles. HEPA filtration captures 99.99% of particles. 60min runtime.',
    price: 749,
    originalPrice: 849,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    category: 'Home',
    countInStock: 9,
    rating: 4.8,
    numReviews: 234,
  },
  {
    name: 'Nespresso Vertuo Next',
    brand: 'Nespresso',
    description: 'Centrifusion technology brews perfect coffee by spinning capsule up to 7000 rotations per minute. 5 cup sizes from espresso to alto. Wi-Fi connected.',
    price: 179,
    originalPrice: 229,
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500',
    category: 'Home',
    countInStock: 16,
    rating: 4.5,
    numReviews: 189,
  },
];

const seedData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@shopnest.com',
      password: bcrypt.hashSync('admin123', 10),
      isAdmin: true,
    });

    const sampleProducts = products.map((p) => ({
      ...p,
      user: adminUser._id,
    }));

    await Product.insertMany(sampleProducts);

    console.log('✅ 20 products seeded successfully!');
    console.log('Admin Email: admin@shopnest.com');
    console.log('Admin Password: admin123');
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedData();