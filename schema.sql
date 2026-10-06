-- ===================================================================
-- WebCraft Studio - Cloudflare D1 Database Schema & Seed Data
-- Database: SQLite (Cloudflare D1 compatible)
-- ===================================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer', -- 'admin' | 'customer'
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT, -- Lucide icon identifier
    color TEXT,
    display_order INTEGER DEFAULT 0
);

-- 3. Templates Table
CREATE TABLE IF NOT EXISTS templates (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category_id TEXT NOT NULL,
    price REAL NOT NULL,
    original_price REAL,
    description TEXT NOT NULL,
    short_desc TEXT NOT NULL,
    features TEXT NOT NULL, -- JSON string array of features
    pages_count INTEGER NOT NULL DEFAULT 1,
    demo_url TEXT,
    thumbnail_url TEXT NOT NULL,
    gallery TEXT NOT NULL, -- JSON string array of image URLs
    zip_url TEXT, -- R2 storage key or download path
    is_featured INTEGER DEFAULT 0,
    rating REAL DEFAULT 5.0,
    sales_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    total_amount REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending' | 'Paid' | 'Rejected' | 'Completed'
    payment_method TEXT NOT NULL, -- 'esewa' | 'khalti' | 'bank_qr'
    payment_proof_url TEXT, -- R2 or Base64 uploaded screenshot
    payment_ref TEXT, -- Transaction Reference / ID entered by user
    notes TEXT,
    admin_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    template_id TEXT NOT NULL,
    template_title TEXT NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE SET NULL
);

-- 6. Contact / Support Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id TEXT PRIMARY KEY,
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_ticket INTEGER DEFAULT 0, -- 0 = Contact, 1 = Support Ticket
    status TEXT DEFAULT 'unread', -- 'unread' | 'read' | 'replied'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Payment Settings Table (eSewa, Khalti, Bank QR details)
CREATE TABLE IF NOT EXISTS payment_settings (
    gateway TEXT PRIMARY KEY, -- 'esewa' | 'khalti' | 'bank'
    details TEXT NOT NULL, -- JSON config object
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES for Query Optimization
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category_id);
CREATE INDEX IF NOT EXISTS idx_templates_featured ON templates(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_messages(status);

-- ===================================================================
-- SEED DATA
-- ===================================================================

-- Initial Admin & Demo User
-- Administrator: sankalpapokharel69@gmail.com / Password: 1325354430
-- Salt: a84c98e1f58231c6, PBKDF2 hash (SHA-256)
INSERT OR IGNORE INTO users (id, name, email, password_hash, salt, role) VALUES
('usr_admin_sankalpa', 'Sankalpa Pokharel', 'sankalpapokharel69@gmail.com', '02fe3b4d809e0071dfce94c9bf804f72dab58db636530d8e018d2495ff2ab385', 'a84c98e1f58231c6', 'admin'),
('usr_demo_01', 'Alex Johnson', 'alex@example.com', 'f092e07174db896e3868aa808945de2ef1897c5e2d6b38c35a8df2d057a6279f', 'a84c98e1f58231c6', 'customer');

-- Categories Seed
INSERT OR IGNORE INTO categories (id, name, slug, description, icon, color, display_order) VALUES
('cat_restaurant', 'Restaurant', 'restaurant', 'Fine dining, cafes, bakeries, and bistro templates', 'Utensils', '#f97316', 1),
('cat_hotel', 'Hotel', 'hotel', 'Luxury resorts, boutique hotels, and booking portals', 'Hotel', '#0ea5e9', 2),
('cat_salon', 'Salon & Spa', 'salon', 'Beauty parlors, barbershops, wellness, and spas', 'Sparkles', '#ec4899', 3),
('cat_furniture', 'Furniture', 'furniture', 'Minimalist furniture stores and interior decor showcases', 'Armchair', '#8b5cf6', 4),
('cat_realestate', 'Real Estate', 'real-estate', 'Property listings, realtor portfolios, and agencies', 'Building2', '#10b981', 5),
('cat_gym', 'Gym & Fitness', 'gym', 'Crossfit boxes, personal trainers, and gym memberships', 'Dumbbell', '#ef4444', 6),
('cat_photography', 'Photography', 'photography', 'Photographer portfolios, studios, and image galleries', 'Camera', '#eab308', 7),
('cat_portfolio', 'Portfolio', 'portfolio', 'Developer, designer, and creative freelancer portfolios', 'Briefcase', '#6366f1', 8),
('cat_business', 'Business & SaaS', 'business', 'Corporate consultancies, startups, and SaaS products', 'TrendingUp', '#14b8a6', 9);
