import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Shield, FileText, Phone, Info, X } from 'lucide-react';

interface ThreeDotMenuProps {
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenPrivacy: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn?: boolean;
}

export function ThreeDotMenu({
  onOpenAbout,
  onOpenContact,
  onOpenPrivacy,
  onOpenAdmin,
  isAdminLoggedIn = false,
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
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#121212]/5 active:bg-[#121212]/10 transition-colors focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
        aria-label="Navigation Options Menu"
        title="More Options"
      >
        <MoreVertical className="w-5 h-5 text-[#121212]" />
      </button>

      {isOpen && (
        <div 
          className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-64 origin-top-right bg-[#121212] text-white rounded-none shadow-2xl border border-[#D4AF37]/30 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
          role="menu"
        >
          <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] font-semibold">
              RIWAAYAT WEAR
            </span>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white"
              aria-label="Close menu"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenAbout();
              }}
              className="w-full text-left px-4 py-2.5 text-xs tracking-wider uppercase flex items-center gap-3 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-colors"
              role="menuitem"
            >
              <Info className="w-4 h-4 text-[#D4AF37]" />
              <span>About Us</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                onOpenContact();
              }}
              className="w-full text-left px-4 py-2.5 text-xs tracking-wider uppercase flex items-center gap-3 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-colors"
              role="menuitem"
            >
              <Phone className="w-4 h-4 text-[#D4AF37]" />
              <span>Contact Us</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                onOpenPrivacy();
              }}
              className="w-full text-left px-4 py-2.5 text-xs tracking-wider uppercase flex items-center gap-3 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-colors"
              role="menuitem"
            >
              <FileText className="w-4 h-4 text-[#D4AF37]" />
              <span>Privacy Policy</span>
            </button>

            <div className="my-1 border-t border-white/10" />

            {/* Admin Panel option - ONLY here as strictly instructed */}
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenAdmin();
              }}
              className="w-full text-left px-4 py-2.5 text-xs tracking-wider uppercase flex items-center justify-between hover:bg-[#D4AF37]/20 text-[#D4AF37] transition-colors group"
              role="menuitem"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-semibold">Admin Panel</span>
              </div>
              {isAdminLoggedIn && (
                <span className="text-[10px] bg-[#25D366]/20 text-[#25D366] px-1.5 py-0.5 rounded text-xs font-mono">
                  Active
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
