# E-Commerce Platform

A modern, production-ready e-commerce platform for small local businesses (jewelry stores, gift shops, print shops, boutiques) with WhatsApp checkout integration.

## Features

### Customer-Facing
- 🎨 **Modern UI** - Beautiful, responsive design with dark/light theme support
- 🛍️ **Product Catalog** - Browse products with categories, search, and filters
- 🛒 **Shopping Cart** - Add products, manage quantities, view totals
- 💬 **WhatsApp Checkout** - Complete orders via WhatsApp (no payment gateway required)
- 📱 **Mobile-First** - Fully responsive design optimized for all devices
- ⚡ **Fast Performance** - Optimized loading and smooth animations

### Admin Panel
- 🔐 **Secure Authentication** - JWT-based admin login
- 📊 **Dashboard** - View statistics, orders, and low stock alerts
- 📦 **Product Management** - Add, edit, delete products with images and variants
- 🏷️ **Category Management** - Organize products into categories
- 📋 **Order Management** - View and track customer orders
- ⚙️ **Settings** - Configure store details, WhatsApp number, delivery charges, and more

## Tech Stack

### Backend
- **Node.js** + **Express.js** - RESTful API server
- **MongoDB** + **Mongoose** - Database and ODM
- **TypeScript** - Type-safe development
- **JWT** - Authentication
- **Multer** - Image upload handling
- **bcryptjs** - Password hashing

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Framer Motion** - Animations

## Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or cloud instance)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
UPLOAD_DIR=uploads
FRONTEND_URL=http://localhost:3000
```

5. Seed the database (creates admin user and sample data):
```bash
npm run seed
```

6. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.local.example .env.local
```

4. Configure your `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Default Admin Credentials

After running the seed script, you can log in to the admin panel with:

- **Email:** `admin@shop.local`
- **Password:** `admin123`

⚠️ **Important:** Change these credentials immediately after first login!

## Project Structure

```
template-ecomm/
├── backend/
│   ├── src/
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth & upload middleware
│   │   ├── types/           # TypeScript types
│   │   └── server.ts        # Express server
│   ├── scripts/
│   │   └── seed.ts          # Database seeding
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/             # Next.js pages (App Router)
    │   ├── components/      # React components
    │   │   ├── ui/         # Reusable UI components
    │   │   └── layout/     # Layout components
    │   ├── lib/            # Utilities (API, theme)
    │   ├── store/          # Zustand stores
    │   └── types/          # TypeScript types
    └── package.json
```

## API Endpoints

### Public Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/categories` - Get all categories
- `GET /api/settings/public` - Get public settings
- `POST /api/orders` - Create order

### Protected Endpoints (Admin)
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category
- `GET /api/orders` - Get all orders
- `PATCH /api/orders/:id/status` - Update order status
- `GET /api/settings` - Get all settings
- `PUT /api/settings` - Update settings
- `POST /api/upload/single` - Upload single image
- `POST /api/upload/multiple` - Upload multiple images

## WhatsApp Integration

The platform uses WhatsApp for order completion instead of traditional payment gateways. When a customer checks out:

1. Customer fills in their name and phone number
2. Order is created in the database
3. A formatted WhatsApp message is generated with order details
4. Customer is redirected to WhatsApp to send the message to the business
5. Business receives the order via WhatsApp and can confirm/process it

The WhatsApp message template can be customized in the admin settings.

## Deployment

### Backend Deployment
1. Build the TypeScript code:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

### Frontend Deployment
1. Build the Next.js application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

### Recommended Hosting
- **Backend:** Railway, Render, DigitalOcean, AWS
- **Frontend:** Vercel, Netlify, Railway
- **Database:** MongoDB Atlas (free tier available)

## Configuration

### Store Settings
Configure your store through the admin panel settings page:
- Store name and description
- WhatsApp business number
- Currency and symbol
- Delivery charges
- Homepage hero text
- Footer content
- Social media links

### Image Uploads
- Images are stored in the `backend/uploads` directory
- Maximum file size: 5MB
- Supported formats: JPEG, JPG, PNG, GIF, WebP

## Development

### Backend Development
```bash
cd backend
npm run dev  # Starts with nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Starts Next.js dev server with hot reload
```

## License

MIT

## Support

For issues or questions, please create an issue in the repository or contact the development team.

---

Built with ❤️ for small local businesses
