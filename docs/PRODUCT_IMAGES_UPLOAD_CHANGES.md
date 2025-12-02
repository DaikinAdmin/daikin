# Product Images and Items Upload - Implementation Changes

## Summary

Updated the product creation/editing forms to use the image upload service with file upload components instead of manual URL input.

## Changes Made

### 1. Product Images Tab (`product-images-tab.tsx`)

**Previous Behavior:**
- Manual input of image paths (`/images/product-1.jpg`)
- Manual input of URLs (`https://example.com/image.jpg`)
- Separate arrays for `imgs` and `url`

**New Behavior:**
- Multi-file upload component (max 5 files)
- File size limit: 1MB per file
- Automatic upload to `/api/images/productImages/{filename}`
- Visual preview grid with thumbnails
- Hover-to-remove functionality
- Progress indicator during upload
- Validation:
  - Only image files accepted
  - File size validation (1MB max)
  - Maximum 5 images per color variant
- Both `imgs` and `url` arrays now populated with uploaded URLs

**Key Features:**
- Drag-and-drop style upload area
- Real-time preview with image thumbnails
- Error handling with user-friendly messages
- Upload progress tracking (current/total)
- Remove images before saving
- Disabled state during upload
- Responsive grid layout (2 cols mobile, 3 cols desktop)

### 2. Product Items Tab (`product-items-tab.tsx`)

**Previous Behavior:**
- Manual text input for image URL
- Field labeled "imageUrl"

**New Behavior:**
- Single file upload component
- File size limit: 1MB
- Automatic upload to `/api/images/productItems/{filename}`
- Visual preview with large aspect-ratio display
- Upload indicator with loading spinner
- Validation:
  - Only image files accepted
  - File size validation (1MB max)
- Remove and replace functionality

**Key Features:**
- Drag-and-drop style upload area
- Large preview image (aspect-video)
- Hover-to-remove button
- Upload loading state
- Error display per item
- Replace image by clicking upload area again

## API Endpoints Used

### Product Images
```
POST /api/images/upload
Content-Type: multipart/form-data

folder: "productImages"
file: <image file>
```

### Product Items
```
POST /api/images/upload
Content-Type: multipart/form-data

folder: "productItems"
file: <image file>
```

## User Workflow

### Adding Product Images

1. Admin clicks "Add Product" button
2. Navigates to Images tab
3. Enters color variant name
4. Clicks upload area (or selects files)
5. Selects up to 5 images (each max 1MB)
6. Images upload automatically with progress indicator
7. Preview thumbnails appear in grid
8. Can remove unwanted images by hovering and clicking X
9. Clicks "Add Image" to save the color variant with images
10. URLs are automatically stored in both `imgs` and `url` arrays

### Adding Product Items

1. Admin navigates to Items tab
2. Selects language (EN/PL/UA)
3. Clicks "Add Item"
4. Fills in title and subtitle
5. Clicks upload area to select image
6. Image uploads automatically (max 1MB)
7. Large preview appears
8. Can replace by clicking upload area again
9. Can remove by hovering and clicking X
10. URL is automatically stored in `img` field

## Validation Rules

### File Type
- Only image files accepted (JPEG, PNG, GIF, WebP, SVG)
- Checked via `file.type.startsWith('image/')`

### File Size
- Maximum 1MB (1,048,576 bytes) per file
- Checked before upload attempt

### Quantity Limits
- **Product Images**: Maximum 5 images per color variant
- **Product Items**: 1 image per item

### Error Messages
- "File must be an image" - Non-image file selected
- "File size must be less than 1MB" - File too large
- "Maximum 5 images allowed" - Trying to upload more than 5
- Upload errors from API displayed directly

## Technical Details

### Dependencies
```typescript
import { uploadImage } from "@/lib/image-upload";
```

### State Management

**Product Images Tab:**
```typescript
const [uploading, setUploading] = useState(false);
const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
const [error, setError] = useState<string | null>(null);
```

**Product Items Tab:**
```typescript
const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
const [errors, setErrors] = useState<Record<number, string>>({});
```

### Upload Logic

**Product Images (Multiple Files):**
```typescript
const uploadedUrls: string[] = [];

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  const result = await uploadImage(file, { folder: 'productImages' });
  uploadedUrls.push(result.url);
  setUploadProgress({ current: i + 1, total: files.length });
}

setFormData({
  ...formData,
  imgs: [...formData.imgs, ...uploadedUrls],
  url: [...formData.url, ...uploadedUrls],
});
```

**Product Items (Single File):**
```typescript
const result = await uploadImage(file, { folder: 'productItems' });
handleChange(index, 'img', result.url);
```

## UI Components Used

### New Icons
- `Upload` - Upload button indicator
- `Loader2` - Loading spinner during upload
- `ImageIcon` - Placeholder for broken images
- `X` - Remove image button

### Existing Components
- `Label` - Form labels with file input binding
- `Input[type="file"]` - Hidden file input
- `Button` - Action buttons
- `Table` - List view of saved images

## Styling Classes

### Upload Area
```css
border-2 border-dashed rounded-md cursor-pointer hover:bg-accent transition-colors
```

### Preview Grid
```css
grid grid-cols-2 md:grid-cols-3 gap-4
```

### Image Container
```css
relative group aspect-square border rounded-lg overflow-hidden bg-muted
```

### Remove Button
```css
opacity-0 group-hover:opacity-100 transition-opacity
```

## Translation Keys

New translation keys needed:

```json
{
  "errorNotImage": "File must be an image",
  "errorFileSize": "File size must be less than 1MB",
  "errorMaxFiles": "Maximum {max} images allowed",
  "uploading": "Uploading...",
  "uploadImages": "Upload Images",
  "uploadImage": "Upload Image",
  "maxFilesReached": "Maximum of {max} images reached",
  "preview": "Preview",
  "image": "Image"
}
```

## Data Structure

### Before (Manual Input)
```typescript
{
  color: "white",
  imgs: ["/images/product-1.jpg"],
  url: ["https://example.com/image.jpg"]
}
```

### After (Upload Service)
```typescript
{
  color: "white",
  imgs: ["http://localhost:3030/api/images/productImages/image-1700000000000.jpg"],
  url: ["http://localhost:3030/api/images/productImages/image-1700000000000.jpg"]
}
```

## Benefits

1. **Better UX**: Visual upload with drag-and-drop feel
2. **Real Preview**: See images before saving
3. **Validation**: Automatic file type and size checking
4. **Progress**: Know upload status in real-time
5. **Consistency**: All images stored in same service
6. **Error Handling**: Clear error messages
7. **Accessibility**: Proper labels and ARIA attributes
8. **Responsive**: Works on mobile and desktop

## Testing Checklist

### Product Images Tab
- [ ] Upload single image (< 1MB)
- [ ] Upload multiple images (2-5)
- [ ] Try uploading 6+ images (should show error)
- [ ] Try uploading non-image file (should show error)
- [ ] Try uploading image > 1MB (should show error)
- [ ] Remove image before saving
- [ ] Upload progress shows correctly
- [ ] Preview thumbnails display
- [ ] Hover to remove works
- [ ] Save color variant with images
- [ ] Edit existing color variant
- [ ] Preview column in table shows thumbnails

### Product Items Tab
- [ ] Upload image for item (< 1MB)
- [ ] Try uploading non-image file (should show error)
- [ ] Try uploading image > 1MB (should show error)
- [ ] Large preview displays correctly
- [ ] Hover to remove works
- [ ] Replace existing image
- [ ] Upload for different locales (EN/PL/UA)
- [ ] Multiple items per locale work independently

## Migration Notes

**No database migration needed** - the data structure remains the same. The change is only in how URLs are populated (via upload instead of manual input).

Existing products with manually-entered URLs will continue to work as-is.

## Future Enhancements

Potential improvements:
1. Image cropping/editing before upload
2. Drag-and-drop file upload (HTML5 drag API)
3. Bulk upload from clipboard
4. Image optimization (resize, compress)
5. CDN integration
6. Thumbnail generation
7. Image metadata (alt text, captions)
