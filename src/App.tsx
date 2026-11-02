/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import type { Product, CartItem, Order, ProductColor, SiteContent } from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ContactLocationSection } from './components/ContactLocationSection';
import { AboutSection } from './components/AboutSection';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './components/AdminPanel/AdminLoginModal';
import { AdminDashboard } from './components/AdminPanel/AdminDashboard';
import { Sparkles, SlidersHorizontal, Check } from 'lucide-react';

import { api } from './utils/apiClient';

export default function App() {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([
    "Men's Shalwar Kameez",
    "Women's Shalwar Kameez",
    "Men's Waistcoats",
    "Women's Unstitched Suits",
    "Kurta & Prince Coats",
    "Luxury Shawls & Chaddars",
    "Velvet Winter Edition",
    "Footwear & Khussa",
    "New Arrivals",
    "Best Sellers",
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Cart State (saved to localStorage for user convenience)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('rw_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Quick View Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Informational Modals
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Admin Panel State (Locked & Protected: requires authentication)
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('rw_admin_token') || localStorage.getItem('rw_admin_token') || null;
    } catch {
      return null;
    }
  });
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rw_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  // Fetch initial products and content from database / local fallback
  const loadData = async () => {
    try {
      const [prods, cats, cnt] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getContent(),
      ]);
      if (prods && prods.length > 0) setProducts(prods);
      if (cats && cats.length > 0) setCategories(cats);
      if (cnt) setSiteContent(cnt);
    } catch (err) {
      console.error('Failed to load store data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Verify stored session token on load
  useEffect(() => {
    loadData();
    const storedToken = sessionStorage.getItem('rw_admin_token') || localStorage.getItem('rw_admin_token');
    if (storedToken) {
      api.verify(storedToken)
        .then((data) => {
          if (data.valid && data.user) {
            setAdminToken(storedToken);
            setAdminUser(data.user);
          } else {
            // Invalid or expired token: lock admin panel
            sessionStorage.removeItem('rw_admin_token');
            localStorage.removeItem('rw_admin_token');
            setAdminToken(null);
            setAdminUser(null);
          }
        })
        .catch(() => {
          sessionStorage.removeItem('rw_admin_token');
          localStorage.removeItem('rw_admin_token');
          setAdminToken(null);
          setAdminUser(null);
        });
    } else {
      setAdminToken(null);
      setAdminUser(null);
    }
  }, []);

  // Cart operations
  const handleAddToCart = (product: Product, size: string, color: ProductColor) => {
    const itemId = `${product.id}-${size}-${color.name}`;
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing) {
        return prev.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          selectedSize: size,
          selectedColor: color,
          quantity: 1,
        },
      ];
    });
    showToast(`Added "${product.name}" (${size}) to bag`);
  };

  const handleBuyNow = (product: Product, size: string, color: ProductColor) => {
    handleAddToCart(product, size, color);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity: newQuantity } : i))
    );
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Admin Handlers - PROTECTED & LOCKED
  const handleOpenAdmin = () => {
    if (adminToken && adminUser) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = (token: string, user: any) => {
    setAdminToken(token);
    setAdminUser(user);
    try {
      sessionStorage.setItem('rw_admin_token', token);
      localStorage.setItem('rw_admin_token', token);
    } catch (e) {
      console.error(e);
    }
    setIsAdminLoginOpen(false);
    setIsAdminDashboardOpen(true);
    showToast(`Admin Suite unlocked. Welcome, ${user?.username || 'Administrator'}`);
  };

  const handleAdminLogout = async () => {
    try {
      if (adminToken) {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminToken}` },
        });
      }
    } catch (e) {
      console.error(e);
    }
    try {
      sessionStorage.removeItem('rw_admin_token');
      localStorage.removeItem('rw_admin_token');
    } catch (e) {
      console.error(e);
    }
    setAdminToken(null);
    setAdminUser(null);
    setIsAdminDashboardOpen(false);
    showToast('Admin Panel locked. Logged out successfully.');
  };

  // Navigation scroll helpers
  const handleScrollToAbout = () => {
    const el = document.getElementById('about-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToContact = () => {
    const el = document.getElementById('contact-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleShopNow = () => {
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    // Category match
    let matchesCategory = true;
    if (selectedCategory !== 'All') {
      if (selectedCategory === 'New Arrivals') {
        matchesCategory = Boolean(p.isNewArrival);
      } else if (selectedCategory === 'Best Sellers') {
        matchesCategory = Boolean(p.isBestSeller);
      } else {
        matchesCategory = p.category === selectedCategory;
      }
    }

    // Search query match
    let matchesSearch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      matchesSearch =
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        Boolean(p.fabric && p.fabric.toLowerCase().includes(q)) ||
        Boolean(p.description && p.description.toLowerCase().includes(q));
    }

    return matchesCategory && matchesSearch;
  });

  const cartTotalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#121212] flex flex-col font-sans selection:bg-[#D4AF37]/25 selection:text-[#121212] overflow-x-hidden">
      
      {/* 
        CRITICAL: At the very top of the website, display ONLY the website name RIWAAYAT WEAR.
        Do not create any announcement bar, promotional strip, extra heading or content above.
      */}
      <Header
        cartCount={cartTotalItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAbout={handleScrollToAbout}
        onOpenContact={handleScrollToContact}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        isAdminLoggedIn={Boolean(adminToken)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={categories}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Public Content */}
      <main className="flex-grow">
        
        {/* Hero Section */}
        <HeroSection
          onShopNow={handleShopNow}
          headline={siteContent?.heroHeadline}
          subheadline={siteContent?.heroSubheadline}
        />

        {/* Products Section */}
        <section id="products-section" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#D4AF37]/20 gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#997B2C] text-xs uppercase tracking-[0.25em] font-semibold mb-1.5">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>The Royal Wardrobe</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#121212] font-medium tracking-wide">
                {selectedCategory === 'All' ? 'All Pakistani Collections' : selectedCategory}
              </h2>
            </div>

            <div className="flex items-center gap-3 text-xs text-neutral-500">
              <span>Showing {filteredProducts.length} handcrafted pieces</span>
              {selectedCategory !== 'All' && (
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="text-[#997B2C] hover:underline font-semibold"
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>

          {/* Search Result notice */}
          {searchQuery && (
            <div className="mb-6 p-3 bg-neutral-100 text-xs text-neutral-700 flex items-center justify-between">
              <span>
                Search results for: <strong>"{searchQuery}"</strong> ({filteredProducts.length} items found)
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-neutral-500 hover:text-black font-semibold text-xs"
              >
                Clear
              </button>
            </div>
          )}

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-white border border-[#D4AF37]/20 p-8">
              <h3 className="font-serif text-xl font-semibold text-[#121212] mb-2">
                No garments found in this category
              </h3>
              <p className="text-xs text-neutral-500 mb-6 max-w-md mx-auto">
                Try selecting "All Collections" or searching for a different Pakistani fabric or design.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="px-6 py-2.5 bg-[#121212] text-white text-xs uppercase tracking-wider font-semibold hover:bg-neutral-800 transition-colors"
              >
                View All Collections
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                  onQuickView={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          )}

        </section>

        {/* About Us Section */}
        <AboutSection />

        {/* Contact & Location Section */}
        <ContactLocationSection />

      </main>

      {/* Footer */}
      <Footer
        onOpenAbout={handleScrollToAbout}
        onOpenContact={handleScrollToContact}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onSelectCategory={setSelectedCategory}
        categories={categories}
      />

      {/* Official Floating WhatsApp Button */}
      <FloatingWhatsApp />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderSuccess={(order) => {
          loadData();
          showToast(`Order #${order.id} placed successfully!`);
        }}
        onClearCart={handleClearCart}
      />

      {/* Product Quick View / Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* Admin Login Modal (Triggered ONLY from Three-Dot Menu) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Admin Full Dashboard (Protected) */}
      {isAdminDashboardOpen && adminToken && (
        <AdminDashboard
          token={adminToken}
          adminUser={adminUser}
          onLogout={handleAdminLogout}
          onClose={() => setIsAdminDashboardOpen(false)}
          onRefreshData={loadData}
        />
      )}

      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#121212] text-white px-5 py-2.5 shadow-2xl border border-[#D4AF37] text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-[#25D366]" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
