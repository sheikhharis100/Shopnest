import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice';
import api from '../utils/api';

const MockPaymentPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);
  const tax = (totalPrice * 0.1).toFixed(2);
  const grandTotal = (parseFloat(totalPrice) + parseFloat(tax)).toFixed(2);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) return v.substring(0, 2) + '/' + v.substring(2, 4);
    return v;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!cardName || !cardNumber || !expiry || !cvv) {
      setError('Please fill in all card details');
      return;
    }
    if (cardNumber.replace(/\s/g, '').length < 16) {
      setError('Please enter a valid 16-digit card number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create order in database
      const orderData = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item._id,
        })),
        shippingAddress: {
          address: '123 Main St',
          city: 'Karachi',
          postalCode: '75000',
          country: 'Pakistan',
        },
        paymentMethod: 'Mock Card Payment',
        itemsPrice: totalPrice,
        taxPrice: tax,
        shippingPrice: 0,
        totalPrice: grandTotal,
        isPaid: true,
        paidAt: new Date(),
      };

      const { data } = await api.post('/orders', orderData);
      dispatch(clearCart());
      navigate(`/order/${data._id}`);
    } catch {
      setError('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Payment Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Details</h2>
          <p className="text-gray-500 text-sm mb-6">Complete your purchase securely</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handlePayment} className="space-y-5">
            {/* Card Icons */}
            <div className="flex gap-2 mb-2">
              <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded">VISA</div>
              <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded">MC</div>
              <div className="bg-blue-400 text-white text-xs font-bold px-3 py-1 rounded">AMEX</div>
            </div>

            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg tracking-widest"
                />
                <span className="absolute right-3 top-3 text-gray-400 text-xl">💳</span>
              </div>
            </div>

            {/* Card Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
              <input
                type="text"
                placeholder="Muhammad Haris"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Expiry + CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength={5}
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input
                  type="password"
                  placeholder="•••"
                  maxLength={4}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Pay Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-bold py-4 rounded-xl text-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Processing Payment...
                </>
              ) : (
                <>🔒 Pay ${grandTotal}</>
              )}
            </button>

            <p className="text-center text-xs text-gray-400 mt-2">
              🔐 Your payment information is encrypted and secure
            </p>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-8 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg"/>
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-800">{item.name}</p>
                  <p className="text-gray-500 text-xs">Qty: {item.qty}</p>
                </div>
                <p className="font-semibold text-gray-800">${(item.price * item.qty).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>${totalPrice}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">FREE</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax (10%)</span>
              <span>${tax}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-800 border-t pt-3 mt-2">
              <span>Total</span>
              <span>${grandTotal}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MockPaymentPage;
