# Categories Management Admin Page

This document describes the admin page for managing product categories.

## Location

- **Path**: `/dashboard/categories`
- **Access**: Admin users only
- **Component**: `src/app/[locale]/dashboard/categories/page.tsx`

## Features

### 1. **Table View**
The main view displays all categories in a structured table with the following columns:
- **Name**: The primary name of the category
- **Slug**: URL-friendly identifier (e.g., "air-conditioners")
- **Products Count**: Number of products in the category
- **Active Status**: Toggle switch to activate/deactivate categories
- **Actions**: Edit and Delete buttons

### 2. **Search Functionality**
- Real-time search by category name or slug
- Clear button to reset search
- Includes inactive categories in admin view

### 3. **Create Category**
Click the "Add New Category" button to open a dialog with:

#### Base Information:
- **Name**: Primary category name (auto-generates slug)
- **Slug**: URL-friendly identifier (can be manually edited)
- **Active Status**: Toggle to activate/deactivate

#### Translations (Multi-language Support):
Tabbed interface for three locales:
- **English (en)**
- **Polish (pl)**
- **Ukrainian (ua)**

Each translation includes:
- Translated name for that locale
- Active status toggle per translation

### 4. **Edit Category**
Click the edit (pencil) icon to modify:
- Base information (name, slug, active status)
- All translations for all supported locales
- Existing translations are pre-populated

### 5. **Delete Category**
Click the delete (trash) icon to remove a category:
- Confirmation dialog prevents accidental deletion
- **Protection**: Categories with products cannot be deleted
- Error message suggests removing products first

### 6. **Toggle Active Status**
Quick toggle switches in the table allow instant activation/deactivation without opening the edit dialog.

## Validation & Constraints

1. **Slug Uniqueness**: Each category must have a unique slug
2. **Cannot Delete with Products**: Categories containing products must be emptied first
3. **Required Fields**: Name and slug are required
4. **Auto-slug Generation**: Slug is automatically generated from name when creating

## Navigation

The Categories link appears in:
- **Desktop Sidebar**: Fixed left sidebar (admin users only)
- **Mobile Navigation**: Hamburger menu (admin users only)

Located between "Events" and "Benefits" in the admin navigation menu.

## API Integration

The page connects to the following endpoints:
- `GET /api/categories?includeInactive=true` - Fetch all categories
- `GET /api/categories?search=...` - Search categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category

## UI Components Used

- **Table**: `@/components/ui/table`
- **Dialog**: `@/components/ui/dialog`
- **Card**: `@/components/ui/card`
- **Button**: `@/components/ui/button`
- **Input**: `@/components/ui/input`
- **Switch**: `@/components/ui/switch`
- **Tabs**: `@/components/ui/tabs` (for translations)
- **ButtonGroup**: `@/components/ui/button-group`
- **Icons**: `lucide-react` (Plus, Pencil, Trash2, Search, Loader2, Layers)

## Translations

All UI text is internationalized using `next-intl`:
- Translation key: `dashboard.categories`
- Supported in: English, Polish, Ukrainian
- Files: 
  - `src/messages/en.json`
  - `src/messages/pl.json`
  - `src/messages/ua.json`

## Similar Implementation

This page follows the same pattern as:
- `/dashboard/benefits` - Benefits management page
- `/dashboard/users` - Users management page
- `/dashboard/orders` - Orders management page

## Example Usage

### Creating a Category with Translations

1. Click "Add New Category"
2. Enter base name: "Air Conditioners"
3. Slug auto-generates: "air-conditioners"
4. Switch to "Polski" tab, enter: "Klimatyzatory"
5. Switch to "Українська" tab, enter: "Кондиціонери"
6. Click "Create Category"

### Editing a Category

1. Click the pencil icon on any category row
2. Modify base information or translations
3. Click "Save Changes"

### Deactivating a Category

1. Toggle the "Active" switch in the table
2. Category is immediately updated

## Testing Checklist

- [ ] Admin users can access the page
- [ ] Non-admin users are redirected
- [ ] Search works correctly
- [ ] Create category with all translations
- [ ] Edit existing category
- [ ] Toggle active status
- [ ] Delete empty category (success)
- [ ] Try to delete category with products (should fail with error message)
- [ ] Slug uniqueness validation
- [ ] Mobile navigation includes Categories link
- [ ] Desktop sidebar includes Categories link

## Future Enhancements

Possible improvements:
1. Bulk operations (activate/deactivate multiple categories)
2. Category ordering/sorting
3. Category icons or images
4. Hierarchical categories (parent/child relationships)
5. Category descriptions with rich text editor
6. Import/export categories
