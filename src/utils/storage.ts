import { Category, ContactMessage, Order, Template, User, PaymentSettings, CurrencyCode, CurrencyRate } from '../types';

export const CURRENCY_LIST: CurrencyRate[] = [
  { code: 'USD', name: 'United States Dollar', symbol: '$', flag: '🇺🇸', rate: 1 },
  { code: 'NPR', name: 'Nepalese Rupee', symbol: 'रू', flag: '🇳🇵', rate: 134.50 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', rate: 84.20 },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', rate: 0.78 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦', rate: 1.37 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'AU$', flag: '🇦🇺', rate: 1.52 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪', rate: 3.67 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', rate: 152.00 },
];

const STORAGE_KEYS = {
  USERS: 'webcraft_users',
  CATEGORIES: 'webcraft_categories',
  TEMPLATES: 'webcraft_templates',
  ORDERS: 'webcraft_orders',
  MESSAGES: 'webcraft_messages',
  CURRENT_USER: 'webcraft_current_user',
  CART: 'webcraft_cart',
  PAYMENT_SETTINGS: 'webcraft_payment_settings',
};

// Initial Categories
export const INITIAL_CATEGORIES: Category[] = [
  { id: 'restaurant', name: 'Restaurant', slug: 'restaurant', description: 'Fine dining, cafes, bakeries, and bistro templates', icon: 'Utensils', color: '#f97316', displayOrder: 1 },
  { id: 'hotel', name: 'Hotel & Resort', slug: 'hotel', description: 'Luxury resorts, boutique hotels, and booking portals', icon: 'Hotel', color: '#0ea5e9', displayOrder: 2 },
  { id: 'salon', name: 'Salon & Spa', slug: 'salon', description: 'Beauty parlors, barbershops, wellness, and spas', icon: 'Sparkles', color: '#ec4899', displayOrder: 3 },
  { id: 'furniture', name: 'Furniture & Decor', slug: 'furniture', description: 'Minimalist furniture stores and interior decor showcases', icon: 'Armchair', color: '#8b5cf6', displayOrder: 4 },
  { id: 'realestate', name: 'Real Estate', slug: 'realestate', description: 'Property listings, realtor portfolios, and agencies', icon: 'Building2', color: '#10b981', displayOrder: 5 },
  { id: 'gym', name: 'Gym & Fitness', slug: 'gym', description: 'Crossfit boxes, personal trainers, and gym memberships', icon: 'Dumbbell', color: '#ef4444', displayOrder: 6 },
  { id: 'photography', name: 'Photography', slug: 'photography', description: 'Photographer portfolios, studios, and image galleries', icon: 'Camera', color: '#eab308', displayOrder: 7 },
  { id: 'portfolio', name: 'Portfolio', slug: 'portfolio', description: 'Developer, designer, and creative freelancer portfolios', icon: 'Briefcase', color: '#6366f1', displayOrder: 8 },
  { id: 'business', name: 'Business & SaaS', slug: 'business', description: 'Corporate consultancies, startups, and SaaS products', icon: 'TrendingUp', color: '#14b8a6', displayOrder: 9 },
];

// Rich Initial Templates
export const INITIAL_TEMPLATES: Template[] = [
  {
    id: 'tpl_restaurant_01',
    title: 'Gourmet Haven - Luxury Bistro & Fine Dining',
    slug: 'gourmet-haven-bistro',
    categoryId: 'restaurant',
    price: 39,
    originalPrice: 59,
    shortDesc: 'Artisanal dining experience template featuring interactive food menus, reservation booking modals, and wine pairing showcases.',
    description: 'Gourmet Haven is engineered for Michelin-worthy restaurants, trendy bistros, and culinary artisans. Features a high-converting table reservation form, dynamic category-tabbed menu, chef team spotlight, seasonal tasting highlights, and Instagram gallery integration.',
    features: [
      'Interactive Interactive Menu with dietary badges (Vegan, GF, Halal)',
      'Instant Table Reservation modal with date & party size picker',
      'Chef Spotlight & Farm-to-Table provenance story section',
      'Wine & Cocktail pairings showcase with tasting notes',
      'Fully responsive & mobile-tested on iPhone & Android',
      'Optimized with Schema.org Restaurant rich snippets for Google search'
    ],
    pagesCount: 6,
    rating: 4.9,
    reviewsCount: 38,
    salesCount: 142,
    isFeatured: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80'
    ],
    techStack: ['HTML5', 'CSS3 Variables', 'Vanilla JS', 'Swiper Slider'],
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },
  {
    id: 'tpl_hotel_01',
    title: 'Aura Grand - Luxury Resort & Boutique Hotel',
    slug: 'aura-grand-resort-hotel',
    categoryId: 'hotel',
    price: 49,
    originalPrice: 79,
    shortDesc: 'Opulent hospitality template equipped with room reservation calendars, amenity showcases, and 360 virtual tour placeholders.',
    description: 'Designed specifically for beachfront resorts, mountain chalets, and urban boutique hotels. Includes a date-range room availability inquiry bar, luxury suites comparison grid, on-site spa & dining highlights, guest reviews slider, and concierge contact form.',
    features: [
      'Check-in / Check-out date availability booking calculator',
      'Interactive Room comparison grid (Deluxe, Penthouse, Ocean Villa)',
      'Amenity breakdown with high-res iconography (Infinity pool, Spa, Valet)',
      'Local experience & tourist excursions guide section',
      'Mobile-friendly sticky booking button for 2x conversion rate'
    ],
    pagesCount: 8,
    rating: 5.0,
    reviewsCount: 52,
    salesCount: 210,
    isFeatured: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80'
    ],
    techStack: ['HTML5', 'CSS3 Flex/Grid', 'Vanilla JS'],
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-02-28T14:00:00Z',
  },
  {
    id: 'tpl_salon_01',
    title: 'Velvet Glow - Premium Beauty & Wellness Spa',
    slug: 'velvet-glow-spa-salon',
    categoryId: 'salon',
    price: 34,
    originalPrice: 49,
    shortDesc: 'Aesthetic, warm, and tranquil template for hair salons, luxury nail spas, barbershops, and holistic wellness clinics.',
    description: 'Give beauty clients an irresistible visual experience. Velvet Glow features an appointment scheduling modal, treatment price lists with timing, stylist portfolio cards, before & after sliders, and product shelf showcases.',
    features: [
      'Interactive Treatment Menu with durations and tiered pricing',
      'Interactive Stylist & Aesthetician booking appointment step-flow',
      'Before & After transformation visual slider component',
      'Client testimonials with Google review star ratings',
      'Social proof Instagram grid with hover zoom'
    ],
    pagesCount: 5,
    rating: 4.8,
    reviewsCount: 29,
    salesCount: 96,
    isFeatured: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=1200&q=80'
    ],
    techStack: ['HTML5', 'CSS3 Variables', 'Lightweight Vanilla JS'],
    createdAt: '2026-02-05T09:00:00Z',
    updatedAt: '2026-03-02T11:00:00Z',
  },
  {
    id: 'tpl_furniture_01',
    title: 'Nordic Living - Minimalist Interior & Furniture Store',
    slug: 'nordic-living-furniture',
    categoryId: 'furniture',
    price: 44,
    originalPrice: 65,
    shortDesc: 'Scandinavian-inspired ecommerce & catalog template with clean lines, product lookbooks, and material detail zooms.',
    description: 'Nordic Living is designed for contemporary furniture makers, interior designers, and decor brands. Features a high-converting product showcase, wood & fabric swatch picker, room-by-room inspiration lookbook, and cart sidebar drawer.',
    features: [
      'Room-by-Room Inspiration Lookbook (Living, Bedroom, Office)',
      'Interactive Finish & Fabric Swatch Selector',
      'Dimensions & Assembly blueprint modal',
      'Smooth sliding mini-cart drawer UI',
      'Zero dependency, pure CSS animations for 99+ Lighthouse performance'
    ],
    pagesCount: 7,
    rating: 4.9,
    reviewsCount: 44,
    salesCount: 167,
    isFeatured: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'
    ],
    techStack: ['HTML5', 'Modern CSS Grid', 'Vanilla JS'],
    createdAt: '2026-01-10T11:00:00Z',
    updatedAt: '2026-02-15T15:00:00Z',
  },
  {
    id: 'tpl_realestate_01',
    title: 'Skyline Realty - Ultra Luxury Properties & Brokerage',
    slug: 'skyline-realty-properties',
    categoryId: 'realestate',
    price: 55,
    originalPrice: 89,
    shortDesc: 'Commercial and residential real estate portal template with advanced property filtering, floor plans, and agent contact.',
    description: 'Engineered for luxury real estate agencies, brokers, and architectural developments. Includes property search by price, bedrooms, and location, interactive SVG floor plan viewer, mortgage calculator widget, and agent lead generation forms.',
    features: [
      'Multi-filter Property Finder (Beds, Baths, Price, Location, Type)',
      'High-res Photo Gallery with Lightbox zoom modal',
      'Interactive Interactive Mortgage & Loan Calculator',
      'Floor Plan blueprint layout toggle with room measurements',
      'Direct WhatsApp and Agent scheduling inquiry buttons'
    ],
    pagesCount: 8,
    rating: 4.9,
    reviewsCount: 67,
    salesCount: 312,
    isFeatured: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    techStack: ['HTML5', 'CSS3', 'Vanilla JS', 'Leaflet Map Ready'],
    createdAt: '2026-01-05T08:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z',
  },
  {
    id: 'tpl_gym_01',
    title: 'Titan Athletics - High-Performance Gym & Crossfit',
    slug: 'titan-athletics-gym',
    categoryId: 'gym',
    price: 35,
    originalPrice: 50,
    shortDesc: 'High-energy, bold athletic template with class timetables, membership pricing tables, and trainer bios.',
    description: 'Ignite prospective members with bold typography, dark neon aesthetic, weekly schedule timetable, membership comparison cards, BMI calculator, and free trial pass signup modal.',
    features: [
      'Weekly Interactive Class Timetable (Filter by HIIT, Yoga, Boxing, Strength)',
      'Tiered Membership Pricing with Monthly / Annual toggle',
      'Interactive BMI & Calorie Calculator widget',
      'Coach and Trainer Profiles with specialty badges',
      'Free 1-Day Trial Pass conversion popup'
    ],
    pagesCount: 6,
    rating: 4.7,
    reviewsCount: 22,
    salesCount: 89,
    isFeatured: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80'
    ],
    techStack: ['HTML5', 'Modern CSS Grid', 'Vanilla JS'],
    createdAt: '2026-02-10T14:00:00Z',
    updatedAt: '2026-02-27T17:00:00Z',
  },
  {
    id: 'tpl_photography_01',
    title: 'Lumina Vision - Editorial & Commercial Photography',
    slug: 'lumina-vision-photography',
    categoryId: 'photography',
    price: 38,
    originalPrice: 55,
    shortDesc: 'Stunning visual portfolio with masonry grids, dark mode aesthetic, EXIF camera details, and print shop.',
    description: 'Built for professional photographers, creative directors, and visual artists. Lumina Vision showcases your art with edge-to-edge masonry layouts, fluid lightbox galleries, client proofing password-protected portal, and photoshoot booking calendar.',
    features: [
      'Dynamic Masonry Gallery with category tags (Portraits, Weddings, Fashion)',
      'Fullscreen Lightbox with EXIF camera data display (Aperture, ISO, Shutter)',
      'Client Proofing / Private gallery download layout',
      'Package pricing cards with commercial license breakdown',
      'Optimized lazy loading for 4K imagery'
    ],
    pagesCount: 6,
    rating: 4.9,
    reviewsCount: 31,
    salesCount: 118,
    isFeatured: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80'
    ],
    techStack: ['HTML5', 'CSS3 Flex/Grid', 'Vanilla JS'],
    createdAt: '2026-01-28T16:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },
  {
    id: 'tpl_portfolio_01',
    title: 'Apex Dev - Modern Developer & Designer Portfolio',
    slug: 'apex-dev-portfolio',
    categoryId: 'portfolio',
    price: 29,
    originalPrice: 45,
    shortDesc: 'Sleek dark-mode personal brand portfolio with interactive project case studies, tech stack badges, and resume download.',
    description: 'Designed for senior engineers, UI/UX designers, and freelance consultants looking to land 6-figure contracts. Features metrics-driven case studies, terminal animation hero, timeline experience roadmap, and instant calendar booking link.',
    features: [
      'Interactive Terminal style greeting hero with typing effect',
      'Case study deep dives with problem, solution & metric impacts',
      'Tech stack badges with proficiency indicators',
      'Resume/CV one-click PDF download & print stylesheet',
      'Dark and light mode switch with smooth color transition'
    ],
    pagesCount: 4,
    rating: 5.0,
    reviewsCount: 74,
    salesCount: 480,
    isFeatured: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
    ],
    techStack: ['HTML5', 'CSS3 Custom Properties', 'Vanilla JS'],
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-03-03T18:00:00Z',
  },
  {
    id: 'tpl_business_01',
    title: 'Vanguard SaaS - Enterprise Agency & Tech Consultancy',
    slug: 'vanguard-saas-enterprise',
    categoryId: 'business',
    price: 49,
    originalPrice: 79,
    shortDesc: 'Corporate startup & SaaS marketing template with ROI metrics, pricing calculator, and high-converting lead magnets.',
    description: 'Vanguard SaaS gives B2B software companies and enterprise consulting firms a clean, authoritative web presence. Includes interactive pricing tier selector, feature comparison matrices, client logos bar, case study cards, and lead capture form.',
    features: [
      'Interactive Billing frequency toggle (Monthly vs Annual with 20% discount)',
      'Enterprise Feature Matrix comparison table with checkmarks',
      'Interactive ROI Calculator for sales demonstrations',
      'Customer Logo marquee carousel and verified trust badges',
      'Built-in modal for whitepaper and demo booking'
    ],
    pagesCount: 9,
    rating: 4.9,
    reviewsCount: 48,
    salesCount: 235,
    isFeatured: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80'
    ],
    techStack: ['HTML5', 'CSS3 Grid', 'Vanilla JS'],
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-03-02T13:00:00Z',
  }
];

// Initial Demo Users
export const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin_01',
    name: 'Sankalpa Pokharel',
    email: 'sankalpapokharel69@gmail.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr_customer_01',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    createdAt: '2026-01-15T12:00:00Z',
  }
];

// Initial Payment Gateway Settings (eSewa, Khalti, Bank Transfer QR & Currency Rates)
export const INITIAL_PAYMENT_SETTINGS: PaymentSettings = {
  ownerRoyaltyPercentage: 10, // 10% platform commission on every sale goes to owner
  ownerEmail: 'sankalpapokharel69@gmail.com',
  exchangeRates: {
    USD: 1,
    NPR: 134.50,
    INR: 84.20,
    EUR: 0.92,
    GBP: 0.78,
    CAD: 1.37,
    AUD: 1.52,
    AED: 3.67,
    JPY: 152.00,
  },
  esewa: {
    id: '9801234567',
    accountName: 'WebCraft Studio Pvt. Ltd.',
    qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=esewa:9801234567?amount=',
    instructions: 'Open your eSewa app, scan the QR code or send payment to the eSewa ID above, then enter the Transaction Reference ID and attach your receipt screenshot.',
    enabled: true,
  },
  khalti: {
    id: '9801234567',
    accountName: 'WebCraft Studio Nepal',
    qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=khalti:9801234567?amount=',
    instructions: 'Open your Khalti app, tap Scan & Pay or send directly to the registered Khalti ID, and upload receipt screenshot.',
    enabled: true,
  },
  bank: {
    bankName: 'Nabil Bank Ltd.',
    accountName: 'WebCraft Studio Pvt. Ltd.',
    accountNumber: '01201017500123',
    branch: 'Teendhara, Kathmandu',
    swiftCode: 'NARBNPKA',
    qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=fonespay:bank_transfer_webcraft_studio',
    instructions: 'Scan using any mobile banking app (Fonepay QR) or deposit directly to our Nabil Bank corporate account.',
    enabled: true,
  },
};

// Initial Demo Orders
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-942817',
    userId: 'usr_customer_01',
    customerName: 'Alex Johnson',
    customerEmail: 'alex@example.com',
    customerPhone: '+977 9801234567',
    totalAmount: 39,
    platformCommission: 3.90, // 10% automatically for Sankalpa Pokharel
    sellerAmount: 35.10,
    currency: 'NPR',
    convertedAmount: 5245.50,
    conversionRate: 134.50,
    status: 'Paid', // Already marked paid so download can be verified immediately!
    paymentMethod: 'esewa',
    paymentRef: 'ESW-99482104-NP',
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80',
    notes: 'Please verify eSewa transfer receipt attached.',
    adminNotes: 'Payment verified via eSewa merchant portal.',
    items: [
      {
        templateId: 'tpl_restaurant_01',
        templateTitle: 'Gourmet Haven - Luxury Bistro & Fine Dining',
        price: 39,
        thumbnailUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
        category: 'Restaurant'
      }
    ],
    createdAt: '2026-02-28T14:32:00Z',
    updatedAt: '2026-02-28T14:45:00Z',
  },
  {
    id: 'ORD-881920',
    userId: 'usr_customer_01',
    customerName: 'Alex Johnson',
    customerEmail: 'alex@example.com',
    customerPhone: '+977 9801234567',
    totalAmount: 49,
    platformCommission: 4.90, // 10% commission
    sellerAmount: 44.10,
    currency: 'USD',
    convertedAmount: 49,
    conversionRate: 1,
    status: 'Pending',
    paymentMethod: 'khalti',
    paymentRef: 'KHLT-7729103',
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=600&q=80',
    notes: 'Paid via Khalti QR screenshot.',
    items: [
      {
        templateId: 'tpl_hotel_01',
        templateTitle: 'Aura Grand - Luxury Resort & Boutique Hotel',
        price: 49,
        thumbnailUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
        category: 'Hotel & Resort'
      }
    ],
    createdAt: '2026-03-04T10:15:00Z',
    updatedAt: '2026-03-04T10:15:00Z',
  }
];

// Initial Messages
export const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'msg_001',
    senderName: 'David Miller',
    senderEmail: 'david.m@designhouse.io',
    subject: 'Commercial license inquiry for client projects',
    message: 'Hello WebCraft team! If I purchase the Apex Dev template, can I use it for multiple freelance client projects or do I need an extended license? Thank you!',
    isTicket: false,
    status: 'unread',
    createdAt: '2026-03-04T16:20:00Z',
  },
  {
    id: 'msg_002',
    senderName: 'Sarah Jenkins',
    senderEmail: 'sarah.j@bloomhotels.com',
    subject: 'Support Ticket: Help with Aura Grand booking calendar integration',
    message: 'Hi support, we recently purchased the Aura Grand template. Is there an easy way to hook up the date picker to our Cloudbeds booking engine webhook? Thanks for your assistance!',
    isTicket: true,
    status: 'unread',
    createdAt: '2026-03-05T09:40:00Z',
  },
  {
    id: 'msg_003',
    senderName: 'Rohan Sharma',
    senderEmail: 'rohan.sharma@gmail.com',
    subject: 'Request for Gym Template Tailwind conversion',
    message: 'Love the Titan Athletics template! Do you have plans to release an official Tailwind v4 config for it as well?',
    isTicket: false,
    status: 'read',
    createdAt: '2026-03-02T11:10:00Z',
  }
];

// Storage Engine
export class StorageService {
  static getCategories(): Category[] {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    return JSON.parse(data);
  }

  static saveCategories(categories: Category[]) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }

  static getTemplates(): Template[] {
    const data = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(INITIAL_TEMPLATES));
      return INITIAL_TEMPLATES;
    }
    return JSON.parse(data);
  }

  static saveTemplates(templates: Template[]) {
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
  }

  static getTemplateById(idOrSlug: string): Template | undefined {
    const templates = this.getTemplates();
    return templates.find(t => t.id === idOrSlug || t.slug === idOrSlug);
  }

  static addTemplate(template: Omit<Template, 'id' | 'createdAt' | 'updatedAt' | 'salesCount' | 'rating'>): Template {
    const templates = this.getTemplates();
    const newTemplate: Template = {
      ...template,
      id: 'tpl_' + Date.now().toString(36),
      rating: 5.0,
      salesCount: 0,
      reviewsCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    templates.unshift(newTemplate);
    this.saveTemplates(templates);
    return newTemplate;
  }

  static updateTemplate(id: string, updates: Partial<Template>): Template | null {
    const templates = this.getTemplates();
    const index = templates.findIndex(t => t.id === id);
    if (index === -1) return null;
    templates[index] = {
      ...templates[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveTemplates(templates);
    return templates[index];
  }

  static deleteTemplate(id: string): boolean {
    const templates = this.getTemplates();
    const filtered = templates.filter(t => t.id !== id);
    if (filtered.length === templates.length) return false;
    this.saveTemplates(filtered);
    return true;
  }

  static getOrders(): Order[] {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(data);
  }

  static saveOrders(orders: Order[]) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }

  static createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'platformCommission' | 'sellerAmount'> & Partial<Pick<Order, 'platformCommission' | 'sellerAmount' | 'currency' | 'convertedAmount' | 'conversionRate'>>): Order {
    const orders = this.getOrders();
    const settings = this.getPaymentSettings();
    const royaltyRate = (settings.ownerRoyaltyPercentage ?? 10) / 100;
    const platformCommission = orderData.platformCommission !== undefined 
      ? orderData.platformCommission 
      : Number((orderData.totalAmount * royaltyRate).toFixed(2));
    const sellerAmount = orderData.sellerAmount !== undefined 
      ? orderData.sellerAmount 
      : Number((orderData.totalAmount - platformCommission).toFixed(2));

    const newOrder: Order = {
      ...orderData,
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      platformCommission,
      sellerAmount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    orders.unshift(newOrder);
    this.saveOrders(orders);

    // Update sales count of purchased templates
    const templates = this.getTemplates();
    orderData.items.forEach(item => {
      const t = templates.find(temp => temp.id === item.templateId);
      if (t) t.salesCount = (t.salesCount || 0) + 1;
    });
    this.saveTemplates(templates);

    return newOrder;
  }

  static updateOrderStatus(orderId: string, status: Order['status'], adminNotes?: string): Order | null {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) return null;
    orders[index].status = status;
    if (adminNotes !== undefined) orders[index].adminNotes = adminNotes;
    orders[index].updatedAt = new Date().toISOString();
    this.saveOrders(orders);
    return orders[index];
  }

  static getMessages(): ContactMessage[] {
    const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
      return INITIAL_MESSAGES;
    }
    return JSON.parse(data);
  }

  static saveMessages(messages: ContactMessage[]) {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }

  static addMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): ContactMessage {
    const messages = this.getMessages();
    const newMsg: ContactMessage = {
      ...msg,
      id: 'msg_' + Date.now().toString(36),
      status: 'unread',
      createdAt: new Date().toISOString(),
    };
    messages.unshift(newMsg);
    this.saveMessages(messages);
    return newMsg;
  }

  static updateMessageStatus(id: string, status: ContactMessage['status']): boolean {
    const messages = this.getMessages();
    const index = messages.findIndex(m => m.id === id);
    if (index === -1) return false;
    messages[index].status = status;
    this.saveMessages(messages);
    return true;
  }

  static deleteMessage(id: string): boolean {
    const messages = this.getMessages();
    const filtered = messages.filter(m => m.id !== id);
    if (filtered.length === messages.length) return false;
    this.saveMessages(filtered);
    return true;
  }

  static getUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    let users: User[] = data ? JSON.parse(data) : INITIAL_USERS;
    
    // Ensure primary admin sankalpapokharel69@gmail.com is present with admin role
    const adminEmail = 'sankalpapokharel69@gmail.com';
    const existingAdminIndex = users.findIndex(u => u.email.toLowerCase() === adminEmail);
    if (existingAdminIndex === -1) {
      users.unshift({
        id: 'usr_admin_sankalpa',
        name: 'Sankalpa Pokharel',
        email: adminEmail,
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        createdAt: '2026-01-01T00:00:00Z',
      });
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } else if (users[existingAdminIndex].role !== 'admin') {
      users[existingAdminIndex].role = 'admin';
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    return users;
  }

  static saveUsers(users: User[]) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  static getPaymentSettings(): PaymentSettings {
    const data = localStorage.getItem(STORAGE_KEYS.PAYMENT_SETTINGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PAYMENT_SETTINGS, JSON.stringify(INITIAL_PAYMENT_SETTINGS));
      return INITIAL_PAYMENT_SETTINGS;
    }
    try {
      const parsed = JSON.parse(data);
      return {
        ...INITIAL_PAYMENT_SETTINGS,
        ...parsed,
        ownerRoyaltyPercentage: parsed.ownerRoyaltyPercentage ?? 10,
        ownerEmail: parsed.ownerEmail || 'sankalpapokharel69@gmail.com',
        exchangeRates: {
          ...INITIAL_PAYMENT_SETTINGS.exchangeRates,
          ...(parsed.exchangeRates || {})
        },
        esewa: { ...INITIAL_PAYMENT_SETTINGS.esewa, ...(parsed.esewa || {}) },
        khalti: { ...INITIAL_PAYMENT_SETTINGS.khalti, ...(parsed.khalti || {}) },
        bank: { ...INITIAL_PAYMENT_SETTINGS.bank, ...(parsed.bank || {}) },
      };
    } catch (e) {
      return INITIAL_PAYMENT_SETTINGS;
    }
  }

  static savePaymentSettings(settings: PaymentSettings) {
    localStorage.setItem(STORAGE_KEYS.PAYMENT_SETTINGS, JSON.stringify(settings));
  }

  static getOwnerRoyaltyStats() {
    const orders = this.getOrders();
    const paidOrders = orders.filter(o => o.status === 'Paid' || o.status === 'Completed');
    const totalRoyaltyEarned = paidOrders.reduce((sum, o) => {
      const comm = o.platformCommission !== undefined ? o.platformCommission : +(o.totalAmount * 0.1).toFixed(2);
      return sum + comm;
    }, 0);
    const pendingRoyalty = orders.filter(o => o.status === 'Pending').reduce((sum, o) => {
      const comm = o.platformCommission !== undefined ? o.platformCommission : +(o.totalAmount * 0.1).toFixed(2);
      return sum + comm;
    }, 0);
    const totalVolume = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    return {
      totalRoyaltyEarned: Number(totalRoyaltyEarned.toFixed(2)),
      pendingRoyalty: Number(pendingRoyalty.toFixed(2)),
      totalPlatformVolume: Number(totalVolume.toFixed(2)),
      qualifyingSalesCount: paidOrders.length,
      royaltyPercentage: 10,
      ownerEmail: 'sankalpapokharel69@gmail.com',
      ownerName: 'Sankalpa Pokharel',
    };
  }
}
