import { LocalDatabase } from './localDatabase';
import type { Product, Order, Inquiry, SiteContent, AdminUser } from '../types';

/**
 * Helper to safely extract JSON or fallback if the server responded with HTML (e.g. Netlify 404 / <!DOCTYPE)
 */
async function safeFetchJson<T>(
  url: string,
  options?: RequestInit,
  fallbackFn?: () => T
): Promise<T> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';

    // If server responded with JSON, parse it
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Request failed with status ${res.status}`);
      }
      return data as T;
    }

    // If server responded with HTML (e.g. <!DOCTYPE html> on Netlify), use client local fallback
    if (fallbackFn) {
      return fallbackFn();
    }

    throw new Error('Endpoint returned non-JSON response');
  } catch (err: any) {
    if (fallbackFn) {
      return fallbackFn();
    }
    throw err;
  }
}

export const api = {
  // ================= ADMIN AUTH =================
  async login(username: string, password: string): Promise<{ token: string; user: AdminUser }> {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Invalid credentials');
        }
        return { token: data.token, user: data.user };
      }
    } catch (err: any) {
      // If it was an intentional invalid credentials error from server, rethrow
      if (err.message && err.message !== 'Failed to fetch' && !err.message.includes('Unexpected token')) {
        throw err;
      }
    }

    // Fallback: Verify via LocalDatabase (for Netlify / static deployment)
    const localRes = LocalDatabase.verifyAdminLogin(username, password);
    if (!localRes) {
      throw new Error('Invalid username or password');
    }
    return { token: localRes.token, user: localRes.user };
  },

  async verify(token: string): Promise<{ valid: boolean; user: AdminUser | null }> {
    try {
      const res = await fetch('/api/admin/verify', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        return { valid: !!data.valid, user: data.user || null };
      }
    } catch {}

    // Fallback: Token starting with rw-token- is valid in offline/Netlify mode
    if (token && token.startsWith('rw-token-')) {
      const creds = LocalDatabase.getAdminCredentials();
      return {
        valid: true,
        user: { id: 'admin-1', username: creds.username, email: 'admin@riwaayatwear.com', role: 'superadmin' }
      };
    }
    return { valid: false, user: null };
  },

  async changeCredentials(currentPass: string, newUsername?: string, newPass?: string, token?: string): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/change-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`,
        },
        body: JSON.stringify({
          currentPassword: currentPass,
          newUsername: newUsername || undefined,
          newPassword: newPass || undefined,
        }),
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update credentials');
        // Mirror locally
        LocalDatabase.changeAdminCredentials(currentPass, newUsername, newPass);
        return true;
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('Unexpected token') && err.message !== 'Failed to fetch') {
        throw err;
      }
    }

    // Local fallback
    const ok = LocalDatabase.changeAdminCredentials(currentPass, newUsername, newPass);
    if (!ok) throw new Error('Incorrect current password');
    return true;
  },

  // ================= PRODUCTS =================
  async getProducts(): Promise<Product[]> {
    return safeFetchJson<{ products: Product[] }>(
      '/api/products',
      undefined,
      () => ({ products: LocalDatabase.getProducts() })
    ).then(res => res.products || []);
  },

  async createProduct(product: Partial<Product> & { name: string; price: number; category: string }, token?: string): Promise<Product> {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`,
        },
        body: JSON.stringify(product),
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create product');
        LocalDatabase.saveProduct(data.product);
        return data.product;
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('Unexpected token') && err.message !== 'Failed to fetch') {
        throw err;
      }
    }
    return LocalDatabase.saveProduct(product);
  },

  async updateProduct(id: string, updates: Partial<Product>, token?: string): Promise<Product> {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`,
        },
        body: JSON.stringify(updates),
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update product');
        LocalDatabase.saveProduct({ ...updates, id } as any);
        return data.product;
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('Unexpected token') && err.message !== 'Failed to fetch') {
        throw err;
      }
    }
    return LocalDatabase.saveProduct({ ...updates, id } as any);
  },

  async deleteProduct(id: string, token?: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token || ''}` },
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to delete product');
        LocalDatabase.deleteProduct(id);
        return true;
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('Unexpected token') && err.message !== 'Failed to fetch') {
        throw err;
      }
    }
    return LocalDatabase.deleteProduct(id);
  },

  // ================= CATEGORIES =================
  async getCategories(): Promise<string[]> {
    return safeFetchJson<{ categories: string[] }>(
      '/api/categories',
      undefined,
      () => ({ categories: LocalDatabase.getCategories() })
    ).then(res => res.categories || []);
  },

  async addCategory(name: string, token?: string): Promise<string[]> {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`,
        },
        body: JSON.stringify({ name }),
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to add category');
        LocalDatabase.addCategory(name);
        return data.categories;
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('Unexpected token') && err.message !== 'Failed to fetch') {
        throw err;
      }
    }
    return LocalDatabase.addCategory(name);
  },

  async deleteCategory(name: string, token?: string): Promise<string[]> {
    try {
      const res = await fetch(`/api/categories/${encodeURIComponent(name)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token || ''}` },
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to delete category');
        LocalDatabase.deleteCategory(name);
        return data.categories;
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('Unexpected token') && err.message !== 'Failed to fetch') {
        throw err;
      }
    }
    return LocalDatabase.deleteCategory(name);
  },

  // ================= ORDERS =================
  async getOrders(token?: string): Promise<Order[]> {
    return safeFetchJson<{ orders: Order[] }>(
      '/api/orders',
      { headers: { Authorization: `Bearer ${token || ''}` } },
      () => ({ orders: LocalDatabase.getOrders() })
    ).then(res => res.orders || []);
  },

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to place order');
        LocalDatabase.createOrder(data.order);
        return data.order;
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('Unexpected token') && err.message !== 'Failed to fetch') {
        throw err;
      }
    }
    return LocalDatabase.createOrder(orderData);
  },

  async updateOrder(id: string, updates: Partial<Order>, token?: string): Promise<Order> {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`,
        },
        body: JSON.stringify(updates),
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update order');
        LocalDatabase.updateOrderStatus(id, updates);
        return data.order;
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('Unexpected token') && err.message !== 'Failed to fetch') {
        throw err;
      }
    }
    const updated = LocalDatabase.updateOrderStatus(id, updates);
    if (!updated) throw new Error('Order not found');
    return updated;
  },

  async deleteOrder(id: string, token?: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token || ''}` },
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to delete order');
        LocalDatabase.deleteOrder(id);
        return true;
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('Unexpected token') && err.message !== 'Failed to fetch') {
        throw err;
      }
    }
    return LocalDatabase.deleteOrder(id);
  },

  // ================= INQUIRIES =================
  async getInquiries(token?: string): Promise<Inquiry[]> {
    return safeFetchJson<{ inquiries: Inquiry[] }>(
      '/api/inquiries',
      { headers: { Authorization: `Bearer ${token || ''}` } },
      () => ({ inquiries: LocalDatabase.getInquiries() })
    ).then(res => res.inquiries || []);
  },

  async createInquiry(inquiryData: Partial<Inquiry>): Promise<Inquiry> {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData),
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to send inquiry');
        LocalDatabase.createInquiry(data.inquiry);
        return data.inquiry;
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('Unexpected token') && err.message !== 'Failed to fetch') {
        throw err;
      }
    }
    return LocalDatabase.createInquiry(inquiryData);
  },

  // ================= SITE CONTENT =================
  async getContent(): Promise<SiteContent> {
    return safeFetchJson<{ content: SiteContent }>(
      '/api/content',
      undefined,
      () => ({ content: LocalDatabase.getContent() })
    ).then(res => res.content || LocalDatabase.getContent());
  },

  async updateContent(content: Partial<SiteContent>, token?: string): Promise<SiteContent> {
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`,
        },
        body: JSON.stringify(content),
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update content');
        LocalDatabase.updateContent(content);
        return data.content;
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('Unexpected token') && err.message !== 'Failed to fetch') {
        throw err;
      }
    }
    return LocalDatabase.updateContent(content);
  }
};
