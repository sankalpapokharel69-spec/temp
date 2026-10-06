import JSZip from 'jszip';
import { Template } from '../types';

export async function generateTemplateZip(template: Template): Promise<Blob> {
  const zip = new JSZip();

  // Root folder
  const folder = zip.folder(template.slug || 'template');

  // Index.html
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${template.title} - WebCraft Studio</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Poppins:wght@600;700&display=swap" rel="stylesheet">
</head>
<body>
  <header class="navbar">
    <div class="container">
      <div class="logo"><strong>${template.title.split(' ')[0]}</strong><span>Craft</span></div>
      <nav>
        <a href="#home">Home</a>
        <a href="#features">Features</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
      <button class="btn btn-primary" onclick="alert('Thanks for visiting!')">Get Started</button>
    </div>
  </header>

  <main>
    <section id="home" class="hero">
      <div class="container hero-content">
        <h1>${template.title}</h1>
        <p class="lead">${template.description}</p>
        <div class="cta-group">
          <a href="#features" class="btn btn-primary">Explore Features</a>
          <a href="#contact" class="btn btn-outline">Contact Us</a>
        </div>
      </div>
    </section>

    <section id="features" class="features-section">
      <div class="container">
        <h2 class="section-title">Key Highlights</h2>
        <div class="grid">
          ${template.features
            .map(
              (f, i) => `
          <div class="card">
            <div class="card-icon">0${i + 1}</div>
            <h3>${f}</h3>
            <p>Engineered with pixel-perfect responsive layouts, fast loading assets, and clean semantic markup.</p>
          </div>`
            )
            .join('\n')}
        </div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container">
      <p>&copy; ${new Date().getFullYear()} ${template.title}. All rights reserved. Crafted by WebCraft Studio.</p>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`;

  // style.css
  const cssContent = `/* ${template.title} Stylesheet - WebCraft Studio */
:root {
  --primary: #4f46e5;
  --primary-hover: #4338ca;
  --bg-color: #ffffff;
  --text-color: #1e293b;
  --text-muted: #64748b;
  --card-bg: #f8fafc;
  --border-color: #e2e8f0;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  color: var(--text-color);
  background: var(--bg-color);
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.navbar {
  border-bottom: 1px solid var(--border-color);
  padding: 20px 0;
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  z-index: 100;
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 22px;
  font-weight: 700;
  color: var(--primary);
  font-family: 'Poppins', sans-serif;
}

.logo span {
  color: #0f172a;
}

nav a {
  margin: 0 16px;
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  transition: color 0.2s;
}

nav a:hover {
  color: var(--primary);
}

.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--primary);
  color: #ffffff;
}

.btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
}

.btn-outline {
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-color);
}

.btn-outline:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.hero {
  padding: 100px 0;
  text-align: center;
  background: radial-gradient(circle at top, #eef2ff 0%, #ffffff 80%);
}

.hero h1 {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 20px;
  font-family: 'Poppins', sans-serif;
  line-height: 1.2;
}

.hero .lead {
  font-size: 18px;
  color: var(--text-muted);
  max-width: 700px;
  margin: 0 auto 32px;
}

.cta-group {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.features-section {
  padding: 80px 0;
}

.section-title {
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 48px;
  font-family: 'Poppins', sans-serif;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 28px;
}

.card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 32px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.08);
}

.card-icon {
  font-size: 20px;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: 12px;
}

.card h3 {
  font-size: 20px;
  margin-bottom: 12px;
  font-family: 'Poppins', sans-serif;
}

.card p {
  color: var(--text-muted);
  font-size: 15px;
}

.footer {
  border-top: 1px solid var(--border-color);
  padding: 40px 0;
  text-align: center;
  color: var(--text-muted);
  font-size: 14px;
}

@media (max-width: 768px) {
  .hero h1 { font-size: 32px; }
  .cta-group { flex-direction: column; align-items: stretch; }
  nav { display: none; }
}
`;

  // script.js
  const jsContent = `// ${template.title} Interactive Script
document.addEventListener('DOMContentLoaded', () => {
  console.log('${template.title} loaded successfully!');
  
  // Smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
`;

  // README.md
  const readmeContent = `# ${template.title}
Purchased from WebCraft Studio.

## Specifications
- Category: ${template.categoryId}
- Responsive: Yes (Desktop, Tablet, Mobile)
- Tech: Semantic HTML5, CSS3 Variables, Vanilla JavaScript
- Included Pages: ${template.pagesCount}

## Quick Start
1. Open \`index.html\` in your browser to preview.
2. Customize \`style.css\` variables for your brand colors.
3. Edit the text and replace images to fit your company.
4. Deploy to GitHub Pages, Cloudflare Pages, Vercel, or Netlify with zero configuration!

Support: support@webcraftstudio.com
`;

  if (folder) {
    folder.file('index.html', htmlContent);
    folder.file('style.css', cssContent);
    folder.file('script.js', jsContent);
    folder.file('README.md', readmeContent);
  }

  return await zip.generateAsync({ type: 'blob' });
}

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
