# Product API - Complete Response Documentation

## ✅ Current Status

**All product endpoints now return complete product objects with all relations.**

## API Endpoints

### 1. POST /api/products - Create Product

**Returns:** Complete product object with status `201`

**Request Body Example:**
```json
{
  "articleId": "DAI-AC-2024-001",
  "price": 1299.99,
  "categoryId": "cat-uuid-123",
  "slug": "daikin-ac-premium",
  "energyClass": "A+++",
  "isActive": true,
  "translations": [
    {
      "locale": "en",
      "name": "Daikin Premium AC",
      "title": "Energy Efficient Cooling",
      "subtitle": "Save up to 40% on energy"
    },
    {
      "locale": "pl",
      "name": "Daikin Premium AC",
      "title": "Energooszczędne chłodzenie",
      "subtitle": "Oszczędź do 40% energii"
    }
  ],
  "featureIds": ["feature-uuid-1", "feature-uuid-2"],
  "specs": [
    {
      "title": "Power Consumption",
      "subtitle": "850W"
    },
    {
      "title": "Cooling Capacity",
      "subtitle": "3.5 kW"
    }
  ],
  "images": [
    {
      "color": "white",
      "imgs": [
        "/api/images/productImages/1732546789123-ac-white-1.jpg",
        "/api/images/productImages/1732546789124-ac-white-2.jpg"
      ],
      "url": []
    },
    {
      "color": "black",
      "imgs": [
        "/api/images/productImages/1732546789125-ac-black-1.jpg"
      ],
      "url": []
    }
  ],
  "items": [
    {
      "locale": "en",
      "title": "Energy Efficient",
      "subtitle": "Save up to 40%",
      "img": "/api/images/productItems/1732546789126-energy.jpg",
      "isActive": true
    },
    {
      "locale": "pl",
      "title": "Energooszczędny",
      "subtitle": "Oszczędź do 40%",
      "img": "/api/images/productItems/1732546789127-energy-pl.jpg",
      "isActive": true
    }
  ]
}
```

**Response Example (201):**
```json
{
  "id": "prod-uuid-789",
  "articleId": "DAI-AC-2024-001",
  "price": 1299.99,
  "categoryId": "cat-uuid-123",
  "slug": "daikin-ac-premium",
  "energyClass": "A+++",
  "isActive": true,
  "createdAt": "2025-11-25T10:30:00.000Z",
  "updatedAt": "2025-11-25T10:30:00.000Z",
  
  "productDetails": [
    {
      "id": "detail-uuid-1",
      "productId": "prod-uuid-789",
      "locale": "en",
      "name": "Daikin Premium AC",
      "title": "Energy Efficient Cooling",
      "subtitle": "Save up to 40% on energy",
      "description": null,
      "createdAt": "2025-11-25T10:30:00.000Z",
      "updatedAt": "2025-11-25T10:30:00.000Z"
    },
    {
      "id": "detail-uuid-2",
      "productId": "prod-uuid-789",
      "locale": "pl",
      "name": "Daikin Premium AC",
      "title": "Energooszczędne chłodzenie",
      "subtitle": "Oszczędź do 40% energii",
      "description": null,
      "createdAt": "2025-11-25T10:30:00.000Z",
      "updatedAt": "2025-11-25T10:30:00.000Z"
    }
  ],
  
  "category": {
    "id": "cat-uuid-123",
    "name": "Air Conditioners",
    "slug": "air-conditioners",
    "isActive": true,
    "createdAt": "2025-11-20T10:00:00.000Z",
    "updatedAt": "2025-11-20T10:00:00.000Z",
    "categoryDetails": [
      {
        "id": "cat-detail-uuid-1",
        "categoryId": "cat-uuid-123",
        "locale": "en",
        "name": "Air Conditioners",
        "description": "Cooling solutions",
        "isActive": true
      }
    ]
  },
  
  "features": [
    {
      "id": "feature-uuid-1",
      "name": "Energy Saving",
      "slug": "energy-saving",
      "isActive": true,
      "createdAt": "2025-11-15T10:00:00.000Z",
      "updatedAt": "2025-11-15T10:00:00.000Z",
      "featureDetails": [
        {
          "id": "feature-detail-uuid-1",
          "featureId": "feature-uuid-1",
          "locale": "en",
          "title": "Energy Saving Mode",
          "subtitle": "Reduce energy consumption",
          "description": "Advanced energy saving technology",
          "img": "/api/images/features/energy-saving.jpg",
          "isActive": true
        }
      ]
    },
    {
      "id": "feature-uuid-2",
      "name": "Smart Control",
      "slug": "smart-control",
      "isActive": true,
      "createdAt": "2025-11-15T10:00:00.000Z",
      "updatedAt": "2025-11-15T10:00:00.000Z",
      "featureDetails": [
        {
          "id": "feature-detail-uuid-2",
          "featureId": "feature-uuid-2",
          "locale": "en",
          "title": "Smart Control",
          "subtitle": "Control from your phone",
          "description": "WiFi enabled smart control",
          "img": "/api/images/features/smart-control.jpg",
          "isActive": true
        }
      ]
    }
  ],
  
  "specs": [
    {
      "id": "spec-uuid-1",
      "productId": "prod-uuid-789",
      "title": "Power Consumption",
      "subtitle": "850W",
      "createdAt": "2025-11-25T10:30:00.000Z",
      "updatedAt": "2025-11-25T10:30:00.000Z"
    },
    {
      "id": "spec-uuid-2",
      "productId": "prod-uuid-789",
      "title": "Cooling Capacity",
      "subtitle": "3.5 kW",
      "createdAt": "2025-11-25T10:30:00.000Z",
      "updatedAt": "2025-11-25T10:30:00.000Z"
    }
  ],
  
  "img": [
    {
      "id": "img-uuid-1",
      "productId": "prod-uuid-789",
      "color": "white",
      "imgs": [
        "/api/images/productImages/1732546789123-ac-white-1.jpg",
        "/api/images/productImages/1732546789124-ac-white-2.jpg"
      ],
      "url": [],
      "createdAt": "2025-11-25T10:30:00.000Z",
      "updatedAt": "2025-11-25T10:30:00.000Z"
    },
    {
      "id": "img-uuid-2",
      "productId": "prod-uuid-789",
      "color": "black",
      "imgs": [
        "/api/images/productImages/1732546789125-ac-black-1.jpg"
      ],
      "url": [],
      "createdAt": "2025-11-25T10:30:00.000Z",
      "updatedAt": "2025-11-25T10:30:00.000Z"
    }
  ],
  
  "items": [
    {
      "id": "item-uuid-1",
      "productId": "prod-uuid-789",
      "locale": "en",
      "title": "Energy Efficient",
      "subtitle": "Save up to 40%",
      "img": "/api/images/productItems/1732546789126-energy.jpg",
      "isActive": true,
      "createdAt": "2025-11-25T10:30:00.000Z",
      "updatedAt": "2025-11-25T10:30:00.000Z"
    },
    {
      "id": "item-uuid-2",
      "productId": "prod-uuid-789",
      "locale": "pl",
      "title": "Energooszczędny",
      "subtitle": "Oszczędź do 40%",
      "img": "/api/images/productItems/1732546789127-energy-pl.jpg",
      "isActive": true,
      "createdAt": "2025-11-25T10:30:00.000Z",
      "updatedAt": "2025-11-25T10:30:00.000Z"
    }
  ]
}
```

---

### 2. GET /api/products/:id - Get Single Product

**Returns:** Complete product object with all relations

**Query Parameters:**
- `locale` (optional): Filter translations by locale (e.g., `en`, `pl`, `ua`)

**Response:** Same structure as POST response above

---

### 3. PUT /api/products/:id - Update Product

**Returns:** Complete updated product object with all relations

**Note:** To update images, items, or specs, use their dedicated endpoints:
- Images: POST/PUT/DELETE `/api/products/:id/images`
- Items: POST/PUT/DELETE `/api/products/:id/items`
- Specs: POST/PUT/DELETE `/api/products/:id/specs`

**Response:** Same structure as POST response above

---

### 4. GET /api/products - Get All Products

**Returns:** Array of complete product objects

**Query Parameters:**
- `search` (optional): Search in articleId, name, title, subtitle
- `locale` (optional): Filter translations by locale
- `categoryId` (optional): Filter by category
- `includeInactive` (optional): Include inactive products (default: false)

**Response:** Array of product objects (same structure as single product)

---

## Complete Product Object Structure

The complete product object includes **7 main sections**:

### 1. **Main Info**
```typescript
{
  id: string;
  articleId: string;
  price: number | null;
  categoryId: string;
  slug: string;
  energyClass: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. **Product Details** (Translations)
```typescript
productDetails: [{
  id: string;
  productId: string;
  locale: string; // 'en' | 'pl' | 'ua'
  name: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}]
```

### 3. **Category** (with translations)
```typescript
category: {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoryDetails: [{
    id: string;
    categoryId: string;
    locale: string;
    name: string;
    description: string | null;
    isActive: boolean;
  }]
}
```

### 4. **Preview Features** (Features array with translations)
```typescript
features: [{
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  featureDetails: [{
    id: string;
    featureId: string;
    locale: string;
    title: string;
    subtitle: string | null;
    description: string | null;
    img: string | null;
    isActive: boolean;
  }]
}]
```

### 5. **Features** (Specs array)
```typescript
specs: [{
  id: string;
  productId: string;
  title: string;
  subtitle: string | null;
  createdAt: Date;
  updatedAt: Date;
}]
```

### 6. **Images** (by color variants)
```typescript
img: [{
  id: string;
  productId: string;
  color: string | null;
  imgs: string[];      // URLs from /api/images/productImages/
  url: string[];       // Legacy field (usually empty)
  createdAt: Date;
  updatedAt: Date;
}]
```

### 7. **Items** (Product highlights by locale)
```typescript
items: [{
  id: string;
  productId: string;
  locale: string;
  title: string;
  subtitle: string | null;
  img: string | null;  // URL from /api/images/productItems/
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}]
```

---

## Admin Workflow

### Creating a Product with Images

**Step-by-step process:**

1. **Admin opens "Add Product" dialog**

2. **Admin fills in product details:**
   - Article ID, price, category, energy class
   - Translations (name, title, subtitle for each locale)
   - Select features
   - Add specifications

3. **Admin uploads images:**
   - **Images Tab**: Select color → Upload 1-5 images (auto-uploaded to `/api/images/productImages/`)
   - **Items Tab**: For each locale item → Upload 1 image (auto-uploaded to `/api/images/productItems/`)
   - Image URLs are returned immediately: `/api/images/productImages/1732546789123-filename.jpg`

4. **Admin clicks "Add Product" button**
   - Frontend collects all data including image URLs
   - Sends POST request to `/api/products` with complete payload
   - Backend validates and creates product with all relations
   - **Response contains complete product object with all 7 sections**

5. **Frontend receives complete product object**
   - Can immediately display the product in the table
   - All images, items, features are included
   - No need for additional API calls

---

## Image Upload Integration

### Product Images Upload Flow

```typescript
// 1. User selects files in Images Tab
const files = event.target.files; // Up to 5 files

// 2. Upload each file sequentially
for (const file of files) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', 'productImages');
  
  const response = await fetch('/api/images/upload', {
    method: 'POST',
    body: formData
  });
  
  const { url } = await response.json();
  // url: "/api/images/productImages/1732546789123-ac-white.jpg"
  
  imageUrls.push(url);
}

// 3. Add to product data
productData.images = [{
  color: 'white',
  imgs: imageUrls, // Array of uploaded URLs
  url: []
}];
```

### Product Items Upload Flow

```typescript
// 1. User selects file for item
const file = event.target.files[0];

// 2. Upload single file
const formData = new FormData();
formData.append('file', file);
formData.append('folder', 'productItems');

const response = await fetch('/api/images/upload', {
  method: 'POST',
  body: formData
});

const { url } = await response.json();
// url: "/api/images/productItems/1732546789126-energy.jpg"

// 3. Add to product data
productData.items = [{
  locale: 'en',
  title: 'Energy Efficient',
  subtitle: 'Save up to 40%',
  img: url, // Single uploaded URL
  isActive: true
}];
```

### Complete Product Submission

```typescript
// After all images are uploaded, submit product
const response = await fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    articleId: 'DAI-AC-2024-001',
    price: 1299.99,
    categoryId: 'cat-uuid-123',
    // ... other fields ...
    images: productImagesWithUrls,
    items: productItemsWithUrls
  })
});

const completeProduct = await response.json();
// completeProduct contains all 7 sections!
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Admin Dashboard                          │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  1. Fill Product Form                              │    │
│  │     - Article ID, Price, Category                  │    │
│  │     - Translations (EN, PL, UA)                    │    │
│  │     - Features, Specs                               │    │
│  └────────────────────────────────────────────────────┘    │
│                          │                                   │
│                          ▼                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │  2. Upload Product Images (Multi-file)             │    │
│  │     POST /api/images/upload                        │    │
│  │     folder: 'productImages'                        │    │
│  │     ────────────────────────────────               │    │
│  │     Response: { url: '/api/images/...' }          │    │
│  └────────────────────────────────────────────────────┘    │
│                          │                                   │
│                          ▼                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │  3. Upload Product Items (Single-file per item)    │    │
│  │     POST /api/images/upload                        │    │
│  │     folder: 'productItems'                         │    │
│  │     ────────────────────────────────               │    │
│  │     Response: { url: '/api/images/...' }          │    │
│  └────────────────────────────────────────────────────┘    │
│                          │                                   │
│                          ▼                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │  4. Submit Complete Product                        │    │
│  │     POST /api/products                             │    │
│  │     {                                              │    │
│  │       articleId, price, categoryId, ...            │    │
│  │       translations: [...],                         │    │
│  │       featureIds: [...],                           │    │
│  │       specs: [...],                                │    │
│  │       images: [{ color, imgs: [URLs] }],          │    │
│  │       items: [{ locale, title, img: URL }]        │    │
│  │     }                                              │    │
│  └────────────────────────────────────────────────────┘    │
│                          │                                   │
└──────────────────────────┼───────────────────────────────────┘
                           ▼
            ┌──────────────────────────────┐
            │    Backend API Server        │
            │    POST /api/products        │
            └──────────────┬───────────────┘
                           │
                           ▼
            ┌──────────────────────────────┐
            │    PostgreSQL Database       │
            │                              │
            │  Creates:                    │
            │  - Product (main)            │
            │  - ProductDetails (trans)    │
            │  - ProductImages (imgs)      │
            │  - ProductItems (items)      │
            │  - ProductSpecs (specs)      │
            │  - Feature relations         │
            └──────────────┬───────────────┘
                           │
                           ▼
            ┌──────────────────────────────┐
            │   Query with ALL includes    │
            │                              │
            │   include: {                 │
            │     productDetails,          │
            │     category: {              │
            │       categoryDetails        │
            │     },                       │
            │     features: {              │
            │       featureDetails         │
            │     },                       │
            │     specs,                   │
            │     img,                     │
            │     items                    │
            │   }                          │
            └──────────────┬───────────────┘
                           │
                           ▼
            ┌──────────────────────────────┐
            │   HTTP 201 Response          │
            │                              │
            │   {                          │
            │     id, articleId, price,    │
            │     productDetails: [...],   │
            │     category: {...},         │
            │     features: [...],         │
            │     specs: [...],            │
            │     img: [...],              │
            │     items: [...]             │
            │   }                          │
            └──────────────┬───────────────┘
                           │
                           ▼
            ┌──────────────────────────────┐
            │   Admin Dashboard UI         │
            │                              │
            │  - Display success message   │
            │  - Update products table     │
            │  - Show all product data     │
            │  - No additional API calls!  │
            └──────────────────────────────┘
```

---

## Validation Rules

### Product Creation
- ✅ `articleId` - Required, must be unique
- ✅ `categoryId` - Required, must exist
- ✅ `slug` - Auto-generated from articleId if not provided, must be unique
- ✅ `featureIds` - If provided, all must exist
- ✅ `images.*.imgs` - Must be valid URLs from image upload service
- ✅ `items.*.img` - Must be valid URL from image upload service
- ✅ `translations` - At least one translation recommended

### Image Upload
- ✅ **Product Images**: Max 5 files per color, 1MB each, JPG/PNG/WEBP
- ✅ **Product Items**: Max 1 file per item, 1MB, JPG/PNG/WEBP
- ✅ Files uploaded to Docker volume at `/uploads`
- ✅ Served via `/api/images/[folder]/[filename]`

---

## Error Handling

### Product Creation Errors

**409 Conflict - Duplicate ArticleId**
```json
{
  "error": "Product with this articleId already exists"
}
```

**409 Conflict - Duplicate Slug**
```json
{
  "error": "Product with this slug already exists"
}
```

**404 Not Found - Invalid Category**
```json
{
  "error": "Category not found"
}
```

**404 Not Found - Invalid Features**
```json
{
  "error": "One or more features not found"
}
```

**400 Bad Request - Missing Required Fields**
```json
{
  "error": "Missing required fields: articleId and categoryId"
}
```

### Image Upload Errors

**400 Bad Request - Invalid File Type**
```json
{
  "error": "Please select an image file (JPG, PNG, WEBP)"
}
```

**400 Bad Request - File Too Large**
```json
{
  "error": "File size must be less than 1MB"
}
```

**400 Bad Request - Too Many Files**
```json
{
  "error": "Maximum 5 images allowed per color"
}
```

---

## Summary

✅ **POST /api/products** - Returns complete product with all 7 sections  
✅ **GET /api/products/:id** - Returns complete product with all 7 sections  
✅ **PUT /api/products/:id** - Returns complete updated product with all 7 sections  
✅ **GET /api/products** - Returns array of complete products  

✅ **Image upload service** - Integrated with product creation  
✅ **File validation** - Client and server-side  
✅ **Docker volumes** - Persistent storage configured  
✅ **Error handling** - Comprehensive validation and error messages  

**No additional API calls needed after product creation!** 🎉
