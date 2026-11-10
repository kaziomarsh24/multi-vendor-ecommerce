import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import Pagination from '@/components/Pagination';
import AdminProductQuickModal from '@/components/admin/AdminProductQuickModal';
import AdminGalleryModal from '@/components/admin/AdminGalleryModal';
import {
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

export default function AdminCatalog({
    products,
    categories,
    filters,
}: CatalogProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [galleryProduct, setGalleryProduct] = useState<Product | null>(null);

    const formatBDT = (amount: string | number | null | undefined) => {
        if (!amount) return '৳0';
        return `৳${Number(amount).toLocaleString('en-US')}`;
    };

    const handleDelete = (p: Product) => {
        if (
            confirm(
                `Are you sure you want to delete "${p.title}" from the master catalog?`,
            )
        ) {
            router.delete(`/admin/catalog/${p.id}`);
        }
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = formData.get('search') as string;
        router.get(
            '/admin/catalog',
            { ...filters, search },
            { preserveState: true },
        );
    };

    const handleCategoryFilter = (catId: string) => {
        router.get(
            '/admin/catalog',
            { ...filters, category: catId || undefined },
            { preserveState: true },
        );
    };

    return (
        <AdminLayout title="Master Shared Catalog">
            <Head title="Master Catalog | Admin Console" />

            {/* Filter Toolbar */}
            <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-3 bg-white p-4 shadow-2xs md:flex-row">
                <div className="flex w-full items-center gap-3 md:w-auto">
                    <form
                        onSubmit={handleSearch}
                        className="relative flex-1 md:w-72"
                    >
                        <input
                            type="text"
                            name="search"
                            defaultValue={filters.search || ''}
                            placeholder="Search catalog by title or SKU..."
                            className="w-full rounded-lg border border-gray-3 bg-white py-2 pr-3.5 pl-9 text-xs text-dark transition focus:border-blue focus:outline-none"
                        />
                        <Search className="absolute top-2.5 left-3 h-4 w-4 text-dark-4" />
                    </form>

                    <select
                        value={filters.category || ''}
                        onChange={(e) => handleCategoryFilter(e.target.value)}
                        className="rounded-lg border border-gray-3 bg-white px-3 py-2 text-xs text-dark transition outline-none focus:border-blue"
                    >
                        <option value="">All Categories</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex w-full items-center gap-2.5 md:w-auto">
                    <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-gray-3 bg-white px-4 py-2 text-xs font-semibold text-dark shadow-2xs transition hover:border-blue hover:text-blue md:w-auto"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Quick Add</span>
                    </button>
                    <Link
                        href="/admin/catalog/create"
                        className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue px-4 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-blue-dark md:w-auto"
                    >
                        <Camera className="h-4 w-4" />
                        <span>Add with Images</span>
                    </Link>
                </div>
            </div>

            {/* Catalog Products Table */}
            <div className="overflow-hidden rounded-xl border border-gray-3 bg-white shadow-2xs">
                <div className="flex items-center justify-between border-b border-gray-3 p-5">
                    <div>
                        <h2 className="text-sm font-bold text-dark">
                            Platform Shared Master Products
                        </h2>
                        <p className="mt-0.5 text-xs text-dark-4">
                            Master entries available for any merchant to attach
                            to their inventory.
                        </p>
                    </div>
                    <span className="bg-blue-light-5 rounded-full px-2.5 py-1 text-xs font-bold text-blue">
                        {products.total} Master Items
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs">
                        <thead>
                            <tr className="border-b border-gray-2 bg-gray-1 text-[11px] font-bold tracking-wider text-dark-4 uppercase">
                                <th className="px-6 py-4">Item Details</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">SKU Code</th>
                                <th className="px-6 py-4">Master Base Price</th>
                                <th className="px-6 py-4">
                                    Active Stocking Shops
                                </th>
                                <th className="px-6 py-4">Media</th>
                                <th className="px-6 py-4 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-2 text-dark-3">
                            {products.data.length > 0 ? (
                                products.data.map((p) => {
                                    const totalMedia =
                                        (p.gallery_urls?.length || 0) +
                                        (p.thumbnail_url ? 1 : 0);

                                    return (
                                        <tr
                                            key={p.id}
                                            className="transition hover:bg-gray-1/50"
                                        >
                                            {/* Item Details */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setGalleryProduct(p)
                                                        }
                                                        className="group relative flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-gray-2 bg-gray-1 p-1 transition hover:border-blue"
                                                        title="Click to view media gallery"
                                                    >
                                                        <img
                                                            src={
                                                                p.thumb_url ||
                                                                p.thumbnail_url ||
                                                                '/images/placeholder-product.svg'
                                                            }
                                                            alt={p.title}
                                                            className="h-full w-full object-contain transition group-hover:scale-105"
                                                            onError={(e) => {
                                                                (
                                                                    e.currentTarget as HTMLImageElement
                                                                ).src =
                                                                    '/images/placeholder-product.svg';
                                                            }}
                                                        />
                                                    </button>
                                                    <div>
                                                        <span className="line-clamp-1 block font-bold text-dark">
                                                            {p.title}
                                                        </span>
                                                        <span className="text-dark-5 mt-0.5 block text-[11px]">
                                                            slug: {p.slug}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-dark-3">
                                                    {p.category?.name ||
                                                        'Uncategorized'}
                                                </span>
                                            </td>

                                            {/* SKU */}
                                            <td className="px-6 py-4 font-mono text-[11px] text-dark-4">
                                                {p.sku}
                                            </td>

                                            {/* Base Price */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-dark">
                                                        {formatBDT(
                                                            p.base_price,
                                                        )}
                                                    </span>
                                                    {p.compare_price && (
                                                        <span className="text-dark-5 text-[10px] line-through">
                                                            {formatBDT(
                                                                p.compare_price,
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Shops Stocking Count */}
                                            <td className="px-6 py-4">
                                                <span className="bg-blue-light-5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium text-blue">
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    <span>
                                                        {p.shops_count ??
                                                            p.shop_products_count ??
                                                            0}{' '}
                                                        Stores
                                                    </span>
                                                </span>
                                            </td>

                                            {/* Media count */}
                                            <td className="px-6 py-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setGalleryProduct(p)
                                                    }
                                                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-3 bg-white px-2.5 py-1 text-[11px] font-medium text-dark-4 transition hover:border-blue hover:text-blue"
                                                >
                                                    <Images className="h-3.5 w-3.5 text-blue" />
                                                    <span>
                                                        {totalMedia}{' '}
                                                        {totalMedia === 1
                                                            ? 'photo'
                                                            : 'photos'}
                                                    </span>
                                                </button>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* Quick Edit */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setEditingProduct(p)
                                                        }
                                                        className="cursor-pointer rounded-lg border border-gray-3 p-1.5 text-dark-3 transition hover:border-blue hover:text-blue"
                                                        title="Quick Edit Info"
                                                    >
                                                        <Edit3 className="h-3.5 w-3.5" />
                                                    </button>

                                                    {/* Full Edit (with Images & Gallery) */}
                                                    <Link
                                                        href={`/admin/catalog/${p.id}/edit`}
                                                        className="cursor-pointer rounded-lg border border-gray-3 p-1.5 text-dark-3 transition hover:border-blue hover:text-blue"
                                                        title="Edit Images & Details"
                                                    >
                                                        <Camera className="h-3.5 w-3.5" />
                                                    </Link>

                                                    {/* Delete */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(p)
                                                        }
                                                        className="cursor-pointer rounded-lg border border-red/20 p-1.5 text-red transition hover:bg-red/10"
                                                        title="Delete from Catalog"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="text-dark-5 px-6 py-12 text-center"
                                    >
                                        No master catalog items match your
                                        search.
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
