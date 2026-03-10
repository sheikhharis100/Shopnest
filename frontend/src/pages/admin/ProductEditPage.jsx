import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api.js';
import Loader from '../../components/Loader.jsx';
import { useToast } from '../../components/ToastContext.js';
import { FiUpload, FiArrowLeft, FiSave } from 'react-icons/fi';

const CATEGORIES = ['Electronics', 'Footwear', 'Accessories', 'Fashion', 'Home', 'Sports', 'Other'];

const ProductEditPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    const fetch = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setName(data.name); setPrice(data.price); setOriginalPrice(data.originalPrice || '');
        setBrand(data.brand || ''); setCategory(data.category); setDescription(data.description);
        setImage(data.image); setCountInStock(data.countInStock);
      } finally { setLoading(false); }
    };
    fetch();
  }, [id, isEdit]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      setUploading(true);
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImage(data.imageUrl);
      toast?.('Image uploaded!', 'success');
    } catch {
      toast?.('Image upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) { toast?.('Please add a product image', 'error'); return; }
    try {
      setSaving(true);
      const payload = { name, price: Number(price), originalPrice: Number(originalPrice) || Number(price), brand, category, description, image, countInStock: Number(countInStock) };
      if (isEdit) {
        await api.put(`/products/${id}`, payload);
        toast?.('Product updated!', 'success');
      } else {
        await api.post('/products', payload);
        toast?.('Product created!', 'success');
      }
      navigate('/admin/products');
    } catch (err) {
      toast?.(err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-20"><Loader /></div>;

  return (
    <div className="animate-fade-in max-w-2xl">
      <button onClick={() => navigate('/admin/products')}
        className="flex items-center gap-1.5 text-brand-blue hover:underline text-sm mb-6">
        <FiArrowLeft /> Back to Products
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? 'Edit Product' : 'Add New Product'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Product Image</label>
          <div className="flex items-start gap-4">
            {image ? (
              <img src={image} alt="preview"
                className="w-28 h-28 object-contain bg-gray-50 rounded-lg border"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/112'; }} />
            ) : (
              <div className="w-28 h-28 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <FiUpload className="text-gray-400 text-2xl" />
              </div>
            )}
            <div className="flex-1 space-y-2">
              <input type="text" placeholder="Image URL" className="input-field text-sm"
                value={image} onChange={e => setImage(e.target.value)} />
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">or</span>
                <label className="cursor-pointer text-xs text-brand-blue hover:underline">
                  {uploading ? 'Uploading...' : 'Upload from device'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-gray-700">Product Details</h3>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Product Name *</label>
            <input type="text" className="input-field" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Brand</label>
              <input type="text" className="input-field" value={brand} onChange={e => setBrand(e.target.value)} placeholder="e.g. Apple" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
              <select className="input-field" value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description *</label>
            <textarea className="input-field resize-none" rows={4} value={description}
              onChange={e => setDescription(e.target.value)} required />
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-gray-700">Pricing & Inventory</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Sale Price ($) *</label>
              <input type="number" min="0" step="0.01" className="input-field" value={price}
                onChange={e => setPrice(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Original Price ($)</label>
              <input type="number" min="0" step="0.01" className="input-field" value={originalPrice}
                onChange={e => setOriginalPrice(e.target.value)} placeholder="For discount display" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Stock Count *</label>
              <input type="number" min="0" className="input-field" value={countInStock}
                onChange={e => setCountInStock(e.target.value)} required />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="btn-orange w-full py-3 text-base font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
          <FiSave /> {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

export default ProductEditPage;
