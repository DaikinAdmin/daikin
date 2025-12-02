# Products Specifications and Items - Multiple Entry Support

## Overview
Updated the Products admin page to support adding multiple specifications and items per locale, matching the structure from the JSON product data format.

## Changes Made

### 1. Specifications Tab (`specifications-tab.tsx`)
**Previous Behavior:**
- Only one specification per locale
- Simple form with title and subtitle fields

**New Behavior:**
- Multiple specifications per locale
- Each specification is displayed in a card with:
  - Specification number header
  - Delete button
  - Title field (required)
  - Subtitle field (optional)
- "Add Specification" button at the bottom of each locale tab
- Empty state message when no specifications exist

**Key Features:**
- ✅ Add unlimited specifications per locale
- ✅ Remove individual specifications
- ✅ Each specification maintains its own title and subtitle
- ✅ Proper indexing for each specification within its locale

### 2. Items Tab (`product-items-tab.tsx`)
**Previous Behavior:**
- Only one item per locale
- Simple form with title, subtitle, image URL, and active toggle

**New Behavior:**
- Multiple items per locale
- Each item is displayed in a card with:
  - Item number header
  - Delete button
  - Title field (required)
  - Subtitle field (optional)
  - Image URL field
  - Active toggle
- "Add Item" button at the bottom of each locale tab
- Empty state message when no items exist

**Key Features:**
- ✅ Add unlimited items per locale
- ✅ Remove individual items
- ✅ Each item maintains its own title, subtitle, image, and active state
- ✅ Proper indexing for each item within its locale

### 3. Translation Updates
Added new translation keys to support the enhanced functionality:

**English (`en.json`):**
```json
"addSpecification": "Add Specification",
"noSpecsYet": "No specifications added yet",
"specification": "Specification",
"noItemsYet": "No items added yet",
"item": "Item"
```

**Polish (`pl.json`):**
```json
"addSpecification": "Dodaj specyfikację",
"noSpecsYet": "Nie dodano jeszcze specyfikacji",
"specification": "Specyfikacja",
"noItemsYet": "Nie dodano jeszcze elementów",
"item": "Element"
```

**Ukrainian (`ua.json`):**
```json
"addSpecification": "Додати специфікацію",
"noSpecsYet": "Специфікації ще не додано",
"specification": "Специфікація",
"noItemsYet": "Елементи ще не додано",
"item": "Елемент"
```

## Product JSON Structure Reference

Based on the provided `product.json` file, the expected data structure is:

```json
{
  "name": "Emura",
  "specs": [
    {
      "title": "Ciśnienie akustyczne",
      "subtitle": "do 19dBA"
    },
    {
      "title": "Etykieta energetyczna",
      "subtitle": "najwyższa efektywność energetyczna A+++"
    },
    // ... more specs
  ],
  "items": [
    {
      "title": "Jednostka wewnętrzna",
      "subtitle": "Ikonicznie zaprojektowana jednostka naścienna.",
      "image": "https://example.com/image.jpg"
    },
    {
      "title": "Jednostka zewnętrzna",
      "subtitle": "Pasuje na Twój dach...",
      "image": "https://example.com/image2.jpg"
    },
    // ... more items
  ]
}
```

## User Interface

### Specifications Tab
```
┌─────────────────────────────────────┐
│ English │ Polski │ Українська        │
├─────────────────────────────────────┤
│                                     │
│ ┌─ Specification #1 ─────────── ✕ │
│ │ Title * [Cooling Capacity     ] │
│ │ Subtitle [3.5 kW              ] │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─ Specification #2 ─────────── ✕ │
│ │ Title * [Energy Label         ] │
│ │ Subtitle [A+++                ] │
│ └─────────────────────────────────┘ │
│                                     │
│ [+ Add Specification]               │
└─────────────────────────────────────┘
```

### Items Tab
```
┌─────────────────────────────────────┐
│ English │ Polski │ Українська        │
├─────────────────────────────────────┤
│                                     │
│ ┌─ Item #1 ──────────────────── ✕ │
│ │ Title * [Indoor Unit          ] │
│ │ Subtitle [Wall-mounted unit   ] │
│ │ Image URL [/images/indoor.jpg ] │
│ │ ☑ Active                        │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─ Item #2 ──────────────────── ✕ │
│ │ Title * [Outdoor Unit         ] │
│ │ Subtitle [Fits on roof/wall   ] │
│ │ Image URL [/images/outdoor.jpg] │
│ │ ☑ Active                        │
│ └─────────────────────────────────┘ │
│                                     │
│ [+ Add Item]                        │
└─────────────────────────────────────┘
```

## Technical Implementation

### Data Flow
1. **Component State**: Both tabs maintain an array of specs/items
2. **Add Operation**: Appends new spec/item with the selected locale
3. **Remove Operation**: Filters out the item at the specified index
4. **Update Operation**: Updates the specific item at the given index
5. **Locale Filtering**: Displays only specs/items for the active locale tab

### Index Management
The components use a two-level indexing system:
- **Local Index**: Position within the current locale (for display)
- **Global Index**: Position in the complete array (for updates/deletes)

This ensures proper data management when switching between locale tabs.

## Benefits

1. **Flexibility**: Products can have as many specifications and items as needed
2. **Localization**: Each locale can have different numbers of specs/items
3. **User Experience**: Clear visual hierarchy with numbered cards and delete buttons
4. **Data Integrity**: Proper indexing ensures no data loss when editing
5. **Empty States**: Clear messaging when no data exists yet

## Testing Recommendations

1. Add multiple specifications in English tab
2. Switch to Polish tab and add different number of specifications
3. Delete individual specifications and verify correct removal
4. Repeat for Items tab
5. Save product and verify all specs/items are persisted correctly
6. Edit product and verify all specs/items load correctly

## Related Files

- `/src/components/dashboard/products/specifications-tab.tsx`
- `/src/components/dashboard/products/product-items-tab.tsx`
- `/src/messages/en.json`
- `/src/messages/pl.json`
- `/src/messages/ua.json`
- `/src/app/[locale]/dashboard/products/page.tsx`

## Date
November 24, 2025
