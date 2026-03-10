import { useNavigate } from 'react-router-dom';
import { FiArrowUp } from 'react-icons/fi';

const FOOTER_LINKS = {
  'Get to Know Us': ['About ShopNest', 'Careers', 'Press Center', 'Investor Relations', 'Blog'],
  'Make Money with Us': ['Sell on ShopNest', 'Become an Affiliate', 'Advertise Your Products', 'ShopNest for Business'],
  'ShopNest Payment Products': ['ShopNest Pay', 'Reload Your Balance', 'Gift Cards', 'ShopNest Currency Converter'],
  'Let Us Help You': ['Your Account', 'Your Orders', 'Shipping Rates & Policies', 'Returns & Replacements', 'Help'],
};

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="mt-10">
      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="w-full bg-brand-navy-light hover:bg-gray-600 text-white py-3 text-sm flex items-center justify-center gap-2 transition"
      >
        <FiArrowUp /> Back to top
      </button>

      {/* Main footer */}
      <div className="bg-brand-navy text-gray-300 py-10">
        <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-bold mb-3 text-sm">{title}</h4>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link}>
                    <button className="text-xs hover:text-white transition text-left">{link}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-brand-navy border-t border-gray-700 py-4">
        <div className="max-w-screen-xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white font-bold text-lg">
            🛒 ShopNest
          </button>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>© {new Date().getFullYear()} ShopNest, Inc.</span>
            <button className="hover:text-white transition">Privacy Notice</button>
            <button className="hover:text-white transition">Conditions of Use</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;