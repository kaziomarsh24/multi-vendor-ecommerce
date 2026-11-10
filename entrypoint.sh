#!/bin/sh
set -e

# Auto-install composer dependencies if vendor is missing
if [ ! -f /var/www/vendor/autoload.php ]; then
    echo "vendor directory missing. Installing composer dependencies..."
    composer install --no-interaction --prefer-dist --optimize-autoloader
fi

# Wait for database
DB_HOST_CHECK=${DB_HOST:-db}
DB_PORT_CHECK=${DB_PORT:-3306}

if [ "$DB_CONNECTION" != "sqlite" ]; then
    echo "Waiting for database connection at ${DB_HOST_CHECK}:${DB_PORT_CHECK}..."
    while ! nc -z "${DB_HOST_CHECK}" "${DB_PORT_CHECK}"; do
        sleep 2
    done
    echo "Database connected successfully!"
fi

# Ensure .env exists and has an encryption key
if [ ! -f /var/www/.env ]; then
    echo ".env not found. Copying from .env.example..."
    cp /var/www/.env.example /var/www/.env
fi

if ! grep -q "^APP_KEY=base64:" /var/www/.env 2>/dev/null; then
    echo "APP_KEY is missing or empty. Generating application key..."
    php artisan key:generate --force || true
fi

# Ensure storage directories & permissions
mkdir -p /var/www/storage/framework/cache/data \
         /var/www/storage/framework/sessions \
         /var/www/storage/framework/views \
         /var/www/storage/app/public/products \
         /var/www/storage/app/public/categories \
         /var/www/storage/app/public/shops \
         /var/www/bootstrap/cache

chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Ensure public storage link exists
php artisan storage:link --force || true

# Migrations & seeders
if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "Running database migrations..."
    php artisan migrate --force
fi

if [ "$RUN_SEEDER" = "true" ]; then
    echo "Running database seeders..."
    php artisan db:seed --force
fi

# Production optimization
if [ "$APP_ENV" = "production" ]; then
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
fi

# Role based execution
role=${1}
if [ "$role" = "queue" ]; then
    shift
    exec php artisan "$@"
elif [ "$role" = "scheduler" ]; then
    shift
    exec "$@"
else
    exec php-fpm
fi
