# nexaSMC Website - Next.js v7.2.4 Vercel Ready

This package is the Vercel-ready Next.js edition of the nexaSMC v7.2.1 public website.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Existing Bootstrap/CSS visual design and local assets
- Next.js Route Handler for the contact form
- Nodemailer for SMTP
- Upstash Redis REST storage for the persistent visitor counter on Vercel

There is no PHP, SQL Server, MySQL, admin dashboard, login, or application database.

## What is fixed in v7.2.4

- No raw script tags are rendered from React/Next.js components.
- No AOS hydration mutation runs before React hydration.
- Header/footer use `next/link`.
- Links preserved inside the static v7.2.1 page markup are routed through the Next.js App Router, so moving between FAQ, Insights, Privacy Policy, Insight details, and Home does not perform a full browser refresh.
- Interactive page behaviour is initialized by a React client runtime after hydration and is re-initialized safely after client-side route changes.
- Contact form uses `/api/contact` and is compatible with Vercel Functions.
- Visitor counter no longer writes to a JSON file. Vercel's runtime filesystem is not used for persistent writes.
- Persistent visitor totals use Upstash Redis REST credentials supplied by the Vercel integration.

## Local run

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

For local contact-email testing, copy `.env.example` to `.env.local` and fill the SMTP password.

The visitor counter will show the optional `NEXA_VISITOR_SEED` value until Redis environment variables are configured.

## Vercel

Read `DEPLOY_VERCEL.md` for the complete deployment procedure.

## Content

The preserved public website content is under `content/`. Next.js routes render the `<main>` content from those files, while shared site chrome and all runtime behaviour are managed by React/Next.js components.

Main routes:

- `/`
- `/faq`
- `/privacy-policy`
- `/insights`
- `/insights/[slug]`

Legacy `.html` URLs redirect to their Next.js routes.


## v7.2.4 Vercel TypeScript Build Fix
The Nodemailer transporter is created per request so Vercel TypeScript production builds do not hit the nullable/generic transporter errors from v7.2.2/v7.2.3.
