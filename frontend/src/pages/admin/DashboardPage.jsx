import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api.js';
import Loader from '../../components/Loader.jsx';
import { FiDollarSign, FiShoppingBag, FiUsers, FiPackage, FiArrowRight } from 'react-icons/fi';

const StatCard = ({ label, value, icon, color, prefix = '' }) => {
  const StatIcon = icon;
  return (
  <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shrink-0`}>
      <StatIcon className="text-white text-xl" />
    </div>
    <div>
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{prefix}{typeof value === 'number' ? value.toLocaleString() : value}</p>
    </div>
  </div>
  );
};

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/products/stats');
        setStats(data);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="py-20"><Loader /></div>;

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Revenue" value={stats?.revenue?.toFixed(2) || '0.00'} icon={FiDollarSign} color="bg-green-500" prefix="$" />
        <StatCard label="Total Orders" value={stats?.totalOrders || 0} icon={FiPackage} color="bg-blue-500" />
        <StatCard label="Total Users" value={stats?.totalUsers || 0} icon={FiUsers} color="bg-purple-500" />
        <StatCard label="Products" value={stats?.totalProducts || 0} icon={FiShoppingBag} color="bg-orange-500" />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <button onClick={() => navigate('/admin/orders')}
            className="text-brand-blue text-sm hover:underline flex items-center gap-1">
            View all <FiArrowRight />
          </button>
        </div>
        {stats?.recentOrders?.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-5 py-3 text-left">Order ID</th>
                  <th className="px-5 py-3 text-left">Customer</th>
                  <th className="px-5 py-3 text-left">Date</th>
                  <th className="px-5 py-3 text-left">Total</th>
                  <th className="px-5 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats?.recentOrders?.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => navigate(`/order/${order._id}`)}>
                    <td className="px-5 py-3 font-mono text-xs text-gray-500">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="px-5 py-3 text-gray-800">{order.user?.name || 'N/A'}</td>
                    <td className="px-5 py-3 text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3 font-semibold">${order.totalPrice?.toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        order.isDelivered ? 'bg-green-100 text-green-700' :
                        order.isPaid ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.isDelivered ? 'Delivered' : order.isPaid ? 'Processing' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
