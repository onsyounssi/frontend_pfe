import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const STYLES = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    sub: 'text-green-600',
    icon: 'text-green-500',
    bar: 'bg-green-500',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-900',
    sub: 'text-amber-700',
    icon: 'text-amber-500',
    bar: 'bg-amber-500',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    sub: 'text-red-600',
    icon: 'text-red-500',
    bar: 'bg-red-500',
  },
};

const Toast = ({ message, subMessage, type = 'success', onClose, duration = 8000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const style = STYLES[type] || STYLES.error;
  const isSuccess = type === 'success';

  return (
    <div className={`fixed top-24 right-6 z-[2000] flex items-start gap-3 px-5 py-4 rounded-2xl border ${style.bg} ${style.border} shadow-xl animate-in slide-in-from-right duration-300 min-w-[320px] max-w-md`}>
      <div className={`flex-shrink-0 mt-0.5 ${style.icon}`}>
        {isSuccess ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-bold ${style.text}`}>{message}</p>
        {subMessage && (
          <p className={`text-xs mt-1 ${style.sub} leading-relaxed whitespace-pre-wrap break-words`}>{subMessage}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors p-1 flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Barre de progression */}
      <div className="absolute bottom-0 left-0 h-1 bg-black/5 w-full rounded-b-2xl overflow-hidden">
        <div
          className={`h-full ${style.bar} animate-progress`}
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-progress {
          animation-name: progress;
          animation-timing-function: linear;
        }
      `}} />
    </div>
  );
};

export default Toast;
