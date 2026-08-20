# Nexa Next.js v7.2.2 - Hydration Fix

## Fixed

- Removed raw `<script>` tags from `app/layout.tsx`.
- Prevented legacy JavaScript and AOS from mutating the DOM while React hydration is running.
- Added `components/SiteRuntime.tsx`, which loads `/assets/js/main.js` only after the client has mounted.
- Removed runtime loading for unused AOS, Swiper, GLightbox, PureCounter, imagesLoaded and Isotope JavaScript libraries.
- Preserved the existing Nexa design, CSS, content, API routes, contact form logic and visitor counter logic.

## Why this fixes the reported errors

Next.js 16/React 19 reported two development errors:

1. `Encountered a script tag while rendering React component.`
2. `Hydration failed because the server rendered HTML didn't match the client.`

The first was caused by plain `<script>` tags rendered by the React root layout. The second was caused by AOS/legacy scripts changing `<body>` attributes and DOM content before React hydration had completed.

The new runtime loader begins DOM behaviour after hydration, so server-rendered and initial client HTML stay aligned.
