# ShopEZ
A full-stack e-commerce application with a React frontend and a Node.js/Express backend.

## Live Demo
**🌐 Live Demo:** [https://client-nine-flame-44.vercel.app](https://client-nine-flame-44.vercel.app)

## Overview
ShopEZ is a modern full-stack e-commerce web application that enables customers to browse products, manage shopping carts, place orders, and maintain wishlists. The project solves the need for a comprehensive digital storefront by providing an administrative dashboard for managing products, categories, orders, and promotional banners. Its main objective is to deliver a complete and seamless online shopping experience with secure authentication and role-based access control.

## Features
- **Customer Shopping Flow:** Product search and filtering, detailed product views, cart & wishlist management, checkout, and order history.
- **Admin Dashboard:** Tools to manage products, categories, modify order statuses, and update promotional banners.
- **Authentication:** Secure JWT-based login and registration with role-aware routes (Customer vs. Admin).
- **Responsive UI:** Clean and responsive user interface built with reusable React components.

## Tech Stack
- **Languages:** JavaScript (ES6+), HTML5, CSS3
- **Frameworks & Libraries:** React.js, Vite, Node.js, Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Tools:** JSON Web Tokens (JWT), bcrypt, Render (Deployment)

## Project Structure
```text
smartBridge/
├── client/          # React + Vite frontend
│   ├── public/      # Static assets
│   ├── src/         # React source code (pages, components, utils)
│   ├── package.json # Frontend dependencies
│   └── vite.config.js
├── server/          # Express + MongoDB backend API
│   ├── config/      # Configuration files
│   ├── controllers/ # Business logic
│   ├── middleware/  # JWT and admin auth middleware
│   ├── models/      # Mongoose database schemas
│   ├── routes/      # REST API endpoints
│   ├── package.json # Backend dependencies
│   └── server.js    # Application entry point
├── render.yaml      # Render deployment blueprint
└── README.md        # Project documentation
```

## Installation

**1. Clone the repository:**
```bash
git clone https://github.com/krikishan/smartBridge.git
cd smartBridge
```

**2. Install dependencies:**
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

## Usage

**1. Environment Variables:**
Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/shopez
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Create a `.env` file in the `client/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

**2. Run the project locally:**
```bash
# Terminal 1: Start Backend
cd server
npm run dev

# Terminal 2: Start Frontend
cd client
npm run dev
```
Open `http://localhost:5173` in your browser to view the application.

## Screenshots
![ShopEZ Screenshot](https://via.placeholder.com/800x400?text=ShopEZ+Screenshot+Placeholder)

*(Replace the placeholder above with actual screenshots of your application)*

## Future Improvements
- Online Payment Gateway Integration (Stripe/PayPal)
- Product Reviews and Ratings system
- AI-based Product Recommendations
- Real-time Order Tracking and Push Notifications
- Coupon and Discount System

## Author
- **Name:** Kishan
- **GitHub:** [krikishan](https://github.com/krikishan)
