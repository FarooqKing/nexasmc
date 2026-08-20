# Next.js Conversion Changes

- Converted the public nexaSMC v7.2.1 static/PHP edition to Next.js App Router.
- Preserved the existing public v7.2.1 layout, styling, logo, services, client logos, portfolio, FAQ, privacy policy and insight content.
- Removed PHP completely.
- No database and no dashboard/admin/login.
- Contact Form now posts to `/api/contact` and sends through Nodemailer SMTP.
- Visitor Counter now uses `/api/visitor-counter` with the existing one-browser-per-UTC-day concept.
- Visitor total is stored in `storage/visitor-count.json` for Namecheap persistent disk hosting.
- Added legacy redirects from old `.html` URLs.
- Added Next.js metadata, `robots.txt` generation and `sitemap.xml` generation.
- Added Namecheap cPanel Node deployment guide.
- Added Vercel persistence note.
