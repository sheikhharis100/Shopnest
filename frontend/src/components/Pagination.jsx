const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;
  return (
    <div className="flex justify-center items-center gap-1 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1.5 rounded border border-gray-300 text-sm disabled:opacity-40 hover:bg-gray-100 transition"
      >
        ‹ Prev
      </button>
      {[...Array(pages).keys()].map(p => (
        <button
          key={p + 1}
          onClick={() => onPageChange(p + 1)}
          className={`px-3 py-1.5 rounded text-sm font-medium transition border ${
            page === p + 1
              ? 'bg-yellow-400 border-yellow-500 text-gray-900'
              : 'border-gray-300 hover:bg-gray-100'
          }`}
        >
          {p + 1}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="px-3 py-1.5 rounded border border-gray-300 text-sm disabled:opacity-40 hover:bg-gray-100 transition"
      >
        Next ›
      </button>
    </div>
  );
};

export default Pagination;
