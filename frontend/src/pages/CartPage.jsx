import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, addToCart } from '../redux/slices/cartSlice.js';
import { FiTrash2, FiArrowRight, FiShoppingBag } from 'react-icons/fi';

const CartPage = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 9.99;
  const taxPrice = itemsPrice * 0.08;
  const total = itemsPrice + shippingPrice + taxPrice;

  const updateQty = (item, qty) => {
    if (qty < 1) return;
    dispatch(addToCart({ ...item, qty }));
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-16 text-center">
          <FiShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
          <button onClick={() => navigate('/')} className="btn-orange px-8 py-3">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
              {cartItems.map(item => (
                <div key={item._id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition">
                  {/* Image */}
                  <div className="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden shrink-0 cursor-pointer"
                    onClick={() => navigate(`/product/${item._id}`)}>
                    <img src={item.image} alt={item.name}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/100'; }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 hover:text-brand-blue cursor-pointer line-clamp-2 text-sm"
                      onClick={() => navigate(`/product/${item._id}`)}>
                      {item.name}
                    </p>
                    {item.brand && <p className="text-xs text-gray-500 mt-0.5">{item.brand}</p>}
                    {item.countInStock > 0 && item.countInStock <= 5 && (
                      <p className="text-xs text-red-600 mt-1">Only {item.countInStock} left</p>
                    )}
                    <p className="text-green-600 text-xs mt-1">In Stock</p>
                  </div>

                  {/* Qty controls */}
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shrink-0">
                    <button onClick={() => updateQty(item, item.qty - 1)}
                      disabled={item.qty <= 1}
                      className="px-2.5 py-1.5 hover:bg-gray-100 font-bold text-gray-600 disabled:opacity-40 transition text-sm">
                      −
                    </button>
                    <span className="px-3 py-1.5 border-x border-gray-300 text-sm font-medium min-w-8 text-center">
                      {item.qty}
                    </span>
                    <button onClick={() => updateQty(item, item.qty + 1)}
                      disabled={item.qty >= item.countInStock}
                      className="px-2.5 py-1.5 hover:bg-gray-100 font-bold text-gray-600 disabled:opacity-40 transition text-sm">
                      +
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0 min-w-20">
                    <p className="font-bold text-gray-900">${(item.price * item.qty).toFixed(2)}</p>
                    <p className="text-xs text-gray-500">${item.price.toFixed(2)} each</p>
                  </div>

                  {/* Delete */}
                  <button onClick={() => dispatch(removeFromCart(item._id))}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 text-right text-sm text-gray-500">
              Subtotal ({cartItems.reduce((a, i) => a + i.qty, 0)} items):
              <span className="font-bold text-gray-900 ml-1 text-base">${itemsPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              {itemsPrice > 100 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-sm text-green-700">
                  ✓ Your order qualifies for <strong>FREE Shipping</strong>!
                </div>
              )}
              {itemsPrice <= 100 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-sm text-yellow-700">
                  Add <strong>${(100 - itemsPrice).toFixed(2)}</strong> more for FREE shipping!
                </div>
              )}

              <h3 className="font-bold text-gray-900 mb-4 text-lg">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.reduce((a, i) => a + i.qty, 0)} items)</span>
                  <span>${itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shippingPrice === 0 ? <span className="text-green-600">FREE</span> : `$${shippingPrice.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Tax</span>
                  <span>${taxPrice.toFixed(2)}</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between font-bold text-gray-900 text-base">
                  <span>Order Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <button onClick={() => navigate('/checkout')}
                className="btn-orange w-full py-3 mt-6 flex items-center justify-center gap-2 text-base">
                Proceed to Checkout <FiArrowRight />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;