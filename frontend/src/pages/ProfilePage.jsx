import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api.js';
import { setCredentials } from '../redux/slices/authSlice.js';
import Loader from '../components/Loader.jsx';
import { useToast } from '../components/ToastContext.js';
import { FiUser, FiMail, FiLock, FiEdit3, FiPackage } from 'react-icons/fi';

const ProfilePage = () => {
  const { userInfo } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!userInfo) { navigate('/login'); return; }
    setName(userInfo.name);
    setEmail(userInfo.email);
    const fetch = async () => {
      try {
        const { data } = await api.get('/orders/mine');
        setOrders(data);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetch();
  }, [userInfo, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const { data } = await api.put('/users/profile', { name, email, ...(password && { password }) });
      dispatch(setCredentials({ ...userInfo, ...data }));
      toast?.('Profile updated!', 'success');
      setPassword('');
      setEditMode(false);
    } catch (err) {
      toast?.(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const STATUS_COLOR = {
    Placed: 'badge-blue',
    Processing: 'badge-yellow',
    Shipped: 'badge-yellow',
    Delivered: 'badge-green',
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Account</h1>
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Profile sidebar */}
        <div className="lg:w-80 shrink-0 space-y-4">
          {/* Avatar card */}
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-3xl font-bold">
                {userInfo?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <h2 className="font-bold text-gray-900 text-lg">{userInfo?.name}</h2>
            <p className="text-gray-500 text-sm">{userInfo?.email}</p>
            {userInfo?.isAdmin && (
              <span className="inline-block mt-2 badge-yellow">Admin</span>
            )}
          </div>

          {/* Edit form */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Account Info</h3>
              <button onClick={() => setEditMode(e => !e)}
                className="text-brand-blue text-sm hover:underline flex items-center gap-1">
                <FiEdit3 /> {editMode ? 'Cancel' : 'Edit'}
              </button>
            </div>
            {editMode ? (
              <form onSubmit={handleUpdate} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input type="text" className="input-field pl-9" value={name}
                      onChange={e => setName(e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input type="email" className="input-field pl-9" value={email}
                      onChange={e => setEmail(e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">New Password <span className="text-gray-400">(optional)</span></label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input type="password" className="input-field pl-9" value={password}
                      onChange={e => setPassword(e.target.value)} placeholder="Leave blank to keep" />
                  </div>
                </div>
                <button type="submit" disabled={saving}
                  className="btn-orange w-full py-2.5 disabled:opacity-60">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <FiUser className="text-gray-400 shrink-0" />
                  <span>{userInfo?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <FiMail className="text-gray-400 shrink-0" />
                  <span>{userInfo?.email}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Orders panel */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <FiPackage className="text-brand-orange" />
              <h3 className="font-bold text-gray-900">My Orders</h3>
              <span className="ml-auto badge-blue">{orders.length} orders</span>
            </div>
            {ordersLoading ? (
              <div className="py-10"><Loader /></div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16">
                <FiPackage className="text-5xl text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500">You haven't placed any orders yet.</p>
                <button onClick={() => navigate('/')} className="btn-orange mt-4 px-6">Start Shopping</button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
                    <tr>
                      <th className="px-5 py-3 text-left">Order ID</th>
                      <th className="px-5 py-3 text-left">Date</th>
                      <th className="px-5 py-3 text-left">Total</th>
                      <th className="px-5 py-3 text-left">Payment</th>
                      <th className="px-5 py-3 text-left">Status</th>
                      <th className="px-5 py-3 text-left">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map(order => (
                      <tr key={order._id} className="hover:bg-gray-50 transition">
                        <td className="px-5 py-3 font-mono text-xs text-gray-500">#{order._id.slice(-8).toUpperCase()}</td>
                        <td className="px-5 py-3 text-gray-700">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3 font-semibold">${order.totalPrice?.toFixed(2)}</td>
                        <td className="px-5 py-3">
                          <span className={order.isPaid ? 'badge-green' : 'badge-red'}>
                            {order.isPaid ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span className={STATUS_COLOR[order.status] || 'badge-blue'}>
                            {order.status || 'Placed'}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <button onClick={() => navigate(`/order/${order._id}`)}
                            className="text-brand-blue hover:underline text-xs font-medium">
                            View →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;