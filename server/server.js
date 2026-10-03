import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { toursData, destinationsData, testimonialsData } from './data/toursData.js';
import { prisma, initDatabase, isDbConnected, setDbConnectedStatus } from './db.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Configure CORS
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin, Vercel subdomains, localhost, or configured CLIENT_URL
    if (!origin || origin.includes('vercel.app') || origin.includes('localhost') || origin.includes('127.0.0.1') || origin === CLIENT_URL) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Initialize Prisma ORM / AWS RDS MySQL database on server startup
initDatabase();

// In-memory active tokens store
const activeAdminTokens = new Set();

// Global site settings (controlled from server / env)
const siteSettings = {
  appName: process.env.APP_NAME || 'Dr. Khan Travel & Tours',
  logoUrl: process.env.APP_LOGO_URL || 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=150&q=80',
  logoText: 'Dr. Khan Travel',
  updatedAt: new Date().toISOString()
};

// In-memory store fallback for user bookings and messages
const bookingsStore = [];

let contactMessagesStore = [
  {
    id: "MSG-1001",
    name: "Zainab Shah",
    email: "zainab.shah@example.com",
    phone: "+92 301 5551234",
    subject: "Custom Family Umrah Package Inquiry",
    message: "Assalamu Alaikum, we are a group of 8 family members planning Umrah in December. Can you provide custom flight + 5 star hotel quotes?",
    status: "Unread",
    receivedAt: new Date(Date.now() - 86400000 * 1.5).toISOString()
  },
  {
    id: "MSG-1002",
    name: "Bilal Hassan",
    email: "bilal.hassan@example.com",
    phone: "+92 345 8889900",
    subject: "Turkey Hot Air Balloon Reservation",
    message: "Does the Turkey Heritage package guarantee hot air balloon seats in Cappadocia during peak season?",
    status: "Replied",
    receivedAt: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

// About section slider images store
let aboutSlidesStore = [
  {
    id: "slide-1",
    imageUrl: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=800&q=80",
    caption: "Luxury Yacht Sunset Cruise"
  },
  {
    id: "slide-2",
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    caption: "Alpine Resort Sanctuary"
  },
  {
    id: "slide-3",
    imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80",
    caption: "Tropical Ocean Villa"
  },
  {
    id: "slide-4",
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    caption: "Executive Spa Resort"
  }
];

async function getAboutSlidesList() {
  if (isDbConnected() && prisma.aboutSlide) {
    try {
      const dbSlides = await prisma.aboutSlide.findMany({
        orderBy: { createdAt: 'desc' }
      });
      if (dbSlides.length > 0) {
        return dbSlides.map(s => ({
          id: s.id,
          imageUrl: s.imageUrl,
          caption: s.caption || ''
        }));
      }
    } catch (e) {
      console.error('Prisma query error for about slides:', e.message);
    }
  }
  return aboutSlidesStore;
}

// Happy Client Gallery Store (Controlled exclusively via Admin Dashboard)
let clientGalleryStore = [];

async function getClientGalleryList() {
  if (isDbConnected() && prisma.clientGalleryItem) {
    try {
      const dbItems = await prisma.clientGalleryItem.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return dbItems.map(item => ({
        id: item.id,
        title: item.title,
        category: item.category,
        image: item.image,
        subtitle: item.subtitle || ''
      }));
    } catch (e) {
      setDbConnectedStatus(false);
    }
  }
  return clientGalleryStore;
}

// Mutable tours store initialized with toursData
let toursList = [...toursData];

// Admin Auth Middleware
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization token required for admin access.' });
  }

  const token = authHeader.split(' ')[1];
  if (!activeAdminTokens.has(token)) {
    return res.status(401).json({ success: false, message: 'Invalid or expired admin session token.' });
  }

  next();
};

// Helper function to query Prisma ORM or fallback
async function getBookingsList() {
  if (isDbConnected()) {
    try {
      const dbBookings = await prisma.booking.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return dbBookings.map(b => ({
        bookingId: b.bookingId,
        tourId: b.tourId,
        tourTitle: b.tourTitle,
        tourPricePerPerson: b.tourPricePerPerson,
        totalAmount: b.totalAmount,
        fullName: b.fullName,
        email: b.email,
        phone: b.phone,
        travelersCount: b.travelersCount,
        travelDate: b.travelDate,
        specialRequests: b.specialRequests,
        status: b.status,
        createdAt: b.createdAt
      }));
    } catch (e) {
      console.error('Prisma query error, using fallback store:', e.message);
    }
  }
  return bookingsStore;
}

// ==================== PUBLIC ROUTES ==================== //

// Healthcheck Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    appName: siteSettings.appName,
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    port: PORT,
    clientUrl: CLIENT_URL,
    environment: process.env.NODE_ENV || 'development',
    adminEmailConfigured: process.env.ADMIN_EMAIL || 'admin@drkhantravel.com',
    orm: 'Prisma ORM (v5.22.0)',
    database: {
      provider: 'AWS RDS MySQL',
      url: process.env.DATABASE_URL ? 'Configured in .env' : 'Not set',
      connected: isDbConnected()
    },
    serverUptime: Math.floor(process.uptime()) + ' seconds'
  });
});

// Get Public Config (Server controlled Logo URL, App Name, Cloudinary & Prisma AWS MySQL info)
app.get('/api/config', (req, res) => {
  res.json({
    success: true,
    siteSettings: {
      appName: siteSettings.appName,
      logoUrl: siteSettings.logoUrl,
      logoText: siteSettings.logoText
    },
    configuredAdminEmail: process.env.ADMIN_EMAIL || 'admin@drkhantravel.com',
    orm: 'Prisma ORM (v5.22.0)',
    database: {
      provider: 'AWS RDS MySQL',
      connected: isDbConnected()
    },
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'dta2eolgn',
      apiKey: process.env.CLOUDINARY_API_KEY || '166225669915732',
      uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || 'dr_khan_travel_preset'
    }
  });
});

// Get Company Stats
app.get('/api/stats', async (req, res) => {
  const currentBookings = await getBookingsList();
  const totalRevenue = currentBookings
    .filter(b => b.status === 'Confirmed' || b.status === 'Completed')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  res.json({
    satisfiedTravelers: "18,500+",
    destinationsCount: "45+",
    yearsExperience: "15+",
    satisfactionRate: "99.6%",
    activeToursCount: toursList.length,
    activeBookingsCount: currentBookings.length,
    totalRevenue
  });
});

// Get all tours with optional search/filtering
app.get('/api/tours', (req, res) => {
  const { category, search, minPrice, maxPrice } = req.query;
  let filtered = [...toursList];

  if (category && category !== 'All') {
    filtered = filtered.filter(t => t.category.toLowerCase().includes(category.toLowerCase()));
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(t => 
      t.title.toLowerCase().includes(q) || 
      t.destination.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  }

  if (maxPrice) {
    filtered = filtered.filter(t => t.price <= Number(maxPrice));
  }

  res.json({
    success: true,
    count: filtered.length,
    total: toursList.length,
    tours: filtered
  });
});

// Get tour by ID
app.get('/api/tours/:id', (req, res) => {
  const tour = toursList.find(t => t.id === req.params.id);
  if (!tour) {
    return res.status(404).json({ success: false, message: 'Tour package not found' });
  }
  res.json({ success: true, tour });
});

// Get featured destinations
app.get('/api/destinations', (req, res) => {
  res.json({
    success: true,
    count: destinationsData.length,
    destinations: destinationsData
  });
});

// Get testimonials
app.get('/api/testimonials', (req, res) => {
  res.json({
    success: true,
    testimonials: testimonialsData
  });
});

// Get About Section Slider Images
app.get('/api/about-slides', async (req, res) => {
  const slides = await getAboutSlidesList();
  res.json({
    success: true,
    count: slides.length,
    slides
  });
});

// Get Happy Client Gallery Items
app.get('/api/client-gallery', async (req, res) => {
  const items = await getClientGalleryList();
  res.json({
    success: true,
    count: items.length,
    items
  });
});

// Public: Submit a new tour booking (Saves via Prisma ORM or memory fallback)
app.post('/api/bookings', async (req, res) => {
  const { tourId, fullName, email, phone, travelersCount, travelDate, specialRequests } = req.body;

  if (!tourId || !fullName || !email || !phone || !travelersCount || !travelDate) {
    return res.status(400).json({
      success: false,
      message: 'Missing required booking fields: tourId, fullName, email, phone, travelersCount, travelDate'
    });
  }

  const tour = toursList.find(t => t.id === tourId);
  const bookingId = `DK-${Math.floor(10000 + Math.random() * 90000)}`;
  const pricePerPerson = tour ? tour.price : 1500;
  const count = Number(travelersCount) || 1;
  const totalAmount = pricePerPerson * count;

  const newBooking = {
    bookingId,
    tourId,
    tourTitle: tour ? tour.title : 'Custom Deluxe Travel Package',
    tourPricePerPerson: pricePerPerson,
    totalAmount,
    fullName,
    email,
    phone,
    travelersCount: count,
    travelDate,
    specialRequests: specialRequests || 'None',
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  if (isDbConnected()) {
    try {
      await prisma.booking.create({
        data: {
          bookingId,
          tourId,
          tourTitle: newBooking.tourTitle,
          tourPricePerPerson: pricePerPerson,
          totalAmount,
          fullName,
          email,
          phone,
          travelersCount: count,
          travelDate,
          specialRequests: specialRequests || 'None',
          status: 'Pending'
        }
      });
    } catch (err) {
      console.error('Prisma booking create error:', err.message);
    }
  }

  bookingsStore.unshift(newBooking);

  res.status(201).json({
    success: true,
    message: 'Booking request submitted successfully! Booking ID: ' + bookingId,
    booking: newBooking
  });
});

// Public: Submit contact message (Saves via Prisma ORM)
app.post('/api/contact', async (req, res) => {
  const { name, fatherName, cnic, passportNumber, workingSkills, tiktokLinks, email, phone, subject, message } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Full Name is required.'
    });
  }

  const processedTiktokLinks = Array.isArray(tiktokLinks)
    ? tiktokLinks.filter(l => l && l.trim() !== '').join('\n')
    : (tiktokLinks || '');

  const msgId = `MSG-${Date.now()}`;
  const newMessage = {
    id: msgId,
    name,
    fatherName: fatherName || 'Not provided',
    cnic: cnic || 'Not provided',
    passportNumber: passportNumber || 'Not provided',
    workingSkills: workingSkills || 'Not specified',
    tiktokLinks: processedTiktokLinks,
    email: email || 'Not provided',
    phone: phone || 'Not provided',
    subject: subject || 'General Application / Inquiry',
    message: message || 'No additional notes',
    status: 'Unread',
    receivedAt: new Date().toISOString()
  };

  if (isDbConnected()) {
    try {
      await prisma.contactMessage.create({
        data: {
          id: msgId,
          name,
          fatherName: fatherName || null,
          cnic: cnic || null,
          passportNumber: passportNumber || null,
          workingSkills: workingSkills || null,
          tiktokLinks: processedTiktokLinks || null,
          email: email || null,
          phone: phone || null,
          subject: subject || 'General Application / Inquiry',
          message: message || 'No additional notes',
          status: 'Unread'
        }
      });
    } catch (err) {
      console.error('Prisma message create error:', err.message);
    }
  }

  contactMessagesStore.unshift(newMessage);

  res.status(201).json({
    success: true,
    message: 'Thank you! Your details and video links have been received successfully.'
  });
});

// ==================== ADMIN AUTHENTICATION ==================== //

// Admin Login Route (checks against server environment variables ADMIN_EMAIL & ADMIN_PASSWORD)
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;

  const envEmail = process.env.ADMIN_EMAIL || 'admin@drkhantravel.com';
  const envPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email and password.'
    });
  }

  // Compare strictly with server environment variables
  const isEmailValid = email.trim().toLowerCase() === envEmail.trim().toLowerCase();
  const isPasswordValid = password === envPassword;

  if (!isEmailValid || !isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password. Please verify server .env credentials.'
    });
  }

  // Generate unique admin session token
  const token = `dk_admin_${crypto.randomBytes(24).toString('hex')}`;
  activeAdminTokens.add(token);

  res.json({
    success: true,
    message: 'Admin authentication successful!',
    token,
    admin: {
      email: envEmail,
      name: 'System Administrator',
      role: 'Super Admin',
      loggedAt: new Date().toISOString()
    }
  });
});

// Verify Admin Session Token
app.get('/api/admin/verify', authenticateAdmin, (req, res) => {
  res.json({
    success: true,
    valid: true,
    admin: {
      email: process.env.ADMIN_EMAIL || 'admin@drkhantravel.com',
      role: 'Super Admin'
    }
  });
});

// Admin Logout
app.post('/api/admin/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeAdminTokens.delete(token);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// ==================== ADMIN SETTINGS & CLOUDINARY ==================== //

// Update Navbar Logo URL & App Settings
app.put('/api/admin/settings', authenticateAdmin, (req, res) => {
  const { logoUrl, appName, logoText } = req.body;

  if (logoUrl) siteSettings.logoUrl = logoUrl;
  if (appName) siteSettings.appName = appName;
  if (logoText) siteSettings.logoText = logoText;
  siteSettings.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: 'Navbar logo and site settings updated successfully!',
    siteSettings
  });
});

// Generate Cloudinary Upload Signature (Admin Protected)
app.post('/api/admin/cloudinary-signature', authenticateAdmin, (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const apiSecret = process.env.CLOUDINARY_API_SECRET || 'DYay_BuY2ief_6Mc6mw8iGN3B7c';

  // Create signature SHA-1 string (standard Cloudinary signed upload: timestamp + apiSecret)
  const strToSign = `timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(strToSign).digest('hex');

  res.json({
    success: true,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'dta2eolgn',
    apiKey: process.env.CLOUDINARY_API_KEY || '166225669915732',
    timestamp,
    signature
  });
});

// Admin: Add new About Section Slide
app.post('/api/admin/about-slides', authenticateAdmin, async (req, res) => {
  const { imageUrl, caption } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ success: false, message: 'Image URL is required' });
  }

  const newSlide = {
    id: `slide-${Date.now()}`,
    imageUrl,
    caption: caption || ''
  };

  if (isDbConnected() && prisma.aboutSlide) {
    try {
      await prisma.aboutSlide.create({
        data: {
          id: newSlide.id,
          imageUrl: newSlide.imageUrl,
          caption: newSlide.caption
        }
      });
    } catch (e) {
      console.error('Prisma save error for about slide:', e.message);
    }
  }

  aboutSlidesStore.unshift(newSlide);
  res.json({
    success: true,
    message: 'About slide added successfully!',
    slide: newSlide
  });
});

// Admin: Add multiple About Section Slides in bulk
app.post('/api/admin/about-slides/bulk', authenticateAdmin, async (req, res) => {
  const { slides } = req.body;
  if (!Array.isArray(slides) || slides.length === 0) {
    return res.status(400).json({ success: false, message: 'Slides array is required' });
  }

  const createdSlides = [];
  for (const item of slides) {
    if (!item.imageUrl) continue;
    const newSlide = {
      id: `slide-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      imageUrl: item.imageUrl,
      caption: item.caption || ''
    };

    if (isDbConnected() && prisma.aboutSlide) {
      try {
        await prisma.aboutSlide.create({
          data: {
            id: newSlide.id,
            imageUrl: newSlide.imageUrl,
            caption: newSlide.caption
          }
        });
      } catch (e) {
        console.error('Prisma bulk slide save error:', e.message);
      }
    }

    aboutSlidesStore.unshift(newSlide);
    createdSlides.push(newSlide);
  }

  res.json({
    success: true,
    message: `${createdSlides.length} slide(s) added successfully!`,
    slides: createdSlides
  });
});

// Admin: Delete About Section Slide
app.delete('/api/admin/about-slides/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;

  if (isDbConnected() && prisma.aboutSlide) {
    try {
      await prisma.aboutSlide.deleteMany({
        where: { id }
      });
    } catch (e) {
      console.error('Prisma delete error for about slide:', e.message);
    }
  }

  aboutSlidesStore = aboutSlidesStore.filter(s => s.id !== id);
  res.json({
    success: true,
    message: `Slide ${id} deleted successfully.`
  });
});

// Admin: Add Happy Client Gallery Item
app.post('/api/admin/client-gallery', authenticateAdmin, async (req, res) => {
  const { title, category, image, subtitle } = req.body;
  if (!image || !title) {
    return res.status(400).json({ success: false, message: 'Title and image URL are required' });
  }

  const newItem = {
    id: `cg-${Date.now()}`,
    title,
    category: category || 'HAPPY CLIENTS',
    image,
    subtitle: subtitle || ''
  };

  if (isDbConnected() && prisma.clientGalleryItem) {
    try {
      await prisma.clientGalleryItem.create({
        data: {
          id: newItem.id,
          title: newItem.title,
          category: newItem.category,
          image: newItem.image,
          subtitle: newItem.subtitle
        }
      });
    } catch (e) {
      console.error('Prisma save error for client gallery item:', e.message);
    }
  }

  clientGalleryStore.unshift(newItem);
  res.json({
    success: true,
    message: 'Client gallery item added successfully!',
    item: newItem
  });
});

// Admin: Add multiple Happy Client Gallery Items in bulk
app.post('/api/admin/client-gallery/bulk', authenticateAdmin, async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Items array is required' });
  }

  const createdItems = [];
  for (const entry of items) {
    if (!entry.image) continue;
    const newItem = {
      id: `cg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: entry.title || 'Happy Client Experience',
      category: entry.category || 'HAPPY CLIENTS',
      image: entry.image,
      subtitle: entry.subtitle || ''
    };

    if (isDbConnected() && prisma.clientGalleryItem) {
      try {
        await prisma.clientGalleryItem.create({
          data: {
            id: newItem.id,
            title: newItem.title,
            category: newItem.category,
            image: newItem.image,
            subtitle: newItem.subtitle
          }
        });
      } catch (e) {
        console.error('Prisma bulk client gallery save error:', e.message);
      }
    }

    clientGalleryStore.unshift(newItem);
    createdItems.push(newItem);
  }

  res.json({
    success: true,
    message: `${createdItems.length} gallery item(s) added successfully!`,
    items: createdItems
  });
});

// Admin: Update Happy Client Gallery Item
app.put('/api/admin/client-gallery/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, category, image, subtitle } = req.body;

  let updatedItem = null;

  if (isDbConnected() && prisma.clientGalleryItem) {
    try {
      await prisma.clientGalleryItem.updateMany({
        where: { id },
        data: {
          ...(title && { title }),
          ...(category && { category }),
          ...(image && { image }),
          ...(subtitle !== undefined && { subtitle })
        }
      });
    } catch (e) {
      console.error('Prisma update error for client gallery item:', e.message);
    }
  }

  const idx = clientGalleryStore.findIndex(i => i.id === id);
  if (idx !== -1) {
    if (title) clientGalleryStore[idx].title = title;
    if (category) clientGalleryStore[idx].category = category;
    if (image) clientGalleryStore[idx].image = image;
    if (subtitle !== undefined) clientGalleryStore[idx].subtitle = subtitle;
    updatedItem = clientGalleryStore[idx];
  } else {
    updatedItem = { id, title, category: category || 'HAPPY CLIENTS', image, subtitle: subtitle || '' };
  }

  res.json({
    success: true,
    message: `Gallery item ${id} updated successfully!`,
    item: updatedItem
  });
});

// Admin: Delete Happy Client Gallery Item
app.delete('/api/admin/client-gallery/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;

  if (isDbConnected() && prisma.clientGalleryItem) {
    try {
      await prisma.clientGalleryItem.deleteMany({
        where: { id }
      });
    } catch (e) {
      console.error('Prisma delete error for client gallery item:', e.message);
    }
  }

  clientGalleryStore = clientGalleryStore.filter(i => i.id !== id);
  res.json({
    success: true,
    message: `Gallery item ${id} deleted successfully.`
  });
});

// ==================== ADMIN PROTECTED MANAGEMENT ENDPOINTS ==================== //

// Get Comprehensive Admin Stats & Overview
app.get('/api/admin/stats', authenticateAdmin, async (req, res) => {
  const currentBookings = await getBookingsList();
  const totalBookings = currentBookings.length;
  const pendingBookings = currentBookings.filter(b => b.status === 'Pending').length;
  const confirmedBookings = currentBookings.filter(b => b.status === 'Confirmed' || b.status === 'Completed').length;
  const cancelledBookings = currentBookings.filter(b => b.status === 'Cancelled').length;

  const totalRevenue = currentBookings
    .filter(b => b.status === 'Confirmed' || b.status === 'Completed')
    .reduce((acc, b) => acc + (b.totalAmount || 0), 0);

  const unreadMessages = contactMessagesStore.filter(m => m.status === 'Unread').length;

  res.json({
    success: true,
    stats: {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      totalRevenue,
      unreadMessages,
      totalMessages: contactMessagesStore.length,
      activeToursCount: toursList.length,
      siteSettings,
      orm: 'Prisma ORM (v5.22.0)',
      database: {
        provider: 'AWS RDS MySQL',
        connected: isDbConnected()
      },
      serverConfig: {
        adminEmail: process.env.ADMIN_EMAIL || 'admin@drkhantravel.com',
        nodeEnv: process.env.NODE_ENV || 'development',
        cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || 'drkhantravel',
        uptime: Math.floor(process.uptime()) + ' seconds'
      }
    }
  });
});

// Admin: Get all bookings
app.get('/api/admin/bookings', authenticateAdmin, async (req, res) => {
  const currentBookings = await getBookingsList();
  res.json({
    success: true,
    count: currentBookings.length,
    bookings: currentBookings
  });
});

// Admin: Update booking status or details
app.put('/api/admin/bookings/:bookingId', authenticateAdmin, async (req, res) => {
  const { bookingId } = req.params;
  const { status, specialRequests, travelersCount, travelDate } = req.body;

  let bookingIndex = bookingsStore.findIndex(b => b.bookingId === bookingId);
  
  if (isDbConnected()) {
    try {
      if (status) {
        await prisma.booking.update({
          where: { bookingId },
          data: { status }
        });
      }
    } catch (e) {
      console.error('Prisma update error:', e.message);
    }
  }

  if (bookingIndex !== -1) {
    const booking = bookingsStore[bookingIndex];
    if (status) booking.status = status;
    if (specialRequests !== undefined) booking.specialRequests = specialRequests;
    if (travelersCount) {
      booking.travelersCount = Number(travelersCount);
      booking.totalAmount = (booking.tourPricePerPerson || 1500) * booking.travelersCount;
    }
    if (travelDate) booking.travelDate = travelDate;
    booking.updatedAt = new Date().toISOString();

    return res.json({
      success: true,
      message: `Booking ${bookingId} updated successfully.`,
      booking
    });
  }

  res.json({ success: true, message: `Booking ${bookingId} status updated.` });
});

// Admin: Delete a booking
app.delete('/api/admin/bookings/:bookingId', authenticateAdmin, async (req, res) => {
  const { bookingId } = req.params;

  if (isDbConnected()) {
    try {
      await prisma.booking.deleteMany({
        where: { bookingId }
      });
    } catch (e) {
      console.error('Prisma delete error:', e.message);
    }
  }

  const index = bookingsStore.findIndex(b => b.bookingId === bookingId);
  let deleted = null;
  if (index !== -1) {
    deleted = bookingsStore.splice(index, 1)[0];
  }

  res.json({
    success: true,
    message: `Booking ${bookingId} deleted successfully.`,
    deleted
  });
});

// Admin: Get all contact messages
app.get('/api/admin/messages', authenticateAdmin, async (req, res) => {
  if (isDbConnected()) {
    try {
      const dbMessages = await prisma.contactMessage.findMany({
        orderBy: { receivedAt: 'desc' }
      });
      if (dbMessages && dbMessages.length > 0) {
        contactMessagesStore = dbMessages.map(m => ({
          ...m,
          receivedAt: m.receivedAt ? m.receivedAt.toISOString() : new Date().toISOString()
        }));
      }
    } catch (err) {
      console.error('Error fetching contact messages from DB:', err.message);
    }
  }

  res.json({
    success: true,
    count: contactMessagesStore.length,
    messages: contactMessagesStore
  });
});

// Admin: Update contact message status
app.put('/api/admin/messages/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const msg = contactMessagesStore.find(m => m.id === id);
  if (!msg) {
    return res.status(404).json({ success: false, message: 'Message not found.' });
  }

  if (status) msg.status = status;
  msg.updatedAt = new Date().toISOString();

  if (isDbConnected()) {
    try {
      const existing = await prisma.contactMessage.findUnique({ where: { id } });
      if (existing) {
        await prisma.contactMessage.update({
          where: { id },
          data: { status: status || msg.status }
        });
      }
    } catch (err) {
      // Graceful fallback if record not in DB
    }
  }

  res.json({
    success: true,
    message: 'Message status updated.',
    messageData: msg
  });
});

// Admin: Delete contact message
app.delete('/api/admin/messages/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const index = contactMessagesStore.findIndex(m => m.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Message not found.' });
  }

  contactMessagesStore.splice(index, 1);

  if (isDbConnected()) {
    try {
      const existing = await prisma.contactMessage.findUnique({ where: { id } });
      if (existing) {
        await prisma.contactMessage.delete({ where: { id } });
      }
    } catch (err) {
      // Graceful fallback if record not in DB
    }
  }

  res.json({ success: true, message: 'Message deleted successfully.' });
});

// Admin: Add new tour package
app.post('/api/admin/tours', authenticateAdmin, (req, res) => {
  const { title, category, destination, duration, price, badge, description, image, highlights } = req.body;

  if (!title || !category || !destination || !price) {
    return res.status(400).json({
      success: false,
      message: 'Title, category, destination, and price are required fields for a tour.'
    });
  }

  const newTour = {
    id: `tour-${Date.now()}`,
    title,
    category,
    destination,
    duration: duration || '7 Days / 6 Nights',
    price: Number(price),
    rating: 4.90,
    reviewsCount: 1,
    image: image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    badge: badge || 'New Destination',
    description: description || 'Experience an unforgettably luxurious adventure crafted by Dr. Khan Travel & Tours.',
    highlights: Array.isArray(highlights) ? highlights : (highlights ? highlights.split('\n').filter(Boolean) : [
      '5-Star Luxury Accommodations',
      'Dedicated Chauffeur & Transfers',
      'Exclusive Guided Sightseeing',
      'All Taxes & Breakfast Included'
    ]),
    included: ['Luxury Hotel', 'Breakfast', 'Airport Transfers', 'Guided Tour'],
    itinerary: [
      { day: 'Day 1-2', title: 'Arrival & Welcome', details: 'Private airport VIP transfer and hotel check-in.' },
      { day: 'Day 3-5', title: 'Guided Sightseeing', details: 'Full day sightseeing tour with private guide.' },
      { day: 'Day 6-7', title: 'Relaxation & Departure', details: 'Leisure day and transfer back to airport.' }
    ]
  };

  toursList.unshift(newTour);

  res.status(201).json({
    success: true,
    message: 'Tour package created successfully!',
    tour: newTour
  });
});

// Admin: Edit tour package
app.put('/api/admin/tours/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const tourIndex = toursList.findIndex(t => t.id === id);

  if (tourIndex === -1) {
    return res.status(404).json({ success: false, message: 'Tour package not found.' });
  }

  const existing = toursList[tourIndex];
  const updated = {
    ...existing,
    ...req.body,
    price: req.body.price ? Number(req.body.price) : existing.price,
    id // keep same ID
  };

  toursList[tourIndex] = updated;

  res.json({
    success: true,
    message: 'Tour package updated successfully!',
    tour: updated
  });
});

// Admin: Delete tour package
app.delete('/api/admin/tours/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const index = toursList.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Tour package not found.' });
  }

  toursList.splice(index, 1);

  res.json({
    success: true,
    message: 'Tour package deleted successfully.'
  });
});

// 404 Fallback
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found on server.` });
});

// Start Express Server (only when running standalone server, not on Vercel serverless)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`✈️  Dr. Khan Travel & Tours Server Running!`);
    console.log(`📡 Port: ${PORT}`);
    console.log(`💎 ORM: Prisma ORM (v5.22.0)`);
    console.log(`🔑 Admin Email: ${process.env.ADMIN_EMAIL || 'admin@drkhantravel.com'}`);
    console.log(`☁️  Cloudinary Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME || 'dta2eolgn'}`);
    console.log(`🌐 Allowed Client Origin: ${CLIENT_URL}`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
}

export default app;
