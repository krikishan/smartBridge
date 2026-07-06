# ShopEZ — Full-Stack E-Commerce Platform

A production-quality e-commerce application built with React + Vite (frontend) and Node.js + Express + MongoDB (backend).

## Tech Stack

### Frontend
- **React 18** with Vite
- **React Router** — Client-side routing
- **Axios** — API communication
- **React Hook Form** — Form validation
- **Framer Motion** — Animations
- **React Icons** — Icon library
- **React Hot Toast** — Toast notifications

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** — Authentication
- **bcryptjs** — Password hashing
- **Multer** — File uploads
- **CORS** + **Cookie Parser**

## Features

- 🔐 JWT Authentication with role-based access (User/Admin)
- 🛍️ Product browsing with search, filter, sort, and pagination
- 🛒 Full cart management (add, update, remove, clear)
- 💳 Multi-step checkout (Address → Payment → Review)
- 📦 Order tracking with status updates
- ❤️ Wishlist functionality
- 👤 User profile with address management
- 🏪 Admin Panel — Dashboard, Products, Categories, Orders, Banner
- 📱 Fully responsive (Desktop, Tablet, Mobile)
- ⚡ Lazy loading and code splitting
- 💫 Smooth Framer Motion animations

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Variables

**Server** (`server/.env`):
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/shopez
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Client** (`client/.env`):
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed Database

```bash
cd server
npm run seed
```

This creates:
- **Admin account**: admin@shopez.com / admin123
- **Test user**: john@example.com / password123
- **36 products** across 8 categories
- **Banner** and **Category** configurations

### 4. Run Development

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## Project Structure

```
smartBridge/
├── client/                 # React + Vite Frontend
│   ├── src/
│   │   ├── api/           # Axios instance & API methods
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Auth & Cart context
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   ├── routes/        # Route config & guards
│   │   ├── styles/        # CSS (index.css design system)
│   │   └── utils/         # Helpers & constants
│   └── index.html
│
├── server/                 # Node.js + Express Backend
│   ├── config/            # Database config
│   ├── controllers/       # Business logic (MVC)
│   ├── middleware/        # Auth, Admin, Error
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routes
│   ├── utils/             # Token gen, seed data
│   └── server.js
│
└── README.md
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/profile` | Get profile |
| PUT | `/api/auth/profile` | Update profile |
| POST | `/api/auth/address` | Add address |
| PUT | `/api/auth/address/:id` | Update address |
| DELETE | `/api/auth/address/:id` | Delete address |
| PUT | `/api/auth/wishlist/:productId` | Toggle wishlist |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all (search, filter, sort, paginate) |
| GET | `/api/products/:id` | Get one |
| POST | `/api/products` | Create (Admin) |
| PUT | `/api/products/:id` | Update (Admin) |
| DELETE | `/api/products/:id` | Delete (Admin) |
| GET | `/api/products/categories/list` | List categories |
| GET | `/api/products/brands/list` | List brands |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get cart |
| POST | `/api/cart` | Add to cart |
| PUT | `/api/cart/:productId` | Update quantity |
| DELETE | `/api/cart/:productId` | Remove item |
| DELETE | `/api/cart/clear` | Clear cart |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | User's orders |
| GET | `/api/orders/:id` | Single order |
| GET | `/api/orders/admin/all` | All orders (Admin) |
| PUT | `/api/orders/:id/status` | Update status (Admin) |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET | `/api/admin/users` | List users |
| GET | `/api/admin/config` | Get config |
| POST | `/api/admin/banner` | Add banner |
| DELETE | `/api/admin/banner/:id` | Delete banner |
| POST | `/api/admin/categories` | Add category |
| PUT | `/api/admin/categories/:id` | Update category |
| DELETE | `/api/admin/categories/:id` | Delete category |

## Database Schemas

### User
name, email, password, mobile, role, addresses[], wishlist[]

### Product
title, description, price, discount, stock, category, brand, images[], rating, numReviews, reviews[], isFeatured, isTrending

### Cart
userId, items[{ productId, quantity }]

### Order
userId, products[], shippingAddress, paymentMethod, total, subtotal, shippingCost, status, orderedDate

### Admin
banner[], categories[]

## License

MIT
