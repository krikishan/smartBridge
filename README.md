# ShopEZ

ShopEZ is a full-stack e-commerce app with a React + Vite frontend and a Node.js + Express + MongoDB backend.

## What’s Included

- Customer shopping flow with search, cart, checkout, orders, and wishlist
- Admin tools for products, categories, orders, and banners
- JWT-based auth with role-aware routes
- Responsive UI with reusable components and page-level styling

## Repository Layout

```
smartBridge/
├── client/   # React + Vite frontend
└── server/   # Express + MongoDB API
```

## Local Development

### Prerequisites

- Node.js 18+
- MongoDB connection string

### Install Dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/shopez
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Run the App

```bash
# Terminal 1
cd server
npm run dev

# Terminal 2
cd client
npm run dev
```

## Deployment Target

This repo is set up for [Render](https://render.com/).

Use the included [render.yaml](render.yaml) blueprint to deploy:

- `shopez-api` as the backend web service
- `shopez-web` as the frontend static site

Before deploying, set these values in Render:

- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `VITE_API_URL`

## Release

The first release tag is `v1.0.0`.
