# Nexa Next.js v7.2.4 - Vercel TypeScript Build Fix

This release fixes the production TypeScript errors reported by Vercel in the contact-email route.

## Fixed
- Removed the module-level Nodemailer transporter typed with `ReturnType<typeof nodemailer.createTransport>`.
- Added `createMailTransporter()` which returns Nodemailer's SMTP transporter directly with correct inferred SMTP types.
- Removed the nullable transporter path that caused `TS18047` in `app/api/contact/route.ts`.
- Removed the incompatible widened transporter assignment that caused `TS2322` / `TS2769` in `lib/mailer.ts`.
- Kept Namecheap SMTP environment-variable configuration unchanged.
- Kept Next.js client-side navigation, hydration fixes, contact API, and Vercel visitor-counter implementation from v7.2.3.
- Pinned Vercel/production Node.js major to `22.x`.

## Deploy
Run locally before pushing:

```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm install
npm run build
```

Then commit and push the complete v7.2.4 folder to the GitHub repository connected to Vercel.
