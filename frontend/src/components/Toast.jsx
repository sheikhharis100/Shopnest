import { useState, useCallback } from 'react';
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';
import { ToastContext } from './ToastContext.js';

const icons = {
  success: <FiCheckCircle className="text-green-500 text-lg shrink-0" />,
  error: <FiAlertCircle className="text-red-500 text-lg shrink-0" />,
  info: <FiInfo className="text-blue-500 text-lg shrink-0" />,
};

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id}
            className="pointer-events-auto flex items-start gap-3 bg-white border border-gray-200 shadow-xl rounded-lg px-4 py-3 min-w-72 max-w-sm animate-slide-up">
            {icons[toast.type]}
            <span className="text-sm text-gray-800 flex-1">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-700 ml-1">
              <FiX />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
