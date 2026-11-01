import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  MessageSquare, 
  Layers, 
  FileEdit, 
  Shield, 
  LogOut, 
  Lock,
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  ExternalLink, 
  RefreshCw, 
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  Search,
  Printer,
  FileText,
  Eye,
  SlidersHorizontal,
  Phone,
  Sparkles
} from 'lucide-react';
import type { Product, Order, Inquiry, SiteContent, ProductColor, OrderStatus } from '../../types';
import { formatPrice } from '../../utils/currency';
import { WhatsAppIcon } from '../FloatingWhatsApp';
import { createWhatsAppUrl, DISPLAY_WHATSAPP_NUMBER } from '../../utils/whatsapp';

interface AdminDashboardProps {
  token: string;
  adminUser: any;
  onLogout: () => void;
  onClose: () => void;
  onRefreshData: () => void;
}

const PRESET_IMAGES = [
  { label: "Men's Black Shalwar Kameez", url: '/src/assets/images/mens_shalwar_kameez_1793388068297.jpg' },
  { label: "Women's Ivory Shalwar Kameez", url: '/src/assets/images/womens_shalwar_kameez_1793388080478.jpg' },
  { label: "Men's Jamawar Waistcoat", url: '/src/assets/images/mens_waistcoat_1793388092885.jpg' },
  { label: "Women's Unstitched Ensemble", url: '/src/assets/images/womens_unstitched_1793388105812.jpg' },
  { label: "Men's Festive Embroidered Kurta", url: '/src/assets/images/mens_festive_kurta_1793555610054.jpg' },
  { label: "Luxury Kashmiri Pashmina Shawl", url: '/src/assets/images/luxury_kashmiri_shawl_1793555467525.jpg' },
  { label: "Women's Royal Velvet Suit", url: '/src/assets/images/womens_velvet_suit_1793555754221.jpg' },
  { label: "Peshawari Norozi Leather Chappal", url: '/src/assets/images/mens_peshawari_chappal_1793555771987.jpg' },
  { label: "Shahzadi Handcrafted Velvet Khussa", url: '/src/assets/images/handcrafted_khussa_1793555786857.jpg' },
  { label: "Mughal Velvet Prince Coat", url: '/src/assets/images/mens_prince_coat_1793555803575.jpg' },
  { label: "Editorial Couple Campaign", url: '/src/assets/images/riwaayat_hero_models_1793388054232.jpg' },
];

export function AdminDashboard({
  token,
  adminUser,
  onLogout,
  onClose,
  onRefreshData,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'categories' | 'orders' | 'inquiries' | 'content' | 'security'
  >('overview');

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filters & Search
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<string>('All');

  // Product Modal (Add/Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New/Edit Product Form state
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState("Men's Shalwar Kameez");
  const [prodPrice, setProdPrice] = useState('');
  const [prodOriginalPrice, setProdOriginalPrice] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodFabric, setProdFabric] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodStock, setProdStock] = useState('25');
  const [prodSizes, setProdSizes] = useState<string>('S, M, L, XL');
  const [prodColors, setProdColors] = useState<{ name: string; hex: string }[]>([
    { name: 'Obsidian Black', hex: '#111111' },
    { name: 'Champagne Ivory', hex: '#F5ECD7' },
  ]);
  const [prodIsNew, setProdIsNew] = useState(false);
  const [prodIsBestSeller, setProdIsBestSeller] = useState(false);

  // Invoice Modal
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Category Input
  const [newCategoryName, setNewCategoryName] = useState('');

  // Security Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const showNotice = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch products
      const pRes = await fetch('/api/products');
      const pData = await pRes.json();
      if (pData.products) setProducts(pData.products);

      // Fetch categories
      const cRes = await fetch('/api/categories');
      const cData = await cRes.json();
      if (cData.categories) setCategories(cData.categories);

      // Fetch orders
      const oRes = await fetch('/api/orders', { headers });
      const oData = await oRes.json();
      if (oData.orders) setOrders(oData.orders);

      // Fetch inquiries
      const iRes = await fetch('/api/inquiries', { headers });
      const iData = await iRes.json();
      if (iData.inquiries) setInquiries(iData.inquiries);

      // Fetch content
      const cntRes = await fetch('/api/content');
      const cntData = await cntRes.json();
      if (cntData.content) setSiteContent(cntData.content);
    } catch (err: any) {
      showNotice(err.message || 'Error fetching data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [token]);

  // Handle open add product
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory(categories[0] || "Men's Shalwar Kameez");
    setProdPrice('');
    setProdOriginalPrice('');
    setProdImage(PRESET_IMAGES[0].url);
    setProdFabric('100% Giza Egyptian Cotton (Liquid Finished)');
    setProdDescription('Handcrafted luxury Pakistani shalwar kameez with refined tonal needlework.');
    setProdStock('30');
    setProdSizes('S, M, L, XL');
    setProdColors([
      { name: 'Obsidian Black', hex: '#111111' },
      { name: 'Champagne Ivory', hex: '#F5ECD7' },
      { name: 'Antique Gold', hex: '#C5A059' }
    ]);
    setProdIsNew(true);
    setProdIsBestSeller(false);
    setIsProductModalOpen(true);
  };

  // Handle open edit product
  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdCategory(p.category);
    setProdPrice(p.price.toString());
    setProdOriginalPrice(p.originalPrice ? p.originalPrice.toString() : '');
    setProdImage(p.image);
    setProdFabric(p.fabric || '');
    setProdDescription(p.description || '');
    setProdStock(p.stockQuantity?.toString() || '25');
    setProdSizes(p.sizes?.join(', ') || 'S, M, L, XL');
    setProdColors(p.colors && p.colors.length > 0 ? p.colors : [{ name: 'Black', hex: '#111111' }]);
    setProdIsNew(Boolean(p.isNewArrival));
    setProdIsBestSeller(Boolean(p.isBestSeller));
    setIsProductModalOpen(true);
  };

  // Save product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodPrice.trim()) {
      showNotice('Product name and price are required.', 'error');
      return;
    }

    const sizesArray = prodSizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: prodName.trim(),
      category: prodCategory,
      price: Number(prodPrice),
      originalPrice: prodOriginalPrice ? Number(prodOriginalPrice) : undefined,
      image: prodImage || PRESET_IMAGES[0].url,
      fabric: prodFabric.trim(),
      description: prodDescription.trim(),
      stockQuantity: Number(prodStock) || 0,
      inStock: Number(prodStock) > 0,
      sizes: sizesArray.length > 0 ? sizesArray : ['Standard'],
      colors: prodColors.length > 0 ? prodColors : [{ name: 'Black', hex: '#111111' }],
      isNewArrival: prodIsNew,
      isBestSeller: prodIsBestSeller,
    };

    try {
      let res;
      if (editingProduct) {
        res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error('Failed to save product');

      showNotice(editingProduct ? 'Product updated successfully' : 'Product created successfully');
      setIsProductModalOpen(false);
      fetchAllData();
      onRefreshData();
    } catch (err: any) {
      showNotice(err.message || 'Error saving product', 'error');
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the catalog?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete product');
      showNotice('Product deleted successfully');
      fetchAllData();
      onRefreshData();
    } catch (err: any) {
      showNotice(err.message || 'Error deleting product', 'error');
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      showNotice(`Order ${orderId} marked as ${status}`);
      fetchAllData();
    } catch (err: any) {
      showNotice(err.message || 'Error updating order status', 'error');
    }
  };

  // Update Inquiry Status
  const handleUpdateInquiryStatus = async (inqId: string, status: 'New' | 'Replied') => {
    try {
      const res = await fetch(`/api/inquiries/${inqId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update inquiry');
      showNotice(`Inquiry marked as ${status}`);
      fetchAllData();
    } catch (err: any) {
      showNotice(err.message || 'Error updating inquiry', 'error');
    }
  };

  // Add Category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      if (!res.ok) throw new Error('Failed to add category');
      showNotice(`Category "${newCategoryName}" added successfully`);
      setNewCategoryName('');
      fetchAllData();
      onRefreshData();
    } catch (err: any) {
      showNotice(err.message || 'Error adding category', 'error');
    }
  };

  // Delete Category
  const handleDeleteCategory = async (catName: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${catName}"?`)) return;

    try {
      const res = await fetch(`/api/categories/${encodeURIComponent(catName)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete category');
      showNotice(`Category "${catName}" deleted successfully`);
      if (selectedProductCategory === catName) setSelectedProductCategory('All');
      fetchAllData();
      onRefreshData();
    } catch (err: any) {
      showNotice(err.message || 'Error deleting category', 'error');
    }
  };

  // Save Website Content
  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteContent) return;

    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(siteContent),
      });
      if (!res.ok) throw new Error('Failed to update website content');
      showNotice('Website content updated and saved to persistent database');
      onRefreshData();
    } catch (err: any) {
      showNotice(err.message || 'Error updating content', 'error');
    }
  };

  // Update Security Credentials (works seamlessly in unlocked mode)
  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() && !newPassword.trim()) {
      showNotice('Please enter a new username or new password to save.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/admin/credentials', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: currentPassword.trim() || undefined,
          newUsername: newUsername.trim() || undefined,
          newPassword: newPassword.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update credentials');
      showNotice('Admin credentials updated successfully');
      setCurrentPassword('');
      setNewUsername('');
      setNewPassword('');
      fetchAllData();
    } catch (err: any) {
      showNotice(err.message || 'Error updating credentials', 'error');
    }
  };

  // Image Upload helper (converts to base64)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ imageBase64: base64 }),
        });
        const data = await res.json();
        if (data.url) {
          setProdImage(data.url);
          showNotice('Image uploaded and set successfully');
        }
      } catch (err) {
        setProdImage(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  // Quick Inline Price/Stock Updater
  const handleQuickUpdateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Update failed');
      showNotice('Product updated');
      fetchAllData();
      onRefreshData();
    } catch (err: any) {
      showNotice(err.message || 'Error updating product', 'error');
    }
  };

  // KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const confirmedOrders = orders.filter((o) => o.status === 'Confirmed').length;
  const processingOrders = orders.filter((o) => o.status === 'Processing').length;
  const shippedOrders = orders.filter((o) => o.status === 'Shipped').length;
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;
  const newInquiries = inquiries.filter((i) => i.status === 'New').length;
  const lowStockCount = products.filter((p) => p.stockQuantity <= 5).length;
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  // Category Garments Counter Helper (handles special collections New Arrivals & Best Sellers)
  const getCategoryCount = (catName: string) => {
    if (catName === 'All') return products.length;
    if (catName === 'New Arrivals') return products.filter((p) => Boolean(p.isNewArrival)).length;
    if (catName === 'Best Sellers') return products.filter((p) => Boolean(p.isBestSeller)).length;
    return products.filter((p) => p.category === catName).length;
  };

  // Filtered Products (correctly matches standard categories as well as New Arrivals and Best Sellers)
  const filteredProducts = products.filter((p) => {
    let matchesCat = true;
    if (selectedProductCategory !== 'All') {
      if (selectedProductCategory === 'New Arrivals') {
        matchesCat = Boolean(p.isNewArrival);
      } else if (selectedProductCategory === 'Best Sellers') {
        matchesCat = Boolean(p.isBestSeller);
      } else {
        matchesCat = p.category === selectedProductCategory;
      }
    }
    const matchesSearch = !productSearch.trim() || 
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
      Boolean(p.fabric && p.fabric.toLowerCase().includes(productSearch.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderFilter === 'All' || o.status === orderFilter;
    const matchesSearch = !orderSearch.trim() || 
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.city.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#0F0F0F] text-white flex flex-col overflow-hidden font-sans">
      
      {/* Top Header Bar */}
      <header className="h-16 px-4 sm:px-6 bg-[#171717] border-b border-[#D4AF37]/30 flex items-center justify-between shrink-0 shadow-md">
        
        {/* Left: Brand & Return */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs text-[#D4AF37] hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 border border-[#D4AF37]/40 cursor-pointer"
            title="Return to public customer website"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit to Storefront</span>
            <span className="sm:hidden">Exit</span>
          </button>

          <div className="hidden md:block border-l border-white/15 h-5" />

          <div className="flex items-center gap-2.5">
            <h1 className="font-brand text-lg tracking-normal uppercase font-black text-white">
              RIWAAYAT WEAR
            </h1>
            <span className="bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-none font-mono">
              Admin Suite
            </span>
          </div>
        </div>

        {/* Right: Actions, Database Status, Logout */}
        <div className="flex items-center gap-3">
          <button
            onClick={fetchAllData}
            className="p-2 text-neutral-300 hover:text-[#D4AF37] transition-colors rounded-full hover:bg-white/5"
            title="Sync & Refresh Database"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#D4AF37]' : ''}`} />
          </button>

          <div className="hidden lg:flex items-center gap-2 bg-black/40 px-3 py-1 border border-white/10 text-xs text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] text-[#D4AF37]">{adminUser?.username || 'admin'}</span>
            <span className="text-[10px] text-neutral-400">· Lahore Time: PKT</span>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-xs text-amber-200 hover:text-white transition-colors bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 px-3 py-1.5 border border-[#D4AF37]/50 cursor-pointer"
            title="Lock Admin Panel and Sign Out"
          >
            <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">Lock Panel</span>
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs text-neutral-200 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 border border-white/20 cursor-pointer"
            title="Close Admin Suite"
          >
            <X className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </header>

      {/* Responsive Navigation Tabs (Mobile horizontal scroll / Desktop sidebar) */}
      <div className="lg:hidden bg-[#141414] border-b border-white/10 overflow-x-auto no-scrollbar flex items-center px-2 py-1 gap-1 text-xs">
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'orders', label: `Orders (${orders.length})`, badge: pendingOrders, icon: ShoppingBag },
          { id: 'categories', label: 'Categories', icon: Layers },
          { id: 'inquiries', label: `Inquiries (${newInquiries})`, icon: MessageSquare },
          { id: 'content', label: 'Site Content', icon: FileEdit },
          { id: 'security', label: 'Security', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`whitespace-nowrap px-3 py-2 flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#D4AF37] text-[#121212] font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge ? (
                <span className="ml-1 px-1 bg-red-500 text-white text-[9px] rounded-full">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:flex w-64 bg-[#141414] border-r border-white/10 flex-col justify-between shrink-0">
          <div className="p-4 space-y-1.5">
            <div className="px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
              Management Modules
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-r-4 border-[#D4AF37] font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Executive Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3.5 py-3 text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-r-4 border-[#D4AF37] font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 shrink-0" />
                <span>Garments Catalog</span>
              </div>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-3 text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-r-4 border-[#D4AF37] font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span>Customer Orders</span>
              </div>
              {pendingOrders > 0 ? (
                <span className="text-[10px] bg-[#D4AF37] text-[#121212] font-bold px-2 py-0.5 rounded-full font-mono">
                  {pendingOrders} new
                </span>
              ) : (
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono">
                  {orders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center justify-between px-3.5 py-3 text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-r-4 border-[#D4AF37] font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 shrink-0" />
                <span>Categories</span>
              </div>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono">
                {categories.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center justify-between px-3.5 py-3 text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-r-4 border-[#D4AF37] font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>Contact Inquiries</span>
              </div>
              {newInquiries > 0 ? (
                <span className="text-[10px] bg-[#25D366] text-[#121212] font-bold px-2 py-0.5 rounded-full font-mono">
                  {newInquiries}
                </span>
              ) : (
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono">
                  {inquiries.length}
                </span>
              )}
            </button>

            <div className="pt-2 border-t border-white/10">
              <button
                onClick={() => setActiveTab('content')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'content'
                    ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-r-4 border-[#D4AF37] font-bold'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileEdit className="w-4 h-4 shrink-0" />
                <span>Storefront Copy</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'security'
                    ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-r-4 border-[#D4AF37] font-bold'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Shield className="w-4 h-4 shrink-0" />
                <span>Admin Security</span>
              </button>
            </div>
          </div>

          {/* Database & Atelier Info & Lock Action */}
          <div className="p-4 border-t border-white/10 space-y-2.5">
            <button
              onClick={onLogout}
              className="w-full py-2.5 px-3 bg-red-950/40 hover:bg-red-900/60 border border-red-700/50 text-red-200 text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              title="Lock Admin Panel and Sign Out"
            >
              <Lock className="w-3.5 h-3.5 text-red-400" />
              <span className="font-semibold uppercase tracking-wider text-[11px]">Lock Admin Panel</span>
            </button>

            <div className="bg-black/30 p-2.5 text-[11px] text-neutral-400 space-y-1 border border-white/5">
              <div className="flex items-center justify-between">
                <span>Database:</span>
                <span className="font-mono text-emerald-400">riwaayat_db.json</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Access:</span>
                <span className="text-[#D4AF37] font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#D4AF37]" /> Locked & Protected
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Content View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#0F0F0F]">
          
          {/* Toast Notification */}
          {notification && (
            <div
              className={`mb-6 p-4 border text-xs flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2 ${
                notification.type === 'success'
                  ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
                  : 'bg-red-950/90 border-red-500 text-red-200'
              }`}
            >
              <div className="flex items-center gap-2.5 font-medium">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{notification.message}</span>
              </div>
              <button onClick={() => setNotification(null)} className="p-1 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ================= MODULE 1: OVERVIEW ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-medium text-white tracking-wide">
                    Atelier Overview & Operations
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Live operational metrics for RIWAAYAT WEAR · Lahore Atelier
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleOpenAddProduct}
                    className="px-4 py-2 bg-[#D4AF37] hover:bg-[#c5a059] text-[#121212] text-xs uppercase tracking-wider font-bold transition-all shadow cursor-pointer flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Garment</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/20 text-xs uppercase tracking-wider font-medium transition-all cursor-pointer"
                  >
                    Manage Orders
                  </button>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#171717] p-5 border border-white/10 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between text-neutral-400 text-xs uppercase tracking-wider mb-2">
                    <span>Total Gross Revenue</span>
                    <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-serif text-white">
                    {formatPrice(totalRevenue)}
                  </div>
                  <div className="text-[11px] text-[#25D366] mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Nationwide Sales ({orders.length} orders)</span>
                  </div>
                </div>

                <div className="bg-[#171717] p-5 border border-white/10 shadow-sm">
                  <div className="flex items-center justify-between text-neutral-400 text-xs uppercase tracking-wider mb-2">
                    <span>Average Order Value</span>
                    <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-serif text-white">
                    {formatPrice(avgOrderValue)}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-2">
                    Across all customer purchases
                  </div>
                </div>

                <div className="bg-[#171717] p-5 border border-white/10 shadow-sm">
                  <div className="flex items-center justify-between text-neutral-400 text-xs uppercase tracking-wider mb-2">
                    <span>Garments in Catalog</span>
                    <Package className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-serif text-white">
                    {products.length}
                  </div>
                  <div className="text-[11px] text-amber-400 mt-2">
                    {lowStockCount > 0 ? `${lowStockCount} garments low on stock` : 'All items well stocked'}
                  </div>
                </div>

                <div className="bg-[#171717] p-5 border border-white/10 shadow-sm">
                  <div className="flex items-center justify-between text-neutral-400 text-xs uppercase tracking-wider mb-2">
                    <span>Inquiries / Leads</span>
                    <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-serif text-white">
                    {inquiries.length}
                  </div>
                  <div className="text-[11px] text-[#25D366] mt-2">
                    {newInquiries} requiring reply
                  </div>
                </div>
              </div>

              {/* Order Status Pipeline Cards */}
              <div className="bg-[#171717] p-5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base font-semibold text-white">
                    Order Status Pipeline (Click to filter)
                  </h3>
                  <span className="text-xs text-neutral-400">Total: {orders.length} orders</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    { label: 'Pending', count: pendingOrders, color: 'border-amber-500/40 text-amber-400 bg-amber-950/20' },
                    { label: 'Confirmed', count: confirmedOrders, color: 'border-yellow-500/40 text-yellow-400 bg-yellow-950/20' },
                    { label: 'Processing', count: processingOrders, color: 'border-blue-500/40 text-blue-400 bg-blue-950/20' },
                    { label: 'Shipped', count: shippedOrders, color: 'border-indigo-500/40 text-indigo-400 bg-indigo-950/20' },
                    { label: 'Delivered', count: deliveredOrders, color: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20' },
                    { label: 'Cancelled', count: orders.filter(o => o.status === 'Cancelled').length, color: 'border-red-500/40 text-red-400 bg-red-950/20' },
                  ].map((st) => (
                    <button
                      key={st.label}
                      onClick={() => {
                        setOrderFilter(st.label);
                        setActiveTab('orders');
                      }}
                      className={`p-3 border text-left rounded-none transition-all hover:scale-[1.02] cursor-pointer ${st.color}`}
                    >
                      <div className="text-[11px] font-semibold uppercase tracking-wider">{st.label}</div>
                      <div className="text-xl font-bold font-serif mt-1">{st.count}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div className="bg-[#171717] p-5 sm:p-6 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-semibold text-white">
                    Latest Customer Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#D4AF37] hover:underline cursor-pointer"
                  >
                    View All {orders.length} Orders →
                  </button>
                </div>

                <div className="divide-y divide-white/5 overflow-x-auto">
                  {orders.slice(0, 5).map((o) => (
                    <div key={o.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#D4AF37]">{o.id}</span>
                          <span className="text-neutral-500">·</span>
                          <span className="font-semibold text-white">{o.customerName}</span>
                          <span className="text-neutral-500">·</span>
                          <span className="text-neutral-300 font-mono">{o.phone}</span>
                        </div>
                        <div className="text-neutral-400 text-[11px] mt-0.5">
                          {o.city} · {o.items?.length || 1} garment(s) · {o.paymentMethod}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-bold text-white">{formatPrice(o.total)}</div>
                          <span className="text-[10px] text-neutral-400">{new Date(o.createdAt).toLocaleDateString()}</span>
                        </div>

                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                          className="bg-black/60 border border-white/20 text-white text-xs px-2 py-1 focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ================= MODULE 2: PRODUCTS ================= */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              {/* Header & Add Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <h2 className="font-serif text-2xl font-medium text-white">
                    Garments Catalog & Inventory ({products.length})
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Add new Pakistani shalwar kameez, edit prices, manage sizes, colors, and stock
                  </p>
                </div>

                <button
                  onClick={handleOpenAddProduct}
                  className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#c5a059] text-[#121212] text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 shadow cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Garment</span>
                </button>
              </div>

              {/* Filters Bar */}
              <div className="bg-[#171717] p-4 border border-white/10 space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {/* Search */}
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Search garments by name, category, or fabric..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-black/40 border border-neutral-700 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="w-full sm:w-auto">
                    <select
                      value={selectedProductCategory}
                      onChange={(e) => setSelectedProductCategory(e.target.value)}
                      className="w-full sm:w-auto px-3 py-2 bg-black/40 border border-neutral-700 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="All">All Categories ({products.length})</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c} ({getCategoryCount(c)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Category quick badges */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                  <button
                    onClick={() => setSelectedProductCategory('All')}
                    className={`px-3 py-1 text-[11px] uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1 ${
                      selectedProductCategory === 'All'
                        ? 'bg-[#D4AF37] text-[#121212] font-bold'
                        : 'bg-white/5 text-neutral-300 hover:text-white'
                    }`}
                  >
                    <span>All</span>
                    <span className="text-[10px] opacity-75 font-mono">({products.length})</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedProductCategory(cat)}
                      className={`whitespace-nowrap px-3 py-1 text-[11px] uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1 ${
                        selectedProductCategory === cat
                          ? 'bg-[#D4AF37] text-[#121212] font-bold'
                          : 'bg-white/5 text-neutral-300 hover:text-white'
                      }`}
                    >
                      <span>{cat}</span>
                      <span className="text-[10px] opacity-75 font-mono">({getCategoryCount(cat)})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-[#171717] border border-white/10 overflow-x-auto shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-black/60 text-neutral-400 uppercase tracking-wider text-[11px]">
                      <th className="p-3.5">Garment Details</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Price (PKR)</th>
                      <th className="p-3.5">Stock</th>
                      <th className="p-3.5">Sizes</th>
                      <th className="p-3.5">Colors</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-neutral-200">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3.5 flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-12 h-14 object-cover object-top border border-white/10 shrink-0 bg-neutral-900"
                          />
                          <div>
                            <div className="font-serif font-semibold text-white text-sm line-clamp-1">
                              {p.name}
                            </div>
                            <div className="text-[11px] text-neutral-400 line-clamp-1">
                              {p.fabric}
                            </div>
                            <div className="flex gap-1.5 mt-1">
                              {p.isNewArrival && (
                                <span className="text-[9px] bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 px-1.5 py-0.2">
                                  New
                                </span>
                              )}
                              {p.isBestSeller && (
                                <span className="text-[9px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.2">
                                  Best Seller
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5 text-neutral-300">{p.category}</td>

                        <td className="p-3.5 font-bold text-white">
                          <div>{formatPrice(p.price)}</div>
                          {p.originalPrice && (
                            <div className="text-[10px] text-neutral-500 line-through">
                              {formatPrice(p.originalPrice)}
                            </div>
                          )}
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`font-semibold ${
                              p.stockQuantity <= 5 ? 'text-amber-400' : 'text-emerald-400'
                            }`}
                          >
                            {p.stockQuantity} pcs
                          </span>
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center gap-1 flex-wrap max-w-[120px]">
                            {p.sizes?.map((s) => (
                              <span key={s} className="bg-white/10 px-1.5 py-0.5 text-[10px]">
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center gap-1">
                            {p.colors?.map((c, i) => (
                              <span
                                key={i}
                                className="w-3.5 h-3.5 rounded-full border border-white/40"
                                style={{ backgroundColor: c.hex }}
                                title={c.name}
                              />
                            ))}
                          </div>
                        </td>

                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1.5 text-neutral-300 hover:text-[#D4AF37] transition-colors cursor-pointer"
                            title="Edit Garment"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 text-neutral-300 hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete Garment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ================= MODULE 3: ORDERS ================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <h2 className="font-serif text-2xl font-medium text-white">
                    Customer Orders ({orders.length})
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Track shipments, customer addresses, phone numbers, and generate print slips
                  </p>
                </div>
              </div>

              {/* Order Search & Filters */}
              <div className="bg-[#171717] p-4 border border-white/10 space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search by Order ID (RW-...), Customer Name, Phone, or City..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-black/40 border border-neutral-700 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Status Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                  {['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => {
                    const count = st === 'All' ? orders.length : orders.filter(o => o.status === st).length;
                    return (
                      <button
                        key={st}
                        onClick={() => setOrderFilter(st)}
                        className={`whitespace-nowrap px-3 py-1.5 text-[11px] uppercase tracking-wider font-medium transition-colors cursor-pointer ${
                          orderFilter === st
                            ? 'bg-[#D4AF37] text-[#121212] font-bold'
                            : 'bg-white/5 text-neutral-300 hover:text-white'
                        }`}
                      >
                        {st} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Orders List */}
              {filteredOrders.length === 0 ? (
                <div className="p-12 text-center text-neutral-500 bg-[#171717] border border-white/10 text-xs">
                  No orders match your filter criteria.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((o) => (
                    <div
                      key={o.id}
                      className="bg-[#171717] border border-white/10 p-5 space-y-4 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-[#D4AF37] text-base">
                            {o.id}
                          </span>
                          <span className="text-neutral-400 text-xs">
                            {new Date(o.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Invoice Slip Trigger */}
                          <button
                            onClick={() => setSelectedInvoiceOrder(o)}
                            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/20 text-xs flex items-center gap-1.5 cursor-pointer"
                            title="Generate Dispatch Slip / Invoice"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Invoice Slip</span>
                          </button>

                          {/* Status Dropdown */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-neutral-400">Status:</span>
                            <select
                              value={o.status}
                              onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                              className="bg-black/60 border border-[#D4AF37]/50 text-white text-xs px-2.5 py-1.5 focus:outline-none"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Customer Info & Address */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-neutral-500 uppercase tracking-wider text-[10px] block mb-1">
                            Customer Details
                          </span>
                          <div className="font-semibold text-white">{o.customerName}</div>
                          <div className="text-neutral-300 font-mono mt-0.5">{o.phone}</div>
                          {o.email && <div className="text-neutral-400">{o.email}</div>}
                          
                          {/* WhatsApp Customer Action */}
                          <a
                            href={`https://wa.me/${o.phone.replace(/[^0-9]/g, '')}?text=Assalam%20o%20Alaikum%20${encodeURIComponent(o.customerName)},%20this%20is%20Riwaayat%20Wear%20in%20Lahore%20regarding%20your%20Order%20${o.id}.%20Status:%20${o.status}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[#25D366] hover:underline mt-2 text-[11px] font-semibold"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5" />
                            <span>WhatsApp Customer</span>
                          </a>
                        </div>

                        <div>
                          <span className="text-neutral-500 uppercase tracking-wider text-[10px] block mb-1">
                            Delivery Destination
                          </span>
                          <div className="text-neutral-200">{o.address}</div>
                          <div className="text-white font-bold mt-0.5">{o.city}, Pakistan</div>
                          {o.notes && (
                            <div className="mt-1 text-[11px] text-amber-300/90 italic">
                              Note: {o.notes}
                            </div>
                          )}
                        </div>

                        <div>
                          <span className="text-neutral-500 uppercase tracking-wider text-[10px] block mb-1">
                            Payment & Total
                          </span>
                          <div className="text-neutral-300">{o.paymentMethod}</div>
                          <div className="text-base font-bold text-white mt-0.5">
                            {formatPrice(o.total)}
                          </div>
                          <div className="text-[11px] text-neutral-400">
                            Subtotal: {formatPrice(o.subtotal)} | Delivery: {o.shippingFee === 0 ? 'FREE' : formatPrice(o.shippingFee)}
                          </div>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="pt-2 border-t border-white/5 space-y-1.5">
                        <span className="text-neutral-500 uppercase tracking-wider text-[10px] block">
                          Ordered Garments:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {o.items?.map((it, idx) => (
                            <div key={idx} className="flex items-center gap-2.5 bg-black/40 p-2 text-xs border border-white/5">
                              {it.image && (
                                <img
                                  src={it.image}
                                  alt={it.productName}
                                  className="w-10 h-12 object-cover shrink-0"
                                />
                              )}
                              <div>
                                <div className="font-semibold text-white line-clamp-1">{it.productName}</div>
                                <div className="text-[11px] text-neutral-400">
                                  Size: {it.size} | Color: {it.color} | Qty: {it.quantity}
                                </div>
                                <div className="font-bold text-neutral-200">
                                  {formatPrice(it.price * it.quantity)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= MODULE 4: CATEGORIES ================= */}
          {activeTab === 'categories' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="font-serif text-2xl font-medium text-white">
                  Product Categories
                </h2>
                <p className="text-xs text-neutral-400">
                  Manage navigational categories and collections
                </p>
              </div>

              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input
                  type="text"
                  placeholder="New Category Name (e.g. Silk Dupattas)"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-black/40 border border-neutral-700 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#c5a059] text-[#121212] text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
                >
                  Add Category
                </button>
              </form>

              <div className="bg-[#171717] border border-white/10 divide-y divide-white/5">
                {categories.map((cat, idx) => {
                  const count = getCategoryCount(cat);
                  const isSpecial = cat === "New Arrivals" || cat === "Best Sellers";
                  return (
                    <div key={idx} className="p-4 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-sm">{cat}</span>
                          {isSpecial && (
                            <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 px-2 py-0.5">
                              Dynamic Collection
                            </span>
                          )}
                        </div>
                        <span className="text-neutral-400 block text-[11px] mt-1">
                          <strong className="text-[#D4AF37]">{count}</strong> garments actively displayed in this category
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedProductCategory(cat);
                            setActiveTab('products');
                          }}
                          className="px-3 py-1.5 text-[11px] bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 transition-colors cursor-pointer"
                        >
                          View Products
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat)}
                          className="p-1.5 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                          title={`Delete category ${cat}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= MODULE 5: INQUIRIES ================= */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-medium text-white">
                  Customer Inquiries & Leads ({inquiries.length})
                </h2>
                <p className="text-xs text-neutral-400">
                  Messages received through the Contact Form on the website
                </p>
              </div>

              <div className="space-y-3">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="bg-[#171717] border border-white/10 p-5 space-y-3 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white text-sm">{inq.name}</h4>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-mono ${
                              inq.status === 'New'
                                ? 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40'
                                : 'bg-neutral-800 text-neutral-400'
                            }`}
                          >
                            {inq.status}
                          </span>
                        </div>
                        <div className="text-neutral-400 text-xs font-mono mt-0.5">
                          {inq.phone} {inq.email && `· ${inq.email}`} · {new Date(inq.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateInquiryStatus(inq.id, inq.status === 'New' ? 'Replied' : 'New')}
                          className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 cursor-pointer"
                        >
                          Mark {inq.status === 'New' ? 'Replied' : 'New'}
                        </button>

                        {inq.phone && (
                          <a
                            href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=Assalam%20o%20Alaikum%20${encodeURIComponent(inq.name)},%20this%20is%20Riwaayat%20Wear%20responding%20to%20your%20message.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-[#25D366] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#20bd5a]"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5" />
                            <span>Reply on WhatsApp</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {inq.subject && (
                      <div className="text-xs font-semibold text-[#D4AF37]">
                        Subject: {inq.subject}
                      </div>
                    )}

                    <p className="text-xs text-neutral-300 bg-black/40 p-3.5 border border-white/5 leading-relaxed">
                      "{inq.message}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= MODULE 6: SITE CONTENT ================= */}
          {activeTab === 'content' && siteContent && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="font-serif text-2xl font-medium text-white">
                  Storefront Copy & Brand Settings
                </h2>
                <p className="text-xs text-neutral-400">
                  Update homepage hero texts, Lahore store address, WhatsApp number and brand narrative
                </p>
              </div>

              <form onSubmit={handleSaveContent} className="bg-[#171717] p-6 border border-white/10 space-y-4 text-xs">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-neutral-300 mb-1">
                    Website Name / Brand Name
                  </label>
                  <input
                    type="text"
                    value={siteContent.brandName}
                    onChange={(e) => setSiteContent({ ...siteContent, brandName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-neutral-300 mb-1">
                    Brand Tagline
                  </label>
                  <input
                    type="text"
                    value={siteContent.tagline}
                    onChange={(e) => setSiteContent({ ...siteContent, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-neutral-300 mb-1">
                      Homepage Hero Headline
                    </label>
                    <input
                      type="text"
                      value={siteContent.heroHeadline}
                      onChange={(e) => setSiteContent({ ...siteContent, heroHeadline: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-black/40 border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-neutral-300 mb-1">
                      Official WhatsApp Number
                    </label>
                    <input
                      type="text"
                      value={siteContent.whatsappNumber}
                      onChange={(e) => setSiteContent({ ...siteContent, whatsappNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-black/40 border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-neutral-300 mb-1">
                    Hero Subheadline / Description
                  </label>
                  <textarea
                    rows={2}
                    value={siteContent.heroSubheadline}
                    onChange={(e) => setSiteContent({ ...siteContent, heroSubheadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-neutral-300 mb-1">
                    Lahore Physical Store Address
                  </label>
                  <input
                    type="text"
                    value={siteContent.address}
                    onChange={(e) => setSiteContent({ ...siteContent, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-neutral-300 mb-1">
                    Store / Atelier Timings
                  </label>
                  <input
                    type="text"
                    value={siteContent.storeHours}
                    onChange={(e) => setSiteContent({ ...siteContent, storeHours: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-neutral-300 mb-1">
                    About Us Heritage Narrative
                  </label>
                  <textarea
                    rows={3}
                    value={siteContent.aboutText}
                    onChange={(e) => setSiteContent({ ...siteContent, aboutText: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#D4AF37] hover:bg-[#c5a059] text-[#121212] text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
                >
                  Save Storefront Copy to Database
                </button>
              </form>
            </div>
          )}

          {/* ================= MODULE 7: SECURITY ================= */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h2 className="font-serif text-2xl font-medium text-white">
                  Administrator Credentials
                </h2>
                <p className="text-xs text-neutral-400">
                  Update your username and master password stored securely on server
                </p>
              </div>

              <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 p-3.5 text-xs text-[#D4AF37] flex items-center gap-2">
                <Shield className="w-4 h-4 shrink-0" />
                <span>The Admin Suite is <strong>Locked & Protected</strong>. Enter your current password below to update your administrative username or password.</span>
              </div>

              <form onSubmit={handleUpdateCredentials} className="bg-[#171717] p-6 border border-white/10 space-y-4 text-xs">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-neutral-300 mb-1">
                    Current Password (Required)
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter current admin password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-neutral-300 mb-1">
                    New Admin Username
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. riwaayat_master"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-neutral-300 mb-1">
                    New Admin Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password (min 4 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#c5a059] text-[#121212] text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
                >
                  Save New Admin Credentials
                </button>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* ================= MODAL: ADD / EDIT PRODUCT ================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#171717] border-2 border-[#D4AF37]/50 w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 text-white space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#D4AF37] font-bold">Garment Catalog</span>
                <h3 className="font-serif text-2xl font-semibold text-white">
                  {editingProduct ? 'Edit Garment Details' : 'Add New Garment to Collection'}
                </h3>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider font-semibold text-neutral-300 mb-1">
                  Garment Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Obsidian Black Shalwar Kameez"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-neutral-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    {categories
                      .filter((c) => c !== "New Arrivals" && c !== "Best Sellers")
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-neutral-300 mb-1">
                    Price (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="9850"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-neutral-300 mb-1">
                    Original Price (Optional)
                  </label>
                  <input
                    type="number"
                    placeholder="12500"
                    value={prodOriginalPrice}
                    onChange={(e) => setProdOriginalPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Image Selection & Presets */}
              <div>
                <label className="block uppercase tracking-wider font-semibold text-neutral-300 mb-1">
                  Product Image (File Upload, Presets, or URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="/src/assets/images/... or https://..."
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                    className="flex-1 px-3.5 py-2 bg-black/40 border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                  <label className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs cursor-pointer flex items-center gap-1.5 border border-white/20">
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Visual Preset Thumbnail Selector */}
                <div className="mt-3">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1.5">
                    Or select high-definition Pakistani fashion lookbook photo:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {PRESET_IMAGES.map((preset, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setProdImage(preset.url)}
                        className={`p-1 border text-left flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          prodImage === preset.url
                            ? 'border-[#D4AF37] bg-[#D4AF37]/15 ring-1 ring-[#D4AF37]'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-16 object-cover object-top"
                        />
                        <span className="text-[10px] text-neutral-300 text-center truncate w-full">
                          {preset.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-neutral-300 mb-1">
                    Fabric Composition & Weave
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 100% Giza Egyptian Cotton (Liquid Finished)"
                    value={prodFabric}
                    onChange={(e) => setProdFabric(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-neutral-300 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-neutral-300 mb-1">
                  Sizes (comma-separated, e.g. S, M, L, XL, XXL)
                </label>
                <input
                  type="text"
                  placeholder="S, M, L, XL, XXL"
                  value={prodSizes}
                  onChange={(e) => setProdSizes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-neutral-300 mb-1">
                  Garment Description & Needlework Details
                </label>
                <textarea
                  rows={3}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodIsNew}
                    onChange={(e) => setProdIsNew(e.target.checked)}
                    className="accent-[#D4AF37] w-4 h-4 cursor-pointer"
                  />
                  <span>Mark as New Arrival</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodIsBestSeller}
                    onChange={(e) => setProdIsBestSeller(e.target.checked)}
                    className="accent-[#D4AF37] w-4 h-4 cursor-pointer"
                  />
                  <span>Mark as Best Seller</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2 bg-neutral-800 text-neutral-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#D4AF37] hover:bg-[#c5a059] text-[#121212] font-bold uppercase tracking-wider cursor-pointer shadow"
                >
                  Save Garment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: INVOICE / DISPATCH SLIP ================= */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-[#121212] w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-neutral-300 space-y-6">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between border-b pb-4">
              <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#8C712E]">
                Official Dispatch Slip & Invoice
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-[#121212] text-white hover:bg-neutral-800 text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button
                  onClick={() => setSelectedInvoiceOrder(null)}
                  className="p-1.5 text-neutral-500 hover:text-black cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Invoice Header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-brand text-2xl font-black tracking-normal uppercase text-black">
                  RIWAAYAT WEAR
                </h2>
                <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
                  Timeless Tradition, Modern Style
                </p>
                <p className="text-xs text-neutral-600 mt-2">
                  Science College, Wahdat Road, Lahore, Pakistan<br />
                  WhatsApp Concierge: {DISPLAY_WHATSAPP_NUMBER}
                </p>
              </div>

              <div className="text-right text-xs">
                <div className="font-mono font-bold text-base text-[#121212]">
                  {selectedInvoiceOrder.id}
                </div>
                <div className="text-neutral-500">
                  Date: {new Date(selectedInvoiceOrder.createdAt).toLocaleDateString()}
                </div>
                <div className="mt-1 inline-block px-2 py-0.5 bg-neutral-100 border text-[11px] font-semibold text-neutral-800">
                  Status: {selectedInvoiceOrder.status}
                </div>
              </div>
            </div>

            {/* Customer Details Box */}
            <div className="bg-neutral-50 p-4 border border-neutral-200 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-neutral-700 block uppercase tracking-wider text-[10px]">
                  Consignee / Customer:
                </span>
                <div className="font-semibold text-neutral-900 mt-0.5">{selectedInvoiceOrder.customerName}</div>
                <div className="text-neutral-600 font-mono mt-0.5">{selectedInvoiceOrder.phone}</div>
                {selectedInvoiceOrder.email && <div className="text-neutral-500">{selectedInvoiceOrder.email}</div>}
              </div>

              <div>
                <span className="font-bold text-neutral-700 block uppercase tracking-wider text-[10px]">
                  Shipping Destination:
                </span>
                <div className="text-neutral-800 mt-0.5">{selectedInvoiceOrder.address}</div>
                <div className="font-bold text-neutral-900">{selectedInvoiceOrder.city}, Pakistan</div>
                {selectedInvoiceOrder.notes && (
                  <div className="text-[11px] text-amber-700 italic mt-1">Note: {selectedInvoiceOrder.notes}</div>
                )}
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-neutral-800 text-[11px] uppercase tracking-wider text-neutral-600">
                  <th className="py-2">Garment</th>
                  <th className="py-2">Size</th>
                  <th className="py-2">Color</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Price (PKR)</th>
                  <th className="py-2 text-right">Total (PKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {selectedInvoiceOrder.items?.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 font-semibold text-neutral-900">{it.productName}</td>
                    <td className="py-2.5 text-neutral-600">{it.size}</td>
                    <td className="py-2.5 text-neutral-600">{it.color}</td>
                    <td className="py-2.5 text-center font-bold text-neutral-800">{it.quantity}</td>
                    <td className="py-2.5 text-right font-mono">{formatPrice(it.price)}</td>
                    <td className="py-2.5 text-right font-mono font-bold">{formatPrice(it.price * it.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Calculations */}
            <div className="border-t pt-3 space-y-1.5 text-xs text-right max-w-xs ml-auto">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal:</span>
                <span className="font-mono">{formatPrice(selectedInvoiceOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Delivery:</span>
                <span>{selectedInvoiceOrder.shippingFee === 0 ? 'FREE' : formatPrice(selectedInvoiceOrder.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#121212] pt-2 border-t">
                <span>Total Amount:</span>
                <span className="font-mono">{formatPrice(selectedInvoiceOrder.total)}</span>
              </div>
              <div className="text-[11px] text-neutral-500 pt-1">
                Payment Mode: <strong>{selectedInvoiceOrder.paymentMethod}</strong>
              </div>
            </div>

            {/* Footer Slip Notice */}
            <div className="border-t pt-4 text-center text-[11px] text-neutral-500">
              Shukriya for choosing RIWAAYAT WEAR · Science College, Wahdat Road, Lahore · Dispatched via Express Courier
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
