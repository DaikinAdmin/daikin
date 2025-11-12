# Product Catalog API Documentation

This document describes the CRUD endpoints for managing Categories, Products, and Features with multi-language support.

## Overview

All entities support internationalization through translation tables:
- **Categories** → CategoryTranslation
- **Products** → ProductTranslation  
- **Features** → FeatureTranslation

## Authentication

- **Admin endpoints** (POST, PUT, DELETE): Require authentication and admin role
- **Public endpoints**: No authentication required, return only active items

## API Endpoints

### Categories

#### Admin Endpoints (Protected)

##### GET /api/categories
Get all categories with optional filtering.

**Query Parameters:**
- `search` (optional): Search in name and slug
- `locale` (optional): Filter translations by locale (e.g., "en", "pl", "ua")
- `includeInactive` (optional): Include inactive categories (default: false)

**Response:**
```json
[
  {
    "id": "cm3abcd123",
    "name": "Air Conditioners",
    "slug": "air-conditioners",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z",
    "categoryDetails": [
      {
        "id": "cm3xyz789",
        "locale": "pl",
        "name": "Klimatyzatory",
        "isActive": true
      }
    ],
    "_count": {
      "products": 5
    }
  }
]
```

##### POST /api/categories
Create a new category (Admin only).

**Request Body:**
```json
{
  "name": "Air Conditioners",
  "slug": "air-conditioners",
  "isActive": true,
  "translations": [
    {
      "locale": "en",
      "name": "Air Conditioners",
      "isActive": true
    },
    {
      "locale": "pl",
      "name": "Klimatyzatory",
      "isActive": true
    },
    {
      "locale": "ua",
      "name": "Кондиціонери",
      "isActive": true
    }
  ]
}
```

##### GET /api/categories/[id]
Get a single category by ID.

**Query Parameters:**
- `locale` (optional): Filter translations by locale

**Response:**
```json
{
  "id": "cm3abcd123",
  "name": "Air Conditioners",
  "slug": "air-conditioners",
  "isActive": true,
  "categoryDetails": [...],
  "products": [...]
}
```

##### PUT /api/categories/[id]
Update a category (Admin only).

**Request Body:**
```json
{
  "name": "Updated Name",
  "slug": "updated-slug",
  "isActive": true,
  "translations": [
    {
      "locale": "en",
      "name": "Updated Name",
      "isActive": true
    }
  ]
}
```

##### DELETE /api/categories/[id]
Delete a category (Admin only).

**Note:** Cannot delete categories with associated products.

#### Public Endpoints

##### GET /api/categories/public
Get all active categories with translations.

**Query Parameters:**
- `locale` (optional, default: "en"): Locale for translations

**Response:**
```json
[
  {
    "id": "cm3abcd123",
    "slug": "air-conditioners",
    "name": "Air Conditioners",
    "productsCount": 5,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

##### GET /api/categories/public/[slug]
Get a single active category by slug with all products.

**Query Parameters:**
- `locale` (optional, default: "en"): Locale for translations

**Response:**
```json
{
  "id": "cm3abcd123",
  "slug": "air-conditioners",
  "name": "Air Conditioners",
  "products": [
    {
      "id": "cm3prod123",
      "articleId": "AC-2000",
      "price": 1999.99,
      "img": "/images/ac-2000.jpg",
      "name": "Daikin AC 2000",
      "description": "High-efficiency air conditioner",
      "features": [...]
    }
  ],
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

---

### Products

#### Admin Endpoints (Protected)

##### GET /api/products
Get all products with optional filtering.

**Query Parameters:**
- `search` (optional): Search in articleId, name, and description
- `locale` (optional): Filter translations by locale
- `categoryId` (optional): Filter by category
- `includeInactive` (optional): Include inactive products (default: false)

**Response:**
```json
[
  {
    "id": "cm3prod123",
    "articleId": "AC-2000",
    "price": 1999.99,
    "img": "/images/ac-2000.jpg",
    "categoryId": "cm3cat123",
    "isActive": true,
    "productDetails": [
      {
        "locale": "en",
        "name": "Daikin AC 2000",
        "description": "High-efficiency air conditioner"
      }
    ],
    "category": {
      "id": "cm3cat123",
      "name": "Air Conditioners",
      "categoryDetails": [...]
    },
    "features": [
      {
        "id": "cm3feat123",
        "name": "Energy Efficient",
        "featureDetails": [...]
      }
    ],
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

##### POST /api/products
Create a new product (Admin only).

**Request Body:**
```json
{
  "articleId": "AC-2000",
  "price": 1999.99,
  "img": "/images/ac-2000.jpg",
  "categoryId": "cm3cat123",
  "isActive": true,
  "translations": [
    {
      "locale": "en",
      "name": "Daikin AC 2000",
      "description": "High-efficiency air conditioner with smart features"
    },
    {
      "locale": "pl",
      "name": "Daikin AC 2000",
      "description": "Wysokowydajny klimatyzator z inteligentnymi funkcjami"
    }
  ],
  "featureIds": ["cm3feat123", "cm3feat456"]
}
```

##### GET /api/products/[id]
Get a single product by ID.

**Query Parameters:**
- `locale` (optional): Filter translations by locale

##### PUT /api/products/[id]
Update a product (Admin only).

**Request Body:**
```json
{
  "articleId": "AC-2000-V2",
  "price": 2199.99,
  "img": "/images/ac-2000-v2.jpg",
  "categoryId": "cm3cat123",
  "isActive": true,
  "translations": [...],
  "featureIds": ["cm3feat123", "cm3feat789"]
}
```

**Note:** Providing `featureIds` will replace all existing feature associations.

##### DELETE /api/products/[id]
Delete a product (Admin only).

**Note:** Cannot delete products with associated orders.

#### Public Endpoints

##### GET /api/products/public
Get all active products with locale-specific translations.

**Query Parameters:**
- `locale` (optional, default: "en"): Locale for translations
- `categoryId` (optional): Filter by category
- `search` (optional): Search in articleId, name, and description

**Response:**
```json
[
  {
    "id": "cm3prod123",
    "articleId": "AC-2000",
    "price": 1999.99,
    "img": "/images/ac-2000.jpg",
    "name": "Daikin AC 2000",
    "description": "High-efficiency air conditioner",
    "category": {
      "id": "cm3cat123",
      "slug": "air-conditioners",
      "name": "Air Conditioners"
    },
    "features": [
      {
        "id": "cm3feat123",
        "img": "/icons/energy.svg",
        "name": "Energy Efficient"
      }
    ],
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

##### GET /api/products/public/[id]
Get a single active product by ID.

**Query Parameters:**
- `locale` (optional, default: "en"): Locale for translations

---

### Features

#### Admin Endpoints (Protected)

##### GET /api/features
Get all features with optional filtering.

**Query Parameters:**
- `search` (optional): Search in name
- `locale` (optional): Filter translations by locale
- `includeInactive` (optional): Include inactive features (default: false)

**Response:**
```json
[
  {
    "id": "cm3feat123",
    "name": "Energy Efficient",
    "img": "/icons/energy.svg",
    "isActive": true,
    "featureDetails": [
      {
        "locale": "en",
        "name": "Energy Efficient",
        "isActive": true
      }
    ],
    "_count": {
      "products": 12
    },
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

##### POST /api/features
Create a new feature (Admin only).

**Request Body:**
```json
{
  "name": "Energy Efficient",
  "img": "/icons/energy.svg",
  "isActive": true,
  "translations": [
    {
      "locale": "en",
      "name": "Energy Efficient",
      "isActive": true
    },
    {
      "locale": "pl",
      "name": "Energooszczędny",
      "isActive": true
    },
    {
      "locale": "ua",
      "name": "Енергоефективний",
      "isActive": true
    }
  ]
}
```

##### GET /api/features/[id]
Get a single feature by ID.

**Query Parameters:**
- `locale` (optional): Filter translations by locale

**Response:**
```json
{
  "id": "cm3feat123",
  "name": "Energy Efficient",
  "img": "/icons/energy.svg",
  "isActive": true,
  "featureDetails": [...],
  "products": [...]
}
```

##### PUT /api/features/[id]
Update a feature (Admin only).

**Request Body:**
```json
{
  "name": "Updated Feature Name",
  "img": "/icons/updated.svg",
  "isActive": true,
  "translations": [...]
}
```

##### DELETE /api/features/[id]
Delete a feature (Admin only).

**Note:** Cannot delete features associated with products.

---

## Error Responses

All endpoints return standard error responses:

```json
{
  "error": "Error message description"
}
```

**Common Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request (missing required fields)
- `401`: Unauthorized (not authenticated)
- `403`: Forbidden (not admin)
- `404`: Not Found
- `409`: Conflict (duplicate slug/articleId or cannot delete due to associations)
- `500`: Internal Server Error

---

## Usage Examples

### Creating a Category with Translations

```javascript
const response = await fetch('/api/categories', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Air Conditioners',
    slug: 'air-conditioners',
    isActive: true,
    translations: [
      { locale: 'en', name: 'Air Conditioners', isActive: true },
      { locale: 'pl', name: 'Klimatyzatory', isActive: true },
      { locale: 'ua', name: 'Кондиціонери', isActive: true }
    ]
  })
});
```

### Fetching Products by Locale

```javascript
// Get all products in Polish
const response = await fetch('/api/products/public?locale=pl');
const products = await response.json();

// Get products in specific category (Ukrainian)
const response = await fetch('/api/products/public?locale=ua&categoryId=cm3cat123');
const products = await response.json();
```

### Creating a Product with Features

```javascript
const response = await fetch('/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    articleId: 'AC-2000',
    price: 1999.99,
    img: '/images/ac-2000.jpg',
    categoryId: 'cm3cat123',
    isActive: true,
    translations: [
      {
        locale: 'en',
        name: 'Daikin AC 2000',
        description: 'High-efficiency air conditioner'
      },
      {
        locale: 'pl',
        name: 'Daikin AC 2000',
        description: 'Wysokowydajny klimatyzator'
      }
    ],
    featureIds: ['cm3feat123', 'cm3feat456']
  })
});
```

### Fetching Category with Products (Public)

```javascript
// Get category by slug in English
const response = await fetch('/api/categories/public/air-conditioners?locale=en');
const category = await response.json();
// Returns category with all its products in English

// Get same category in Polish
const response = await fetch('/api/categories/public/air-conditioners?locale=pl');
const category = await response.json();
// Returns category with all its products in Polish
```

---

## Notes

1. **Locale Support**: The system supports "en", "pl", and "ua" locales based on your schema. Default is "en" for public endpoints.

2. **Cascade Deletes**: Translations are automatically deleted when their parent entity is deleted due to Prisma's `onDelete: Cascade` configuration.

3. **Active vs Inactive**: Admin endpoints can see inactive items with `includeInactive=true`. Public endpoints only show active items.

4. **Translation Management**: When updating translations via PUT requests, all existing translations are replaced with the new set provided.

5. **Feature Associations**: Products can have multiple features. Use `featureIds` array to manage these relationships.

6. **Search**: Search functionality works across translations, allowing users to find items in their preferred language.
