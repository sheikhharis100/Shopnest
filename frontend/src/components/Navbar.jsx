import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice.js';
import {
  FiShoppingCart, FiUser, FiSearch, FiMenu, FiX,
  FiChevronDown, FiPackage, FiLogOut, FiSettings
} from 'react-icons/fi';

const CATEGORIES = ['Electronics', 'Footwear', 'Accessories', 'Fashion', 'Home', 'Sports'];

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?keyword=${search}&category=${category === 'All' ? '' : category}`);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setAccountOpen(false);
  };

  useEffect(() => {
    const handler = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 shadow-nav">
      {/* Main Nav */}
      <nav className="bg-brand-navy text-white">
        <div className="max-w-screen-2xl mx-auto px-4 py-2 flex items-center gap-3">
          {/* Logo */}
          <button onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-white hover:text-yellow-400 transition shrink-0 border border-transparent hover:border-gray-500 rounded px-2 py-1">
            <FiShoppingCart className="text-brand-orange text-2xl" />
            <span className="text-xl font-bold tracking-tight">ShopNest</span>
          </button>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 flex hidden sm:flex rounded-lg overflow-hidden shadow">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-gray-200 text-gray-700 text-sm px-2 border-r border-gray-300 focus:outline-none cursor-pointer"
            >
              <option>All</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ShopNest..."
              className="flex-1 px-4 py-2 text-gray-900 text-sm focus:outline-none"
              id="navbar-search"
            />
            <button type="submit"
              className="bg-brand-orange hover:bg-brand-orange-dark px-4 text-gray-900 transition">
              <FiSearch className="text-lg" />
            </button>
          </form>

          {/* Right side */}
          <div className="flex items-center gap-1 ml-auto sm:ml-0 shrink-0">
            {/* Account */}
            <div ref={accountRef} className="relative">
              <button
                onClick={() => setAccountOpen(o => !o)}
                className="flex flex-col items-start px-3 py-1.5 rounded hover:border hover:border-white transition text-xs group"
              >
                <span className="text-gray-300">Hello, {userInfo ? userInfo.name.split(' ')[0] : 'Guest'}</span>
                <span className="font-bold flex items-center gap-1">Account <FiChevronDown className="text-xs" /></span>
              </button>
              {accountOpen && (
                <div className="absolute right-0 mt-1 w-52 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-200 z-50 animate-fade-in">
                  <div className="py-2">
                    {userInfo ? (
                      <>
                        <button onClick={() => { navigate('/profile'); setAccountOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm">
                          <FiUser className="text-gray-500" /> My Account
                        </button>
                        <button onClick={() => { navigate('/profile'); setAccountOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm">
                          <FiPackage className="text-gray-500" /> My Orders
                        </button>
                        {userInfo.isAdmin && (
                          <button onClick={() => { navigate('/admin/dashboard'); setAccountOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm">
                            <FiSettings className="text-gray-500" /> Admin Dashboard
                          </button>
                        )}
                        <hr className="my-1" />
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm text-red-600">
                          <FiLogOut /> Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { navigate('/login'); setAccountOpen(false); }}
                          className="w-full btn-orange mx-3 my-2 text-sm text-center block">
                          Sign In
                        </button>
                        <p className="px-4 py-1 text-xs text-gray-500">
                          New customer?{' '}
                          <button onClick={() => { navigate('/register'); setAccountOpen(false); }}
                            className="text-brand-blue hover:underline">Start here</button>
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            <button onClick={() => navigate('/cart')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:border hover:border-white transition relative">
              <div className="relative">
                <FiShoppingCart className="text-2xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-orange text-gray-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </div>
              <span className="font-bold hidden sm:block">Cart</span>
            </button>

            {/* Mobile menu */}
            <button onClick={() => setMobileOpen(o => !o)} className="sm:hidden p-2 rounded hover:border hover:border-white">
              {mobileOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {mobileOpen && (
          <div className="sm:hidden px-4 pb-3 animate-fade-in">
            <form onSubmit={handleSearch} className="flex rounded-lg overflow-hidden shadow">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ShopNest..."
                className="flex-1 px-4 py-2 text-gray-900 text-sm focus:outline-none"
              />
              <button type="submit" className="bg-brand-orange px-4 text-gray-900">
                <FiSearch />
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* Category strip */}
      <div className="bg-brand-navy-light text-white overflow-x-auto">
        <div className="max-w-screen-2xl mx-auto px-4 flex items-center gap-1 py-1 whitespace-nowrap text-sm">
          <button onClick={() => navigate('/')}
            className="flex items-center gap-1 px-3 py-1 rounded hover:border hover:border-white transition font-medium">
            <FiMenu className="text-sm" /> All
          </button>
          {CATEGORIES.map(cat => (
            <button key={cat}
              onClick={() => navigate(`/?category=${cat}`)}
              className="px-3 py-1 rounded hover:border hover:border-white transition">
              {cat}
            </button>
          ))}
          <button onClick={() => navigate('/profile')}
            className="px-3 py-1 rounded hover:border hover:border-white transition">
            My Orders
          </button>
          {userInfo?.isAdmin && (
            <button onClick={() => navigate('/admin/dashboard')}
              className="px-3 py-1 rounded hover:border hover:border-white transition text-yellow-400 font-medium">
              ⚙ Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;