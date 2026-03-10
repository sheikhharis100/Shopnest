import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/api.js';
import ProductCard from '../components/ProductCard.jsx';
import Loader from '../components/Loader.jsx';
import Message from '../components/Message.jsx';
import Pagination from '../components/Pagination.jsx';
import { FiArrowRight, FiZap } from 'react-icons/fi';

const CATEGORIES = [
  { name: 'Electronics', icon: '💻', color: 'from-blue-500 to-indigo-600' },
  { name: 'Footwear', icon: '👟', color: 'from-orange-400 to-pink-500' },
  { name: 'Accessories', icon: '⌚', color: 'from-yellow-400 to-amber-500' },
  { name: 'Fashion', icon: '👗', color: 'from-pink-400 to-rose-500' },
  { name: 'Home', icon: '🏠', color: 'from-green-400 to-teal-500' },
  { name: 'Sports', icon: '⚽', color: 'from-purple-400 to-violet-500' },
];

const HERO_SLIDES = [
  {
    title: 'Up to 40% Off Electronics',
    subtitle: 'Latest smartphones, laptops, and more',
    cta: 'Shop Electronics',
    category: 'Electronics',
    gradient: 'from-slate-800 via-blue-900 to-indigo-900',
    emoji: '💻',
  },
  {
    title: 'New Season, New Style',
    subtitle: 'Discover the latest fashion trends',
    cta: 'Shop Fashion',
    category: 'Fashion',
    gradient: 'from-rose-800 via-pink-900 to-purple-900',
    emoji: '👗',
  },
  {
    title: 'Top Deals Every Day',
    subtitle: 'Free shipping on orders over $100',
    cta: 'See All Deals',
    category: '',
    gradient: 'from-amber-700 via-orange-800 to-red-900',
    emoji: '🔥',
  },
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [slideIndex, setSlideIndex] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(
        `/products?keyword=${keyword}&category=${category}&page=${page}`
      );
      setProducts(data.products || data);
      setPages(data.pages || 1);
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [keyword, category, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Hero auto-slide
  useEffect(() => {
    const timer = setInterval(() => setSlideIndex(i => (i + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[slideIndex];
  const isFiltered = keyword || category;

  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      {!isFiltered && (
        <div className={`relative bg-gradient-to-r ${slide.gradient} text-white overflow-hidden h-72 sm:h-80 transition-all duration-1000`}>
          <div className="absolute inset-0 flex items-center justify-between max-w-screen-xl mx-auto px-8 sm:px-16">
            <div className="space-y-4 max-w-lg">
              <p className="text-brand-orange font-semibold text-sm uppercase tracking-widest">Deal of the Day</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">{slide.title}</h1>
              <p className="text-gray-300 text-lg">{slide.subtitle}</p>
              <button
                onClick={() => navigate(`/?category=${slide.category}`)}
                className="btn-orange flex items-center gap-2 text-sm w-fit"
              >
                {slide.cta} <FiArrowRight />
              </button>
            </div>
            <div className="hidden sm:block text-9xl opacity-20 select-none">{slide.emoji}</div>
          </div>
          {/* Slide dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button key={i} onClick={() => setSlideIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === slideIndex ? 'bg-brand-orange scale-125' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {/* Category Grid */}
        {!isFiltered && (
          <section className="mb-10">
            <h2 className="section-title">Shop by Category</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => navigate(`/?category=${cat.name}`)}
                  className={`bg-gradient-to-br ${cat.color} text-white rounded-xl p-4 flex flex-col items-center gap-2 hover:scale-105 hover:shadow-lg transition-all duration-200 aspect-square justify-center`}
                >
                  <span className="text-3xl">{cat.icon}</span>
                  <span className="text-xs font-semibold">{cat.name}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Filter indicator */}
        {isFiltered && (
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {keyword ? `Results for "${keyword}"` : `${category}`}
            </h2>
            <button onClick={() => navigate('/')}
              className="text-sm text-brand-blue hover:underline">
              Clear filters ×
            </button>
          </div>
        )}

        {/* Products Header */}
        {!isFiltered && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title flex items-center gap-2">
              <FiZap className="text-yellow-500" /> Best Sellers
            </h2>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message type="error">{error}</Message>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg mb-4">No products found</p>
            <button onClick={() => navigate('/')} className="btn-orange">Browse All Products</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <Pagination page={page} pages={pages} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default HomePage;