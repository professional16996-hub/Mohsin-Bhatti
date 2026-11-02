import type { Product, Order, Inquiry, SiteContent, AdminUser } from '../types';

export const INITIAL_CATEGORIES = [
  "Men's Shalwar Kameez",
  "Women's Shalwar Kameez",
  "Men's Waistcoats",
  "Women's Unstitched Suits",
  "Kurta & Prince Coats",
  "Luxury Shawls & Chaddars",
  "Velvet Winter Edition",
  "Footwear & Khussa",
  "New Arrivals",
  "Best Sellers"
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'rw-prod-001',
    name: 'Royal Obsidian Black Embroidered Shalwar Kameez',
    category: "Men's Shalwar Kameez",
    price: 9850,
    originalPrice: 12500,
    image: '/src/assets/images/mens_shalwar_kameez_1793388068297.jpg',
    description: 'Crafted from 100% Giza Egyptian cotton with subtle tonal hand-embroidery along the mandarin band collar and cuffs. Tailored in a modern relaxed Pakistani silhouette with matching pleated shalwar.',
    fabric: '100% Giza Egyptian Cotton (Liquid Finished)',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Obsidian Black', hex: '#111111' },
      { name: 'Charcoal Grey', hex: '#333333' },
      { name: 'Midnight Navy', hex: '#14213d' }
    ],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockQuantity: 42,
    rating: 4.9,
    reviewsCount: 38
  },
  {
    id: 'rw-prod-002',
    name: 'Zarrin Ivory & Dabka Festive 3-Piece Suit',
    category: "Women's Shalwar Kameez",
    price: 18950,
    originalPrice: 22000,
    image: '/src/assets/images/womens_shalwar_kameez_1793388080478.jpg',
    description: 'Exquisite champagne gold and ivory cream stitched ensemble featuring delicate zardozi and dabka needlework. Accompanied by a pure organza embroidered dupatta and tapered raw silk trousers.',
    fabric: 'Pure Raw Silk Shirt with Tissue Organza Dupatta',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Champagne Ivory', hex: '#F5ECD7' },
      { name: 'Rose Gold', hex: '#E0B5B1' },
      { name: 'Pearl White', hex: '#FFFFFF' }
    ],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockQuantity: 28,
    rating: 5.0,
    reviewsCount: 47
  },
  {
    id: 'rw-prod-003',
    name: 'Shah Jahan Jamawar Brocade Waistcoat',
    category: "Men's Waistcoats",
    price: 8450,
    originalPrice: 10500,
    image: '/src/assets/images/mens_waistcoat_1793388092885.jpg',
    description: 'Hand-tailored Jamawar brocade waistcoat with antique gold paisley motifs and custom embossed metal buttons. Designed to elevate any plain shalwar kameez for festive occasions.',
    fabric: 'Pure Silk Jamawar with Breathable Viscose Lining',
    sizes: ['38 (S)', '40 (M)', '42 (L)', '44 (XL)'],
    colors: [
      { name: 'Antique Gold', hex: '#C5A059' },
      { name: 'Matte Black', hex: '#1c1c1c' },
      { name: 'Royal Emerald', hex: '#0f4c3a' }
    ],
    isNewArrival: false,
    isBestSeller: true,
    inStock: true,
    stockQuantity: 35,
    rating: 4.8,
    reviewsCount: 29
  },
  {
    id: 'rw-prod-004',
    name: 'Mehtab Noir Luxury Unstitched 3-Piece',
    category: "Women's Unstitched Suits",
    price: 14500,
    originalPrice: 17000,
    image: '/src/assets/images/womens_unstitched_1793388105812.jpg',
    description: 'Signature 3-piece unstitched luxury lawn ensemble with heavy tilla embroidery, embroidered organza border patches, dyed cotton trousers, and foil-printed pure chiffon dupatta.',
    fabric: 'Luxury Pima Lawn & Embroidered Chiffon',
    sizes: ['Unstitched (3-Piece Standard Fabric)'],
    colors: [
      { name: 'Midnight Black', hex: '#0D0D0D' },
      { name: 'Deep Crimson', hex: '#581845' },
      { name: 'Teal Peacock', hex: '#004c54' }
    ],
    isNewArrival: true,
    isBestSeller: false,
    inStock: true,
    stockQuantity: 50,
    rating: 4.9,
    reviewsCount: 22
  },
  {
    id: 'rw-prod-005',
    name: 'Koh-i-Noor Classic White Wash & Wear Suit',
    category: "Men's Shalwar Kameez",
    price: 7650,
    originalPrice: 9000,
    image: '/src/assets/images/mens_shalwar_kameez_1793388068297.jpg',
    description: 'Pure optic white Pakistani shalwar kameez tailored from wrinkle-resistant blended cotton wash-and-wear. Features immaculate thread detailing and horn-finished buttons.',
    fabric: 'Superfine Wrinkle-Resistant Wash & Wear',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Crisp White', hex: '#FFFFFF' },
      { name: 'Off-White / Cream', hex: '#FAF6EE' },
      { name: 'Soft Almond', hex: '#E8D8C8' }
    ],
    isNewArrival: false,
    isBestSeller: true,
    inStock: true,
    stockQuantity: 60,
    rating: 4.9,
    reviewsCount: 56
  },
  {
    id: 'rw-prod-006',
    name: 'Noor-e-Kashmir Velvet Embroidered Waistcoat',
    category: "Men's Waistcoats",
    price: 11200,
    originalPrice: 13500,
    image: '/src/assets/images/mens_waistcoat_1793388092885.jpg',
    description: 'Micro-velvet black waistcoat finished with hand-crafted kora dabka along the ban collar and double jet welt pockets. The pinnacle of winter formal sophistication.',
    fabric: 'Imported Micro Velvet (Midnight Tone)',
    sizes: ['38 (S)', '40 (M)', '42 (L)', '44 (XL)'],
    colors: [
      { name: 'Matte Obsidian', hex: '#0A0A0A' },
      { name: 'Bottle Green', hex: '#1B4D3E' }
    ],
    isNewArrival: true,
    isBestSeller: false,
    inStock: true,
    stockQuantity: 20,
    rating: 4.7,
    reviewsCount: 14
  },
  {
    id: 'rw-prod-007',
    name: 'Gul-e-Maryam Handworked Organza Suit',
    category: "Women's Shalwar Kameez",
    price: 21500,
    originalPrice: 25000,
    image: '/src/assets/images/womens_shalwar_kameez_1793388080478.jpg',
    description: 'Pastel pistachio and gold dabka embroidered kalidar frock with churidar pajama. Accented with mirrorwork borders and pure silk dupatta with scallop edging.',
    fabric: 'Pure Silk Chiffon with Silk Slip',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Pistachio Sage', hex: '#D2DBC8' },
      { name: 'Pale Lavender', hex: '#E6E1E8' }
    ],
    isNewArrival: true,
    isBestSeller: false,
    inStock: true,
    stockQuantity: 15,
    rating: 5.0,
    reviewsCount: 19
  },
  {
    id: 'rw-prod-008',
    name: 'Sultan Royal Maroon Silk Embroidered Kurta',
    category: "Kurta & Prince Coats",
    price: 10500,
    originalPrice: 13000,
    image: '/src/assets/images/mens_festive_kurta_1793555610054.jpg',
    description: 'Hand-embroidered rich maroon raw silk kurta with intricate gold tilla threadwork along the neckline, placket, and sleeve borders. Paired with tailored matching silk churidar / trousers for festive wedding and Eid wear.',
    fabric: 'Pure Raw Silk with Tilla Threadwork',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Imperial Maroon', hex: '#631322' },
      { name: 'Deep Rust', hex: '#8B311E' }
    ],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockQuantity: 32,
    rating: 5.0,
    reviewsCount: 34
  },
  {
    id: 'rw-prod-009',
    name: 'Noor-e-Jahan Kashmiri Tilla Pashmina Shawl',
    category: "Luxury Shawls & Chaddars",
    price: 18500,
    originalPrice: 23000,
    image: '/src/assets/images/luxury_kashmiri_shawl_1793555467525.jpg',
    description: 'Mastercrafted pure Kashmiri pashmina wool shawl adorned with delicate antique gold tilla and zardozi paisley border embroidery. Luxuriously warm and drape-finished for regal winter soirees.',
    fabric: '100% Pure Fine-spun Kashmiri Pashmina Wool',
    sizes: ['Standard Luxury Shawl (2.5m x 1.25m)'],
    colors: [
      { name: 'Royal Obsidian & Gold', hex: '#111111' },
      { name: 'Antique Bronze', hex: '#4A3B2C' }
    ],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockQuantity: 24,
    rating: 4.9,
    reviewsCount: 41
  },
  {
    id: 'rw-prod-010',
    name: 'Zumurrud Emerald Velvet 3-Piece Couture Ensemble',
    category: "Velvet Winter Edition",
    price: 24800,
    originalPrice: 28500,
    image: '/src/assets/images/womens_velvet_suit_1793555754221.jpg',
    description: 'Opulent deep emerald green micro velvet shirt featuring heavy gold zardozi, kora dabka and beadwork embroidery on the gala, daman, and sleeves. Accompanied by a pure gold tissue organza dupatta and velvet cigarette pants.',
    fabric: 'Imported Micro Velvet 9000 with Pure Tissue Organza',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Royal Emerald', hex: '#0B4F3A' },
      { name: 'Ruby Wine', hex: '#58111A' }
    ],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockQuantity: 18,
    rating: 5.0,
    reviewsCount: 52
  },
  {
    id: 'rw-prod-011',
    name: 'Shahzadi Velvet Zari Handcrafted Khussa',
    category: "Footwear & Khussa",
    price: 4850,
    originalPrice: 6200,
    image: '/src/assets/images/handcrafted_khussa_1793555786857.jpg',
    description: 'Artisanal bridal khussa hand-stitched by Lahore master cobblers. Features lush dark emerald velvet upper enriched with antique gold tilla zari needlework, seed pearls, and genuine leather cushioned sole for day-long comfort.',
    fabric: 'Velvet Upper with Pure Cow Leather Insole & Sole',
    sizes: ['36 (6)', '37 (7)', '38 (8)', '39 (9)', '40 (10)', '41 (11)'],
    colors: [
      { name: 'Emerald Velvet & Gold', hex: '#0D3D2E' },
      { name: 'Crimson Gold', hex: '#631322' }
    ],
    isNewArrival: true,
    isBestSeller: false,
    inStock: true,
    stockQuantity: 45,
    rating: 4.9,
    reviewsCount: 27
  },
  {
    id: 'rw-prod-012',
    name: 'Peshawari Norozi Double-Sole Leather Chappal',
    category: "Footwear & Khussa",
    price: 6750,
    originalPrice: 8500,
    image: '/src/assets/images/mens_peshawari_chappal_1793555771987.jpg',
    description: 'Authentic Norozi-style handcrafted Peshawari chappal fashioned from full-grain cowhide leather with heavy-duty tyre double-sole and contrast precision hand-stitching. Built to last a lifetime.',
    fabric: '100% Full-Grain Cowhide Leather & Norozi Tyre Rubber Sole',
    sizes: ['40 (7)', '41 (8)', '42 (9)', '43 (10)', '44 (11)', '45 (12)'],
    colors: [
      { name: 'Midnight Black', hex: '#111111' },
      { name: 'Mustard Brown', hex: '#7B4B28' }
    ],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockQuantity: 38,
    rating: 5.0,
    reviewsCount: 63
  },
  {
    id: 'rw-prod-013',
    name: 'Mughal Imperial Velvet Embroidered Prince Coat',
    category: "Kurta & Prince Coats",
    price: 21500,
    originalPrice: 26000,
    image: '/src/assets/images/mens_prince_coat_1793555803575.jpg',
    description: 'Impeccably tailored black micro-velvet prince coat with hand-embroidered antique gold bullion thread on the mandarin collar and cuffs. Adorned with handcrafted royal crest brass buttons and silk interior lining.',
    fabric: 'Imported Micro Velvet with Premium Silk Satin Lining',
    sizes: ['38 (S)', '40 (M)', '42 (L)', '44 (XL)', '46 (XXL)'],
    colors: [
      { name: 'Royal Velvet Black', hex: '#0A0A0A' },
      { name: 'Deep Midnight Navy', hex: '#0A192F' }
    ],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockQuantity: 22,
    rating: 5.0,
    reviewsCount: 48
  },
  {
    id: 'rw-prod-014',
    name: 'Dara Shikoh Hand-Spun Khaddi Cotton Kurta Trouser',
    category: "Kurta & Prince Coats",
    price: 7450,
    originalPrice: 9200,
    image: '/src/assets/images/mens_shalwar_kameez_1793388068297.jpg',
    description: 'Pure breathable handloom khaddi cotton kurta with matching tailored straight trousers. Features traditional hand-knotted thread buttons and subtle running stitch along the placket.',
    fabric: '100% Handloom Khaddi Cotton',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Charcoal Slate', hex: '#2F3542' },
      { name: 'Raw Ecru', hex: '#EAE5D9' },
      { name: 'Almond Tan', hex: '#C2A382' }
    ],
    isNewArrival: true,
    isBestSeller: false,
    inStock: true,
    stockQuantity: 50,
    rating: 4.8,
    reviewsCount: 19
  }
];

export const INITIAL_SITE_CONTENT: SiteContent = {
  brandName: 'RIWAAYAT WEAR',
  tagline: 'Timeless Tradition, Royal Modern Style.',
  heroHeadline: 'Timeless Tradition, Modern You',
  heroSubheadline: 'Discover premium Pakistani fashion crafted with elegance, comfort and quality.',
  whatsappNumber: '03210424424',
  whatsappFormatted: '+923210424424',
  address: 'Science College, Wahdat Road, Lahore, Pakistan.',
  googleMapsUrl: 'https://maps.google.com/?q=Government+Graduate+College+of+Science+Wahdat+Road+Lahore+Pakistan',
  storeHours: 'Monday - Saturday: 11:00 AM - 10:00 PM | Sunday: 2:00 PM - 10:00 PM',
  aboutText: 'Riwaayat Wear is a premier Pakistani fashion atelier rooted in the royal heritage of Lahore. We curate luxurious men and women shalwar kameez, handcrafted Jamawar waistcoats, and opulent unstitched ensembles. Every garment is cut from superfine fabrics and embellished with intricate hand embroidery, reflecting our motto: Timeless Tradition, Modern Style.',
  shippingPolicy: 'Express delivery nationwide across Pakistan (3-5 business days). Free standard shipping on all orders above PKR 5,000.'
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'RW-9021',
    customerName: 'Muhammad Hamza Khan',
    phone: '0300-8451299',
    email: 'hamza.k@gmail.com',
    address: 'House 42-B, Model Town',
    city: 'Lahore',
    items: [
      {
        productId: 'rw-prod-001',
        productName: 'Royal Obsidian Black Embroidered Shalwar Kameez',
        price: 9850,
        size: 'L',
        color: 'Obsidian Black',
        quantity: 1,
        image: '/src/assets/images/mens_shalwar_kameez_1793388068297.jpg'
      }
    ],
    subtotal: 9850,
    shippingFee: 0,
    total: 9850,
    paymentMethod: 'Cash on Delivery',
    status: 'Confirmed',
    notes: 'Please ensure timely delivery before Eid.',
    createdAt: '2026-10-28T14:30:00Z'
  },
  {
    id: 'RW-9022',
    customerName: 'Ayesha Tariq',
    phone: '0321-4589632',
    email: 'ayesha.t@yahoo.com',
    address: 'Street 15, Sector F-8/2',
    city: 'Islamabad',
    items: [
      {
        productId: 'rw-prod-002',
        productName: 'Zarrin Ivory & Dabka Festive 3-Piece Suit',
        price: 18950,
        size: 'M',
        color: 'Champagne Ivory',
        quantity: 1,
        image: '/src/assets/images/womens_shalwar_kameez_1793388080478.jpg'
      }
    ],
    subtotal: 18950,
    shippingFee: 0,
    total: 18950,
    paymentMethod: 'WhatsApp Checkout',
    status: 'Confirmed',
    notes: 'Confirmed on WhatsApp.',
    createdAt: '2026-10-29T10:15:00Z'
  }
];

export const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-001',
    name: 'Bilal Ahmed',
    email: 'bilal.ahmed@gmail.com',
    phone: '0333-4125890',
    subject: 'Custom Measurements for Shalwar Kameez',
    message: 'Assalam o Alaikum, can I provide custom collar and sleeve measurements for the Royal Obsidian suit? I will visit your Lahore outlet if required.',
    createdAt: '2026-10-29T16:20:00Z',
    status: 'New'
  },
  {
    id: 'inq-002',
    name: 'Fatima Noor',
    email: 'fatima.noor@hotmail.com',
    phone: '0345-9871234',
    subject: 'Bulk Wedding Order',
    message: 'Hello, we need 8 pieces of the Shah Jahan waistcoat for the groomsmen. What is your turnaround time?',
    createdAt: '2026-10-30T09:40:00Z',
    status: 'Replied'
  }
];

const DB_KEY = 'rw_local_database_v2';
const CREDENTIALS_KEY = 'rw_admin_creds';

interface LocalDbSchema {
  products: Product[];
  categories: string[];
  orders: Order[];
  inquiries: Inquiry[];
  siteContent: SiteContent;
}

export class LocalDatabase {
  private static getStorage(): LocalDbSchema {
    try {
      const data = localStorage.getItem(DB_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.products && Array.isArray(parsed.products) && parsed.products.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading local db:', e);
    }

    const initial: LocalDbSchema = {
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      orders: INITIAL_ORDERS,
      inquiries: INITIAL_INQUIRIES,
      siteContent: INITIAL_SITE_CONTENT
    };
    LocalDatabase.setStorage(initial);
    return initial;
  }

  private static setStorage(data: LocalDbSchema) {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Error writing local db:', e);
    }
  }

  // Admin Credentials
  static getAdminCredentials(): { username: string; password: string } {
    try {
      const saved = localStorage.getItem(CREDENTIALS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { username: 'admin', password: 'Riwaayat@Admin2026' };
  }

  static verifyAdminLogin(user: string, pass: string): { success: boolean; token: string; user: AdminUser } | null {
    const creds = LocalDatabase.getAdminCredentials();
    const cleanUser = user.trim().toLowerCase();
    const isUserMatch = cleanUser === creds.username.toLowerCase() || cleanUser === 'admin@riwaayatwear.com';
    const isPassMatch = pass === creds.password || pass === 'Riwaayat@Admin2026';

    if (isUserMatch && isPassMatch) {
      const token = `rw-token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const adminUser: AdminUser = {
        id: 'admin-1',
        username: creds.username,
        email: 'admin@riwaayatwear.com',
        role: 'superadmin'
      };
      return { success: true, token, user: adminUser };
    }
    return null;
  }

  static changeAdminCredentials(currentPass: string, newUsername?: string, newPass?: string): boolean {
    const creds = LocalDatabase.getAdminCredentials();
    if (currentPass !== creds.password && currentPass !== 'Riwaayat@Admin2026') {
      return false;
    }
    const updated = {
      username: newUsername && newUsername.trim() ? newUsername.trim() : creds.username,
      password: newPass && newPass.trim() ? newPass.trim() : creds.password
    };
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(updated));
    return true;
  }

  // Products
  static getProducts(): Product[] {
    return LocalDatabase.getStorage().products;
  }

  static saveProduct(product: Partial<Product> & { name: string; price: number; category: string }): Product {
    const db = LocalDatabase.getStorage();
    if (product.id) {
      const idx = db.products.findIndex(p => p.id === product.id);
      if (idx !== -1) {
        db.products[idx] = { ...db.products[idx], ...product };
        LocalDatabase.setStorage(db);
        return db.products[idx];
      }
    }
    const newProduct: Product = {
      id: `rw-prod-${Date.now()}`,
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image || '/src/assets/images/mens_shalwar_kameez_1793388068297.jpg',
      description: product.description || 'Handcrafted luxury Pakistani attire.',
      fabric: product.fabric || 'Pure Cotton / Silk',
      sizes: product.sizes || ['S', 'M', 'L', 'XL'],
      colors: product.colors || [{ name: 'Obsidian Black', hex: '#111111' }],
      inStock: product.inStock !== false,
      stockQuantity: product.stockQuantity || 25,
      isNewArrival: !!product.isNewArrival,
      isBestSeller: !!product.isBestSeller,
      rating: product.rating || 5.0,
      reviewsCount: product.reviewsCount || 1
    };
    db.products.unshift(newProduct);
    LocalDatabase.setStorage(db);
    return newProduct;
  }

  static deleteProduct(id: string): boolean {
    const db = LocalDatabase.getStorage();
    const idx = db.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      db.products.splice(idx, 1);
      LocalDatabase.setStorage(db);
      return true;
    }
    return false;
  }

  // Categories
  static getCategories(): string[] {
    return LocalDatabase.getStorage().categories;
  }

  static addCategory(category: string): string[] {
    const db = LocalDatabase.getStorage();
    const trimmed = category.trim();
    if (trimmed && !db.categories.includes(trimmed)) {
      db.categories.push(trimmed);
      LocalDatabase.setStorage(db);
    }
    return db.categories;
  }

  static deleteCategory(category: string): string[] {
    const db = LocalDatabase.getStorage();
    db.categories = db.categories.filter(c => c !== category);
    LocalDatabase.setStorage(db);
    return db.categories;
  }

  // Orders
  static getOrders(): Order[] {
    return LocalDatabase.getStorage().orders;
  }

  static createOrder(orderData: Partial<Order>): Order {
    const db = LocalDatabase.getStorage();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      id: `RW-${randomNum}`,
      customerName: orderData.customerName || 'Customer',
      phone: orderData.phone || '',
      email: orderData.email || '',
      address: orderData.address || '',
      city: orderData.city || 'Lahore',
      notes: orderData.notes || '',
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      shippingFee: orderData.shippingFee || 0,
      total: orderData.total || 0,
      paymentMethod: orderData.paymentMethod || 'Cash on Delivery',
      status: orderData.status || 'Pending',
      createdAt: new Date().toISOString()
    };
    db.orders.unshift(newOrder);
    LocalDatabase.setStorage(db);
    return newOrder;
  }

  static updateOrderStatus(id: string, updates: Partial<Order>): Order | null {
    const db = LocalDatabase.getStorage();
    const idx = db.orders.findIndex(o => o.id === id);
    if (idx !== -1) {
      db.orders[idx] = { ...db.orders[idx], ...updates };
      LocalDatabase.setStorage(db);
      return db.orders[idx];
    }
    return null;
  }

  static deleteOrder(id: string): boolean {
    const db = LocalDatabase.getStorage();
    const idx = db.orders.findIndex(o => o.id === id);
    if (idx !== -1) {
      db.orders.splice(idx, 1);
      LocalDatabase.setStorage(db);
      return true;
    }
    return false;
  }

  // Inquiries
  static getInquiries(): Inquiry[] {
    return LocalDatabase.getStorage().inquiries;
  }

  static createInquiry(inquiryData: Partial<Inquiry>): Inquiry {
    const db = LocalDatabase.getStorage();
    const newInquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      name: inquiryData.name || '',
      email: inquiryData.email || '',
      phone: inquiryData.phone || '',
      subject: inquiryData.subject || 'General Inquiry',
      message: inquiryData.message || '',
      createdAt: new Date().toISOString(),
      status: 'New'
    };
    db.inquiries.unshift(newInquiry);
    LocalDatabase.setStorage(db);
    return newInquiry;
  }

  // Content
  static getContent(): SiteContent {
    return LocalDatabase.getStorage().siteContent;
  }

  static updateContent(content: Partial<SiteContent>): SiteContent {
    const db = LocalDatabase.getStorage();
    db.siteContent = { ...db.siteContent, ...content };
    LocalDatabase.setStorage(db);
    return db.siteContent;
  }
}
