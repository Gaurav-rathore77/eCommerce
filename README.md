# RATHORE E-Commerce

A modern, full-featured e-commerce website built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui. Features a dynamic product catalog, shopping cart, dark mode, and a secure admin panel.

## Features

- **Dynamic Product Catalog** - Products are stored in a JSON database and fetched dynamically
- **Shopping Cart** - Add/remove products, update quantities
- **Admin Panel** - Secure admin dashboard to manage products (CRUD operations)
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Mobile-first, fully responsive UI
- **JWT Authentication** - Secure admin access with JWT tokens

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- JSON Database (file-based)
- JWT Authentication
- bcryptjs for password hashing

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Admin Credentials - CHANGE THESE!
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password

# JWT Secret - Generate a strong random string
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Optional: Pre-hashed password (generate with bcrypt)
# ADMIN_PASSWORD_HASH=$2a$10$...your_hashed_password...
```

**Important:** Change the default credentials before deploying!

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the storefront.

### 4. Access Admin Panel

Navigate to [http://localhost:3000/admin](http://localhost:3000/admin)

Login with your configured admin credentials from `.env.local`.

## Admin Panel Features

- **Dashboard** - View product statistics (total products, categories, in stock)
- **Add Product** - Create new products with multiple images and tags
- **Edit Product** - Update existing product details
- **Delete Product** - Remove products from the catalog
- **Search** - Find products quickly

## API Routes

- `GET /api/products` - List all products
- `GET /api/products/[id]` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/[id]` - Update product (admin only)
- `DELETE /api/products/[id]` - Delete product (admin only)
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token

## Project Structure

```
src/
├── app/
│   ├── admin/           # Admin panel pages
│   ├── api/             # API routes
│   ├── product/[id]/    # Product detail page
│   ├── products/        # Product listing page
│   └── page.tsx         # Homepage
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── CartSheet.tsx    # Shopping cart sidebar
│   ├── Header.tsx       # Site header
│   ├── Footer.tsx       # Site footer
│   ├── Hero.tsx         # Homepage hero section
│   ├── ProductCard.tsx  # Product card component
│   ├── ThemeProvider.tsx
│   └── ThemeToggle.tsx
├── context/
│   ├── CartContext.tsx
│   └── AdminAuthContext.tsx
├── lib/
│   ├── db.ts            # Database utilities
│   └── auth.ts          # Authentication utilities
├── types/
│   └── index.ts         # TypeScript types
└── data/
    └── db.json          # JSON database (auto-created)
```

## Security Notes

- Change default JWT_SECRET in production
- Use strong, unique admin password
- The JSON database is suitable for demo/portfolio purposes only
- For production, consider using a proper database (PostgreSQL, MongoDB, etc.)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
