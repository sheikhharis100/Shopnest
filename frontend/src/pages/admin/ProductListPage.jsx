import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api.js';
import Loader from '../../components/Loader.jsx';
import { useToast } from '../../components/ToastContext.js';
import { FiEdit, FiTrash2, FiPlusCircle, FiSearch } from 'react-icons/fi';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products?page=1&limit=100');
      setProducts(data.products || data);
    } catch {
      toast?.('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const deleteHandler = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast?.('Product deleted', 'success');
      fetchProducts();
    } catch {
      toast?.('Delete failed', 'error');
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products <span className="text-gray-400 text-lg font-normal">({products.length})</span></h1>
        <Link to="/admin/products/create" className="btn-orange flex items-center gap-2 text-sm px-4 py-2">
          <FiPlusCircle /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search by name or category..."
          className="input-field pl-10 bg-white"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? <Loader /> : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Stock</th>
                  <th className="px-4 py-3 text-left">Rating</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(product => (
                  <tr key={product._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name}
                          className="w-10 h-10 object-contain bg-gray-50 rounded border"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }} />
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{product.category}</td>
                    <td className="px-4 py-3 font-semibold">${product.price}</td>
                    <td className="px-4 py-3">
                      <span className={product.countInStock === 0 ? 'badge-red' : product.countInStock <= 5 ? 'badge-yellow' : 'badge-green'}>
                        {product.countInStock === 0 ? 'Out of stock' : `${product.countInStock} in stock`}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">⭐ {product.rating?.toFixed(1)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => navigate(`/admin/products/${product._id}/edit`)}
                          className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded transition">
                          <FiEdit />
                        </button>
                        <button onClick={() => deleteHandler(product._id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded transition">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">No products found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListPage;