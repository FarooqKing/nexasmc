import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'app/page.tsx',
  'app/faq/page.tsx',
  'app/insights/page.tsx',
  'app/insights/[slug]/page.tsx',
  'app/privacy-policy/page.tsx',
  'app/api/contact/route.ts',
  'app/api/visitor-counter/route.ts',
  'components/SiteChrome.tsx',
  'components/SiteRuntime.tsx',
  'components/StaticPageContent.tsx',
  'lib/content.ts',
  'lib/mailer.ts',
  'lib/visitorStore.ts',
  'content/index.html',
  'public/assets/css/main.css',
  'public/assets/brand/nexa-logo-192.png',
  'vercel.json'
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) {
  console.error('Missing required files:', missing);
  process.exit(1);
}

const disallowed = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (['node_modules', '.next', '.git'].includes(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.php')) disallowed.push(path.relative(root, full));
  }
}
walk(root);

if (disallowed.length) {
  console.error('PHP files were not expected:', disallowed);
  process.exit(1);
}

const layout = fs.readFileSync(path.join(root, 'app/layout.tsx'), 'utf8');
if (/<script\b/i.test(layout)) {
  console.error('Raw <script> tags must not be rendered from app/layout.tsx.');
  process.exit(1);
}

const chrome = fs.readFileSync(path.join(root, 'components/SiteChrome.tsx'), 'utf8');
if (!chrome.includes("from 'next/link'")) {
  console.error('SiteChrome must use next/link for App Router navigation.');
  process.exit(1);
}

const runtime = fs.readFileSync(path.join(root, 'components/SiteRuntime.tsx'), 'utf8');
if (!runtime.includes('router.push')) {
  console.error('SiteRuntime must route legacy content links through the Next.js router.');
  process.exit(1);
}

const visitorRoute = fs.readFileSync(path.join(root, 'app/api/visitor-counter/route.ts'), 'utf8');
if (/node:fs|writeFile|visitor-count\.json/.test(visitorRoute)) {
  console.error('Vercel visitor counter must not write to the local filesystem.');
  process.exit(1);
}

console.log('Preflight OK: Vercel-ready Next.js structure, client-side routing, no PHP, no local visitor writes.');
