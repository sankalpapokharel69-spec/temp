# WebCraft Studio - Website Templates Marketplace

A production-ready e-commerce marketplace for modern website templates (HTML5, CSS3, JavaScript, Tailwind, and React). Features live interactive multi-device demos, shopping cart, customizable checkout with payment proof upload (eSewa, Khalti, Fonepay / Bank QR), customer accounts, and an administrator backoffice.

---

## 👑 Administrator Credentials

* **Admin Email:** `sankalpapokharel69@gmail.com`
* **Admin Password:** `1325354430`
* **Admin Route:** `/#/admin` (or click **Backoffice** in the navbar after signing in)

From the backoffice, you can manage:
1. **Payment Gateways (`/#/admin/payments`):** Customize your eSewa ID, Khalti ID, and Bank Account details (Bank Name, Account Number, Branch, SWIFT) and upload custom QR code screenshots.
2. **Templates Manager (`/#/admin/templates`):** Add, edit, or remove website templates, prices, features, and demo previews.
3. **Orders Manager (`/#/admin/orders`):** Review customer receipts & payment slips and approve orders to unlock template ZIP downloads.
4. **Inbox & Tickets (`/#/admin/messages`):** Manage customer contact messages and support inquiries.
5. **Categories & Customers:** Full directory management.

---

## 🚀 How to Host on Render.com (100% Free)

Follow these simple steps after pushing your code to GitHub:

### Step 1: Push Your Code to GitHub
If you haven't pushed yet, run:
```bash
git init
git add .
git commit -m "Initial commit of WebCraft Studio"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git
git push -u origin main
```

---

### Step 2: Sign In to Render
1. Go to **[https://render.com](https://render.com)**.
2. Sign in or create a free account using **GitHub** (this grants Render access to your repositories).

---

### Step 3: Create a Free Static Site
1. On the Render Dashboard, click the blue **"New +"** button at the top right.
2. Select **"Static Site"**.
3. Under **"Connect a repository"**, select your GitHub repository (e.g., `webcraft-studio`).

---

### Step 4: Configure the Build Settings
Enter the following configuration:

| Setting | Value |
| :--- | :--- |
| **Name** | `webcraft-studio` (or any custom name) |
| **Branch** | `main` |
| **Root Directory** | *(Leave blank)* |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

*(Note: Render will also automatically detect `render.yaml` included in this repository!)*

---

### Step 5: Configure SPA Rewrite Rule (Single Page App)
Because WebCraft Studio uses client routing, configure the rewrite rule:
1. Scroll down to **"Redirects / Rewrites"** (or find it in your site's settings).
2. Click **"Add Rule"**:
   * **Type:** `Rewrite`
   * **Source:** `/*`
   * **Destination:** `/index.html`
3. Click **"Save"**.

---

### Step 6: Deploy!
1. Click **"Create Static Site"**.
2. Render will run `npm install && npm run build` and publish your site to a free `https://<your-app-name>.onrender.com` URL with free SSL/HTTPS in under 2 minutes.

---

## 🛠 Local Development
To run locally:
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
