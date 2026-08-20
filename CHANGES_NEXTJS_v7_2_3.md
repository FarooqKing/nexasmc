# v7.2.3 - Vercel Ready / Client Navigation Fix

- Converted shared header/footer links to Next.js `Link` components.
- Added delegated Next.js App Router navigation for internal links preserved inside the v7.2.1 static page markup.
- Removed the legacy browser script loader and moved page interactions into `SiteRuntime.tsx` React effects.
- Re-initializes FAQ, filters, counters, contact form, reveal effects, marquee and hash scrolling after client-side route changes.
- Removed local JSON/file locking from the visitor API.
- Added persistent Vercel visitor storage through Upstash Redis REST.
- Removed filesystem-based contact error logging for Vercel Functions.
- Made the contact email logo use the public site URL instead of a local attachment path.
- Added Vercel-specific environment example, `vercel.json`, `.vercelignore`, and deployment instructions.
- Removed PHP, cPanel custom server files, and writable `storage` requirements from this Vercel edition.
