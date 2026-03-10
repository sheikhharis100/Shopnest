import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice.js';
import api from '../utils/api.js';
import Loader from '../components/Loader.jsx';
import Message from '../components/Message.jsx';
import Rating from '../components/Rating.jsx';
import { useToast } from '../components/ToastContext.js';
import { FiShoppingCart, FiZap, FiArrowLeft, FiStar } from 'react-icons/fi';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { userInfo } = useSelector(state => state.auth);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch {
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchProduct(); }, [fetchProduct]);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, qty }));
    toast?.(`Added to cart!`, 'success');
    navigate('/cart');
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/checkout');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!userInfo) { navigate('/login'); return; }
    try {
      setReviewLoading(true);
      await api.post(`/products/${id}/reviews`, { rating: reviewRating, comment: reviewComment });
      toast?.('Review submitted!', 'success');
      setReviewComment('');
      fetchProduct();
    } catch (err) {
      toast?.(err.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <div className="py-20"><Loader /></div>;
  if (error) return <div className="max-w-screen-xl mx-auto px-4 py-8"><Message type="error">{error}</Message></div>;

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const TABS = [
    { key: 'description', label: 'Description' },
    { key: 'specs', label: 'Specifications' },
    { key: 'reviews', label: `Reviews (${product.numReviews})` },
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 animate-fade-in">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-brand-blue hover:underline text-sm mb-6">
        <FiArrowLeft /> Back to results
      </button>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image */}
          <div className="relative">
            {discount > 0 && (
              <span className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded z-10">
                -{discount}% OFF
              </span>
            )}
            <div className="bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center h-96">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain p-4"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=No+Image'; }}
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4">
            {product.brand && (
              <p className="text-brand-blue font-medium text-sm">{product.brand}</p>
            )}
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{product.name}</h1>

            <Rating value={product.rating} numReviews={product.numReviews} size="lg" />

            <hr />

            {/* Price */}
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  <span className="text-lg align-top">$</span>{product.price.toFixed(2)}
                </span>
                {discount > 0 && (
                  <span className="text-gray-400 line-through text-lg">${product.originalPrice?.toFixed(2)}</span>
                )}
                {discount > 0 && (
                  <span className="text-red-600 text-sm font-semibold">Save {discount}%</span>
                )}
              </div>
              {product.countInStock > 0 ? (
                <p className="text-green-600 font-semibold text-sm mt-1">✓ In Stock ({product.countInStock} available)</p>
              ) : (
                <p className="text-red-600 font-semibold text-sm mt-1">✗ Out of Stock</p>
              )}
            </div>

            <hr />

            {/* Qty + Buttons */}
            {product.countInStock > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">Qty:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="px-3 py-1.5 hover:bg-gray-100 font-bold text-gray-600 transition">−</button>
                    <span className="px-4 py-1.5 border-x border-gray-300 text-sm font-medium">{qty}</span>
                    <button onClick={() => setQty(q => Math.min(product.countInStock, q + 1))}
                      className="px-3 py-1.5 hover:bg-gray-100 font-bold text-gray-600 transition">+</button>
                  </div>
                </div>
                <button onClick={handleAddToCart}
                  className="btn-orange w-full flex items-center justify-center gap-2 py-3">
                  <FiShoppingCart /> Add to Cart
                </button>
                <button onClick={handleBuyNow}
                  className="btn-navy w-full flex items-center justify-center gap-2 py-3">
                  <FiZap /> Buy Now
                </button>
              </div>
            )}
            {product.countInStock === 0 && (
              <button disabled className="w-full py-3 rounded-lg border border-gray-200 text-gray-400 cursor-not-allowed">
                Currently Unavailable
              </button>
            )}

            <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-1">
              <p>✓ Free shipping on orders over $100</p>
              <p>✓ 30-day return policy</p>
              <p>✓ Secure payment</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200">
          {TABS.map(tab => (
            <button key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-4 text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'border-b-2 border-brand-orange text-brand-orange'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'description' && (
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</p>
          )}
          {activeTab === 'specs' && (
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                {[
                  ['Brand', product.brand],
                  ['Category', product.category],
                  ['In Stock', product.countInStock],
                  ['Rating', `${product.rating?.toFixed(1)} / 5`],
                  ['Reviews', product.numReviews],
                ].map(([key, val]) => (
                  <tr key={key}>
                    <td className="py-2.5 pr-4 font-medium text-gray-600 w-36">{key}</td>
                    <td className="py-2.5 text-gray-800">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {product.reviews?.length === 0 && (
                <p className="text-gray-500">No reviews yet. Be the first!</p>
              )}
              {product.reviews?.map((r, i) => (
                <div key={i} className="border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Rating value={r.rating} />
                    <span className="font-medium text-sm text-gray-800">{r.name}</span>
                    <span className="text-xs text-gray-400">{r.createdAt?.substring(0, 10)}</span>
                  </div>
                  <p className="text-gray-700 text-sm">{r.comment}</p>
                </div>
              ))}

              {/* Review form */}
              <div className="mt-6 border-t pt-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiStar className="text-yellow-400" /> Write a Review
                </h3>
                {!userInfo ? (
                  <p className="text-sm text-gray-500">
                    <button onClick={() => navigate('/login')} className="text-brand-blue hover:underline">Sign in</button> to write a review.
                  </p>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(s => (
                          <button key={s} type="button" onClick={() => setReviewRating(s)}
                            className={`text-2xl transition ${s <= reviewRating ? 'text-yellow-400' : 'text-gray-300'}`}>
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                      <textarea
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        required
                        rows={4}
                        className="input-field resize-none"
                        placeholder="Share your experience with this product..."
                      />
                    </div>
                    <button type="submit" disabled={reviewLoading}
                      className="btn-orange px-6 disabled:opacity-60">
                      {reviewLoading ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;