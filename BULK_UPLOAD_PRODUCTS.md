# Bulk Product Upload Feature

## Overview

The bulk upload feature allows administrators to upload multiple products at once using a JSON file. This is particularly useful for:
- Initial product catalog setup
- Mass product updates
- Migrating products from other systems
- Batch product operations

## How to Use

1. **Access the Feature**
   - Navigate to Dashboard → Products Management
   - Click the "Bulk Upload" button (next to "Add New Product")

2. **Prepare Your JSON File**
   - Create a JSON file containing an array of product objects
   - Each product must have `articleId` and `categorySlug`
   - See the sample format below or download the sample file from the dialog

3. **Upload the File**
   - Click "Select JSON File" in the bulk upload dialog
   - Choose your prepared JSON file
   - Review the file selection
   - Click "Upload File"

4. **Review Results**
   - After upload, you'll see a summary showing:
     - Number of products created
     - Number of products updated
     - Number of failed products
   - If there are errors, you can view detailed error messages for each failed product

## JSON Format

### Required Fields

- **articleId** (string): Unique product identifier
- **categorySlug** (string): Category slug (not category ID)

### Optional Fields

- **price** (number): Product price
- **slug** (string): URL-friendly product slug (auto-generated if not provided)
- **energyClass** (string): Energy efficiency class (A, B, C, D, E, F, or null)
- **isActive** (boolean): Whether the product is active (default: true)
- **featureIds** (array of strings): Array of feature IDs to associate with the product

### Nested Objects

#### translations (array)
Product details in multiple languages:
```json
{
  "locale": "en",
  "name": "Product Name",
  "title": "Product Title",
  "subtitle": "Optional subtitle"
}
```

#### specs (array)
Product specifications:
```json
{
  "locale": "en",
  "title": "Specification Name",
  "subtitle": "Specification Value"
}
```

#### images (array)
Product images by color variant:
```json
{
  "color": "White",
  "imgs": ["/path/to/image1.jpg", "/path/to/image2.jpg"],
  "url": ["/product/url1", "/product/url2"]
}
```

#### items (array)
Related product items (e.g., components, accessories):
```json
{
  "locale": "en",
  "title": "Item Name",
  "subtitle": "Item Description",
  "img": "/path/to/item.jpg",
  "isActive": true
}
```

## Sample JSON

```json
[
  {
    "articleId": "AC-2024-001",
    "price": 1299.99,
    "categorySlug": "air-conditioning",
    "slug": "premium-air-conditioner",
    "energyClass": "A",
    "isActive": true,
    "featureIds": ["feature-id-1", "feature-id-2"],
    "translations": [
      {
        "locale": "en",
        "name": "Premium Air Conditioner",
        "title": "High-Efficiency Cooling",
        "subtitle": "Perfect for large rooms"
      },
      {
        "locale": "pl",
        "name": "Klimatyzacja Premium",
        "title": "Wysokowydajne chłodzenie",
        "subtitle": "Idealny do dużych pomieszczeń"
      }
    ],
    "specs": [
      {
        "locale": "en",
        "title": "Cooling Capacity",
        "subtitle": "5.0 kW"
      },
      {
        "locale": "en",
        "title": "Energy Rating",
        "subtitle": "A+++"
      }
    ],
    "images": [
      {
        "color": "White",
        "imgs": ["/images/ac-white-1.jpg", "/images/ac-white-2.jpg"],
        "url": ["/products/premium-air-conditioner"]
      }
    ],
    "items": [
      {
        "locale": "en",
        "title": "Indoor Unit",
        "subtitle": "Wall-mounted",
        "img": "/images/indoor.jpg",
        "isActive": true
      }
    ]
  }
]
```

## Behavior

### Creating Products
- If a product with the given `articleId` doesn't exist, it will be created
- The category must exist in the database (referenced by `categorySlug`)
- Features (if provided) must exist in the database

### Updating Products
- If a product with the given `articleId` already exists, it will be updated
- All related data (translations, specs, images, items) will be replaced
- Features will be updated to match the provided `featureIds`

### Error Handling
- Products that fail validation will be skipped
- Other products in the batch will continue to process
- Detailed error messages are provided for each failed product
- Common errors:
  - Missing required fields (articleId, categorySlug)
  - Category not found
  - Feature not found
  - Duplicate slug conflict

## Important Notes

1. **Category Slug vs ID**: The API accepts `categorySlug` (not `categoryId`) to make it easier to reference categories by their human-readable identifier

2. **Transactions**: Updates are performed in transactions to ensure data consistency

3. **Validation**: Each product is validated before processing

4. **Performance**: Large batches may take time to process. The UI will show a loading indicator during upload

5. **File Size**: Keep JSON files reasonable in size. For very large catalogs, consider splitting into multiple files

6. **Backup**: Always backup your data before performing bulk operations

## API Endpoint

**POST** `/api/products/bulk-upload`

### Request Body
```json
{
  "products": [
    // Array of product objects
  ]
}
```

### Response
```json
{
  "success": true,
  "created": 10,
  "updated": 5,
  "failed": 2,
  "errors": [
    {
      "articleId": "FAILED-001",
      "error": "Category with slug 'invalid-category' not found"
    }
  ]
}
```

## Troubleshooting

### "Category not found" error
- Verify the category slug exists in your database
- Check for typos in the categorySlug field
- Ensure the category is active

### "Feature not found" error
- Verify all feature IDs exist in the database
- Check for typos in feature IDs
- Ensure features are active

### "Slug already exists" error
- Check if another product is using the same slug
- Either remove the slug field (it will auto-generate) or use a unique value

### File upload fails
- Ensure the file is valid JSON
- Check the file size isn't too large
- Verify you have admin permissions

## Best Practices

1. **Test First**: Start with a small batch to verify your JSON format is correct
2. **Use Sample**: Download and modify the sample JSON file provided in the UI
3. **Validate JSON**: Use a JSON validator before uploading
4. **Incremental Updates**: For large catalogs, upload in batches
5. **Review Errors**: Always check the error report after bulk upload
6. **Document Changes**: Keep a log of what was uploaded when

## Security

- Only users with **admin** role can perform bulk uploads
- All uploads are authenticated and authorized
- Validation is performed on all input data
- Transactions ensure data consistency
