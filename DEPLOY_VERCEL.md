# Deploy nexaSMC Next.js v7.2.3 to Vercel

This project is prepared for Vercel's native Next.js deployment. Do not use the old PHP files or the old JSON visitor-counter storage.

## 1. Extract the project

Extract the ZIP on your PC. The folder containing `package.json`, `app`, `components`, `content`, and `public` is the project root.

## 2. Optional local check

From the project root:

```bash
npm install
npm run dev
```

Open `http://localhost:3000` and verify Home, FAQ, Insights, an Insight detail, Privacy Policy, and Contact.

## 3. Deploy to Vercel

### Option A - GitHub (recommended)

1. Create a GitHub repository.
2. Upload/push this project to that repository.
3. In Vercel choose **Add New > Project**.
4. Import the GitHub repository.
5. Vercel should detect **Next.js** automatically.
6. Keep the normal Next.js build settings and deploy.

### Option B - Vercel CLI

Install the CLI and run it from this project folder:

```bash
npm install -g vercel
vercel login
vercel
```

For the production deployment:

```bash
vercel --prod
```

## 4. Contact form environment variables

In **Vercel > Project > Settings > Environment Variables**, add:

```text
NEXT_PUBLIC_SITE_URL=https://nexasmc.com
NEXA_SMTP_HOST=server390.web-hosting.com
NEXA_SMTP_PORT=465
NEXA_SMTP_SECURE=true
NEXA_SMTP_USERNAME=info@nexasmc.com
NEXA_SMTP_PASSWORD=YOUR_REAL_MAILBOX_PASSWORD
NEXA_SMTP_FROM_EMAIL=info@nexasmc.com
NEXA_SMTP_FROM_NAME=nexaSMC Website
NEXA_CONTACT_TO_EMAIL=info@nexasmc.com
```

For testing, `NEXA_CONTACT_TO_EMAIL` can temporarily be your Gmail address.

Never commit the real SMTP password to GitHub.

After changing environment variables, redeploy the Vercel project.

## 5. Enable the persistent Website Visitors counter

A local JSON file is not reliable on Vercel. This version is designed to use **Upstash for Redis** from the Vercel Marketplace.

1. Open your Vercel project.
2. Open Marketplace/Storage and choose **Upstash for Redis**.
3. Create or select a Redis database and connect it to this Vercel project.
4. The integration supplies the required Redis REST environment variables to the project.
5. Redeploy the website.

The code accepts either of these variable pairs:

```text
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

or the compatible pair:

```text
KV_REST_API_URL
KV_REST_API_TOKEN
```

Optional starting value:

```text
NEXA_VISITOR_SEED=0
```

Visitor logic remains approximately one count per browser per UTC day. Redis `INCR` is used for the persistent total.

## 6. Connect nexasmc.com

In **Vercel > Project > Settings > Domains**, add:

```text
nexasmc.com
www.nexasmc.com
```

Vercel will show the exact DNS records required for the current project. Add only those web records in Namecheap DNS/cPanel DNS.

Important: do **not** delete or replace the existing email records such as MX/SPF/DKIM/Jellyfish records. The website can point to Vercel while `info@nexasmc.com` continues using the existing mail hosting.

## 7. Final tests

Check:

- Home opens with the v7.2.1 design.
- FAQ -> Insights -> Privacy Policy navigation happens without a full browser refresh.
- Home hash navigation scrolls to About, Services, Clients, Portfolio, and Contact.
- Mobile menu opens/closes correctly.
- FAQ accordion works after client-side navigation.
- Insight filters work.
- Portfolio filters work.
- Contact form returns a success response and the email arrives.
- Website Visitors increments after Upstash is connected.
- Refreshing the same browser on the same UTC day does not keep incrementing the visitor total.

## Troubleshooting

### Visitor count stays at 0

Check that the Upstash integration is connected to the same Vercel project and that its environment variables are available in the Production environment, then redeploy.

### Contact form says email is not configured

Check `NEXA_SMTP_PASSWORD` in Vercel Environment Variables and redeploy.

### Contact SMTP authentication fails

Confirm the mailbox password and these values:

```text
server390.web-hosting.com
465
secure=true
info@nexasmc.com
```

### Old deployment still appears

Use a new Vercel deployment, promote it to Production, then hard refresh the browser once. Client-side page navigation after that should not perform full document reloads.
