# ShopEZ
A full-stack e-commerce app built with React, Node.js, and Express. 

## Live Demo
**🌐 Live Demo:** [https://client-nine-flame-44.vercel.app](https://client-nine-flame-44.vercel.app)

## Overview
ShopEZ is an online store project I built to handle the entire shopping flow from start to finish. I wanted to create a platform where customers can browse, add items to their carts, and check out easily, while also giving store owners a dedicated admin dashboard to manage products, inventory, and orders. 

It handles everything from secure user authentication to managing categories and promotional banners on the homepage. 

## Features
- **Shopping Flow**: Search and filter products, manage your cart and wishlist, and check out securely.
- **Admin Tools**: A dashboard to add/edit products, manage categories, track orders, and update site banners.
- **Auth**: JWT-based login and registration (separates standard customers from admins).
- **Responsive**: Clean, mobile-friendly UI built with reusable React components.

## Tech Stack
- **Frontend**: React.js, Vite, HTML5, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Other Tools**: JWT for auth, bcrypt for password hashing, and Render for deployment.

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

**1. Clone the repo:**
```bash
git clone https://github.com/krikishan/smartBridge.git
cd smartBridge
```

**2. Install dependencies:**
You'll need to install packages for both the client and the server.
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

## Usage

**1. Set up Environment Variables:**
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

**2. Run it locally:**
```bash
# Terminal 1: Start the backend
cd server
npm run dev

# Terminal 2: Start the frontend
cd client
npm run dev
```
Then just open `http://localhost:5173` in your browser.

## Screenshots
![ShopEZ Screenshot](https://via.placeholder.com/800x400?text=ShopEZ+Screenshot+Placeholder)

*(Replace the placeholder above with actual screenshots of the app later)*

## Future Improvements
- Wire up a real payment gateway (Stripe or PayPal)
- Add product reviews and a 5-star rating system
- Implement AI product recommendations
- Push notifications or SMS updates for order tracking
- Support for coupon codes and discounts

## Author
- **Name:** Kishan
- **GitHub:** [krikishan](https://github.com/krikishan)
