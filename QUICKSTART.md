# Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- MongoDB installed and running (or MongoDB Atlas account)

## Setup Steps

### 1. Backend Setup (5 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env and set your MongoDB URI
# MONGODB_URI=mongodb://localhost:27017/ecommerce

# Seed database (creates admin user and sample data)
npm run seed

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup (3 minutes)

```bash
# Open new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Start frontend server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 3. Access the Application

**Customer Site:** http://localhost:3000

**Admin Panel:** http://localhost:3000/admin/login
- Email: `admin@shop.local`
- Password: `admin123`

## Next Steps

1. **Configure Store Settings**
   - Go to Admin → Settings
   - Update store name, WhatsApp number, currency
   - Customize homepage hero text

2. **Add Products**
   - Go to Admin → Products
   - Click "Add Product"
   - Upload images, set price, add variants

3. **Test WhatsApp Checkout**
   - Browse products on the customer site
   - Add items to cart
   - Complete checkout (will open WhatsApp)

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running: `mongod` or check MongoDB Atlas connection string
- Verify MONGODB_URI in backend/.env

**Port Already in Use:**
- Change PORT in backend/.env (default: 5000)
- Change port in frontend/.env.local NEXT_PUBLIC_API_URL

**Images Not Loading:**
- Ensure backend server is running
- Check UPLOAD_DIR in backend/.env
- Verify image paths in database

## Production Deployment

See [README.md](./README.md) for detailed deployment instructions.
