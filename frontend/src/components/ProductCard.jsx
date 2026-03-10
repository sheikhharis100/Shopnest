import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice.js';
import { useNavigate } from 'react-router-dom';
import Rating from './Rating.jsx';
import { FiShoppingCart, FiZap } from 'react-icons/fi';
import { useToast } from './ToastContext.js';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart({ ...product, qty: 1 }));
    toast?.(`"${product.name}" added to cart`, 'success');
  };

  return (
    <div
      className="bg-white rounded-xl overflow-hidden hover:shadow-product-hover shadow-product transition-all duration-300 cursor-pointer group flex flex-col"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 h-52">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'; }}
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
            -{discount}%
          </span>
        )}
        {product.countInStock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-red-600 font-bold text-sm">Out of Stock</span>
          </div>
        )}
        {/* Quick add overlay */}
        {product.countInStock > 0 && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-brand-orange hover:bg-brand-orange-dark text-gray-900 text-xs font-medium px-4 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap shadow-lg flex items-center gap-1.5"
          >
            <FiShoppingCart className="text-sm" /> Quick Add
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {product.brand && (
          <p className="text-xs text-brand-blue font-medium mb-1">{product.brand}</p>
        )}
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug mb-2 hover:text-brand-blue transition-colors">
          {product.name}
        </h3>

        <Rating value={product.rating} numReviews={product.numReviews} />

        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">
              <span className="text-sm align-top font-normal">$</span>{product.price.toFixed(2)}
            </span>
            {discount > 0 && (
              <span className="text-sm text-gray-400 line-through">${product.originalPrice?.toFixed(2)}</span>
            )}
          </div>
          {product.countInStock > 0 && product.countInStock <= 5 && (
            <p className="text-xs text-red-600 mt-1 font-medium">Only {product.countInStock} left!</p>
          )}
        </div>

        {product.countInStock > 0 && (
          <button
            onClick={handleAddToCart}
            className="btn-orange w-full mt-3 text-sm flex items-center justify-center gap-2"
          >
            <FiShoppingCart /> Add to Cart
          </button>
        )}
        {product.countInStock === 0 && (
          <button disabled className="w-full mt-3 py-2 px-4 rounded-lg border border-gray-200 text-sm text-gray-400 cursor-not-allowed">
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;