# Швидкий старт: Банери

## 1. Додавання банера через Dashboard

1. Перейдіть на `/dashboard/banners`
2. Натисніть "Додати банер"
3. Заповніть форму:
   - **URL зображення** - пряме посилання на зображення
   - **Посилання** (опціонально) - куди переходити при кліку
   - **Розміщення** - де відображати (home-hero, products-top тощо)
   - **Мова** - uk/en/ru
   - **Активний** - чи показувати банер
4. Натисніть "Створити"

## 2. Відображення на сайті

### Варіант А: Використання компонента

```tsx
import { BannerDisplay } from "@/components/banner-display";

// У вашому компоненті
<BannerDisplay 
  location="home-hero" 
  className="w-full h-[500px]"
/>
```

### Варіант Б: Кастомна логіка

```tsx
"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

export function MyBanners() {
  const locale = useLocale();
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    fetch(`/api/banners/public?locale=${locale}&location=home-hero`)
      .then(res => res.json())
      .then(data => setBanners(data));
  }, [locale]);

  return (
    <div>
      {banners.map(banner => (
        <div key={banner.id}>
          {banner.link ? (
            <a href={banner.link}>
              <img src={banner.img} alt="Banner" />
            </a>
          ) : (
            <img src={banner.img} alt="Banner" />
          )}
        </div>
      ))}
    </div>
  );
}
```

## 3. Доступні розміщення

- `home-hero` - Головна сторінка (великий банер)
- `home-top` - Головна сторінка (верх)
- `home-bottom` - Головна сторінка (низ)
- `products-top` - Сторінка продуктів (верх)
- `products-sidebar` - Сторінка продуктів (бокова панель)

Додайте свої варіанти у `LOCATIONS` в файлі `dashboard/banners/page.tsx`

## 4. API для розробників

### Отримати активні банери
```
GET /api/banners/public?locale=uk&location=home-hero
```

### Керування (admin only)
```
GET    /api/banners              # Всі банери
POST   /api/banners              # Створити
GET    /api/banners/[id]         # Один банер
PUT    /api/banners/[id]         # Оновити
DELETE /api/banners/[id]         # Видалити
```
