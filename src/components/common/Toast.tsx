import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { notification, setNotification } = useStore();

  if (!notification) return null;

  return (
    <div className="fixed top-16 right-4 z-50 animate-in slide-in-from-top-3 duration-200">
      <div className="bg-slate-950 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center space-x-3 text-xs font-semibold backdrop-blur-md">
        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>{notification}</span>
        <button
          onClick={() => setNotification(null)}
          className="text-slate-400 hover:text-white p-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
