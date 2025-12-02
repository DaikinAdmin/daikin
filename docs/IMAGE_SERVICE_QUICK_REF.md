# Image Upload Service - Quick Reference

## 🚀 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/images/upload` | Upload image |
| `GET` | `/api/images/{folder}/{filename}` | Fetch image |
| `DELETE` | `/api/images/{folder}/{filename}` | Delete image |
| `GET` | `/api/images/list?folder={folder}` | List images |
| `GET` | `/api/images/folders` | List folders |
| `POST` | `/api/images/folders` | Create folder |

## 📁 Folder Structure

```
/uploads/
├── products/      # Product images
├── features/      # Feature icons
├── categories/    # Category banners
├── services/      # Service images
├── benefits/      # Benefit icons
└── general/       # Miscellaneous
```

## 💻 Frontend Usage

### React Hook - Single Image
```tsx
import { useSingleImageUpload } from '@/hooks/use-image-upload';

const { imageUrl, upload, uploading } = useSingleImageUpload({
  folder: 'products'
});

<input type="file" onChange={(e) => {
  const file = e.target.files?.[0];
  if (file) upload(file);
}} disabled={uploading} />
```

### React Hook - Multiple Images
```tsx
import { useMultipleImageUpload } from '@/hooks/use-image-upload';

const { images, addImages, removeImage } = useMultipleImageUpload({
  folder: 'products',
  maxImages: 5
});

<input type="file" multiple onChange={(e) => 
  e.target.files && addImages(Array.from(e.target.files))
} />
```

### Helper Functions
```typescript
import { uploadImage, IMAGE_FOLDERS } from '@/lib/image-upload';

const result = await uploadImage(file, { 
  folder: IMAGE_FOLDERS.PRODUCTS 
});
console.log(result.url); // Use this URL
```

## 🔄 Admin API Workflow

### Create Product with Images
```typescript
// 1. Upload images
const uploads = await Promise.all(
  imageFiles.map(f => uploadImage(f, { folder: 'products' }))
);

// 2. Create product with URLs
await fetch('/api/products', {
  method: 'POST',
  body: JSON.stringify({
    articleId: 'PROD-001',
    images: [{
      color: 'white',
      imgs: uploads.map(u => u.url),
      url: uploads.map(u => u.url)
    }]
  })
});
```

### Create Feature with Icon
```typescript
// 1. Upload icon
const { url } = await uploadImage(iconFile, { folder: 'features' });

// 2. Create feature
await fetch('/api/features', {
  method: 'POST',
  body: JSON.stringify({
    name: 'Energy Saving',
    img: url
  })
});
```

## 🐚 cURL Commands

### Upload
```bash
curl -X POST http://localhost:3030/api/images/upload \
  -F "file=@image.jpg" \
  -F "folder=products"
```

### List Images
```bash
curl http://localhost:3030/api/images/list?folder=products
```

### Delete Image
```bash
curl -X DELETE http://localhost:3030/api/images/products/image-123.jpg
```

## 🐳 Docker Commands

### Volume Management
```bash
# Inspect volume
docker volume inspect daikin_upload_data

# Backup
docker run --rm -v daikin_upload_data:/uploads -v $(pwd):/backup alpine \
  tar czf /backup/images-backup.tar.gz -C /uploads .

# Restore
docker run --rm -v daikin_upload_data:/uploads -v $(pwd):/backup alpine \
  tar xzf /backup/images-backup.tar.gz -C /uploads

# Check size
docker exec daikin-app du -sh /uploads/*
```

### Container Management
```bash
# View logs
docker logs -f daikin-app

# Restart
docker compose restart app

# Rebuild
docker compose build --no-cache app
docker compose up -d
```

## ⚙️ Environment Variables

```env
UPLOAD_DIR=/uploads
IMAGE_SERVICE_URL=http://your-domain:3030
```

## 🎯 Response Examples

### Upload Success
```json
{
  "url": "http://localhost:3030/api/images/products/img-1700000000000.jpg",
  "filename": "img-1700000000000.jpg",
  "folder": "products",
  "size": 245678
}
```

### List Images
```json
{
  "images": [{
    "filename": "img-1700000000000.jpg",
    "url": "http://localhost:3030/api/images/products/img-1700000000000.jpg",
    "size": 245678,
    "created": "2024-11-23T10:00:00.000Z"
  }],
  "count": 1
}
```

## 🔍 Troubleshooting

| Issue | Solution |
|-------|----------|
| Images not persisting | Check volume: `docker volume ls` |
| Upload fails | Check logs: `docker logs daikin-app` |
| Permission denied | Verify `/uploads` permissions in container |
| Cannot access image | Verify `IMAGE_SERVICE_URL` is correct |

## 📚 Full Documentation

- [Complete API Docs](./IMAGE_UPLOAD_SERVICE.md)
- [Integration Guide](./ADMIN_API_IMAGE_INTEGRATION.md)
- [Implementation Summary](./IMAGE_SERVICE_SUMMARY.md)

## ✅ Quick Test

```bash
# 1. Upload
IMAGE_URL=$(curl -X POST http://localhost:3030/api/images/upload \
  -F "file=@test.jpg" \
  -F "folder=products" | jq -r '.url')

# 2. Verify upload
curl -I $IMAGE_URL

# 3. List
curl http://localhost:3030/api/images/list?folder=products

# 4. Delete
curl -X DELETE $IMAGE_URL
```

---

**Quick Tip**: Always upload images first, then use the returned URL in your create/update API calls!
