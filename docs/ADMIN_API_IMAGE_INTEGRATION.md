# Admin API Integration with Image Upload Service

This guide explains how to integrate the image upload service with all admin APIs for managing products, features, services, categories, and benefits.

## Quick Start

### 1. Upload Image First
Before creating or updating any entity with images, upload the image(s) first:

```bash
curl -X POST http://your-domain.com:3030/api/images/upload \
  -F "file=@product-image.jpg" \
  -F "folder=products"
```

**Response:**
```json
{
  "success": true,
  "url": "http://your-domain.com:3030/api/images/products/product-image-1700000000000.jpg",
  "filename": "product-image-1700000000000.jpg",
  "folder": "products",
  "size": 245678,
  "type": "image/jpeg"
}
```

### 2. Use the Returned URL
Take the `url` from the response and use it in your create/update API calls.

---

## Products API

### Folder Recommendation: `products`

### Creating a Product with Images

Products support multiple image types:
- **Product Images** (main gallery): Array of `{ color, imgs: [urls], url: [urls] }`
- **Product Items** (features/specifications): Each item can have an `img` field

```typescript
// Step 1: Upload product images
const mainImages = await Promise.all([
  uploadImage(file1, { folder: 'products' }),
  uploadImage(file2, { folder: 'products' }),
  uploadImage(file3, { folder: 'products' })
]);

// Step 2: Create product with image URLs
const productData = {
  articleId: "DAIKIN-AC-001",
  price: 2999.99,
  categoryId: "category-id-here",
  slug: "daikin-ac-001",
  energyClass: "A++",
  isActive: true,
  translations: [
    {
      locale: "en",
      name: "Daikin Air Conditioner",
      title: "Premium AC Unit",
      subtitle: "Energy efficient cooling"
    }
  ],
  images: [
    {
      color: "white",
      imgs: [mainImages[0].url, mainImages[1].url],
      url: [mainImages[0].url, mainImages[1].url]
    },
    {
      color: "black",
      imgs: [mainImages[2].url],
      url: [mainImages[2].url]
    }
  ],
  items: [
    {
      locale: "en",
      title: "Energy Efficient",
      subtitle: "Save up to 40%",
      img: mainImages[0].url,
      isActive: true
    }
  ]
};

// POST request
const response = await fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(productData)
});
```

### cURL Example - Create Product

```bash
# 1. Upload images
IMAGE1=$(curl -X POST http://localhost:3030/api/images/upload \
  -F "file=@white-ac.jpg" \
  -F "folder=products" | jq -r '.url')

IMAGE2=$(curl -X POST http://localhost:3030/api/images/upload \
  -F "file=@black-ac.jpg" \
  -F "folder=products" | jq -r '.url')

# 2. Create product
curl -X POST http://localhost:3030/api/products \
  -H "Content-Type: application/json" \
  -d "{
    \"articleId\": \"DAIKIN-AC-001\",
    \"price\": 2999.99,
    \"categoryId\": \"category-id\",
    \"slug\": \"daikin-ac-001\",
    \"energyClass\": \"A++\",
    \"isActive\": true,
    \"translations\": [
      {
        \"locale\": \"en\",
        \"name\": \"Daikin AC\",
        \"title\": \"Premium Unit\"
      }
    ],
    \"images\": [
      {
        \"color\": \"white\",
        \"imgs\": [\"$IMAGE1\"],
        \"url\": [\"$IMAGE1\"]
      },
      {
        \"color\": \"black\",
        \"imgs\": [\"$IMAGE2\"],
        \"url\": [\"$IMAGE2\"]
      }
    ]
  }"
```

### Update Product Images

```bash
# PUT /api/products/[id]
curl -X PUT http://localhost:3030/api/products/product-id \
  -H "Content-Type: application/json" \
  -d "{
    \"img\": \"http://localhost:3030/api/images/products/updated-image-1700000000000.jpg\"
  }"
```

---

## Features API

### Folder Recommendation: `features`

Features have a single `img` field for the icon/image.

### Creating a Feature with Icon

```typescript
// Step 1: Upload feature icon
const iconUpload = await uploadImage(iconFile, { folder: 'features' });

// Step 2: Create feature
const featureData = {
  name: "Energy Saving",
  img: iconUpload.url,
  isActive: true,
  preview: false,
  translations: [
    {
      locale: "en",
      name: "Energy Saving Mode",
      desc: "Reduces energy consumption by 40%",
      isActive: true
    },
    {
      locale: "pl",
      name: "Tryb oszczędzania energii",
      desc: "Zmniejsza zużycie energii o 40%",
      isActive: true
    }
  ]
};

const response = await fetch('/api/features', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(featureData)
});
```

### cURL Example - Create Feature

```bash
# 1. Upload icon
ICON_URL=$(curl -X POST http://localhost:3030/api/images/upload \
  -F "file=@energy-icon.png" \
  -F "folder=features" | jq -r '.url')

# 2. Create feature
curl -X POST http://localhost:3030/api/features \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Energy Saving\",
    \"img\": \"$ICON_URL\",
    \"isActive\": true,
    \"preview\": false,
    \"translations\": [
      {
        \"locale\": \"en\",
        \"name\": \"Energy Saving Mode\",
        \"desc\": \"Reduces energy consumption\"
      }
    ]
  }"
```

### Update Feature Icon

```bash
# PUT /api/features/[id]
curl -X PUT http://localhost:3030/api/features/feature-id \
  -H "Content-Type: application/json" \
  -d "{
    \"img\": \"http://localhost:3030/api/images/features/new-icon-1700000000000.png\"
  }"
```

---

## Categories API

### Folder Recommendation: `categories`

Categories support images through their slug or custom fields (if extended).

```bash
# Upload category banner/icon
curl -X POST http://localhost:3030/api/images/upload \
  -F "file=@category-banner.jpg" \
  -F "folder=categories"
```

---

## Benefits API

### Folder Recommendation: `benefits`

Benefits typically don't have images in the current schema, but you can extend them.

```bash
# If you add an img field to BenefitDescription model
curl -X POST http://localhost:3030/api/images/upload \
  -F "file=@benefit-icon.png" \
  -F "folder=benefits"
```

---

## Complete React Component Example

```tsx
import { useState } from 'react';
import { uploadImage, IMAGE_FOLDERS } from '@/lib/image-upload';

interface ProductFormData {
  articleId: string;
  price: number;
  categoryId: string;
  images: { color: string; imgs: string[]; url: string[] }[];
}

export function CreateProductForm() {
  const [formData, setFormData] = useState<ProductFormData>({
    articleId: '',
    price: 0,
    categoryId: '',
    images: [],
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (files: FileList, color: string) => {
    setUploading(true);
    try {
      // Upload all images for this color
      const uploadPromises = Array.from(files).map(file =>
        uploadImage(file, { folder: IMAGE_FOLDERS.PRODUCTS })
      );
      
      const uploads = await Promise.all(uploadPromises);
      const imageUrls = uploads.map(u => u.url);

      // Add to form data
      setFormData(prev => ({
        ...prev,
        images: [
          ...prev.images,
          {
            color,
            imgs: imageUrls,
            url: imageUrls,
          },
        ],
      }));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const product = await response.json();
        alert('Product created successfully!');
        // Redirect or reset form
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Submit failed:', error);
      alert('Failed to create product');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Article ID:</label>
        <input
          type="text"
          value={formData.articleId}
          onChange={e => setFormData({ ...formData, articleId: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Price:</label>
        <input
          type="number"
          value={formData.price}
          onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
          required
        />
      </div>

      <div>
        <label>Upload Images (White):</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={e => e.target.files && handleImageUpload(e.target.files, 'white')}
          disabled={uploading}
        />
      </div>

      <div>
        <label>Upload Images (Black):</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={e => e.target.files && handleImageUpload(e.target.files, 'black')}
          disabled={uploading}
        />
      </div>

      {uploading && <p>Uploading images...</p>}

      <div>
        <h3>Uploaded Images:</h3>
        {formData.images.map((imgSet, idx) => (
          <div key={idx}>
            <p><strong>Color:</strong> {imgSet.color}</p>
            {imgSet.imgs.map((url, i) => (
              <img key={i} src={url} alt={`${imgSet.color}-${i}`} style={{ width: 100, height: 100 }} />
            ))}
          </div>
        ))}
      </div>

      <button type="submit" disabled={uploading}>
        Create Product
      </button>
    </form>
  );
}
```

---

## Bulk Upload Example

```typescript
// Upload multiple product images at once
async function bulkUploadProductImages(products: Array<{ id: string; imageFiles: File[] }>) {
  const results = [];

  for (const product of products) {
    try {
      // Upload all images for this product
      const uploads = await Promise.all(
        product.imageFiles.map(file =>
          uploadImage(file, { folder: IMAGE_FOLDERS.PRODUCTS })
        )
      );

      const imageUrls = uploads.map(u => u.url);

      // Update product with new images
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          img: {
            create: [{
              color: 'default',
              imgs: imageUrls,
              url: imageUrls,
            }],
          },
        }),
      });

      results.push({
        productId: product.id,
        success: response.ok,
        imageCount: imageUrls.length,
      });
    } catch (error) {
      results.push({
        productId: product.id,
        success: false,
        error: error.message,
      });
    }
  }

  return results;
}
```

---

## Image Management

### List Product Images

```bash
curl http://localhost:3030/api/images/list?folder=products
```

### Delete Old Images

```typescript
import { deleteImage } from '@/lib/image-upload';

// When updating a product with new images, delete old ones
async function updateProductImages(productId: string, oldImageUrls: string[], newImageFiles: File[]) {
  // Upload new images
  const uploads = await Promise.all(
    newImageFiles.map(file => uploadImage(file, { folder: IMAGE_FOLDERS.PRODUCTS }))
  );
  
  const newImageUrls = uploads.map(u => u.url);

  // Update product
  await fetch(`/api/products/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      img: {
        create: [{
          color: 'default',
          imgs: newImageUrls,
          url: newImageUrls,
        }],
      },
    }),
  });

  // Delete old images
  await Promise.all(oldImageUrls.map(url => deleteImage(url)));
}
```

---

## Best Practices

### 1. Folder Organization
Use consistent folder names for each entity type:
- Products: `products`
- Features: `features`
- Categories: `categories`
- Services: `services`
- Benefits: `benefits`
- General/Other: `general`

### 2. Image Upload Workflow
1. **Upload images first** using `/api/images/upload`
2. **Store the returned URLs** in your state/form
3. **Submit the entity** with image URLs
4. **Handle errors** - if entity creation fails, optionally delete uploaded images

### 3. Image Validation
Before uploading, validate:
- File is an image type
- File size is reasonable (< 10MB)
- Image dimensions if needed

```typescript
import { isImageFile, validateImageSize } from '@/lib/image-upload';

function validateFile(file: File): boolean {
  if (!isImageFile(file)) {
    alert('Please select an image file');
    return false;
  }
  
  if (!validateImageSize(file, 10)) {
    alert('Image must be less than 10MB');
    return false;
  }
  
  return true;
}
```

### 4. Error Handling

```typescript
async function safeUploadImage(file: File, folder: string) {
  try {
    return await uploadImage(file, { folder });
  } catch (error) {
    console.error('Upload failed:', error);
    
    // Show user-friendly error
    if (error.message.includes('Only image files')) {
      alert('Please upload an image file (JPG, PNG, GIF, WebP)');
    } else if (error.message.includes('Failed to upload')) {
      alert('Upload failed. Please try again.');
    } else {
      alert('An error occurred during upload');
    }
    
    throw error;
  }
}
```

### 5. Progress Indication

```typescript
function UploadWithProgress() {
  const [progress, setProgress] = useState<{current: number; total: number}>({ current: 0, total: 0 });

  const uploadMultiple = async (files: File[]) => {
    setProgress({ current: 0, total: files.length });
    
    const urls = [];
    for (let i = 0; i < files.length; i++) {
      const result = await uploadImage(files[i], { folder: 'products' });
      urls.push(result.url);
      setProgress({ current: i + 1, total: files.length });
    }
    
    return urls;
  };

  return (
    <div>
      {progress.total > 0 && (
        <p>Uploading: {progress.current} / {progress.total}</p>
      )}
    </div>
  );
}
```

---

## API Endpoints Summary

| Entity | Image Field | Folder | Create Endpoint | Update Endpoint |
|--------|------------|--------|----------------|----------------|
| **Product** | `images[]` (multiple) | `products` | `POST /api/products` | `PUT /api/products/[id]` |
| **Feature** | `img` (single) | `features` | `POST /api/features` | `PUT /api/features/[id]` |
| **Category** | Custom | `categories` | `POST /api/categories` | `PUT /api/categories/[id]` |
| **Benefit** | Custom | `benefits` | `POST /api/benefits` | `PUT /api/benefits/[id]` |

---

## Testing

### Test Image Upload

```bash
# Test uploading to different folders
curl -X POST http://localhost:3030/api/images/upload \
  -F "file=@test-image.jpg" \
  -F "folder=products"

curl -X POST http://localhost:3030/api/images/upload \
  -F "file=@test-icon.png" \
  -F "folder=features"
```

### Verify Image Access

```bash
# After upload, verify the image is accessible
curl -I http://localhost:3030/api/images/products/test-image-1700000000000.jpg
```

### Test Complete Flow

```bash
# 1. Upload
IMAGE_URL=$(curl -X POST http://localhost:3030/api/images/upload \
  -F "file=@product.jpg" \
  -F "folder=products" | jq -r '.url')

# 2. Create feature with image
curl -X POST http://localhost:3030/api/features \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Test\", \"img\": \"$IMAGE_URL\"}"

# 3. Verify feature was created
curl http://localhost:3030/api/features
```
