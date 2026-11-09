import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import Pagination from '@/components/Pagination';
import AdminProductQuickModal from '@/components/admin/AdminProductQuickModal';
import AdminGalleryModal from '@/components/admin/AdminGalleryModal';
import {
    Layers,
    Plus,
    Search,
    Edit3,
    Trash2,
    CheckCircle2,
    Camera,
    Images,
} from 'lucide-react';
import type { Product, Category, PaginatedData } from '@/types/ecommerce';

interface CatalogProps {
    products: PaginatedData<Product>;
    categories: Category[];
    filters: {
        category?: string;
        search?: string;
    };
}

export default function AdminCatalog({ products, categories, filters }: CatalogProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [galleryProduct, setGalleryProduct] = useState<Product | null>(null);

    const formatBDT = (amount: string | number | null | undefined) => {
        if (!amount) return '৳0';
        return `৳${Number(amount).toLocaleString('en-US')}`;
    };

    const handleDelete = (p: Product) => {
        if (confirm(`Are you sure you want to delete "${p.title}" from the master catalog?`)) {
            router.delete(`/admin/catalog/${p.id}`);
        }
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = formData.get('search') as string;
        router.get('/admin/catalog', { ...filters, search }, { preserveState: true });
    };

    const handleCategoryFilter = (catId: string) => {
        router.get('/admin/catalog', { ...filters, category: catId || undefined }, { preserveState: true });
    };

    return (
        <AdminLayout title="Master Shared Catalog">
            <Head title="Master Catalog | Admin Console" />

            {/* Filter Toolbar */}
            <div className="bg-white rounded-xl p-4 border border-gray-3 shadow-2xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <form onSubmit={handleSearch} className="relative flex-1 md:w-72">
                        <input
                            type="text"
                            name="search"
                            defaultValue={filters.search || ''}
                            placeholder="Search catalog by title or SKU..."
                            className="w-full pl-9 pr-3.5 py-2 text-xs border border-gray-3 rounded-lg focus:outline-none focus:border-blue text-dark bg-white transition"
                        />
                        <Search className="w-4 h-4 text-dark-4 absolute left-3 top-2.5" />
                    </form>

                    <select
                        value={filters.category || ''}
                        onChange={(e) => handleCategoryFilter(e.target.value)}
                        className="text-xs border border-gray-3 rounded-lg px-3 py-2 text-dark bg-white outline-none focus:border-blue transition"
                    >
                        <option value="">All Categories</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2.5 w-full md:w-auto">
                    <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="w-full md:w-auto px-4 py-2 rounded-lg border border-gray-3 hover:border-blue hover:text-blue bg-white text-dark font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Quick Add</span>
                    </button>
                    <Link
                        href="/admin/catalog/create"
                        className="w-full md:w-auto bg-blue hover:bg-blue-dark text-white text-xs font-semibold px-4 py-2 rounded-lg transition flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                        <Camera className="w-4 h-4" />
                        <span>Add with Images</span>
                    </Link>
                </div>
            </div>

            {/* Catalog Products Table */}
            <div className="bg-white rounded-xl border border-gray-3 shadow-2xs overflow-hidden">
                <div className="p-5 border-b border-gray-3 flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-bold text-dark">Platform Shared Master Products</h2>
                        <p className="text-xs text-dark-4 mt-0.5">Master entries available for any merchant to attach to their inventory.</p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-light-5 text-blue">
                        {products.total} Master Items
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="border-b border-gray-2 bg-gray-1 text-[11px] font-bold text-dark-4 uppercase tracking-wider">
                                <th className="px-6 py-4">Item Details</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">SKU Code</th>
                                <th className="px-6 py-4">Master Base Price</th>
                                <th className="px-6 py-4">Active Stocking Shops</th>
                                <th className="px-6 py-4">Media</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-2 text-dark-3">
                            {products.data.length > 0 ? (
                                products.data.map((p) => {
                                    const totalMedia = (p.gallery_urls?.length || 0) + (p.thumbnail_url ? 1 : 0);

                                    return (
                                        <tr key={p.id} className="hover:bg-gray-1/50 transition">
                                            {/* Item Details */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setGalleryProduct(p)}
                                                        className="w-11 h-11 rounded-xl bg-gray-1 border border-gray-2 p-1 flex items-center justify-center shrink-0 overflow-hidden group cursor-pointer hover:border-blue transition relative"
                                                        title="Click to view media gallery"
                                                    >
                                                        <img
                                                            src={p.thumb_url || p.thumbnail_url || '/images/placeholder-product.svg'}
                                                            alt={p.title}
                                                            className="w-full h-full object-contain group-hover:scale-105 transition"
                                                            onError={(e) => {
                                                                (e.currentTarget as HTMLImageElement).src = '/images/placeholder-product.svg';
                                                            }}
                                                        />
                                                    </button>
                                                    <div>
                                                        <span className="font-bold text-dark block line-clamp-1">{p.title}</span>
                                                        <span className="text-[11px] text-dark-5 block mt-0.5">
                                                            slug: {p.slug}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-dark-3">
                                                    {p.category?.name || 'Uncategorized'}
                                                </span>
                                            </td>

                                            {/* SKU */}
                                            <td className="px-6 py-4 font-mono text-[11px] text-dark-4">
                                                {p.sku}
                                            </td>

                                            {/* Base Price */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-dark">{formatBDT(p.base_price)}</span>
                                                    {p.compare_price && (
                                                        <span className="text-[10px] text-dark-5 line-through">
                                                            {formatBDT(p.compare_price)}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Shops Stocking Count */}
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-light-5 text-blue">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    <span>{p.shops_count ?? p.shop_products_count ?? 0} Stores</span>
                                                </span>
                                            </td>

                                            {/* Media count */}
                                            <td className="px-6 py-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setGalleryProduct(p)}
                                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-gray-3 text-dark-4 hover:border-blue hover:text-blue bg-white transition cursor-pointer"
                                                >
                                                    <Images className="w-3.5 h-3.5 text-blue" />
                                                    <span>{totalMedia} {totalMedia === 1 ? 'photo' : 'photos'}</span>
                                                </button>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* Quick Edit */}
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingProduct(p)}
                                                        className="p-1.5 rounded-lg border border-gray-3 text-dark-3 hover:border-blue hover:text-blue transition cursor-pointer"
                                                        title="Quick Edit Info"
                                                    >
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                    </button>

                                                    {/* Full Edit (with Images & Gallery) */}
                                                    <Link
                                                        href={`/admin/catalog/${p.id}/edit`}
                                                        className="p-1.5 rounded-lg border border-gray-3 text-dark-3 hover:border-blue hover:text-blue transition cursor-pointer"
                                                        title="Edit Images & Details"
                                                    >
                                                        <Camera className="w-3.5 h-3.5" />
                                                    </Link>

                                                    {/* Delete */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(p)}
                                                        className="p-1.5 rounded-lg border border-red/20 text-red hover:bg-red/10 transition cursor-pointer"
                                                        title="Delete from Catalog"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-dark-5">
                                        No master catalog items match your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <Pagination
                links={products.links}
                from={products.from}
                to={products.to}
                total={products.total}
                className="mt-6"
            />

            {/* Modular Quick Modal (Create & Edit) */}
            <AdminProductQuickModal
                isOpen={isCreateModalOpen || !!editingProduct}
                mode={editingProduct ? 'edit' : 'create'}
                product={editingProduct}
                categories={categories}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setEditingProduct(null);
                }}
            />

            {/* Modular Gallery Showcase Modal */}
            <AdminGalleryModal
                product={galleryProduct}
                onClose={() => setGalleryProduct(null)}
            />
        </AdminLayout>
    );
}
