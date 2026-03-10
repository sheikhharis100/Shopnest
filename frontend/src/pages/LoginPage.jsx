import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials } from '../redux/slices/authSlice.js';
import api from '../utils/api.js';
import { FiMail, FiLock, FiEye, FiEyeOff, FiShoppingCart } from 'react-icons/fi';
import { useToast } from '../components/ToastContext.js';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await api.post('/auth/login', { email, password });
      dispatch(setCredentials(data));
      toast?.(`Welcome back, ${data.name}!`, 'success');
      navigate('/');
    } catch (err) {
      toast?.(err.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => navigate('/')}>
        <FiShoppingCart className="text-brand-orange text-3xl" />
        <span className="text-2xl font-bold text-gray-900">ShopNest</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input id="login-email" type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input id="login-password" type={showPass ? 'text' : 'password'} required
                value={password} onChange={e => setPassword(e.target.value)}
                className="input-field pl-10 pr-10"
                placeholder="••••••••" />
              <button type="button" onClick={() => setShowPass(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="btn-orange w-full py-3 text-base font-semibold disabled:opacity-60 mt-2">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            New to ShopNest?{' '}
            <Link to="/register" className="text-brand-blue font-medium hover:underline">Create account</Link>
          </p>
        </div>
      </div>

      <p className="mt-6 text-xs text-gray-400 text-center">
        By signing in, you agree to ShopNest's Terms of Use and Privacy Notice.
      </p>
    </div>
  );
};

export default LoginPage;