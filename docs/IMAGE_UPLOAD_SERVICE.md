# Image Upload Service

## Overview
This service provides image upload, storage, and retrieval functionality with Docker volume persistence on your VPS.

## Features
- ✅ Upload images with automatic timestamp-based naming to avoid duplicates
- ✅ Organize images into custom folders
- ✅ Retrieve images via URL
- ✅ List all images and folders
- ✅ Delete images
- ✅ Persistent storage with Docker volumes
- ✅ Support for multiple image formats (JPEG, PNG, GIF, WebP, SVG)

## API Endpoints

### 1. Upload Image
**POST** `/api/images/upload`

Upload an image file with optional folder organization.

**Request:**
```bash
curl -X POST http://your-domain.com:3030/api/images/upload \
  -F "file=@/path/to/image.jpg" \
  -F "folder=products"
```

**Response:**
```json
{
  "success": true,
  "url": "http://your-domain.com:3030/api/images/products/image-1700000000000.jpg",
  "filename": "image-1700000000000.jpg",
  "folder": "products",
  "size": 245678,
  "type": "image/jpeg"
}
```

**Parameters:**
- `file` (required): Image file to upload
- `folder` (optional): Folder name to organize images (default: "general")

---

### 2. Get Image
**GET** `/api/images/{folder}/{filename}`

Retrieve an uploaded image.

**Example:**
```bash
curl http://your-domain.com:3030/api/images/products/image-1700000000000.jpg
```

Returns the image file with appropriate content-type headers.

---

### 3. Delete Image
**DELETE** `/api/images/{folder}/{filename}`

Delete an uploaded image.

**Example:**
```bash
curl -X DELETE http://your-domain.com:3030/api/images/products/image-1700000000000.jpg
```

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

---

### 4. List Images
**GET** `/api/images/list?folder={folder}`

List all images in a specific folder or all images.

**Examples:**
```bash
# List all images in "products" folder
curl http://your-domain.com:3030/api/images/list?folder=products

# List all images in root
curl http://your-domain.com:3030/api/images/list
```

**Response:**
```json
{
  "images": [
    {
      "filename": "product-1700000000000.jpg",
      "url": "http://your-domain.com:3030/api/images/products/product-1700000000000.jpg",
      "size": 245678,
      "created": "2024-11-23T10:00:00.000Z",
      "modified": "2024-11-23T10:00:00.000Z"
    }
  ],
  "folder": "products",
  "count": 1
}
```

---

### 5. List Folders
**GET** `/api/images/folders`

List all available folders.

**Example:**
```bash
curl http://your-domain.com:3030/api/images/folders
```

**Response:**
```json
{
  "folders": ["products", "categories", "banners", "general"],
  "count": 4
}
```

---

### 6. Create Folder
**POST** `/api/images/folders`

Create a new folder for organizing images.

**Example:**
```bash
curl -X POST http://your-domain.com:3030/api/images/folders \
  -H "Content-Type: application/json" \
  -d '{"folder": "new-category"}'
```

**Response:**
```json
{
  "success": true,
  "folder": "new-category",
  "path": "/uploads/new-category"
}
```

---

### 7. Get Upload Configuration
**GET** `/api/images/upload`

Get current upload service configuration.

**Example:**
```bash
curl http://your-domain.com:3030/api/images/upload
```

**Response:**
```json
{
  "uploadDir": "/uploads",
  "baseUrl": "http://your-domain.com:3030",
  "maxFileSize": "10MB",
  "allowedTypes": ["image/jpeg", "image/png", "image/gif", "image/webp"]
}
```

## Environment Variables

Add these to your `.env` file:

```env
# Image Upload Service Configuration
UPLOAD_DIR=/uploads
IMAGE_SERVICE_URL=http://your-domain.com:3030
```

**Variables:**
- `UPLOAD_DIR`: Directory path for storing uploaded images (default: `/uploads`)
- `IMAGE_SERVICE_URL`: Base URL for generating image URLs (default: `http://localhost:3030`)

## Docker Setup

The service is configured with a persistent Docker volume to ensure images are not lost when containers restart.

### Volume Configuration
In `docker-compose.yml`:
```yaml
volumes:
  - upload_data:/uploads
```

### Volume Management

**View volume details:**
```bash
docker volume inspect daikin_upload_data
```

**Backup images:**
```bash
docker run --rm -v daikin_upload_data:/uploads -v $(pwd):/backup alpine tar czf /backup/images-backup.tar.gz -C /uploads .
```

**Restore images:**
```bash
docker run --rm -v daikin_upload_data:/uploads -v $(pwd):/backup alpine tar xzf /backup/images-backup.tar.gz -C /uploads
```

**View images in volume:**
```bash
docker run --rm -v daikin_upload_data:/uploads alpine ls -lR /uploads
```

## Deployment

1. **Update environment variables** in your `.env` file with your domain/IP:
   ```env
   IMAGE_SERVICE_URL=http://your-vps-ip:3030
   ```

2. **Rebuild and restart containers:**
   ```bash
   docker compose down
   docker compose build --no-cache
   docker compose up -d
   ```

3. **Verify the service is running:**
   ```bash
   curl http://your-vps-ip:3030/api/images/upload
   ```

## Usage Examples

### JavaScript/TypeScript (Client-side)

```typescript
// Upload image
async function uploadImage(file: File, folder: string = 'general') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const response = await fetch('/api/images/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  return data.url; // Use this URL in your application
}

// Example usage
const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
const file = fileInput.files?.[0];
if (file) {
  const imageUrl = await uploadImage(file, 'products');
  console.log('Image URL:', imageUrl);
  // Store imageUrl in your database
}
```

### React Component Example

```tsx
import { useState } from 'react';

export function ImageUploader() {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'products');

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setImageUrl(data.url);
      console.log('Upload successful:', data);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      {imageUrl && (
        <div>
          <p>Image uploaded successfully!</p>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '300px' }} />
          <p>URL: {imageUrl}</p>
        </div>
      )}
    </div>
  );
}
```

### cURL Examples

```bash
# Upload product image
curl -X POST http://your-domain.com:3030/api/images/upload \
  -F "file=@product.jpg" \
  -F "folder=products"

# Upload banner image
curl -X POST http://your-domain.com:3030/api/images/upload \
  -F "file=@banner.png" \
  -F "folder=banners"

# List all product images
curl http://your-domain.com:3030/api/images/list?folder=products

# Get specific image
curl http://your-domain.com:3030/api/images/products/product-1700000000000.jpg -o downloaded-image.jpg

# Delete image
curl -X DELETE http://your-domain.com:3030/api/images/products/old-product-1700000000000.jpg
```

## File Naming Convention

All uploaded files are automatically renamed with the following pattern:
```
{original-filename-without-extension}-{timestamp}.{extension}
```

**Examples:**
- `product.jpg` → `product-1700000000000.jpg`
- `banner-image.png` → `banner-image-1700000000000.png`
- `logo.svg` → `logo-1700000000000.svg`

This ensures no filename conflicts even if the same file is uploaded multiple times.

## Security Considerations

1. **File Type Validation**: Only image files are accepted (JPEG, PNG, GIF, WebP, SVG)
2. **Path Traversal Protection**: Folder and filename inputs are sanitized
3. **File Size**: Consider adding file size limits in production
4. **Authentication**: Consider adding authentication middleware for upload endpoints
5. **Rate Limiting**: Consider implementing rate limiting to prevent abuse

## Troubleshooting

### Images not persisting after container restart
- Verify the volume is properly mounted in `docker-compose.yml`
- Check volume status: `docker volume ls`

### Upload fails with 500 error
- Check container logs: `docker logs daikin-app`
- Verify `/uploads` directory permissions
- Ensure `UPLOAD_DIR` environment variable is set

### Cannot access images via URL
- Verify `IMAGE_SERVICE_URL` matches your domain/IP
- Check that port 3030 is accessible
- Ensure images were uploaded successfully

### Permission denied errors
- The upload directory is owned by user `nextjs` (UID 1001)
- Check Dockerfile permissions are correctly set

## Monitoring

Check upload service health:
```bash
# View container logs
docker logs -f daikin-app

# Check storage usage
docker exec daikin-app du -sh /uploads/*

# List all uploaded files
docker exec daikin-app find /uploads -type f
```

## Maintenance

### Cleanup old images
```bash
# Remove images older than 30 days
docker exec daikin-app find /uploads -type f -mtime +30 -delete
```

### Check disk usage
```bash
docker system df -v
```
