import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api.js';
import Loader from '../components/Loader.jsx';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiHome } from 'react-icons/fi';

const STATUS_STEPS = [
  { key: 'Placed', label: 'Order Placed', icon: FiPackage },
  { key: 'Processing', label: 'Processing', icon: FiClock },
  { key: 'Shipped', label: 'Shipped', icon: FiTruck },
  { key: 'Delivered', label: 'Delivered', icon: FiCheckCircle },
];

const OrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch {
        navigate('/profile');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  if (loading) return <div className="py-20"><Loader /></div>;
  if (!order) return null;

  const currentStatusIndex = STATUS_STEPS.findIndex(s => s.key === (order.status || 'Placed'));
  const activeStep = currentStatusIndex === -1 ? 0 : currentStatusIndex;

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Confirmed! 🎉</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Order <span className="font-mono font-medium text-gray-800">#{order._id}</span> &bull;
          Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Status Timeline */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-6">Order Status</h2>
        <div className="flex items-start justify-between relative">
          {/* Connecting line */}
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200 z-0" />
          <div
            className="absolute top-5 left-5 h-0.5 bg-green-500 z-0 transition-all duration-700"
            style={{ width: `${(activeStep / (STATUS_STEPS.length - 1)) * 100}%` }}
          />

          {STATUS_STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = i < activeStep;
            const active = i === activeStep;
            return (
              <div key={s.key} className="flex flex-col items-center gap-2 z-10 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  done ? 'bg-green-500 border-green-500 text-white' :
                  active ? 'bg-brand-orange border-brand-orange text-white' :
                  'bg-white border-gray-300 text-gray-400'
                }`}>
                  <Icon className="text-base" />
                </div>
                <span className={`text-xs font-medium text-center ${
                  done || active ? 'text-gray-800' : 'text-gray-400'
                }`}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Shipping */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FiHome className="text-brand-orange" /> Shipping Address
          </h3>
          <p className="text-gray-700 text-sm">{order.shippingAddress?.address}</p>
          <p className="text-gray-700 text-sm">{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
          <p className="text-gray-700 text-sm">{order.shippingAddress?.country}</p>
          <div className="mt-3 pt-3 border-t">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
              order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {order.isDelivered ? `Delivered ${new Date(order.deliveredAt).toLocaleDateString()}` : 'Not yet delivered'}
            </span>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FiPackage className="text-brand-orange" /> Payment
          </h3>
          <p className="text-gray-700 text-sm">Method: <strong>{order.paymentMethod || 'Card'}</strong></p>
          <div className="mt-3 pt-3 border-t">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
              order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {order.isPaid ? `Paid ${new Date(order.paidAt).toLocaleDateString()}` : 'Not Paid'}
            </span>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <h3 className="font-bold text-gray-900 mb-4">Items Ordered</h3>
        <div className="divide-y divide-gray-100">
          {order.orderItems?.map((item, i) => (
            <div key={i} className="flex items-center gap-4 py-3">
              <img src={item.image} alt={item.name}
                className="w-14 h-14 object-contain bg-gray-50 rounded"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/56'; }} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">Qty: {item.qty} × ${item.price?.toFixed(2)}</p>
              </div>
              <p className="font-bold text-gray-900">${(item.price * item.qty).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Price breakdown */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <h3 className="font-bold text-gray-900 mb-3">Order Total</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Items</span><span>${order.itemsPrice?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>{order.shippingPrice === 0 ? <span className="text-green-600">FREE</span> : `$${order.shippingPrice?.toFixed(2)}`}</span>
          </div>
          {order.taxPrice > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Tax</span><span>${order.taxPrice?.toFixed(2)}</span>
            </div>
          )}
          <hr />
          <div className="flex justify-between font-bold text-gray-900 text-base">
            <span>Total</span><span>${order.totalPrice?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button onClick={() => navigate('/')}
        className="btn-orange w-full py-3 text-base">
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderPage;