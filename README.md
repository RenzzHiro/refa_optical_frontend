# Refa Optical Frontend

React, Vite, and TypeScript customer storefront and admin dashboard.

## Local development

1. Install Node.js, then run `npm ci` in this folder.
2. Copy `.env.example` to `.env.local` if you need to override the API base URL. The default `/api/v1` uses the Vite proxy to `http://localhost:8080`.
3. Start the backend from the sibling `backend` folder, then run `npm run dev` here.

Build with `npm run build`; Vite outputs static files to `dist/`.

## Deploying this folder as its own GitHub repository

Push the contents of `frontend/` as the root of the frontend repository. In Vercel, import that repository and use the project root (`./`), framework preset **Vite**, build command `npm run build`, and output directory `dist`.

Set the Vercel environment variable `VITE_API_BASE_URL` to the deployed backend origin plus `/api/v1`, for example `https://api.example.com/api/v1`. This value is public frontend configuration; never put secrets in `VITE_*` variables.

Configure the backend's `CORS_ORIGINS` to include the exact deployed frontend origin (for example `https://refa-optical.vercel.app`, without a trailing slash), set `COOKIE_SECURE=true` for HTTPS, and set `FRONTEND_URL` to that frontend origin so Midtrans can return customers to the payment result page. The backend must be reachable over HTTPS from the browser.

The `vercel.json` rewrite supports React Router routes such as `/account/orders` and `/payment/success` when users refresh or open them directly.

Product/design requirements are in `docs/`.
