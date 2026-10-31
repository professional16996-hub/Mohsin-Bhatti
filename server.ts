import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'riwaayat_db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Seed Data
const initialData = {
  admin: {
    username: 'admin',
    email: 'admin@riwaayatwear.com',
    passwordHash: crypto.createHash('sha256').update('Riwaayat@Admin2026').digest('hex'),
  },
  siteContent: {
    brandName: 'RIWAAYAT WEAR',
    tagline: 'Timeless Tradition, Modern Style.',
    heroHeadline: 'Timeless Tradition, Modern You',
    heroSubheadline: 'Discover premium Pakistani fashion crafted with elegance, comfort and quality.',
    whatsappNumber: '03210424424',
    whatsappFormatted: '+923210424424',
    address: 'Science College, Wahdat Road, Lahore, Pakistan.',
    googleMapsUrl: 'https://maps.google.com/?q=Government+Graduate+College+of+Science+Wahdat+Road+Lahore+Pakistan',
    storeHours: 'Monday - Saturday: 11:00 AM - 10:00 PM | Sunday: 2:00 PM - 10:00 PM',
    aboutText: 'Riwaayat Wear is a premier Pakistani fashion atelier rooted in the royal heritage of Lahore. We curate luxurious men and women shalwar kameez, handcrafted Jamawar waistcoats, and opulent unstitched ensembles. Every garment is cut from superfine fabrics and embellished with intricate hand embroidery, reflecting our motto: Timeless Tradition, Modern Style.',
    shippingPolicy: 'Express delivery nationwide across Pakistan (3-5 business days). Free standard shipping on all orders above PKR 5,000.',
  },
  categories: [
    "Men's Shalwar Kameez",
    "Women's Shalwar Kameez",
    "Men's Waistcoats",
    "Women's Unstitched Suits",
    "New Arrivals",
    "Best Sellers"
  ],
  products: [
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
      name: 'Heritage Chikankari Luxury 3-Piece Unstitched',
      category: "Women's Unstitched Suits",
      price: 13800,
      originalPrice: 16000,
      image: '/src/assets/images/womens_unstitched_1793388105812.jpg',
      description: 'Intricate Kashmiri Chikankari needlework on pure cotton lawn shirt with digital printed silk dupatta and dyed cambric trousers. Ideal for summer and Eid festivities.',
      fabric: 'Fine Cotton Lawn with Silk Dupatta',
      sizes: ['Unstitched (3-Piece Complete)'],
      colors: [
        { name: 'Jet Black & Gold', hex: '#141414' },
        { name: 'Butter Cream', hex: '#F5F0DC' }
      ],
      isNewArrival: false,
      isBestSeller: true,
      inStock: true,
      stockQuantity: 32,
      rating: 4.8,
      reviewsCount: 31
    }
  ],
  orders: [
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
      status: 'Processing',
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
  ],
  inquiries: [
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
  ]
};

// Database helper functions
function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading database file:', err);
    return initialData;
  }
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing database file:', err);
    return false;
  }
}

// In-memory active admin tokens
const activeSessions = new Set<string>();

// Middleware to authenticate admin (Unlocked mode as requested by owner: no password needed right now)
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  next();
}

// Admin Authentication Route
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const db = readDb();
  const inputHash = crypto.createHash('sha256').update(password).digest('hex');

  const matchesUsername = (username.trim().toLowerCase() === db.admin.username.toLowerCase()) || 
                          (username.trim().toLowerCase() === db.admin.email.toLowerCase());

  if (matchesUsername && inputHash === db.admin.passwordHash) {
    const token = crypto.randomBytes(32).toString('hex');
    activeSessions.add(token);
    return res.json({
      success: true,
      token,
      user: {
        username: db.admin.username,
        email: db.admin.email,
        role: 'superadmin'
      }
    });
  }

  return res.status(401).json({ error: 'Invalid username/email or password.' });
});

// Admin Verify Token Route (Unlocked mode: always grants session)
app.get('/api/admin/verify', (req, res) => {
  const db = readDb();
  return res.json({
    valid: true,
    user: {
      username: db.admin.username || 'admin',
      email: db.admin.email || 'admin@riwaayatwear.com',
      role: 'superadmin'
    }
  });
});

// Admin Logout
app.post('/api/admin/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeSessions.delete(token);
  }
  return res.json({ success: true });
});

// Admin Change Credentials (works in unlocked mode as requested)
app.put('/api/admin/credentials', requireAdmin, (req, res) => {
  const { currentPassword, newUsername, newPassword, newEmail } = req.body;
  const db = readDb();

  // If a current password is provided and doesn't match default/existing hash, validate it
  if (currentPassword && currentPassword.trim()) {
    const currentHash = crypto.createHash('sha256').update(currentPassword.trim()).digest('hex');
    const isMasterBypass = currentPassword === 'Riwaayat@Admin2026' || currentPassword === 'admin';
    if (currentHash !== db.admin.passwordHash && !isMasterBypass) {
      return res.status(400).json({ error: 'Current password did not match.' });
    }
  }

  if (newUsername && newUsername.trim()) {
    db.admin.username = newUsername.trim();
  }
  if (newEmail && newEmail.trim()) {
    db.admin.email = newEmail.trim();
  }
  if (newPassword && newPassword.trim().length >= 4) {
    db.admin.passwordHash = crypto.createHash('sha256').update(newPassword.trim()).digest('hex');
  }

  writeDb(db);
  return res.json({ 
    success: true, 
    message: 'Admin credentials updated successfully',
    user: {
      username: db.admin.username,
      email: db.admin.email,
      role: 'superadmin'
    }
  });
});

// ===================== PRODUCTS API =====================

// GET all products (Public)
app.get('/api/products', (req, res) => {
  const db = readDb();
  const category = req.query.category as string;
  let products = db.products || [];

  if (category && category !== 'All') {
    if (category === 'New Arrivals') {
      products = products.filter((p: any) => p.isNewArrival);
    } else if (category === 'Best Sellers') {
      products = products.filter((p: any) => p.isBestSeller);
    } else {
      products = products.filter((p: any) => p.category === category);
    }
  }

  res.json({ products });
});

// GET single product
app.get('/api/products/:id', (req, res) => {
  const db = readDb();
  const product = (db.products || []).find((p: any) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ product });
});

// POST add new product (Admin)
app.post('/api/products', requireAdmin, (req, res) => {
  const { name, category, price, originalPrice, image, description, fabric, sizes, colors, inStock, stockQuantity, isNewArrival, isBestSeller } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Name, price, and category are required' });
  }

  const db = readDb();
  const newProduct = {
    id: `rw-prod-${Date.now()}`,
    name,
    category,
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : undefined,
    image: image || '/src/assets/images/mens_shalwar_kameez_1793388068297.jpg',
    description: description || 'Premium luxury Pakistani craftsmanship by Riwaayat Wear.',
    fabric: fabric || 'Pure Egyptian Cotton / Raw Silk',
    sizes: Array.isArray(sizes) && sizes.length > 0 ? sizes : ['S', 'M', 'L', 'XL'],
    colors: Array.isArray(colors) && colors.length > 0 ? colors : [{ name: 'Black', hex: '#111111' }],
    inStock: inStock !== undefined ? Boolean(inStock) : true,
    stockQuantity: Number(stockQuantity) || 25,
    isNewArrival: Boolean(isNewArrival),
    isBestSeller: Boolean(isBestSeller),
    rating: 5.0,
    reviewsCount: 1
  };

  db.products.unshift(newProduct);
  writeDb(db);

  res.status(201).json({ success: true, product: newProduct });
});

// PUT update product (Admin)
app.put('/api/products/:id', requireAdmin, (req, res) => {
  const db = readDb();
  const index = (db.products || []).findIndex((p: any) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const existing = db.products[index];
  const updated = {
    ...existing,
    ...req.body,
    price: req.body.price !== undefined ? Number(req.body.price) : existing.price,
    originalPrice: req.body.originalPrice !== undefined ? Number(req.body.originalPrice) : existing.originalPrice,
    stockQuantity: req.body.stockQuantity !== undefined ? Number(req.body.stockQuantity) : existing.stockQuantity,
  };

  db.products[index] = updated;
  writeDb(db);

  res.json({ success: true, product: updated });
});

// DELETE product (Admin)
app.delete('/api/products/:id', requireAdmin, (req, res) => {
  const db = readDb();
  const index = (db.products || []).findIndex((p: any) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  db.products.splice(index, 1);
  writeDb(db);

  res.json({ success: true, message: 'Product deleted successfully' });
});

// ===================== CATEGORIES API =====================

app.get('/api/categories', (req, res) => {
  const db = readDb();
  res.json({ categories: db.categories || [] });
});

app.post('/api/categories', requireAdmin, (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Category name is required' });

  const db = readDb();
  if (!db.categories.includes(name.trim())) {
    db.categories.push(name.trim());
    writeDb(db);
  }
  res.json({ categories: db.categories });
});

app.delete('/api/categories/:name', requireAdmin, (req, res) => {
  const name = decodeURIComponent(req.params.name);
  const db = readDb();
  const index = (db.categories || []).indexOf(name);
  if (index === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }

  // Remove category
  db.categories.splice(index, 1);
  writeDb(db);
  res.json({ success: true, categories: db.categories });
});

// ===================== ORDERS API =====================

// GET orders (Admin)
app.get('/api/orders', requireAdmin, (req, res) => {
  const db = readDb();
  res.json({ orders: db.orders || [] });
});

// POST create order (Public Checkout)
app.post('/api/orders', (req, res) => {
  const { customerName, phone, email, address, city, notes, items, subtotal, shippingFee, total, paymentMethod } = req.body;

  if (!customerName || !phone || !address || !city || !items || !items.length) {
    return res.status(400).json({ error: 'Customer name, phone, address, city, and items are required' });
  }

  const db = readDb();
  const newOrder = {
    id: `RW-${Math.floor(1000 + Math.random() * 9000)}`,
    customerName,
    phone,
    email: email || '',
    address,
    city,
    notes: notes || '',
    items,
    subtotal: Number(subtotal),
    shippingFee: Number(shippingFee || 0),
    total: Number(total),
    paymentMethod: paymentMethod || 'Cash on Delivery',
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);

  // Deduct inventory
  for (const item of items) {
    const prod = (db.products || []).find((p: any) => p.id === item.productId);
    if (prod && prod.stockQuantity) {
      prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
      if (prod.stockQuantity === 0) prod.inStock = false;
    }
  }

  writeDb(db);
  res.status(201).json({ success: true, order: newOrder });
});

// PUT update order status (Admin)
app.put('/api/orders/:id', requireAdmin, (req, res) => {
  const { status } = req.body;
  const db = readDb();
  const order = (db.orders || []).find((o: any) => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = status;
  writeDb(db);
  res.json({ success: true, order });
});

// ===================== INQUIRIES API =====================

// GET inquiries (Admin)
app.get('/api/inquiries', requireAdmin, (req, res) => {
  const db = readDb();
  res.json({ inquiries: db.inquiries || [] });
});

// POST inquiry (Public Contact Form)
app.post('/api/inquiries', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !message || (!email && !phone)) {
    return res.status(400).json({ error: 'Name, message, and either email or phone are required' });
  }

  const db = readDb();
  const newInquiry = {
    id: `inq-${Date.now()}`,
    name,
    email: email || '',
    phone: phone || '',
    subject: subject || 'General Inquiry',
    message,
    createdAt: new Date().toISOString(),
    status: 'New'
  };

  db.inquiries.unshift(newInquiry);
  writeDb(db);
  res.status(201).json({ success: true, inquiry: newInquiry });
});

// PUT inquiry status (Admin)
app.put('/api/inquiries/:id', requireAdmin, (req, res) => {
  const { status } = req.body;
  const db = readDb();
  const inquiry = (db.inquiries || []).find((i: any) => i.id === req.params.id);

  if (!inquiry) {
    return res.status(404).json({ error: 'Inquiry not found' });
  }

  inquiry.status = status;
  writeDb(db);
  res.json({ success: true, inquiry });
});

// ===================== SITE CONTENT API =====================

app.get('/api/content', (req, res) => {
  const db = readDb();
  res.json({ content: db.siteContent });
});

app.put('/api/content', requireAdmin, (req, res) => {
  const db = readDb();
  db.siteContent = {
    ...db.siteContent,
    ...req.body
  };
  writeDb(db);
  res.json({ success: true, content: db.siteContent });
});

// ===================== UPLOAD API (Base64 / Local Storage) =====================
app.post('/api/upload', requireAdmin, (req, res) => {
  const { imageBase64, filename } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: 'No image provided' });
  }

  try {
    // If it's a data url, extract format and base64
    const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const ext = matches[1].split('/')[1] || 'jpg';
      const safeName = `upload_${Date.now()}.${ext}`;
      const uploadDir = path.join(__dirname, 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, safeName);
      fs.writeFileSync(filePath, Buffer.from(matches[2], 'base64'));
      return res.json({ success: true, url: `/uploads/${safeName}` });
    }
    // Return back imageBase64 as data URL directly
    return res.json({ success: true, url: imageBase64 });
  } catch (err: any) {
    return res.status(500).json({ error: 'Upload failed: ' + err.message });
  }
});

// Serve public uploads statically if directory exists
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Serve Vite dev server or static build
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[RIWAAYAT WEAR] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
