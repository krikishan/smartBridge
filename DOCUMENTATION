# ShopEZ Documentation

## ShopEZ – Full Stack E-Commerce Application

**Version:** v1.0.0
**Technology Stack:** React + Vite, Node.js, Express.js, MongoDB

---

# Table of Contents

1. Introduction
2. Project Overview
3. Features
4. System Architecture
5. Technology Stack
6. Repository Structure
7. Prerequisites
8. Installation Guide
9. Environment Variables
10. Running the Application
11. API Overview
12. Authentication
13. User Roles
14. Frontend Modules
15. Backend Modules
16. Database Overview
17. Deployment
18. Future Enhancements
19. Conclusion

---

# 1. Introduction

ShopEZ is a modern full-stack e-commerce web application that enables customers to browse products, manage shopping carts, place orders, and maintain wishlists. It also provides an administrative dashboard for managing products, categories, orders, and promotional banners.

The application follows a client-server architecture where the React frontend communicates with a RESTful Express backend using HTTP APIs. MongoDB is used for data storage, while JWT (JSON Web Token) provides secure authentication and authorization.

---

# 2. Project Overview

ShopEZ is designed to deliver a complete online shopping experience.

The application includes:

* User Registration & Login
* Product Catalog
* Category Management
* Product Search
* Wishlist
* Shopping Cart
* Checkout Process
* Order Management
* Admin Dashboard
* Banner Management
* Secure Authentication

---

# 3. Features

## Customer Features

* User Registration
* User Login
* JWT Authentication
* Product Search
* Product Filtering
* View Product Details
* Add to Cart
* Update Cart Quantity
* Remove from Cart
* Wishlist Management
* Checkout
* Place Orders
* View Order History
* Responsive UI

---

## Admin Features

* Dashboard
* Add Products
* Edit Products
* Delete Products
* Manage Categories
* Manage Orders
* Update Order Status
* Banner Management
* Role-based Access Control

---

# 4. System Architecture

```
                +----------------------+
                |     React Client     |
                |     (Vite Frontend)  |
                +----------+-----------+
                           |
                    REST API Requests
                           |
                +----------v-----------+
                | Express.js Backend   |
                | JWT Authentication   |
                +----------+-----------+
                           |
                     Mongoose ODM
                           |
                +----------v-----------+
                |      MongoDB         |
                +----------------------+
```

---

# 5. Technology Stack

## Frontend

* React.js
* Vite
* React Router
* Axios
* CSS
* JavaScript (ES6)

---

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* dotenv

---

## Deployment

* Render
* MongoDB Atlas

---

# 6. Repository Structure

```
smartBridge/

│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── package.json
│   └── server.js
│
├── render.yaml
└── README.md
```

---

# 7. Prerequisites

Install the following software before running the project.

* Node.js (18 or later)
* npm
* MongoDB (Local or Atlas)
* Git

---

# 8. Installation Guide

## Clone Repository

```bash
git clone <repository-url>

cd smartBridge
```

---

## Install Backend

```bash
cd server

npm install
```

---

## Install Frontend

```bash
cd ../client

npm install
```

---

# 9. Environment Variables

## Backend (.env)

```env
PORT=5000

MONGO_URI=mongodb://localhost:27017/shopez

JWT_SECRET=your_secret_key

JWT_EXPIRE=7d

NODE_ENV=development

CLIENT_URL=http://localhost:5173
```

---

## Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

# 10. Running the Application

## Start Backend

```bash
cd server

npm run dev
```

Backend URL

```
http://localhost:5000
```

---

## Start Frontend

```bash
cd client

npm run dev
```

Frontend URL

```
http://localhost:5173
```

---

# 11. API Overview

The backend exposes REST APIs for all major modules.

## Authentication

* Register User
* Login User
* Get Current User

---

## Products

* Get Products
* Get Product by ID
* Search Products
* Add Product (Admin)
* Update Product (Admin)
* Delete Product (Admin)

---

## Categories

* Get Categories
* Add Category
* Update Category
* Delete Category

---

## Cart

* Add Item
* Remove Item
* Update Quantity
* View Cart

---

## Wishlist

* Add Product
* Remove Product
* View Wishlist

---

## Orders

* Place Order
* View Orders
* View Order Details
* Update Order Status

---

## Banner

* Create Banner
* Update Banner
* Delete Banner
* View Banner

---

# 12. Authentication

Authentication is implemented using JSON Web Tokens (JWT).

Workflow:

```
User Login

↓

Server verifies credentials

↓

JWT Token Generated

↓

Token returned to client

↓

Client stores token

↓

Token included in Authorization Header

↓

Protected APIs validate JWT
```

Benefits

* Secure Authentication
* Stateless Sessions
* Protected Routes
* Role Verification

---

# 13. User Roles

## Customer

Allowed to:

* Register
* Login
* Browse Products
* Add to Cart
* Wishlist
* Checkout
* View Orders

---

## Admin

Allowed to:

* Manage Products
* Manage Categories
* Manage Orders
* Manage Banners
* Access Dashboard

---

# 14. Frontend Modules

## Authentication Module

* Login Page
* Register Page

---

## Product Module

* Product Listing
* Product Details
* Search
* Categories

---

## Shopping Module

* Cart
* Wishlist
* Checkout

---

## Orders Module

* My Orders
* Order Details

---

## Admin Module

* Dashboard
* Product Management
* Category Management
* Banner Management
* Order Management

---

# 15. Backend Modules

## Controllers

Business logic for each feature.

Examples:

* Product Controller
* User Controller
* Order Controller
* Banner Controller

---

## Routes

Defines REST endpoints.

Examples:

```
/api/auth

/api/products

/api/orders

/api/categories

/api/banner
```

---

## Middleware

Responsible for

* JWT Authentication
* Error Handling
* Admin Authorization

---

## Models

MongoDB collections include

* User
* Product
* Category
* Cart
* Wishlist
* Order
* Banner

---

# 16. Database Overview

Main Collections

```
Users

Products

Categories

Orders

Wishlists

Carts

Banners
```

Relationships

```
User
 │
 ├── Orders
 ├── Wishlist
 └── Cart

Category
 │
 └── Products

Order
 │
 └── Products
```

---

# 17. Deployment

ShopEZ is configured for deployment on **Render**.

Deployment uses the included:

```
render.yaml
```

The deployment creates

### Backend

```
shopez-api
```

---

### Frontend

```
shopez-web
```

---

Environment Variables required

```
MONGO_URI

JWT_SECRET

CLIENT_URL

VITE_API_URL
```

---

# Deployment Steps

1. Push code to GitHub.
2. Create a Render account.
3. Connect the GitHub repository.
4. Deploy using `render.yaml`.
5. Configure environment variables.
6. Deploy backend and frontend services.
7. Verify the application after deployment.

---

# 18. Future Enhancements

Potential future improvements include:

* Online Payment Gateway Integration
* Product Reviews and Ratings
* AI-based Product Recommendations
* Email Notifications
* SMS Order Updates
* Coupon and Discount System
* Inventory Management
* Sales Analytics Dashboard
* Multi-language Support
* Dark Mode
* Progressive Web App (PWA)
* Real-time Order Tracking
* Push Notifications

---

# 19. Conclusion

ShopEZ is a scalable and responsive full-stack e-commerce platform built using modern web technologies. It provides a seamless shopping experience for customers while offering administrators a comprehensive dashboard for managing products, categories, banners, and orders. The application follows industry-standard practices such as RESTful APIs, JWT-based authentication, role-based authorization, reusable frontend components, and cloud deployment through Render. Its modular architecture makes it easy to maintain, extend, and deploy for both educational and real-world e-commerce use cases.

---

# Release Information

| Property       | Value                          |
| -------------- | ------------------------------ |
| Application    | ShopEZ                         |
| Version        | v1.0.0                         |
| Frontend       | React + Vite                   |
| Backend        | Node.js + Express              |
| Database       | MongoDB                        |
| Authentication | JWT                            |
| Deployment     | Render                         |
| Architecture   | Client–Server                  |
| License        | Open Source / Academic Project |
