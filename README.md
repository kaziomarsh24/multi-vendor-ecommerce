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

- **Backend:** Laravel 13 (PHP 8.4+)
- **Frontend:** React 19, Inertia.js v3, TypeScript, Tailwind CSS
- **Database:** SQLite / MySQL / PostgreSQL
- **Testing:** Pest PHP (31 passing feature tests)

---

## Quick Start: Local Development

Choose either **Option 1 (Docker - Recommended)** for a zero-configuration containerized local environment, or **Option 2 (Native PHP & Composer)** to run directly on your host machine.

### Option 1: Local Setup with Docker (Recommended)

Pre-configured with PHP 8.5 FPM, MySQL 8.0, and Nginx. The automated container entrypoint automatically installs Composer dependencies, waits for MySQL, generates application keys, runs migrations with authentic seeders, and links storage.

```bash
# 1. Copy Docker-specific environment configuration
cp .env.docker.example .env

# 2. Copy local development override (maps HTTP to port 8080 & MySQL to 3307)
cp docker-compose.override.yml.example docker-compose.override.yml

# 3. Build and start containers in detached mode
docker compose up -d --build
```

Access the local storefront at `http://localhost:8080`.

---

### Option 2: Local Setup without Docker (Native PHP & Composer)

If you prefer running PHP, SQLite/MySQL, and Node.js directly on your local system:

```bash
# 1. Install PHP and Node dependencies
composer install
npm install

# 2. Copy local environment configuration & generate key
cp .env.example .env
php artisan key:generate

# 3. Run database migrations with sample data
php artisan migrate:fresh --seed

# 4. Build frontend production assets
npm run build

# 5. Start development servers
composer run dev
```

Access the local storefront at `http://localhost:8000`.

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

## Custom Packages Used

Two open-source packages I built (`thekaziomar/*`) are integrated into this project:

### 1. [`thekaziomar/laravel-smart-upload`](https://kaziomarsh24.github.io/laravel-smart-upload/)
- Automatically converts uploads to WebP format.
- Generates responsive thumbnail variants on upload.
- **Auto Storage Purge:** Models (`Shop`, `Product`, `Category`, `ShopProduct`) use the `HasUploadPurge` trait and declare `$purgeableFiles = ['logo', 'banner', 'thumbnail', 'gallery', 'image']` so old or replaced files are automatically deleted from storage whenever records are updated or deleted, preventing orphaned storage bloat.
- Documentation: [laravel-smart-upload documentation](https://kaziomarsh24.github.io/laravel-smart-upload/)

### 2. [`thekaziomar/laravel-atomic-cache`](https://kaziomarsh24.github.io/laravel-atomic-cache/)
- Enables tag-based caching on standard database cache drivers (MySQL / SQLite).
- **Atomic Locks:** Uses atomic locks to eliminate cache stampedes and dog-piling during concurrent traffic spikes.
- **Auto Cache Busting:** Models use the `AutoClearsCache` trait to invalidate their virtual tag versions on `saved` and `deleted` events.
- **Transactional Invalidation:** Defers cache clearing until database transaction commits (`DB::afterCommit`) when products or shop stock levels are updated.
- Documentation: [laravel-atomic-cache documentation](https://kaziomarsh24.github.io/laravel-atomic-cache/)

---

## Storefront URLs

- **Marketplace Home:** `http://localhost:8000/`
- **Dhanmondi Gadget Hub:** `http://localhost:8000/shops/dhanmondi-gadget-hub`
- **Jamuna Lifestyle & Mart:** `http://localhost:8000/shops/jamuna-lifestyle-mart`
- **Chittagong Digital Zone:** `http://localhost:8000/shops/chittagong-digital-zone`
- **Product Details & Shop Comparison:** `http://localhost:8000/products/keychron-k2-wireless-mechanical-keyboard-version-2`

---

## Production & SSL Deployment

The project is pre-configured for direct VPS deployment with automated Docker orchestration, Nginx reverse proxy, and Let's Encrypt SSL.

### Architecture Overview
- **Production (`docker-compose.yml`):** Base compose file mounts `docker/nginx/production.conf`, listening on port 80 (HTTP redirect + ACME challenge) and port 443 (HTTP/2 SSL). Pre-provisioned fallback certificates in `docker/certbot/conf/live/` guarantee Nginx boots immediately on brand-new servers without missing-certificate crashes.
- **Local Development (`docker-compose.override.yml`):** Automatically applied locally to mount `docker/nginx/default.conf` and map port `8080:80` without HTTPS overhead.

### 1. Configure Domain & Environment
On your production server:
- `.env`:
  ```env
  APP_ENV=production
  APP_DEBUG=false
  APP_URL=https://yourdomain.com
  FORWARD_HTTP_PORT=80
  FORWARD_HTTPS_PORT=443
  ```
- `docker/nginx/production.conf`:
  Replace `server_name _;` with your domain (e.g. `server_name yourdomain.com www.yourdomain.com;`).

### 2. Start Services
```bash
docker compose up -d --build
```
*(The container entrypoint automatically waits for MySQL, executes database migrations, seeds initial data, links storage, and caches configurations).*

### 3. Issue Trusted SSL Certificate (One-Time Command)
Once your domain DNS points to your server IP, obtain your Let's Encrypt SSL certificate:
```bash
# 1. Request SSL certificate via Certbot ACME challenge
docker compose run --rm --entrypoint certbot certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  -d yourdomain.com \
  -d www.yourdomain.com \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email

# 2. Update Nginx configuration with domain certificate paths
sed -i 's|/etc/letsencrypt/live/fullchain.pem|/etc/letsencrypt/live/yourdomain.com/fullchain.pem|g' docker/nginx/production.conf
sed -i 's|/etc/letsencrypt/live/privkey.pem|/etc/letsencrypt/live/yourdomain.com/privkey.pem|g' docker/nginx/production.conf

# 3. Restart Nginx to activate trusted SSL
docker compose restart nginx
```

*(The included `certbot` container automatically handles certificate renewals every 12 hours).*

---

## Testing

The project includes 31 feature tests covering authentication, RBAC authorization, shop management, catalog operations, inventory attachment, storefront isolation, and cache invalidation.

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
