This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- 🏠 **E-commerce Platform** - Product catalog with categories, features, and specifications
- 🔐 **Authentication** - Secure user authentication with Better Auth
- 🛒 **Order Management** - Complete order tracking and management system
- 🎁 **Benefits System** - Loyalty program with Daikin Coins
- 📧 **Email Notifications** - Automated service reminders
- 🖼️ **Image Upload Service** - Persistent image storage with Docker volumes
- 🌍 **Internationalization** - Multi-language support (EN, PL, UA)
- 🎨 **Modern UI** - Built with Radix UI and Tailwind CSS

## Image Upload Service

This project includes a complete image upload service for managing product images, feature icons, and other assets.

**Quick Links:**
- 📖 [Image Service Documentation](./IMAGE_UPLOAD_SERVICE.md)
- 🔗 [Admin API Integration Guide](./ADMIN_API_IMAGE_INTEGRATION.md)
- 📋 [Implementation Summary](./IMAGE_SERVICE_SUMMARY.md)

**Key Features:**
- Upload images with automatic timestamp-based naming
- Organize images into folders (products, features, categories, etc.)
- Persistent storage using Docker volumes
- RESTful API endpoints for upload, fetch, list, and delete
- React hooks for easy frontend integration

**Quick Example:**
```bash
# Upload image
curl -X POST http://localhost:3030/api/images/upload \
  -F "file=@product.jpg" \
  -F "folder=products"

# Response includes URL to use in your application
{
  "url": "http://localhost:3030/api/images/products/product-1700000000000.jpg"
}
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## What else you will need?
1. **PostgreSQL instance**
2. **Nodemailer env variables:**
   - MAIL_HOST
   - MAIL_PORT
   - MAIL_USER
   - MAIL_PASSWORD
3. **Image Service configuration:**
   - UPLOAD_DIR (default: `/uploads`)
   - IMAGE_SERVICE_URL (your VPS domain/IP)

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/daikin

# Authentication
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3030
NEXT_PUBLIC_APP_URL=http://localhost:3030

# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Image Upload Service
UPLOAD_DIR=/uploads
IMAGE_SERVICE_URL=http://localhost:3030
```

## Docker Deployment

The application is fully containerized with Docker Compose:

```bash
# Build and start all services
docker compose up -d

# View logs
docker logs -f daikin-app

# Stop services
docker compose down

# Rebuild after changes
docker compose build --no-cache
docker compose up -d
```

**Services:**
- **app** - Next.js application (port 3030)
- **postgres** - PostgreSQL database (port 5434)

**Volumes:**
- `postgres_data` - Database persistence
- `upload_data` - Image storage persistence

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── images/       # Image upload service
│   │   │   ├── products/     # Product management
│   │   │   ├── features/     # Feature management
│   │   │   ├── categories/   # Category management
│   │   │   └── ...
│   │   └── [locale]/         # Internationalized pages
│   ├── components/           # React components
│   ├── lib/                  # Utilities and helpers
│   │   └── image-upload.ts   # Image service helper
│   ├── hooks/                # React hooks
│   │   └── use-image-upload.ts
│   └── types/                # TypeScript definitions
├── prisma/                   # Database schema and migrations
├── public/                   # Static assets
├── docker-compose.yml        # Docker configuration
├── Dockerfile               # Container definition
└── *.md                     # Documentation files
```

## Documentation

- 📖 [Image Upload Service](./IMAGE_UPLOAD_SERVICE.md) - Complete API documentation
- 🔗 [Admin API Integration](./ADMIN_API_IMAGE_INTEGRATION.md) - Integration examples
- 📋 [Implementation Summary](./IMAGE_SERVICE_SUMMARY.md) - Overview and quick start
- 📦 [Bulk Upload Products](./BULK_UPLOAD_PRODUCTS.md) - Bulk operations guide
- 🚀 [Deployment Guide](./DEPLOYMENT.md) - Production deployment
- 🌱 [Database Seeding](./prisma/SEED.md) - Seed data guide

## What else you will need (Legacy)?
1. PostgreSQL instance.
2. Nodemailer env variables:
 - MAIL_HOST
 - MAIL_PORT
 - MAIL_USER
 - MAIL_PASSWORD

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# better-auth-example
