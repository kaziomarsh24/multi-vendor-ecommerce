# CSN Multi-Shop E-Commerce Platform

A multi-vendor e-commerce platform built with Laravel, Inertia.js, React, and TypeScript featuring a centralized master catalog and independent shop inventories.

---

## Architecture Overview

This platform implements a centralized Master Catalog model with distributed Shop Inventories:

1. **Central Master Catalog:** Platform administrators define global master products with base reference prices, specifications, categories, and master image galleries.
2. **Shop Inventory & Custom Pricing:** Verified shop owners (e.g., Dhanmondi Gadget Hub, Jamuna Lifestyle & Mart) can browse the shared master catalog, stock any item with one click, and override the title, selling price, compare price, and local stock quantity.
3. **Shared Catalog Expansion:** When a shop owner creates a new product, it is added to the central master catalog for all merchants to browse and stock, while being immediately attached to the creator's inventory.
4. **Storefront Isolation:** Customers can browse the central marketplace or individual shop storefronts. On a shop's storefront, customers only see products stocked by that specific merchant at their custom prices.
5. **Multi-Shop Price Comparison:** On product pages, customers can compare prices across all verified shops stocking that product.

---

## Tech Stack

- **Backend:** Laravel 12 (PHP 8.3+)
- **Frontend:** React 19, Inertia.js v3, TypeScript, Tailwind CSS
- **Database:** SQLite / MySQL / PostgreSQL
- **Testing:** Pest PHP (28 passing feature tests)

---

## Setup & Installation

Clone the repository and run the following commands:

```bash
# 1. Install dependencies
composer install
npm install

# 2. Environment configuration
cp .env.example .env
php artisan key:generate

# 3. Database migration & seeding
php artisan migrate:fresh --seed

# 4. Build frontend assets
npm run build

# 5. Start development server (runs artisan serve, queue & vite)
composer run dev
```

Access the application at `http://localhost:8000`.

---

## Demo Credentials

All seeded accounts use the password: `password`

| Role | Email | Password | Default Portal | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@csn.com` | `password` | `/admin` | Master catalog, categories, and shops management |
| **Shop Owner 1** | `owner1@csn.com` | `password` | `/owner/inventory` | Dhanmondi Gadget Hub (6 stocked items) |
| **Shop Owner 2** | `owner2@csn.com` | `password` | `/owner/inventory` | Jamuna Lifestyle & Mart (4 stocked items) |
| **Shop Owner 3** | `owner3@csn.com` | `password` | `/owner/inventory` | Chittagong Digital Zone (0 stocked items - empty state) |
| **Customer** | `customer@csn.com` | `password` | `/` | Standard customer account |

---

## Packages Used

### 1. `thekaziomar/laravel-smart-upload`
- **Purpose:** File upload handling and storage lifecycle management.
- **Implementation:** Integrated via the `HasUploadPurge` trait in `Shop`, `ShopProduct`, `Product`, and `Category` models.
- **Why it is used:** Automatically purges replaced or deleted image files (thumbnails, galleries, shop logos, and banners) from the disk upon record update or deletion, preventing orphaned storage bloat.

### 2. `thekaziomar/laravel-atomic-cache`
- **Purpose:** High-performance caching and atomic invalidation engine.
- **Implementation:** Used across storefront controllers (`HomeController`, `ShopController`, `ProductController`) for high-concurrency caching.
- **Why it is used:** Eliminates cache stampedes during concurrent traffic with atomic locks, provides virtual tag caching for non-Redis stores, and defers cache invalidation to database transaction commits (`DB::afterCommit`) when products or shop stocks are updated.

---

## Storefront URLs

- **Marketplace Home:** `http://localhost:8000/`
- **Dhanmondi Gadget Hub:** `http://localhost:8000/shops/dhanmondi-gadget-hub`
- **Jamuna Lifestyle & Mart:** `http://localhost:8000/shops/jamuna-lifestyle-mart`
- **Chittagong Digital Zone:** `http://localhost:8000/shops/chittagong-digital-zone`
- **Product Details & Shop Comparison:** `http://localhost:8000/products/keychron-k2-wireless-mechanical-keyboard`

---

## Testing

The project includes 28 feature tests covering authentication, RBAC authorization, shop management, catalog operations, inventory attachment, storefront isolation, and cache invalidation.

```bash
php artisan test
```

To run code style checks:

```bash
composer lint:check
```

---

## License

This project is open-source software licensed under the MIT License.
