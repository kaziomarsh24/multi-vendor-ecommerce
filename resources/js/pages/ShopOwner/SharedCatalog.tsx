import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import ShopOwnerLayout from '@/layouts/ShopOwnerLayout';
import Pagination from '@/components/Pagination';
import AttachProductModal from '@/components/shop-owner/AttachProductModal';
import CreateSharedProductModal from '@/components/shop-owner/CreateSharedProductModal';
import EditSharedProductModal from '@/components/shop-owner/EditSharedProductModal';
import { Search, Plus, CheckCircle2, Edit3 } from 'lucide-react';
import type {
    Shop,
    Product,
    Category,
    PaginatedData,
    User,
} from '@/types/ecommerce';

interface SharedCatalogProps {
    shop: Shop;
    products: PaginatedData<Product>;
    existingProductIds: number[];
    categories: (Category & { children?: Category[] })[];
    filters: {
        category?: string;
        search?: string;
    };
}

export default function SharedCatalog({
    shop,
    products,
    existingProductIds,
    categories,
    filters,
}: SharedCatalogProps) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const currentUserId = auth?.user?.id;

    // Modal state
    const [attachingProduct, setAttachingProduct] = useState<Product | null>(
        null,
    );
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingMasterProduct, setEditingMasterProduct] =
        useState<Product | null>(null);

    const formatBDT = (amount: string | number | null | undefined) => {
        if (!amount) return '৳0';
        return `৳${Number(amount).toLocaleString('en-US')}`;
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = formData.get('search') as string;
        router.get(
            '/owner/catalog',
            { ...filters, search },
            { preserveState: true },
        );
    };

    const handleCategoryChange = (catId: string) => {
        router.get(
            '/owner/catalog',
            { ...filters, category: catId || undefined },
            { preserveState: true },
        );
    };

    return (
        <ShopOwnerLayout title={`${shop.name} | Shared Master Catalog`}>
            <Head title="Master Catalog" />

            {/* Header info */}
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h2 className="text-xl font-extrabold tracking-tight text-gray-900">
                        Shared Master Catalog
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-500">
                        Browse platform-wide products. Attach any item to{' '}
                        <span className="font-bold text-gray-700">
                            {shop.name}
                        </span>{' '}
                        with custom pricing & stock.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex cursor-pointer items-center gap-1.5 self-start rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 md:self-auto"
                >
                    <Plus className="h-4 w-4" />
                    <span>Create New Product</span>
                </button>
            </div>

            {/* Filter Bar */}
            <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:flex-row">
                <form
                    onSubmit={handleSearch}
                    className="relative w-full sm:w-80"
                >
                    <input
                        type="text"
                        name="search"
                        defaultValue={filters.search || ''}
                        placeholder="Search products by title or SKU..."
                        className="w-full rounded-lg border border-gray-300 py-2 pr-3 pl-9 text-xs outline-none focus:ring-1 focus:ring-blue-600"
                    />
                    <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                </form>

                <div className="flex w-full items-center gap-2 sm:w-auto">
                    <span className="text-xs font-medium text-gray-500">
                        Category:
                    </span>
                    <select
                        value={filters.category || ''}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-700 outline-none sm:flex-initial"
                    >
                        <option value="">All Categories</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products.data.map((p) => {
                    const isInShop = existingProductIds.includes(p.id);
                    const isCreatedByMe = p.created_by === currentUserId;

                    return (
                        <div
                            key={p.id}
                            className="flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition hover:shadow-md"
                        >
                            <div>
                                {/* Product Image */}
                                <div className="group relative mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-4">
                                    <img
                                        src={
                                            p.thumbnail_url ||
                                            '/images/placeholder-product.svg'
                                        }
                                        alt={p.title}
                                        className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
                                        onError={(e) => {
                                            (
                                                e.currentTarget as HTMLImageElement
                                            ).src =
                                                '/images/placeholder-product.svg';
                                        }}
                                    />
                                    {isCreatedByMe && (
                                        <span className="absolute top-2 left-2 rounded-full bg-purple-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                                            My Product
                                        </span>
                                    )}
                                </div>

                                {/* Category Tag */}
                                <div className="mb-1 text-[11px] font-semibold tracking-wider text-blue-600 uppercase">
                                    {p.category?.name || 'General'}
                                </div>

                                {/* Title */}
                                <h3 className="mb-2 line-clamp-2 min-h-[32px] text-xs leading-snug font-bold text-gray-900">
                                    {p.title}
                                </h3>

                                {/* Master Base Price */}
                                <div className="mb-4 text-xs text-gray-500">
                                    Base Price:{' '}
                                    <span className="font-bold text-gray-900">
                                        {formatBDT(p.base_price)}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                                {isInShop ? (
                                    <Link
                                        href="/owner/inventory"
                                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
                                    >
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        <span>View in Inventory</span>
                                    </Link>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setAttachingProduct(p)}
                                        className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        <span>+ Add to Shop</span>
                                    </button>
                                )}

                                {isCreatedByMe && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setEditingMasterProduct(p)
                                        }
                                        className="cursor-pointer rounded-lg bg-gray-100 p-2 text-gray-700 transition hover:bg-gray-200"
                                        title="Edit Product Details"
                                    >
                                        <Edit3 className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            <Pagination
                links={products.links}
                from={products.from}
                to={products.to}
                total={products.total}
                className="mt-6"
            />

            {/* Modular Modals */}
            <AttachProductModal
                shopName={shop.name}
                product={attachingProduct}
                onClose={() => setAttachingProduct(null)}
            />

            <CreateSharedProductModal
                isOpen={isCreateModalOpen}
                categories={categories}
                onClose={() => setIsCreateModalOpen(false)}
            />

            <EditSharedProductModal
                product={editingMasterProduct}
                categories={categories}
                onClose={() => setEditingMasterProduct(null)}
            />
        </ShopOwnerLayout>
    );
}
