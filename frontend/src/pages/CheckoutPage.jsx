import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastContext.js';
import { FiCheck, FiMapPin, FiCreditCard, FiShoppingBag } from 'react-icons/fi';

const STEPS = ['Shipping', 'Payment', 'Review & Place'];

const CheckoutPage = () => {
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const toast = useToast();

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 9.99;
  const taxPrice = itemsPrice * 0.08;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  if (!userInfo) { navigate('/login'); return null; }
  if (cartItems.length === 0) { navigate('/cart'); return null; }

  const handleNext = () => {
    if (step === 0 && (!address || !city || !postalCode || !country)) {
      toast?.('Please fill in all shipping fields', 'error');
      return;
    }
    setStep(s => s + 1);
  };

  const StepIcon = [FiMapPin, FiCreditCard, FiShoppingBag][step];

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-8 animate-fade-in">
      {/* Step indicator */}
      <div className="flex items-center justify-center mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`flex items-center gap-2 text-sm font-medium transition-all ${
              i < step ? 'text-green-600' : i === step ? 'text-brand-orange' : 'text-gray-400'
            }`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all text-xs font-bold shrink-0 ${
                i < step ? 'bg-green-600 border-green-600 text-white' :
                i === step ? 'border-brand-orange bg-orange-50 text-brand-orange' :
                'border-gray-300 text-gray-400'
              }`}>
                {i < step ? <FiCheck /> : i + 1}
              </span>
              <span className="hidden sm:block">{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 w-16 mx-3 transition-all ${i < step ? 'bg-green-500' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main panel */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            {/* Step 0: Shipping */}
            {step === 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FiMapPin className="text-brand-orange" /> Shipping Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                    <input id="shipping-address" type="text" placeholder="123 Main St" className="input-field"
                      value={address} onChange={e => setAddress(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                      <input id="shipping-city" type="text" placeholder="New York" className="input-field"
                        value={city} onChange={e => setCity(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                      <input id="shipping-postal" type="text" placeholder="10001" className="input-field"
                        value={postalCode} onChange={e => setPostalCode(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                    <input id="shipping-country" type="text" placeholder="United States" className="input-field"
                      value={country} onChange={e => setCountry(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FiCreditCard className="text-brand-orange" /> Payment Method
                </h2>
                <div className="space-y-3">
                  {['Credit Card', 'PayPal', 'Cash on Delivery'].map(method => (
                    <label key={method}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === method ? 'border-brand-orange bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                      <input type="radio" name="payment" value={method}
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                        className="accent-orange-400" />
                      <span className="font-medium text-gray-800">{method}</span>
                    </label>
                  ))}
                  {paymentMethod === 'Credit Card' && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Card Details (Demo)</p>
                      <input type="text" placeholder="1234 5678 9012 3456" className="input-field" maxLength={19} />
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="MM/YY" className="input-field" />
                        <input type="text" placeholder="CVC" className="input-field" maxLength={3} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FiShoppingBag className="text-brand-orange" /> Review Your Order
                </h2>
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-2">Shipping To</h3>
                  <p className="text-gray-800">{address}, {city}, {postalCode}, {country}</p>
                </div>
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-2">Payment</h3>
                  <p className="text-gray-800">{paymentMethod}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-2">Items</h3>
                  <div className="divide-y divide-gray-100">
                    {cartItems.map(item => (
                      <div key={item._id} className="flex items-center gap-3 py-2">
                        <img src={item.image} alt={item.name}
                          className="w-12 h-12 object-contain bg-gray-50 rounded"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }} />
                        <span className="flex-1 text-sm text-gray-800">{item.name} × {item.qty}</span>
                        <span className="font-medium">${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
              {step > 0 ? (
                <button onClick={() => setStep(s => s - 1)} className="btn-navy px-6">← Back</button>
              ) : (
                <div />
              )}
              {step < STEPS.length - 1 ? (
                <button onClick={handleNext} className="btn-orange px-8">Continue →</button>
              ) : (
                <button onClick={() => navigate('/payment')}
                  className="btn-orange px-8 py-3 text-base font-semibold">
                  🔒 Proceed to Payment
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Summary sidebar */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-5 sticky top-24">
            <h3 className="font-bold text-gray-900 text-base mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              {cartItems.map(item => (
                <div key={item._id} className="flex justify-between text-gray-700">
                  <span className="line-clamp-1 flex-1 mr-2">{item.name} ×{item.qty}</span>
                  <span className="shrink-0">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <hr className="my-2" />
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span><span>${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shippingPrice === 0 ? <span className="text-green-600">FREE</span> : `$${shippingPrice.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (8%)</span><span>${taxPrice.toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span><span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;