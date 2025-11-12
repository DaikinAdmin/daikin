# Features Management Admin Page

This document describes the admin page for managing product features.

## Location

- **Path**: `/dashboard/features`
- **Access**: Admin users only
- **Component**: `src/app/[locale]/dashboard/features/page.tsx`

## Features

### 1. **Table View**
The main view displays all features in a structured table with the following columns:
- **Name**: The primary name of the feature
- **Image**: Image URL/path for the feature icon
- **Products Count**: Number of products using this feature
- **Active Status**: Toggle switch to activate/deactivate features
- **Actions**: Edit and Delete buttons

### 2. **Search Functionality**
- Real-time search by feature name
- Clear button to reset search
- Includes inactive features in admin view

### 3. **Create Feature**
Click the "Add New Feature" button to open a dialog with:

#### Base Information:
- **Name**: Primary feature name
- **Image URL**: Path to feature icon or image (e.g., `/icons/energy.svg`)
- **Active Status**: Toggle to activate/deactivate

#### Translations (Multi-language Support):
Tabbed interface for three locales:
- **English (en)**
- **Polish (pl)**
- **Ukrainian (ua)**

Each translation includes:
- Translated name for that locale
- Active status toggle per translation

### 4. **Edit Feature**
Click the edit (pencil) icon to modify:
- Base information (name, image, active status)
- All translations for all supported locales
- Existing translations are pre-populated

### 5. **Delete Feature**
Click the delete (trash) icon to remove a feature:
- Confirmation dialog prevents accidental deletion
- **Protection**: Features used by products cannot be deleted
- Error message suggests removing feature from products first or deactivating it

### 6. **Toggle Active Status**
Quick toggle switches in the table allow instant activation/deactivation without opening the edit dialog.

## Validation & Constraints

1. **Name Required**: Feature name is a required field
2. **Cannot Delete with Products**: Features used by products must be removed from products first
3. **Optional Image**: Image URL is optional
4. **Translation Flexibility**: Translations can be added for any or all locales

## Navigation

The Features link appears in:
- **Desktop Sidebar**: Fixed left sidebar (admin users only)
- **Mobile Navigation**: Hamburger menu (admin users only)

Located between "Categories" and "Benefits" in the admin navigation menu.

## Icon

Uses the **Sparkles** icon from lucide-react to represent features.

## API Integration

The page connects to the following endpoints:
- `GET /api/features?includeInactive=true` - Fetch all features
- `GET /api/features?search=...` - Search features
- `POST /api/features` - Create new feature
- `PUT /api/features/[id]` - Update feature
- `DELETE /api/features/[id]` - Delete feature

## UI Components Used

- **Table**: `@/components/ui/table`
- **Dialog**: `@/components/ui/dialog`
- **Card**: `@/components/ui/card`
- **Button**: `@/components/ui/button`
- **Input**: `@/components/ui/input`
- **Switch**: `@/components/ui/switch`
- **Tabs**: `@/components/ui/tabs` (for translations)
- **ButtonGroup**: `@/components/ui/button-group`
- **Icons**: `lucide-react` (Plus, Pencil, Trash2, Search, Loader2, Sparkles)

## Translations

All UI text is internationalized using `next-intl`:
- Translation key: `dashboard.features`
- Supported in: English, Polish, Ukrainian
- Files: 
  - `src/messages/en.json`
  - `src/messages/pl.json`
  - `src/messages/ua.json`

## Similar Implementation

This page follows the same pattern as:
- `/dashboard/categories` - Categories management page
- `/dashboard/benefits` - Benefits management page
- `/dashboard/users` - Users management page

## Example Usage

### Creating a Feature with Translations

1. Click "Add New Feature"
2. Enter base name: "Energy Efficient"
3. Enter image URL: "/icons/energy.svg"
4. Switch to "Polski" tab, enter: "Energooszczędny"
5. Switch to "Українська" tab, enter: "Енергоефективний"
6. Click "Create Feature"

### Editing a Feature

1. Click the pencil icon on any feature row
2. Modify base information or translations
3. Click "Save Changes"

### Deactivating a Feature

1. Toggle the "Active" switch in the table
2. Feature is immediately updated

## Feature Use Cases

Features are characteristics or highlights of products, such as:
- Energy Efficient
- Quiet Operation
- Smart Home Compatible
- Eco-Friendly Refrigerant
- Wi-Fi Enabled
- Air Purification
- Inverter Technology
- Sleep Mode
- Timer Function
- Remote Control

Products can have multiple features assigned to them to showcase their capabilities.

## Testing Checklist

- [ ] Admin users can access the page
- [ ] Non-admin users are redirected
- [ ] Search works correctly
- [ ] Create feature with all translations
- [ ] Edit existing feature
- [ ] Toggle active status
- [ ] Delete unused feature (success)
- [ ] Try to delete feature used by products (should fail with error message)
- [ ] Optional image field works correctly
- [ ] Mobile navigation includes Features link
- [ ] Desktop sidebar includes Features link

## Future Enhancements

Possible improvements:
1. Image upload functionality instead of URL input
2. Feature categories or grouping
3. Feature icons library/picker
4. Bulk operations (activate/deactivate multiple features)
5. Feature ordering/priority
6. Usage analytics (which features are most common)
7. Import/export features
8. Rich text descriptions for features

## Relationship with Products

Features have a many-to-many relationship with Products:
- A feature can be used by multiple products
- A product can have multiple features
- When creating/editing products, features can be selected from the available list
- Features are displayed on product pages to highlight key capabilities

## Best Practices

1. **Clear Naming**: Use descriptive, benefit-focused names (e.g., "Energy Saving" not "Feature 1")
2. **Consistent Icons**: Use meaningful icons that visually represent the feature
3. **Accurate Translations**: Ensure translations convey the same meaning across languages
4. **Regular Cleanup**: Deactivate unused features instead of deleting to maintain data integrity
5. **Feature Reuse**: Create general features that can apply to multiple products
