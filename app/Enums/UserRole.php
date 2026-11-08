<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case SHOP_OWNER = 'shop_owner';
    case CUSTOMER = 'customer';

    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Administrator',
            self::SHOP_OWNER => 'Shop Owner',
            self::CUSTOMER => 'Customer',
        };
    }
}
