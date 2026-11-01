import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.DEFAULT_APP_PORT ? Number(process.env.DEFAULT_APP_PORT) : 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// CORS & Preflight middleware for API endpoints
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-admin-token');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

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
    "Kurta & Prince Coats",
    "Luxury Shawls & Chaddars",
    "Velvet Winter Edition",
    "Footwear & Khussa",
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

// Active admin tokens (seeded with master dev/test tokens + dynamic logins)
const activeSessions = new Set<string>([
  'admin-master-session-token',
  'riwaayat-admin-token-2026',
  'test-admin-token'
]);

// Helper to extract token from request
function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization || (req.headers['x-admin-token'] as string);
  if (!authHeader) {
    if (req.query.token && typeof req.query.token === 'string') {
      return req.query.token;
    }
    return null;
  }
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return authHeader;
}

// Middleware to authenticate admin (Requires valid active session token)
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required. Please log in.' });
  }
  if (!activeSessions.has(token)) {
    return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
  }
  next();
}

// ===================== ADMIN AUTHENTICATION API =====================

// Admin Login
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

// Admin Verify Token (Both GET and POST)
const handleAdminVerify = (req: Request, res: Response) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ valid: false, error: 'No authorization token provided' });
  }
  if (!activeSessions.has(token)) {
    return res.status(401).json({ valid: false, error: 'Session expired or invalid' });
  }

  const db = readDb();
  return res.json({
    valid: true,
    user: {
      username: db.admin.username || 'admin',
      email: db.admin.email || 'admin@riwaayatwear.com',
      role: 'superadmin'
    }
  });
};

app.get('/api/admin/verify', handleAdminVerify);
app.post('/api/admin/verify', handleAdminVerify);

// Admin Logout
app.post('/api/admin/logout', (req, res) => {
  const token = extractToken(req);
  if (token) {
    activeSessions.delete(token);
  }
  return res.json({ success: true, message: 'Logged out successfully' });
});

// Admin Change Credentials (PUT, POST, PATCH)
const handleAdminCredentials = (req: Request, res: Response) => {
  const { currentPassword, newUsername, newPassword, newEmail, username, password, email } = req.body;
  const db = readDb();

  // If current password provided, verify it
  const checkPass = currentPassword || (password && !newPassword ? password : null);
  if (checkPass) {
    const currentHash = crypto.createHash('sha256').update(String(checkPass).trim()).digest('hex');
    if (currentHash !== db.admin.passwordHash) {
      return res.status(400).json({ error: 'Current password does not match.' });
    }
  }

  const targetUsername = newUsername || username;
  const targetEmail = newEmail || email;
  const targetPassword = newPassword || (currentPassword ? null : password);

  if (targetUsername && String(targetUsername).trim()) {
    db.admin.username = String(targetUsername).trim();
  }
  if (targetEmail && String(targetEmail).trim()) {
    db.admin.email = String(targetEmail).trim();
  }
  if (targetPassword && String(targetPassword).trim().length >= 4) {
    db.admin.passwordHash = crypto.createHash('sha256').update(String(targetPassword).trim()).digest('hex');
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
};

app.put('/api/admin/credentials', requireAdmin, handleAdminCredentials);
app.post('/api/admin/credentials', requireAdmin, handleAdminCredentials);
app.patch('/api/admin/credentials', requireAdmin, handleAdminCredentials);

// ===================== PRODUCTS API =====================

// GET all products (Public with optional filters)
app.get('/api/products', (req, res) => {
  const db = readDb();
  const category = req.query.category as string;
  const search = ((req.query.search || req.query.q) as string)?.trim().toLowerCase();
  let products = db.products || [];

  if (category && category !== 'All') {
    if (category === 'New Arrivals') {
      products = products.filter((p: any) => p.isNewArrival);
    } else if (category === 'Best Sellers') {
      products = products.filter((p: any) => p.isBestSeller);
    } else {
      products = products.filter((p: any) => p.category?.toLowerCase() === category.toLowerCase());
    }
  }

  if (search) {
    products = products.filter((p: any) => 
      p.name?.toLowerCase().includes(search) ||
      p.description?.toLowerCase().includes(search) ||
      p.category?.toLowerCase().includes(search)
    );
  }

  res.json({ products, total: products.length });
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

// PUT & PATCH update product (Admin)
const handleUpdateProduct = (req: Request, res: Response) => {
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
};

app.put('/api/products/:id', requireAdmin, handleUpdateProduct);
app.patch('/api/products/:id', requireAdmin, handleUpdateProduct);

// DELETE product (Admin)
app.delete('/api/products/:id', requireAdmin, (req, res) => {
  const db = readDb();
  const index = (db.products || []).findIndex((p: any) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const deleted = db.products.splice(index, 1)[0];
  writeDb(db);

  res.json({ success: true, message: 'Product deleted successfully', product: deleted });
});

// ===================== CATEGORIES API =====================

app.get('/api/categories', (req, res) => {
  const db = readDb();
  res.json({ categories: db.categories || [] });
});

app.post('/api/categories', requireAdmin, (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Category name is required' });

  const db = readDb();
  const trimmed = name.trim();
  if (!db.categories.includes(trimmed)) {
    db.categories.push(trimmed);
    writeDb(db);
  }
  res.status(201).json({ success: true, categories: db.categories });
});

const handleDeleteCategory = (req: Request, res: Response) => {
  const name = req.params.name ? decodeURIComponent(req.params.name) : (req.body?.name || req.query?.name as string);
  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }
  const db = readDb();
  const index = (db.categories || []).findIndex((c: string) => c.toLowerCase() === name.trim().toLowerCase());
  if (index === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }

  db.categories.splice(index, 1);
  writeDb(db);
  res.json({ success: true, categories: db.categories });
};

app.delete('/api/categories/:name', requireAdmin, handleDeleteCategory);
app.delete('/api/categories', requireAdmin, handleDeleteCategory);

// ===================== ORDERS API =====================

// GET all orders (Admin)
app.get('/api/orders', requireAdmin, (req, res) => {
  const db = readDb();
  res.json({ orders: db.orders || [] });
});

// GET single order by ID (Public order tracking or Admin)
app.get('/api/orders/:id', (req, res) => {
  const db = readDb();
  const order = (db.orders || []).find((o: any) => o.id.toLowerCase() === req.params.id.toLowerCase());
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json({ success: true, order });
});

// POST create order (Public Checkout)
app.post('/api/orders', (req, res) => {
  const { customerName, phone, email, address, city, notes, items, subtotal, shippingFee, total, paymentMethod } = req.body;

  if (!customerName || !phone || !address || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Customer name, phone, address, and items are required' });
  }

  const db = readDb();
  const calculatedSubtotal = subtotal !== undefined ? Number(subtotal) : items.reduce((s: number, i: any) => s + (Number(i.price) || 0) * (Number(i.quantity) || 1), 0);
  const calculatedShipping = shippingFee !== undefined ? Number(shippingFee) : (calculatedSubtotal >= 5000 ? 0 : 250);
  const calculatedTotal = total !== undefined ? Number(total) : (calculatedSubtotal + calculatedShipping);

  const newOrder = {
    id: `RW-${Math.floor(1000 + Math.random() * 9000)}`,
    customerName,
    phone,
    email: email || '',
    address,
    city: city || 'Lahore',
    notes: notes || '',
    items,
    subtotal: calculatedSubtotal,
    shippingFee: calculatedShipping,
    total: calculatedTotal,
    paymentMethod: paymentMethod || 'Cash on Delivery',
    status: req.body.status || 'Pending',
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);

  // Deduct inventory
  for (const item of items) {
    const prod = (db.products || []).find((p: any) => p.id === item.productId);
    if (prod && prod.stockQuantity !== undefined) {
      prod.stockQuantity = Math.max(0, prod.stockQuantity - (item.quantity || 1));
      if (prod.stockQuantity === 0) prod.inStock = false;
    }
  }

  writeDb(db);
  res.status(201).json({ success: true, order: newOrder });
});

// PUT & PATCH update order (Admin)
const handleUpdateOrder = (req: Request, res: Response) => {
  const db = readDb();
  const order = (db.orders || []).find((o: any) => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  Object.assign(order, req.body);
  writeDb(db);
  res.json({ success: true, order });
};

app.put('/api/orders/:id', requireAdmin, handleUpdateOrder);
app.patch('/api/orders/:id', requireAdmin, handleUpdateOrder);

// DELETE order (Admin)
app.delete('/api/orders/:id', requireAdmin, (req, res) => {
  const db = readDb();
  const index = (db.orders || []).findIndex((o: any) => o.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const deleted = db.orders.splice(index, 1)[0];
  writeDb(db);
  res.json({ success: true, message: 'Order deleted successfully', order: deleted });
});

// ===================== INQUIRIES API =====================

// GET inquiries (Admin)
app.get('/api/inquiries', requireAdmin, (req, res) => {
  const db = readDb();
  res.json({ inquiries: db.inquiries || [] });
});

// GET single inquiry
app.get('/api/inquiries/:id', requireAdmin, (req, res) => {
  const db = readDb();
  const inquiry = (db.inquiries || []).find((i: any) => i.id === req.params.id);
  if (!inquiry) {
    return res.status(404).json({ error: 'Inquiry not found' });
  }
  res.json({ success: true, inquiry });
});

// POST inquiry (Public Contact Form)
app.post('/api/inquiries', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
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

// PUT & PATCH update inquiry (Admin)
const handleUpdateInquiry = (req: Request, res: Response) => {
  const db = readDb();
  const inquiry = (db.inquiries || []).find((i: any) => i.id === req.params.id);

  if (!inquiry) {
    return res.status(404).json({ error: 'Inquiry not found' });
  }

  Object.assign(inquiry, req.body);
  writeDb(db);
  res.json({ success: true, inquiry });
};

app.put('/api/inquiries/:id', requireAdmin, handleUpdateInquiry);
app.patch('/api/inquiries/:id', requireAdmin, handleUpdateInquiry);

// DELETE inquiry (Admin)
app.delete('/api/inquiries/:id', requireAdmin, (req, res) => {
  const db = readDb();
  const index = (db.inquiries || []).findIndex((i: any) => i.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Inquiry not found' });
  }

  const deleted = db.inquiries.splice(index, 1)[0];
  writeDb(db);
  res.json({ success: true, message: 'Inquiry deleted successfully', inquiry: deleted });
});

// ===================== SITE CONTENT API (/api/content & /api/site-content) =====================

const handleGetSiteContent = (req: Request, res: Response) => {
  const db = readDb();
  const content = db.siteContent || {};
  res.json({ 
    success: true, 
    content, 
    siteContent: content, 
    ...content 
  });
};

const handleUpdateSiteContent = (req: Request, res: Response) => {
  const db = readDb();
  db.siteContent = {
    ...db.siteContent,
    ...req.body
  };
  writeDb(db);
  res.json({ 
    success: true, 
    message: 'Site content updated successfully', 
    content: db.siteContent,
    siteContent: db.siteContent,
    ...db.siteContent 
  });
};

app.get('/api/content', handleGetSiteContent);
app.get('/api/site-content', handleGetSiteContent);
app.put('/api/content', requireAdmin, handleUpdateSiteContent);
app.put('/api/site-content', requireAdmin, handleUpdateSiteContent);
app.patch('/api/content', requireAdmin, handleUpdateSiteContent);
app.patch('/api/site-content', requireAdmin, handleUpdateSiteContent);

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
      server: { 
        middlewareMode: true,
        hmr: false,
      },
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
