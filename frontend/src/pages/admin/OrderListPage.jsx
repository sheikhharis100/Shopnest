import { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api.js';
import Loader from '../../components/Loader.jsx';
import { useToast } from '../../components/ToastContext.js';
import { useNavigate } from 'react-router-dom';
import { FiTruck } from 'react-icons/fi';

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch {
      toast?.('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const markDelivered = async (id) => {
    try {
      await api.put(`/orders/${id}/deliver`);
      toast?.('Order marked as delivered', 'success');
      fetchOrders();
    } catch {
      toast?.('Failed to update order', 'error');
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        All Orders <span className="text-gray-400 text-lg font-normal">({orders.length})</span>
      </h1>

      {loading ? <Loader /> : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-5 py-3 text-left">Order ID</th>
                  <th className="px-5 py-3 text-left">Customer</th>
                  <th className="px-5 py-3 text-left">Date</th>
                  <th className="px-5 py-3 text-left">Total</th>
                  <th className="px-5 py-3 text-left">Paid</th>
                  <th className="px-5 py-3 text-left">Delivered</th>
                  <th className="px-5 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.length === 0 ? (
                  <tr><td colSpan={7} className="px-5 py-10 text-center text-gray-400">No orders yet</td></tr>
                ) : orders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3 font-mono text-xs text-gray-500">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="px-5 py-3 text-gray-800">{order.user?.name || 'N/A'}</td>
                    <td className="px-5 py-3 text-gray-600">{order.createdAt?.substring(0, 10)}</td>
                    <td className="px-5 py-3 font-semibold">${order.totalPrice?.toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <span className={order.isPaid ? 'badge-green' : 'badge-red'}>
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={order.isDelivered ? 'badge-green' : 'badge-yellow'}>
                        {order.isDelivered ? 'Delivered' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate(`/order/${order._id}`)}
                          className="text-xs text-brand-blue hover:underline">View</button>
                        {!order.isDelivered && (
                          <button onClick={() => markDelivered(order._id)}
                            className="flex items-center gap-1 text-xs bg-green-100 text-green-700 hover:bg-green-200 px-2 py-1 rounded transition">
                            <FiTruck /> Deliver
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderListPage;