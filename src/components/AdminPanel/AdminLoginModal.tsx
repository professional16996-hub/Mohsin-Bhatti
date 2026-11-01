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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAutofill = () => {
    setUsername('admin');
    setPassword('Riwaayat@Admin2026');
    setError('');
  };

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="relative bg-[#121212] text-white w-full max-w-md shadow-2xl border-2 border-[#D4AF37]/50 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          aria-label="Close login dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Kicker */}
        <div className="text-center mb-6">
          <div className="relative w-16 h-16 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Lock className="w-7 h-7 text-[#D4AF37]" />
            <div className="absolute -bottom-1 -right-1 bg-amber-950 border border-[#D4AF37] rounded-full p-1 text-white">
              <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
            </div>
          </div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-bold block">
            Locked · Authorized Access Only
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-wide text-white mt-1">
            Admin Management Suite
          </h2>
          <p className="text-xs text-neutral-400 mt-1.5">
            Enter your credentials to unlock RIWAAYAT WEAR operations
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-700 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-300 mb-1.5">
              Admin Username or Email
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 text-white text-sm focus:outline-none focus:border-[#D4AF37] placeholder-neutral-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-[#D4AF37] hover:underline"
              >
                {showPassword ? 'Hide Password' : 'Show Password'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 text-white text-sm focus:outline-none focus:border-[#D4AF37] placeholder-neutral-500 font-mono"
            />
          </div>

          <div className="pt-2 space-y-2.5">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#D4AF37] hover:bg-[#c5a059] text-[#121212] text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In to Admin Dashboard'}</span>
            </button>

            {/* Quick 1-Click Autofill Button for Convenience */}
            <button
              type="button"
              onClick={handleAutofill}
              className="w-full py-2 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/20 text-[11px] uppercase tracking-wider font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Autofill Master Admin Credentials</span>
            </button>
          </div>
        </form>

        {/* Help Info Box */}
        <div className="mt-5 pt-3.5 border-t border-neutral-800 text-[11px] text-neutral-400 bg-neutral-900/60 p-3 border border-neutral-800 flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="text-white font-semibold">Master Access: </span>
            User: <code className="text-[#D4AF37] bg-black/40 px-1 py-0.5 font-mono">admin</code> | 
            Pass: <code className="text-[#D4AF37] bg-black/40 px-1 py-0.5 font-mono">Riwaayat@Admin2026</code>
          </div>
        </div>
      </div>
    </div>
  );
}
