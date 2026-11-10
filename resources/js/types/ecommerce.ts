export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'shop_owner' | 'customer';
    shop?: Shop | null;
}

export interface Category {
    id: number;
    parent_id?: number | null;
    name: string;
    slug: string;
    icon?: string | null;
    icon_url?: string | null;
    products_count?: number;
    children_count?: number;
    children?: Category[];
    parent?: Category | null;
}

export interface Shop {
    id: number;
    user_id: number;
    name: string;
    slug: string;
    email?: string | null;
    description?: string | null;
    logo?: string | null;
    logo_url?: string | null;
    banner?: string | null;
    banner_url?: string | null;
    phone?: string | null;
    address?: string | null;
    is_active: boolean;
    is_verified?: boolean;
    shop_products_count?: number;
    owner?: User | null;
}

export interface Product {
    id: number;
    user_id: number;
    category_id: number;
    subcategory_id?: number | null;
    title: string;
    slug: string;
    sku: string;
    base_price: string | number;
    compare_price?: string | number | null;
    description?: string | null;
    thumbnail?: string | null;
    thumbnail_url?: string | null;
    thumb_url?: string | null;
    gallery?: string[] | null;
    gallery_urls?: string[];
    gallery_thumb_urls?: string[];
    is_approved: boolean;
    category?: Category;
    subcategory?: Category | null;
    creator?: User;
    created_by?: number;
    shops_count?: number;
    shop_products_count?: number;
    shop_products?: ShopProduct[];
}

export interface ShopProduct {
    id: number;
    shop_id: number;
    product_id: number;
    custom_price?: string | number | null;
    custom_compare_price?: string | number | null;
    custom_title?: string | null;
    custom_description?: string | null;
    custom_thumbnail?: string | null;
    custom_thumbnail_url?: string | null;
    custom_gallery?: string[] | null;
    stock_quantity: number;
    is_active: boolean;
    display_price: string | number;
    display_compare_price?: string | number | null;
    display_title: string;
    display_description?: string | null;
    display_thumbnail?: string | null;
    display_thumbnail_url?: string | null;
    display_thumb_url?: string | null;
    display_gallery?: string[];
    display_gallery_urls?: string[];
    display_gallery_thumb_urls?: string[];
    product?: Product;
    shop?: Shop;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    prev_page_url?: string | null;
    next_page_url?: string | null;
    links: {
        url?: string | null;
        label: string;
        active: boolean;
    }[];
}
