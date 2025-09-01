# Habit Tracker PWA

Installable, offline-first Habit Tracker built with React, Vite, Tailwind, IndexedDB (`idb`), Workbox PWA, and Recharts.

## Features
- ✅ Add/rename/delete habits
- ✅ Daily check-ins with automatic streak calculation
- ✅ IndexedDB storage for offline use
- ✅ PWA: installable + offline via Workbox-generated Service Worker
- ✅ Mock reminder notifications at your chosen time (uses Notification API)
- ✅ Progress chart (last 30 days)

## Quick Start
```bash
# 1) Install deps
npm install

# 2) Run in dev
npm run dev
# open the URL shown (usually http://localhost:5173)

# 3) Build production
npm run build

# 4) Preview production build (with SW)
npm run preview
# open the URL shown (usually http://localhost:4173)
```

> The service worker is generated during `npm run build` and enabled when you run `npm run preview` or deploy the `dist` folder.
