# Система управління банерами

## Огляд

Повноцінна система для управління банерами на сайті з адмін-панеллю та публічним API.

## База даних

### Таблиця Banners

```prisma
model Banners {
  id        String   @id @default(cuid())
  img       String
  link      String?
  location  String
  locale    String
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("banners")
}
```

**Поля:**
- `img` - URL зображення банера
- `link` - Посилання при кліку (необов'язкове)
- `location` - Розміщення банера на сайті (home-hero, home-top, products-top тощо)
- `locale` - Мова банера (uk, en, ru)
- `isActive` - Статус активності

## API Endpoints

### Admin API (потрібна авторизація як admin)

#### GET /api/banners
Отримання всіх банерів (для адміністрування)

**Query параметри:**
- `locale` (опціонально) - Фільтр по мові
- `location` (опціонально) - Фільтр по розміщенню
- `includeInactive` (опціонально) - Включити неактивні (true/false)

**Відповідь:**
```json
[
  {
    "id": "cuid123",
    "img": "https://example.com/banner.jpg",
    "link": "https://example.com/promo",
    "location": "home-hero",
    "locale": "uk",
    "isActive": true,
    "createdAt": "2026-01-16T07:29:51.000Z",
    "updatedAt": "2026-01-16T07:29:51.000Z"
  }
]
```

#### POST /api/banners
Створення нового банера

**Body:**
```json
{
  "img": "https://example.com/banner.jpg",
  "link": "https://example.com/promo",
  "location": "home-hero",
  "locale": "uk",
  "isActive": true
}
```

**Відповідь:** Створений об'єкт банера

#### GET /api/banners/[id]
Отримання одного банера за ID

**Відповідь:** Об'єкт банера

#### PUT /api/banners/[id]
Оновлення банера

**Body:** Часткове оновлення (будь-які поля з POST)

**Відповідь:** Оновлений об'єкт банера

#### DELETE /api/banners/[id]
Видалення банера

**Відповідь:**
```json
{
  "message": "Banner deleted successfully"
}
```

### Public API (без авторизації)

#### GET /api/banners/public
Отримання активних банерів для відображення на сайті

**Query параметри:**
- `locale` (обов'язковий) - Мова
- `location` (опціонально) - Розміщення

**Відповідь:**
```json
[
  {
    "id": "cuid123",
    "img": "https://example.com/banner.jpg",
    "link": "https://example.com/promo",
    "location": "home-hero",
    "locale": "uk"
  }
]
```

## Dashboard

### Сторінка управління
Розташування: `/dashboard/banners`

**Функціонал:**
- ✅ Перегляд всіх банерів у таблиці
- ✅ Фільтрація по мові та розміщенню
- ✅ Створення нового банера
- ✅ Редагування існуючого банера
- ✅ Видалення банера
- ✅ Превью зображення
- ✅ Вказівка посилання (опціонально)
- ✅ Вибір розміщення та мови
- ✅ Активація/деактивація

## Компонент для відображення

### BannerDisplay

Компонент для відображення банерів на клієнтській частині сайту.

**Використання:**

```tsx
import { BannerDisplay } from "@/components/banner-display";

// У будь-якому компоненті
<BannerDisplay 
  location="home-hero" 
  className="w-full h-[400px]"
/>
```

**Props:**
- `location` (обов'язковий) - Розміщення банера
- `className` (опціонально) - Додаткові CSS класи

Компонент автоматично:
- Отримує мову з контексту Next-Intl
- Завантажує відповідні активні банери
- Відображає зображення з посиланням (якщо є)
- Приховується, якщо немає банерів

## Типи розміщень (locations)

Попередньо визначені варіанти:
- `home-hero` - Головна сторінка (героїчний банер)
- `home-top` - Головна сторінка (верх)
- `home-bottom` - Головна сторінка (низ)
- `products-top` - Сторінка продуктів (верх)
- `products-sidebar` - Сторінка продуктів (бокова панель)

Можна додати свої варіанти у файлі `page.tsx`.

## Локалізація

Підтримувані мови:
- `uk` - Українська
- `en` - English
- `ru` - Русский

## Безпека

- Всі адміністративні операції (POST, PUT, DELETE) вимагають авторизації з роллю `admin`
- Public API повертає тільки активні банери
- Валідація обов'язкових полів на рівні API

## Міграція

Міграція створена автоматично:
```bash
npx prisma migrate dev --name add_banners_table
```

Файл: `prisma/migrations/20260116072951_add_banners_table/migration.sql`

## Приклади використання

### Додавання банера на головну сторінку

```tsx
// app/[locale]/page.tsx
import { BannerDisplay } from "@/components/banner-display";

export default function HomePage() {
  return (
    <div>
      <BannerDisplay location="home-hero" className="mb-8" />
      {/* Інший контент */}
    </div>
  );
}
```

### Програмне отримання банерів

```tsx
const response = await fetch('/api/banners/public?locale=uk&location=home-hero');
const banners = await response.json();
```

## Покращення у майбутньому

Можливі доповнення:
- 📸 Інтеграція з Image Upload Service для завантаження зображень
- 🎯 Планування показу банерів (дата початку/кінця)
- 📊 Аналітика кліків
- 🎨 Підтримка різних розмірів для різних пристроїв
- 🔄 Сортування та пріоритизація банерів
