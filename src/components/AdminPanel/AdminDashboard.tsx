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
  Image as ImageIcon
} from 'lucide-react';
import type { Product, Order, Inquiry, SiteContent, ProductColor, OrderStatus } from '../../types';
import { formatPrice } from '../../utils/currency';
import { WhatsAppIcon } from '../FloatingWhatsApp';
import { createWhatsAppUrl } from '../../utils/whatsapp';

interface AdminDashboardProps {
  token: string;
  adminUser: any;
  onLogout: () => void;
  onClose: () => void;
  onRefreshData: () => void;
}

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
    { name: 'Black', hex: '#111111' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Gold', hex: '#D4AF37' },
  ]);
  const [prodIsNew, setProdIsNew] = useState(false);
  const [prodIsBestSeller, setProdIsBestSeller] = useState(false);

  // New Category input
  const [newCategoryName, setNewCategoryName] = useState('');

  // Security Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Orders Filter
  const [orderFilter, setOrderFilter] = useState<string>('All');

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
    setProdImage('/src/assets/images/mens_shalwar_kameez_1793388068297.jpg');
    setProdFabric('100% Giza Egyptian Cotton');
    setProdDescription('Handcrafted luxury Pakistani shalwar kameez.');
    setProdStock('30');
    setProdSizes('S, M, L, XL');
    setProdColors([
      { name: 'Obsidian Black', hex: '#111111' },
      { name: 'Champagne Ivory', hex: '#F5ECD7' },
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
    setProdColors(p.colors || [{ name: 'Default', hex: '#111111' }]);
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
      image: prodImage || '/src/assets/images/mens_shalwar_kameez_1793388068297.jpg',
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
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

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
      showNotice('Website content updated successfully');
      onRefreshData();
    } catch (err: any) {
      showNotice(err.message || 'Error updating content', 'error');
    }
  };

  // Update Security Credentials
  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showNotice('Please enter your current password.', 'error');
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
          currentPassword,
          newUsername: newUsername || undefined,
          newPassword: newPassword || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update credentials');
      showNotice('Credentials updated successfully');
      setCurrentPassword('');
      setNewUsername('');
      setNewPassword('');
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
        setProdImage(base64); // fallback direct data url
      }
    };
    reader.readAsDataURL(file);
  };

  // KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const newInquiries = inquiries.filter((i) => i.status === 'New').length;

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'All') return true;
    return o.status === orderFilter;
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#121212] text-white flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="h-16 px-4 sm:px-6 bg-[#1a1a1a] border-b border-[#D4AF37]/30 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs text-[#D4AF37] hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 border border-[#D4AF37]/30"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Storefront</span>
          </button>
          <div className="hidden sm:block border-l border-white/20 h-5" />
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg tracking-[0.2em] uppercase font-semibold text-[#D4AF37]">
              RIWAAYAT WEAR
            </span>
            <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 px-2 py-0.5 uppercase tracking-wider font-mono">
              Admin Suite
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAllData}
            className="p-2 text-neutral-400 hover:text-white transition-colors"
            title="Refresh Database"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-300">
            <Shield className="w-3.5 h-3.5 text-[#25D366]" />
            <span className="font-mono text-[11px]">{adminUser?.username || 'admin'}</span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors bg-red-950/40 hover:bg-red-950/80 px-3 py-1.5 border border-red-800/60"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Navigation */}
        <div className="w-16 sm:w-60 bg-[#161616] border-r border-white/10 flex flex-col justify-between shrink-0">
          <div className="py-4 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider transition-colors ${
                activeTab === 'overview'
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-r-2 border-[#D4AF37] font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-4 py-3 text-xs uppercase tracking-wider transition-colors ${
                activeTab === 'products'
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-r-2 border-[#D4AF37] font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Products</span>
              </div>
              <span className="hidden sm:inline text-[10px] bg-white/10 px-1.5 py-0.5 rounded font-mono">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider transition-colors ${
                activeTab === 'categories'
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-r-2 border-[#D4AF37] font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Categories</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-4 py-3 text-xs uppercase tracking-wider transition-colors ${
                activeTab === 'orders'
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-r-2 border-[#D4AF37] font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Orders</span>
              </div>
              {pendingOrders > 0 && (
                <span className="hidden sm:inline text-[10px] bg-[#D4AF37] text-[#121212] font-bold px-1.5 py-0.5 rounded-full font-mono">
                  {pendingOrders}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center justify-between px-4 py-3 text-xs uppercase tracking-wider transition-colors ${
                activeTab === 'inquiries'
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-r-2 border-[#D4AF37] font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Inquiries</span>
              </div>
              {newInquiries > 0 && (
                <span className="hidden sm:inline text-[10px] bg-[#25D366] text-[#121212] font-bold px-1.5 py-0.5 rounded-full font-mono">
                  {newInquiries}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider transition-colors ${
                activeTab === 'content'
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-r-2 border-[#D4AF37] font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileEdit className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Site Content</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider transition-colors ${
                activeTab === 'security'
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-r-2 border-[#D4AF37] font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Admin Security</span>
            </button>
          </div>

          <div className="p-3 sm:p-4 border-t border-white/10 text-neutral-500 text-[11px] hidden sm:block font-mono">
            DB: riwaayat_db.json
            <div className="text-[10px] text-emerald-500">● Persistent Storage</div>
          </div>
        </div>

        {/* Content View Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#121212]">
          
          {/* Toast Notification */}
          {notification && (
            <div
              className={`mb-6 p-4 border text-xs flex items-center justify-between ${
                notification.type === 'success'
                  ? 'bg-emerald-950/80 border-emerald-600 text-emerald-200'
                  : 'bg-red-950/80 border-red-600 text-red-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{notification.message}</span>
              </div>
              <button onClick={() => setNotification(null)}>
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ================= TAB 1: OVERVIEW ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-white mb-1">
                  Atelier Executive Summary
                </h2>
                <p className="text-xs text-neutral-400">
                  Real-time metrics from your live store and persistent orders database
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#1a1a1a] p-5 border border-white/10 shadow-sm">
                  <div className="flex items-center justify-between text-neutral-400 text-xs uppercase tracking-wider mb-2">
                    <span>Total Sales</span>
                    <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div className="text-2xl font-bold font-serif text-white">
                    {formatPrice(totalRevenue)}
                  </div>
                  <div className="text-[11px] text-[#25D366] mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Nationwide Gross Volume</span>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] p-5 border border-white/10 shadow-sm">
                  <div className="flex items-center justify-between text-neutral-400 text-xs uppercase tracking-wider mb-2">
                    <span>Total Orders</span>
                    <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div className="text-2xl font-bold font-serif text-white">
                    {orders.length}
                  </div>
                  <div className="text-[11px] text-amber-400 mt-2">
                    {pendingOrders} awaiting fulfillment
                  </div>
                </div>

                <div className="bg-[#1a1a1a] p-5 border border-white/10 shadow-sm">
                  <div className="flex items-center justify-between text-neutral-400 text-xs uppercase tracking-wider mb-2">
                    <span>Active Products</span>
                    <Package className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div className="text-2xl font-bold font-serif text-white">
                    {products.length}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-2">
                    Across {categories.length} categories
                  </div>
                </div>

                <div className="bg-[#1a1a1a] p-5 border border-white/10 shadow-sm">
                  <div className="flex items-center justify-between text-neutral-400 text-xs uppercase tracking-wider mb-2">
                    <span>Customer Inquiries</span>
                    <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div className="text-2xl font-bold font-serif text-white">
                    {inquiries.length}
                  </div>
                  <div className="text-[11px] text-[#25D366] mt-2">
                    {newInquiries} new messages
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent Orders Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Recent Orders */}
                <div className="lg:col-span-8 bg-[#1a1a1a] p-5 sm:p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-lg font-semibold text-white">
                      Recent Orders
                    </h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-[#D4AF37] hover:underline"
                    >
                      View All Orders ({orders.length}) →
                    </button>
                  </div>

                  <div className="divide-y divide-white/5 overflow-x-auto">
                    {orders.slice(0, 4).map((o) => (
                      <div key={o.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-white">{o.id}</span>
                            <span className="text-neutral-400">·</span>
                            <span className="text-neutral-200">{o.customerName}</span>
                          </div>
                          <div className="text-neutral-400 text-[11px] mt-0.5">
                            {o.city} · {o.items?.length || 1} items · {o.paymentMethod}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-white">{formatPrice(o.total)}</div>
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] mt-0.5 font-medium ${
                              o.status === 'Delivered'
                                ? 'bg-emerald-950 text-emerald-300'
                                : o.status === 'Processing'
                                ? 'bg-blue-950 text-blue-300'
                                : o.status === 'Confirmed'
                                ? 'bg-amber-950 text-amber-300'
                                : 'bg-neutral-800 text-neutral-300'
                            }`}
                          >
                            {o.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Operations Checklist */}
                <div className="lg:col-span-4 bg-[#1a1a1a] p-5 sm:p-6 border border-white/10 space-y-4">
                  <h3 className="font-serif text-lg font-semibold text-white">
                    Quick Operational Tools
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={handleOpenAddProduct}
                      className="w-full py-2.5 px-3 bg-[#D4AF37] hover:bg-[#c5a059] text-[#121212] text-xs uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Product</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('content')}
                      className="w-full py-2.5 px-3 bg-white/5 hover:bg-white/10 text-white text-xs uppercase tracking-wider font-medium transition-colors border border-white/20 flex items-center justify-center gap-2"
                    >
                      <FileEdit className="w-4 h-4 text-[#D4AF37]" />
                      <span>Edit Website Headlines</span>
                    </button>

                    <a
                      href={createWhatsAppUrl('Official Riwaayat Wear Admin dispatch notification test.')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] text-xs uppercase tracking-wider font-semibold transition-colors border border-[#25D366]/40 flex items-center justify-center gap-2"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      <span>Open WhatsApp Web (+923210424424)</span>
                    </a>
                  </div>

                  <div className="pt-3 border-t border-white/10 text-[11px] text-neutral-400 space-y-1">
                    <div>Address: Science College, Wahdat Road, Lahore</div>
                    <div>WhatsApp: 03210424424</div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ================= TAB 2: PRODUCTS ================= */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-medium text-white">
                    Products & Inventory ({products.length})
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Add, edit, manage prices, sizes, colors and delete catalog garments
                  </p>
                </div>

                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#c5a059] text-[#121212] text-xs uppercase tracking-wider font-bold transition-colors flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-[#1a1a1a] border border-white/10 overflow-x-auto shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-black/40 text-neutral-400 uppercase tracking-wider text-[11px]">
                      <th className="p-3.5">Garment</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Price (PKR)</th>
                      <th className="p-3.5">Sizes</th>
                      <th className="p-3.5">Colors</th>
                      <th className="p-3.5">Stock</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-neutral-200">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3.5 flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-12 h-14 object-cover object-top border border-white/10 shrink-0"
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
                                <span className="text-[9px] bg-[#D4AF37]/20 text-[#D4AF37] px-1.5 py-0.2 rounded">
                                  New
                                </span>
                              )}
                              {p.isBestSeller && (
                                <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded">
                                  Best Seller
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5 text-neutral-300">{p.category}</td>

                        <td className="p-3.5 font-bold text-white">
                          {formatPrice(p.price)}
                          {p.originalPrice && (
                            <div className="text-[10px] text-neutral-500 line-through">
                              {formatPrice(p.originalPrice)}
                            </div>
                          )}
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center gap-1 flex-wrap max-w-[120px]">
                            {p.sizes?.map((s) => (
                              <span key={s} className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">
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

                        <td className="p-3.5">
                          <span
                            className={`font-semibold ${
                              p.stockQuantity > 5 ? 'text-emerald-400' : 'text-amber-400'
                            }`}
                          >
                            {p.stockQuantity} in stock
                          </span>
                        </td>

                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1.5 text-neutral-400 hover:text-[#D4AF37] transition-colors"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 text-neutral-400 hover:text-red-400 transition-colors"
                            title="Delete Product"
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

          {/* ================= TAB 3: CATEGORIES ================= */}
          {activeTab === 'categories' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="font-serif text-2xl font-medium text-white">
                  Manage Product Categories
                </h2>
                <p className="text-xs text-neutral-400">
                  Organize store navigation and product grouping
                </p>
              </div>

              {/* Add category form */}
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input
                  type="text"
                  placeholder="New Category Name (e.g. Festive Kurta Sets)"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-[#1a1a1a] border border-neutral-700 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#c5a059] text-[#121212] text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
                >
                  Add Category
                </button>
              </form>

              <div className="bg-[#1a1a1a] border border-white/10 divide-y divide-white/5">
                {categories.map((cat, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between text-xs">
                    <span className="font-medium text-white">{cat}</span>
                    <span className="text-neutral-500 font-mono text-[11px]">
                      {products.filter((p) => p.category === cat).length} items
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 4: ORDERS ================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-medium text-white">
                    Customer Orders ({orders.length})
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Track shipments, customer addresses, phone numbers and order lifecycle
                  </p>
                </div>

                {/* Filter tabs */}
                <div className="flex items-center gap-1 bg-[#1a1a1a] p-1 border border-white/10 text-xs">
                  {['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderFilter(st)}
                      className={`px-2.5 py-1 text-[11px] font-medium transition-colors ${
                        orderFilter === st
                          ? 'bg-[#D4AF37] text-[#121212] font-bold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="p-12 text-center text-neutral-500 bg-[#1a1a1a] border border-white/10 text-xs">
                  No orders found under "{orderFilter}".
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((o) => (
                    <div
                      key={o.id}
                      className="bg-[#1a1a1a] border border-white/10 p-5 space-y-4 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-[#D4AF37] text-sm">
                            {o.id}
                          </span>
                          <span className="text-neutral-400 text-xs">
                            {new Date(o.createdAt).toLocaleString()}
                          </span>
                        </div>

                        {/* Order status dropdown */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-400">Status:</span>
                          <select
                            value={o.status}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                            className="bg-[#121212] border border-[#D4AF37]/50 text-white text-xs px-2.5 py-1 focus:outline-none"
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

                      {/* Customer & Address Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-neutral-500 uppercase tracking-wider text-[10px] block mb-1">
                            Customer Details
                          </span>
                          <div className="font-semibold text-white">{o.customerName}</div>
                          <div className="text-neutral-300 font-mono mt-0.5">{o.phone}</div>
                          {o.email && <div className="text-neutral-400">{o.email}</div>}
                          
                          {/* Direct WhatsApp link to customer */}
                          <a
                            href={`https://wa.me/${o.phone.replace(/[^0-9]/g, '')}?text=Assalam%20o%20Alaikum%20${encodeURIComponent(o.customerName)},%20this%20is%20Riwaayat%20Wear%20regarding%20your%20Order%20${o.id}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[#25D366] hover:underline mt-2 text-[11px]"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5" />
                            <span>WhatsApp Customer</span>
                          </a>
                        </div>

                        <div>
                          <span className="text-neutral-500 uppercase tracking-wider text-[10px] block mb-1">
                            Shipping Destination
                          </span>
                          <div className="text-neutral-300 font-medium">{o.address}</div>
                          <div className="text-neutral-400 font-bold mt-0.5">{o.city}, Pakistan</div>
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
                          <div className="text-base font-bold text-white mt-1">
                            {formatPrice(o.total)}
                          </div>
                          <div className="text-[11px] text-neutral-400">
                            Subtotal: {formatPrice(o.subtotal)} | Delivery: {o.shippingFee === 0 ? 'FREE' : formatPrice(o.shippingFee)}
                          </div>
                        </div>
                      </div>

                      {/* Itemized breakdown */}
                      <div className="pt-2 border-t border-white/5 space-y-1.5">
                        <span className="text-neutral-500 uppercase tracking-wider text-[10px] block">
                          Ordered Items:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {o.items?.map((it, idx) => (
                            <div key={idx} className="flex items-center gap-2.5 bg-black/30 p-2 text-xs">
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

          {/* ================= TAB 5: INQUIRIES ================= */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-medium text-white">
                  Customer Inquiries ({inquiries.length})
                </h2>
                <p className="text-xs text-neutral-400">
                  Messages received via public Contact Form from potential clients
                </p>
              </div>

              <div className="space-y-3">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="bg-[#1a1a1a] border border-white/10 p-5 space-y-3 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white text-sm">{inq.name}</h4>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono ${
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
                          className="px-2.5 py-1 text-xs bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10"
                        >
                          Mark {inq.status === 'New' ? 'Replied' : 'New'}
                        </button>

                        {inq.phone && (
                          <a
                            href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=Assalam%20o%20Alaikum%20${encodeURIComponent(inq.name)},%20this%20is%20Riwaayat%20Wear%20responding%20to%20your%20inquiry.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-[#25D366] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#20bd5a]"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5" />
                            <span>Reply via WhatsApp</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {inq.subject && (
                      <div className="text-xs font-semibold text-[#D4AF37]">
                        Subject: {inq.subject}
                      </div>
                    )}

                    <p className="text-xs text-neutral-300 bg-black/30 p-3 border border-white/5 leading-relaxed">
                      "{inq.message}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 6: WEBSITE CONTENT ================= */}
          {activeTab === 'content' && siteContent && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="font-serif text-2xl font-medium text-white">
                  Manage Website Content
                </h2>
                <p className="text-xs text-neutral-400">
                  Update homepage hero texts, Lahore store address, WhatsApp number and brand copy
                </p>
              </div>

              <form onSubmit={handleSaveContent} className="bg-[#1a1a1a] p-6 border border-white/10 space-y-4 text-xs">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-neutral-300 mb-1">
                    Website Name / Brand Name
                  </label>
                  <input
                    type="text"
                    value={siteContent.brandName}
                    onChange={(e) => setSiteContent({ ...siteContent, brandName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#121212] border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
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
                    className="w-full px-3 py-2 bg-[#121212] border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
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
                      className="w-full px-3 py-2 bg-[#121212] border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
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
                      className="w-full px-3 py-2 bg-[#121212] border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
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
                    className="w-full px-3 py-2 bg-[#121212] border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
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
                    className="w-full px-3 py-2 bg-[#121212] border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
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
                    className="w-full px-3 py-2 bg-[#121212] border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
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
                    className="w-full px-3 py-2 bg-[#121212] border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#D4AF37] hover:bg-[#c5a059] text-[#121212] text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
                >
                  Save Website Content Changes
                </button>
              </form>
            </div>
          )}

          {/* ================= TAB 7: SECURITY ================= */}
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

              <form onSubmit={handleUpdateCredentials} className="bg-[#1a1a1a] p-6 border border-white/10 space-y-4 text-xs">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-neutral-300 mb-1">
                    Current Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121212] border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-neutral-300 mb-1">
                    New Admin Username (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. riwaayat_master"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121212] border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-neutral-300 mb-1">
                    New Admin Password (Optional, min 6 characters)
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new secure password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121212] border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#c5a059] text-[#121212] text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
                >
                  Update Admin Credentials
                </button>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* ================= ADD / EDIT PRODUCT MODAL ================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1a1a1a] border border-[#D4AF37]/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-xl font-semibold text-white">
                {editingProduct ? 'Edit Garment' : 'Add New Garment to Collection'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider font-semibold text-neutral-300 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Obsidian Black Shalwar Kameez"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121212] border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
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
                    className="w-full px-3 py-2 bg-[#121212] border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    {categories.map((c) => (
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
                    className="w-full px-3 py-2 bg-[#121212] border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
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
                    className="w-full px-3 py-2 bg-[#121212] border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Image URL & Upload */}
              <div>
                <label className="block uppercase tracking-wider font-semibold text-neutral-300 mb-1">
                  Product Image URL or Upload File
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="/src/assets/images/... or https://..."
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#121212] border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
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

                {/* Preset image suggestions */}
                <div className="mt-2 flex items-center gap-2 overflow-x-auto pb-1 text-[11px] text-neutral-400">
                  <span>Presets:</span>
                  <button
                    type="button"
                    onClick={() => setProdImage('/src/assets/images/mens_shalwar_kameez_1793388068297.jpg')}
                    className="text-[#D4AF37] hover:underline"
                  >
                    Men's Shalwar
                  </button>
                  <button
                    type="button"
                    onClick={() => setProdImage('/src/assets/images/womens_shalwar_kameez_1793388080478.jpg')}
                    className="text-[#D4AF37] hover:underline"
                  >
                    Women's Shalwar
                  </button>
                  <button
                    type="button"
                    onClick={() => setProdImage('/src/assets/images/mens_waistcoat_1793388092885.jpg')}
                    className="text-[#D4AF37] hover:underline"
                  >
                    Waistcoat
                  </button>
                  <button
                    type="button"
                    onClick={() => setProdImage('/src/assets/images/womens_unstitched_1793388105812.jpg')}
                    className="text-[#D4AF37] hover:underline"
                  >
                    Unstitched
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-neutral-300 mb-1">
                    Fabric Composition
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 100% Giza Egyptian Cotton"
                    value={prodFabric}
                    onChange={(e) => setProdFabric(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121212] border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
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
                    className="w-full px-3 py-2 bg-[#121212] border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-neutral-300 mb-1">
                  Sizes (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="S, M, L, XL, XXL"
                  value={prodSizes}
                  onChange={(e) => setProdSizes(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121212] border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-neutral-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121212] border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodIsNew}
                    onChange={(e) => setProdIsNew(e.target.checked)}
                    className="accent-[#D4AF37] w-4 h-4"
                  />
                  <span>Mark as New Arrival</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodIsBestSeller}
                    onChange={(e) => setProdIsBestSeller(e.target.checked)}
                    className="accent-[#D4AF37] w-4 h-4"
                  />
                  <span>Mark as Best Seller</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-neutral-800 text-neutral-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#D4AF37] hover:bg-[#c5a059] text-[#121212] font-bold uppercase tracking-wider"
                >
                  Save Garment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
