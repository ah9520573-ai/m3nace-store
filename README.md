# M3NACE Store

A responsive React + Express commerce application using XLSX spreadsheets as its data store.

## Run locally

1. Install Node.js 18+.
2. In `backend`, copy `.env.example` to `.env` and change `JWT_SECRET`.
3. Install and start the API:

```powershell
cd backend
npm install
npm run dev
```

4. In another terminal, install and start the frontend:

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL printed in the terminal. The backend creates `backend/data/products.xlsx`, `users.xlsx`, and `orders.xlsx` on its first start, and also creates the `uploads` directory.

The admin account is created or updated from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the backend environment.

## Deploying on Render

For the backend Web Service, set `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLIENT_URL=https://m3nace-store-frontend.onrender.com`, `NODE_ENV=production`, `DATA_DIR`, and `UPLOAD_DIR`. Point `DATA_DIR` and `UPLOAD_DIR` at directories on the mounted persistent disk.

For the frontend Web Service, set `VITE_API_URL=https://m3nace-store.onrender.com/api` and run `vite preview`.

## API

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `PUT /api/auth/profile`
- `GET /api/products`, `GET /api/products/:id`
- `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id` (admin)
- `POST /api/orders`, `GET /api/orders/my` (customer), `GET /api/orders` (admin)
- `PUT /api/orders/:id/status` (admin)
- `GET /api/users` (admin)
- `GET /api/admin/stats`, `GET /api/admin/export/:type` (admin; type is `products`, `orders`, or `users`)
- `GET /api/health`

Product uploads use multipart fields `images` (up to six JPG/PNG/WEBP files) and `video` (optional MP4/WEBM), served from `/uploads`.
