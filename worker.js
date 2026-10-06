/**
 * WebCraft Studio - Cloudflare Workers Backend with Hono-compatible API
 * Handles /api/* routes, D1 SQLite database queries, R2 storage, and Web Crypto auth.
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': env.CORS_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Helper to send JSON
    const json = (data, status = 200) => {
      return new Response(JSON.stringify(data), {
        status,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    };

    // Helper for error
    const error = (message, status = 400) => json({ error: message }, status);

    // Crypto helper (PBKDF2 SHA-256)
    async function hashPassword(password, saltHex) {
      const enc = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
      );
      const salt = new Uint8Array(saltHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
      const derivedBits = await crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        256
      );
      return Array.from(new Uint8Array(derivedBits))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    }

    // Auth Middleware helper
    async function getAuthenticatedUser(req) {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
      const token = authHeader.replace('Bearer ', '');
      try {
        // Decode base64 payload of simulated/signed token
        const payload = JSON.parse(atob(token.split('.')[1] || token));
        if (!payload || !payload.userId) return null;
        
        if (env.DB) {
          const user = await env.DB.prepare('SELECT id, name, email, role FROM users WHERE id = ?')
            .bind(payload.userId)
            .first();
          return user || null;
        }
        return payload;
      } catch (e) {
        return null;
      }
    }

    const path = url.pathname;

    try {
      // -------------------------------------------------------------
      // 1. PUBLIC TEMPLATES & CATEGORIES
      // -------------------------------------------------------------
      if (path === '/api/categories' && request.method === 'GET') {
        if (!env.DB) return json([]);
        const categories = await env.DB.prepare('SELECT * FROM categories ORDER BY display_order ASC').all();
        return json(categories.results);
      }

      if (path === '/api/templates' && request.method === 'GET') {
        if (!env.DB) return json([]);
        const category = url.searchParams.get('category');
        const search = url.searchParams.get('q');
        const sort = url.searchParams.get('sort') || 'newest';

        let query = 'SELECT * FROM templates WHERE 1=1';
        const params = [];

        if (category && category !== 'all') {
          query += ' AND category_id = ?';
          params.push(category);
        }
        if (search) {
          query += ' AND (title LIKE ? OR description LIKE ?)';
          params.push(`%${search}%`, `%${search}%`);
        }

        if (sort === 'price_asc') query += ' ORDER BY price ASC';
        else if (sort === 'price_desc') query += ' ORDER BY price DESC';
        else if (sort === 'popular') query += ' ORDER BY sales_count DESC';
        else query += ' ORDER BY created_at DESC';

        const stmt = env.DB.prepare(query);
        const { results } = await stmt.bind(...params).all();
        
        // Parse JSON fields
        const formatted = results.map(t => ({
          ...t,
          features: JSON.parse(t.features || '[]'),
          gallery: JSON.parse(t.gallery || '[]'),
          is_featured: Boolean(t.is_featured)
        }));

        return json(formatted);
      }

      if (path.startsWith('/api/templates/') && request.method === 'GET') {
        const id = path.replace('/api/templates/', '');
        if (!env.DB) return error('DB not configured', 500);
        const template = await env.DB.prepare('SELECT * FROM templates WHERE id = ? OR slug = ?').bind(id, id).first();
        if (!template) return error('Template not found', 404);
        return json({
          ...template,
          features: JSON.parse(template.features || '[]'),
          gallery: JSON.parse(template.gallery || '[]'),
          is_featured: Boolean(template.is_featured)
        });
      }

      // -------------------------------------------------------------
      // 2. AUTHENTICATION (Register, Login, Me)
      // -------------------------------------------------------------
      if (path === '/api/auth/register' && request.method === 'POST') {
        const { name, email, password } = await request.json();
        if (!name || !email || !password) return error('All fields required');
        
        if (!env.DB) return error('DB not configured');
        const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email.toLowerCase()).first();
        if (existing) return error('Email is already registered');

        const saltArray = new Uint8Array(8);
        crypto.getRandomValues(saltArray);
        const salt = Array.from(saltArray).map(b => b.toString(16).padStart(2, '0')).join('');
        const hash = await hashPassword(password, salt);
        const userId = 'usr_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4);

        await env.DB.prepare(
          'INSERT INTO users (id, name, email, password_hash, salt, role) VALUES (?, ?, ?, ?, ?, ?)'
        ).bind(userId, name, email.toLowerCase(), hash, salt, 'customer').run();

        const token = btoa(JSON.stringify({ userId, email, role: 'customer', exp: Date.now() + 86400000 }));
        return json({ user: { id: userId, name, email, role: 'customer' }, token });
      }

      if (path === '/api/auth/login' && request.method === 'POST') {
        const { email, password } = await request.json();
        if (!email || !password) return error('Email and password required');
        
        // Fast-path administrator fallback
        if (email.toLowerCase() === 'sankalpapokharel69@gmail.com' && password === '1325354430') {
          const adminUser = {
            id: 'usr_admin_sankalpa',
            name: 'Sankalpa Pokharel',
            email: 'sankalpapokharel69@gmail.com',
            role: 'admin',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
          };
          const token = btoa(JSON.stringify({ userId: adminUser.id, email: adminUser.email, role: 'admin', exp: Date.now() + 86400000 }));
          return json({ user: adminUser, token });
        }

        if (!env.DB) return error('DB not configured');
        const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email.toLowerCase()).first();
        if (!user) return error('Invalid email or password', 401);

        const hash = await hashPassword(password, user.salt);
        if (hash !== user.password_hash) return error('Invalid email or password', 401);

        const token = btoa(JSON.stringify({ userId: user.id, email: user.email, role: user.role, exp: Date.now() + 86400000 }));
        return json({
          user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
          token
        });
      }

      // -------------------------------------------------------------
      // 3. ORDERS & CHECKOUT
      // -------------------------------------------------------------
      if (path === '/api/orders' && request.method === 'POST') {
        const user = await getAuthenticatedUser(request);
        const body = await request.json();
        const { items, payment_method, payment_ref, payment_proof_url, customer_name, customer_email, notes } = body;

        if (!items || !items.length) return error('Cart is empty');
        const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
        const totalAmount = items.reduce((sum, item) => sum + (item.price || 0), 0);

        if (env.DB) {
          await env.DB.prepare(
            `INSERT INTO orders (id, user_id, customer_name, customer_email, total_amount, status, payment_method, payment_ref, payment_proof_url, notes)
             VALUES (?, ?, ?, ?, ?, 'Pending', ?, ?, ?, ?)`
          ).bind(
            orderId,
            user ? user.id : 'guest',
            customer_name || (user ? user.name : 'Customer'),
            customer_email || (user ? user.email : 'guest@example.com'),
            totalAmount,
            payment_method,
            payment_ref || '',
            payment_proof_url || '',
            notes || ''
          ).run();

          for (const item of items) {
            await env.DB.prepare(
              'INSERT INTO order_items (id, order_id, template_id, template_title, price) VALUES (?, ?, ?, ?, ?)'
            ).bind(
              'item_' + Math.random().toString(36).substr(2, 9),
              orderId,
              item.id,
              item.title,
              item.price
            ).run();
          }
        }

        return json({ success: true, orderId, totalAmount, status: 'Pending' });
      }

      // -------------------------------------------------------------
      // 4. R2 SECURE FILE DOWNLOAD (Only Paid orders)
      // -------------------------------------------------------------
      if (path.match(/\/api\/orders\/[^/]+\/download\/[^/]+/) && request.method === 'GET') {
        const parts = path.split('/');
        const orderId = parts[3];
        const templateId = parts[5];

        const user = await getAuthenticatedUser(request);
        if (!user) return error('Unauthorized', 401);

        if (env.DB) {
          const order = await env.DB.prepare(
            'SELECT * FROM orders WHERE id = ? AND (user_id = ? OR ? = "admin")'
          ).bind(orderId, user.id, user.role).first();

          if (!order) return error('Order not found or unauthorized', 404);
          if (order.status !== 'Paid' && order.status !== 'Completed') {
            return error('Payment not verified yet. Order status is: ' + order.status, 403);
          }

          if (env.BUCKET) {
            const objectKey = `templates/${templateId}.zip`;
            const object = await env.BUCKET.get(objectKey);
            if (object) {
              const headers = new Headers();
              object.writeHttpMetadata(headers);
              headers.set('Content-Disposition', `attachment; filename="${templateId}.zip"`);
              headers.set('etag', object.httpEtag);
              return new Response(object.body, { headers });
            }
          }
        }

        return json({ downloadUrl: `/downloads/${templateId}.zip`, message: 'Download authorized' });
      }

      // -------------------------------------------------------------
      // 5. CONTACT & SUPPORT TICKETS
      // -------------------------------------------------------------
      if (path === '/api/contact' && request.method === 'POST') {
        const { sender_name, sender_email, subject, message, is_ticket } = await request.json();
        if (!sender_name || !sender_email || !message) return error('Missing required fields');

        if (env.DB) {
          const msgId = 'msg_' + Date.now().toString(36);
          await env.DB.prepare(
            'INSERT INTO contact_messages (id, sender_name, sender_email, subject, message, is_ticket, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
          ).bind(msgId, sender_name, sender_email, subject || 'Inquiry', message, is_ticket ? 1 : 0, 'unread').run();
        }

        return json({ success: true, message: 'Message sent successfully!' });
      }

      // -------------------------------------------------------------
      // 6. PAYMENT GATEWAYS SETTINGS (eSewa, Khalti, Bank)
      // -------------------------------------------------------------
      if (path === '/api/settings/payments' && request.method === 'GET') {
        if (env.DB) {
          const rows = await env.DB.prepare('SELECT gateway, details FROM payment_settings').all();
          const settings = {};
          if (rows && rows.results) {
            for (const r of rows.results) {
              try { settings[r.gateway] = JSON.parse(r.details); } catch(e) {}
            }
          }
          return json(settings);
        }
        return json({ message: 'Settings retrieved' });
      }

      if (path === '/api/settings/payments' && request.method === 'PUT') {
        const user = await getAuthenticatedUser(request);
        if (!user || user.role !== 'admin') return error('Forbidden: Admin access required', 403);

        const body = await request.json();
        if (env.DB && body) {
          for (const gateway of ['esewa', 'khalti', 'bank']) {
            if (body[gateway]) {
              await env.DB.prepare(
                'INSERT INTO payment_settings (gateway, details, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(gateway) DO UPDATE SET details=excluded.details, updated_at=CURRENT_TIMESTAMP'
              ).bind(gateway, JSON.stringify(body[gateway])).run();
            }
          }
        }
        return json({ success: true, message: 'Payment settings updated successfully' });
      }

      return error('Endpoint not found', 404);
    } catch (err) {
      return error(err.message || 'Internal Server Error', 500);
    }
  }
};
