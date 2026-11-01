import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Shield, FileText, Phone, Info, X, Lock } from 'lucide-react';

interface ThreeDotMenuProps {
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenPrivacy: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn?: boolean;
  align?: 'left' | 'right';
}

export function ThreeDotMenu({
  onOpenAbout,
  onOpenContact,
  onOpenPrivacy,
  onOpenAdmin,
  isAdminLoggedIn = false,
  align = 'right',
}: ThreeDotMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Background backdrop overlay when menu is open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] transition-opacity"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="relative inline-block text-left z-50" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`flex items-center justify-center w-11 h-11 rounded-full transition-all cursor-pointer ${
            isOpen
              ? 'bg-[#121212] text-[#D4AF37] ring-2 ring-[#D4AF37]'
              : 'hover:bg-[#121212]/10 active:bg-[#121212]/15 text-[#121212]'
          }`}
          aria-label="Navigation Options Menu"
          aria-expanded={isOpen}
          title="Menu Options"
        >
          {isOpen ? (
            <X className="w-5 h-5 text-[#D4AF37]" />
          ) : (
            <MoreVertical className="w-6 h-6 text-[#121212]" />
          )}
        </button>

        {isOpen && (
          <div 
            className={`absolute ${align === 'left' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'} mt-2 w-72 bg-[#121212] text-white shadow-2xl border-2 border-[#D4AF37]/50 py-2 z-50 animate-in fade-in zoom-in-95 duration-150`}
            role="menu"
          >
            <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
              <span className="text-[11px] tracking-[0.25em] uppercase text-[#D4AF37] font-bold">
                RIWAAYAT WEAR
              </span>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white p-1"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenAbout();
                }}
                className="w-full text-left px-4 py-3 text-xs tracking-wider uppercase flex items-center gap-3 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37] transition-colors cursor-pointer"
                role="menuitem"
              >
                <Info className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-medium">About Us</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenContact();
                }}
                className="w-full text-left px-4 py-3 text-xs tracking-wider uppercase flex items-center gap-3 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37] transition-colors cursor-pointer"
                role="menuitem"
              >
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-medium">Contact Us</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenPrivacy();
                }}
                className="w-full text-left px-4 py-3 text-xs tracking-wider uppercase flex items-center gap-3 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37] transition-colors cursor-pointer"
                role="menuitem"
              >
                <FileText className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-medium">Privacy Policy</span>
              </button>

              <div className="my-1.5 border-t border-white/10" />

              {/* Admin Panel option - ONLY here as strictly instructed */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenAdmin();
                }}
                className="w-full text-left px-4 py-3 text-xs tracking-wider uppercase flex items-center justify-between hover:bg-[#D4AF37]/25 text-[#D4AF37] transition-colors group cursor-pointer"
                role="menuitem"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-bold">Admin Panel</span>
                </div>
                {isAdminLoggedIn ? (
                  <span className="text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-600/50 px-2 py-0.5 text-xs font-mono font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Active
                  </span>
                ) : (
                  <span className="text-[10px] bg-amber-950/80 text-[#D4AF37] border border-[#D4AF37]/60 px-2 py-0.5 text-xs font-mono font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3 text-[#D4AF37]" />
                    Locked
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
