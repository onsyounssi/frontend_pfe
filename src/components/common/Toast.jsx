import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
  const borderColor = type === 'success' ? 'border-green-200' : 'border-red-200';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const iconColor = type === 'success' ? 'text-green-500' : 'text-red-500';

  return (
    <div className={`fixed top-24 right-6 z-[2000] flex items-center gap-3 px-5 py-4 rounded-2xl border ${bgColor} ${borderColor} shadow-xl animate-in slide-in-from-right duration-300 min-w-[300px] max-w-md`}>
      <div className={`flex-shrink-0 ${iconColor}`}>
        {type === 'success' ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-bold ${textColor}`}>{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
      >
        <X className="w-4 h-4" />
      </button>
      
      {/* Barre de progression */}
      <div className="absolute bottom-0 left-0 h-1 bg-black/5 w-full rounded-b-2xl overflow-hidden">
        <div 
          className={`h-full ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} animate-progress`}
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
