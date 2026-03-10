import { NavLink, useNavigate } from 'react-router-dom';
import { FiGrid, FiPackage, FiUsers, FiShoppingBag, FiPlusCircle, FiArrowLeft } from 'react-icons/fi';

const LINKS = [
  { to: '/admin/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/admin/products', icon: FiShoppingBag, label: 'Products' },
  { to: '/admin/products/create', icon: FiPlusCircle, label: 'Add Product' },
  { to: '/admin/orders', icon: FiPackage, label: 'Orders' },
  { to: '/admin/users', icon: FiUsers, label: 'Users' },
];

const AdminSidebar = ({ children }) => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-brand-navy text-gray-300 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-700">
          <button onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition mb-3">
            <FiArrowLeft /> Back to Store
          </button>
          <h2 className="text-white font-bold text-lg">⚙ Admin</h2>
        </div>
        <nav className="flex-1 py-4">
          {LINKS.map((link) => {
            const NavIcon = link.icon;
            return (
              <NavLink key={link.to} to={link.to} end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-3 text-sm transition-all ${
                    isActive
                      ? 'bg-brand-navy-light text-white border-l-2 border-brand-orange'
                      : 'hover:bg-brand-navy-light hover:text-white'
                  }`
                }>
                <NavIcon className="text-base shrink-0" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
};

export default AdminSidebar;
