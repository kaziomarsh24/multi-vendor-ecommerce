import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import ShopOwnerLayout from '@/layouts/ShopOwnerLayout';
import Pagination from '@/components/Pagination';
import AttachProductModal from '@/components/shop-owner/AttachProductModal';
import CreateSharedProductModal from '@/components/shop-owner/CreateSharedProductModal';
import EditSharedProductModal from '@/components/shop-owner/EditSharedProductModal';
import {
    Search,
    Plus,
    CheckCircle2,
    Edit3,
} from 'lucide-react';
import type { Shop, Product, Category, PaginatedData, User } from '@/types/ecommerce';

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

export default function SharedCatalog({ shop, products, existingProductIds, categories, filters }: SharedCatalogProps) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const currentUserId = auth?.user?.id;

    // Modal state
    const [attachingProduct, setAttachingProduct] = useState<Product | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingMasterProduct, setEditingMasterProduct] = useState<Product | null>(null);

    const formatBDT = (amount: string | number | null | undefined) => {
        if (!amount) return '৳0';
        return `৳${Number(amount).toLocaleString('en-US')}`;
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = formData.get('search') as string;
        router.get('/owner/catalog', { ...filters, search }, { preserveState: true });
    };

    const handleCategoryChange = (catId: string) => {
        router.get('/owner/catalog', { ...filters, category: catId || undefined }, { preserveState: true });
    };

    return (
        <ShopOwnerLayout title={`${shop.name} | Shared Master Catalog`}>
            <Head title="Master Catalog" />

            {/* Header info */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Shared Master Catalog</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Browse platform-wide products. Attach any item to <span className="font-bold text-gray-700">{shop.name}</span> with custom pricing & stock.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer self-start md:self-auto"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create New Product</span>
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <form onSubmit={handleSearch} className="relative w-full sm:w-80">
                    <input
                        type="text"
                        name="search"
                        defaultValue={filters.search || ''}
                        placeholder="Search products by title or SKU..."
                        className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-600 outline-none"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </form>

                <div className="w-full sm:w-auto flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">Category:</span>
                    <select
                        value={filters.category || ''}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="text-xs border border-gray-300 rounded-lg px-3 py-2 text-gray-700 outline-none flex-1 sm:flex-initial"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {products.data.map((p) => {
                    const isInShop = existingProductIds.includes(p.id);
                    const isCreatedByMe = p.created_by === currentUserId;

                    return (
                        <div
                            key={p.id}
                            className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                        >
                            <div>
                                {/* Product Image */}
                                <div className="aspect-square bg-gray-50 rounded-xl mb-3 p-4 flex items-center justify-center border border-gray-100 relative group overflow-hidden">
                                    <img
                                        src={p.thumbnail_url || '/images/placeholder-product.svg'}
                                        alt={p.title}
                                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = '/images/placeholder-product.svg';
                                        }}
                                    />
                                    {isCreatedByMe && (
                                        <span className="absolute top-2 left-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                                            My Product
                                        </span>
                                    )}
                                </div>

                                {/* Category Tag */}
                                <div className="text-[11px] font-semibold text-blue-600 mb-1 uppercase tracking-wider">
                                    {p.category?.name || 'General'}
                                </div>

                                {/* Title */}
                                <h3 className="text-xs font-bold text-gray-900 leading-snug line-clamp-2 min-h-[32px] mb-2">
                                    {p.title}
                                </h3>

                                {/* Master Base Price */}
                                <div className="text-xs text-gray-500 mb-4">
                                    Base Price: <span className="font-bold text-gray-900">{formatBDT(p.base_price)}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                                {isInShop ? (
                                    <Link
                                        href="/owner/inventory"
                                        className="flex-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>View in Inventory</span>
                                    </Link>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setAttachingProduct(p)}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>+ Add to Shop</span>
                                    </button>
                                )}

                                {isCreatedByMe && (
                                    <button
                                        type="button"
                                        onClick={() => setEditingMasterProduct(p)}
                                        className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition cursor-pointer"
                                        title="Edit Product Details"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" />
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
