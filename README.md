# Health Hive – Online Pharmacy Platform

Health Hive is a modern full-stack online pharmacy platform where users can purchase medicines, sellers can manage their products, and admins can control the overall system. The platform features secure payments, role-based dashboards, and efficient medicine management.

---

## Features

### User Features
- User authentication using Firebase
- Browse and purchase medicines
- Secure online payments
- View order history and real-time order updates
- Responsive and user-friendly UI

### Seller Features
- Seller dashboard with role-based access
- Seller approval system (admin-controlled)
- Manage medicines:
  - Add new medicines
  - Update medicine details
  - Delete medicines
- View and manage orders related to their products

### Admin Features
- Admin dashboard with full system control
- Manage users and sellers
- Approve or reject seller requests
- Monitor medicines, orders, and payments
- Role-based access control (Admin, Seller, User)

### Payment System
- Secure online payments using **Stripe**
- Real-time order and payment status updates

---

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- DaisyUI
- React Hook Form
- TanStack Query
- SwiperJS

### Backend
- Node.js
- Express.js
- MongoDB

### Authentication & Services
- Firebase Authentication
- Stripe Payment Gateway

---

## ⚙️ Installation & Setup

Follow the steps below to run **Health Hive** locally.

1. **Clone the repository:**
   ```bash
     https://github.com/Niloy-Modak/health-hive-webapp-client.git

2. **Navigate repository:**
   ```bash
   cd project
3. **Install dependencies:**
   ```bash
   npm install

4. **Set up environment variables for client side:**
   ```bash
   VITE_apiKey=
   VITE_authDomain=
   VITE_projectId=
   VITE_storageBucket=
   VITE_messagingSenderId=
   VITE_appId=
   VITE_IMGBB_API_KEY=
   VITE_STRIPE_PK=
5. **Run in client side:**
   ```bash
   npm run dev
