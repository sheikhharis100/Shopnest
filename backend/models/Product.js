import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  brand: { type: String, default: 'ShopNest' },
  category: { type: String, required: true },
  description: { type: String, required: true },
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  price: { type: Number, required: true, default: 0 },
  originalPrice: { type: Number, default: 0 },
  countInStock: { type: Number, required: true, default: 0 },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);