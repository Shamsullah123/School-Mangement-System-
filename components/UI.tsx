import React from 'react';
import { X } from 'lucide-react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'outline' }> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md",
    secondary: "bg-slate-200 text-slate-800 hover:bg-slate-300",
    danger: "bg-red-500 text-white hover:bg-red-600",
    outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
  };
  
  return (
    <button className={`${baseStyles} ${variants[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`} {...props}>
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className = '', ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
    <input 
      className={`w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${className}`} 
      {...props} 
    />
  </div>
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }> = ({ label, children, className = '', ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
    <select 
      className={`w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${className}`} 
      {...props} 
    >
      {children}
    </select>
  </div>
);

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement> & { title?: string }> = ({ children, title, className = '', ...props }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-100 p-6 ${className}`} {...props}>
    {title && <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>}
    {children}
  </div>
);

export const Badge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    Paid: 'bg-green-100 text-green-800',
    Sent: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Overdue: 'bg-red-100 text-red-800',
    Failed: 'bg-red-100 text-red-800',
  };
  const defaultStyle = 'bg-slate-100 text-slate-800';

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || defaultStyle}`}>
      {status}
    </span>
  );
};

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};