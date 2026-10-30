import React from 'react';
import { ShoppingBag, Search, Sparkles } from 'lucide-react';
import { ThreeDotMenu } from './ThreeDotMenu';
import type { ProductCategory } from '../types';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenPrivacy: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn?: boolean;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({
  cartCount,
  onOpenCart,
  onOpenAbout,
  onOpenContact,
  onOpenPrivacy,
  onOpenAdmin,
  isAdminLoggedIn = false,
  selectedCategory,
  onSelectCategory,
  categories,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  const [showSearch, setShowSearch] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#D4AF37]/20 transition-all">
      {/* 
        CRITICAL: At the very top of the website, display ONLY the website name RIWAAYAT WEAR.
        No announcement bar, promotional strip, extra heading or content above.
      */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          
          {/* Left: Minimal Three-Dot Menu (⋮) */}
          <div className="flex items-center gap-2 w-1/4 justify-start">
            <ThreeDotMenu
              onOpenAbout={onOpenAbout}
              onOpenContact={onOpenContact}
              onOpenPrivacy={onOpenPrivacy}
              onOpenAdmin={onOpenAdmin}
              isAdminLoggedIn={isAdminLoggedIn}
            />
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-full hover:bg-[#121212]/5 text-[#121212]/70 hover:text-[#121212] transition-colors"
              aria-label="Search Collection"
              title="Search Collection"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Center: Brand Name RIWAAYAT WEAR (Centered, Elegant) */}
          <div className="w-2/4 text-center">
            <a 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-block group"
            >
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl tracking-[0.25em] sm:tracking-[0.3em] font-medium text-[#121212] uppercase transition-colors group-hover:text-[#997B2C]">
                RIWAAYAT WEAR
              </h1>
              <p className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#C5A059] font-medium -mt-1 hidden sm:block">
                Timeless Tradition, Modern Style
              </p>
            </a>
          </div>

          {/* Right: Shopping Cart Icon */}
          <div className="flex items-center justify-end gap-3 w-1/4">
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full hover:bg-[#121212]/5 text-[#121212] transition-colors focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              aria-label={`Shopping Cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-[#121212] text-[#D4AF37] border border-[#D4AF37] text-[11px] font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Search Input */}
        {showSearch && (
          <div className="pb-4 pt-1 max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search shalwar kameez, waistcoats, fabrics..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D4AF37]/40 rounded-none text-sm focus:outline-none focus:border-[#121212] text-[#121212] placeholder-neutral-400"
              />
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-400" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3.5 top-3 text-xs text-neutral-400 hover:text-neutral-700"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* Category Navigation Bar */}
        <nav 
          className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-1 sm:gap-2 pb-2.5 -mx-4 px-4 sm:mx-0 sm:px-0 border-t border-[#D4AF37]/10 pt-2"
          aria-label="Product Categories"
        >
          <button
            onClick={() => onSelectCategory('All')}
            className={`whitespace-nowrap px-3 sm:px-4 py-1.5 text-xs sm:text-xs tracking-wider uppercase transition-all duration-200 border-b-2 font-medium ${
              selectedCategory === 'All'
                ? 'border-[#121212] text-[#121212] font-semibold'
                : 'border-transparent text-neutral-600 hover:text-[#121212] hover:border-[#D4AF37]/50'
            }`}
          >
            All Collections
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  // Scroll to products section smoothly
                  const prodSection = document.getElementById('products-section');
                  if (prodSection) {
                    prodSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`whitespace-nowrap px-3 sm:px-4 py-1.5 text-xs sm:text-xs tracking-wider uppercase transition-all duration-200 border-b-2 font-medium ${
                  isSelected
                    ? 'border-[#121212] text-[#121212] font-semibold'
                    : 'border-transparent text-neutral-600 hover:text-[#121212] hover:border-[#D4AF37]/50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
