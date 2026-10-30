import React, { useState } from 'react';
import { X, Lock, Shield, KeyRound, AlertCircle, Sparkles } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string, user: any) => void;
}

export function AdminLoginModal({ isOpen, onClose, onLoginSuccess }: AdminLoginModalProps) {
  if (!isOpen) return null;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please enter your username and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      localStorage.setItem('rw_admin_token', data.token);
      onLoginSuccess(data.token, data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="relative bg-[#121212] text-white w-full max-w-md shadow-2xl border border-[#D4AF37]/50 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
          aria-label="Close login dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Kicker */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mx-auto mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold block">
            Authorized Personnel Only
          </span>
          <h2 className="font-serif text-2xl font-semibold tracking-wide text-white mt-1">
            Riwaayat Wear Admin Portal
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Sign in to manage catalog, orders, and store operations
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-300 mb-1">
              Admin Username / Email
            </label>
            <div className="relative">
              <input
                type="text"
                required
                autoFocus
                placeholder="admin or admin@riwaayatwear.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 text-white text-sm focus:outline-none focus:border-[#D4AF37] placeholder-neutral-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 text-white text-sm focus:outline-none focus:border-[#D4AF37] placeholder-neutral-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#D4AF37] hover:bg-[#c5a059] text-[#121212] text-xs uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Secure Admin Login'}</span>
          </button>
        </form>

        {/* Initial Setup Credentials Notice */}
        <div className="mt-6 pt-4 border-t border-neutral-800 text-[11px] text-neutral-400 bg-neutral-900/50 p-3 border border-neutral-800">
          <p className="font-semibold text-[#D4AF37] mb-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Initial Admin Credentials:
          </p>
          <div className="font-mono text-neutral-300 space-y-0.5">
            <div>User: <span className="text-white">admin</span></div>
            <div>Password: <span className="text-white">Riwaayat@Admin2026</span></div>
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">
            (You can update credentials anytime inside the Admin Security tab)
          </p>
        </div>
      </div>
    </div>
  );
}
