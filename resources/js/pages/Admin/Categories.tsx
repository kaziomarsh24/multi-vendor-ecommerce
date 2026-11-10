import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import CategoryModal, {
    type CategoryWithStats,
} from '@/components/admin/CategoryModal';
import { Tag, Plus, FolderTree } from 'lucide-react';

interface CategoriesProps {
    parentCategories: CategoryWithStats[];
    subcategories: CategoryWithStats[];
}

export default function AdminCategories({
    parentCategories,
    subcategories,
}: CategoriesProps) {
    const [activeTab, setActiveTab] = useState<'parents' | 'subcategories'>(
        'parents',
    );

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [modalTargetType, setModalTargetType] = useState<'primary' | 'sub'>(
        'primary',
    );
    const [editingCategory, setEditingCategory] =
        useState<CategoryWithStats | null>(null);

    const openCreateModal = (type: 'primary' | 'sub') => {
        setModalMode('create');
        setModalTargetType(type);
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const openEditModal = (cat: CategoryWithStats) => {
        const isSub = !!cat.parent_id;
        setModalMode('edit');
        setModalTargetType(isSub ? 'sub' : 'primary');
        setEditingCategory(cat);
        setIsModalOpen(true);
    };

    const handleDelete = (cat: CategoryWithStats) => {
        const type = cat.parent_id ? 'subcategory' : 'category';
        if (confirm(`Are you sure you want to delete ${type} "${cat.name}"?`)) {
            router.delete(`/admin/categories/${cat.id}`);
        }
    };

    return (
        <AdminLayout title="Central Categories Management">
            <Head title="Categories | CSN Admin" />

            <div className="space-y-6">
                {/* Header & Add Action */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-dark">
                            Categories
                        </h1>
                    </div>

                    <div className="flex items-center gap-2.5">
                        {activeTab === 'parents' ? (
                            <button
                                type="button"
                                onClick={() => openCreateModal('primary')}
                                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue px-4 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-blue-dark"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Add Category</span>
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => openCreateModal('sub')}
                                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue px-4 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-blue-dark"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Add Subcategory</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Modern Pill Tabs */}
                <div className="flex items-center gap-2 border-b border-gray-2 pb-4">
                    <button
                        type="button"
                        onClick={() => setActiveTab('parents')}
                        className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                            activeTab === 'parents'
                                ? 'bg-blue text-white shadow-2xs'
                                : 'bg-gray-1 text-dark-4 hover:bg-gray-2 hover:text-dark'
                        }`}
                    >
                        <Tag className="h-3.5 w-3.5" />
                        <span>Categories</span>
                        <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                                activeTab === 'parents'
                                    ? 'bg-white/20 text-white'
                                    : 'bg-gray-3 text-dark-3'
                            }`}
                        >
                            {parentCategories.length}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('subcategories')}
                        className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                            activeTab === 'subcategories'
                                ? 'bg-blue text-white shadow-2xs'
                                : 'bg-gray-1 text-dark-4 hover:bg-gray-2 hover:text-dark'
                        }`}
                    >
                        <FolderTree className="h-3.5 w-3.5" />
                        <span>Subcategories</span>
                        <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                                activeTab === 'subcategories'
                                    ? 'bg-white/20 text-white'
                                    : 'bg-gray-3 text-dark-3'
                            }`}
                        >
                            {subcategories.length}
                        </span>
                    </button>
                </div>

                {/* Tab 1: Primary Categories Table */}
                {activeTab === 'parents' && (
                    <div className="shadow-1 overflow-hidden rounded-xl border border-gray-2 bg-white">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-gray-2 bg-gray-1 text-[11px] font-bold tracking-wider text-dark-4 uppercase">
                                        <th className="px-6 py-4">
                                            Department / Category
                                        </th>
                                        <th className="px-6 py-4">Slug</th>
                                        <th className="px-6 py-4">
                                            Subcategories
                                        </th>
                                        <th className="px-6 py-4">
                                            Total Products
                                        </th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-2 text-xs">
                                    {parentCategories.map((cat) => (
                                        <tr
                                            key={cat.id}
                                            className="transition hover:bg-gray-1/50"
                                        >
                                            {/* Department / Category with Real Icon */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-2 bg-gray-1 p-1.5">
                                                        {cat.icon_url ? (
                                                            <img
                                                                src={
                                                                    cat.icon_url
                                                                }
                                                                alt={cat.name}
                                                                className="h-full w-full object-contain"
                                                                onError={(
                                                                    e,
                                                                ) => {
                                                                    (
                                                                        e.currentTarget as HTMLImageElement
                                                                    ).src =
                                                                        '/images/placeholder-product.svg';
                                                                }}
                                                            />
                                                        ) : (
                                                            <Tag className="text-dark-5 h-5 w-5" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="block font-bold text-dark">
                                                            {cat.name}
                                                        </span>
                                                        <span className="text-dark-5 block text-[11px]">
                                                            ID: #{cat.id}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Slug */}
                                            <td className="px-6 py-4 font-mono text-[11px] text-dark-4">
                                                {cat.slug}
                                            </td>

                                            {/* Subcategories Count */}
                                            <td className="px-6 py-4">
                                                <span className="bg-blue-light-5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium text-blue">
                                                    {cat.children?.length ??
                                                        cat.children_count ??
                                                        0}{' '}
                                                    Subcategories
                                                </span>
                                            </td>

                                            {/* Total Products */}
                                            <td className="px-6 py-4 font-bold text-dark">
                                                {cat.products_count ?? 0}
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                                                        cat.is_active !== false
                                                            ? 'bg-green-light-6 text-green'
                                                            : 'bg-red-light-6 text-red'
                                                    }`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${
                                                            cat.is_active !==
                                                            false
                                                                ? 'bg-green'
                                                                : 'bg-red'
                                                        }`}
                                                    />
                                                    {cat.is_active !== false
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="space-x-2 px-6 py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEditModal(cat)
                                                    }
                                                    className="cursor-pointer rounded border border-gray-3 px-3 py-1 text-xs font-medium text-dark-3 transition hover:border-blue hover:text-blue"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(cat)
                                                    }
                                                    className="cursor-pointer rounded border border-red/20 px-3 py-1 text-xs font-medium text-red transition hover:bg-red/10"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Tab 2: Subcategories Table */}
                {activeTab === 'subcategories' && (
                    <div className="shadow-1 overflow-hidden rounded-xl border border-gray-2 bg-white">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-gray-2 bg-gray-1 text-[11px] font-bold tracking-wider text-dark-4 uppercase">
                                        <th className="px-6 py-4">
                                            Subcategory
                                        </th>
                                        <th className="px-6 py-4">
                                            Parent Department
                                        </th>
                                        <th className="px-6 py-4">Slug</th>
                                        <th className="px-6 py-4">
                                            Total Products
                                        </th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-2 text-xs">
                                    {subcategories.map((sub) => (
                                        <tr
                                            key={sub.id}
                                            className="transition hover:bg-gray-1/50"
                                        >
                                            {/* Subcategory Name & Real Icon */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-2 bg-gray-1 p-1.5">
                                                        {sub.icon_url ? (
                                                            <img
                                                                src={
                                                                    sub.icon_url
                                                                }
                                                                alt={sub.name}
                                                                className="h-full w-full object-contain"
                                                                onError={(
                                                                    e,
                                                                ) => {
                                                                    (
                                                                        e.currentTarget as HTMLImageElement
                                                                    ).src =
                                                                        '/images/placeholder-product.svg';
                                                                }}
                                                            />
                                                        ) : (
                                                            <FolderTree className="text-dark-5 h-4 w-4" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="block font-bold text-dark">
                                                            {sub.name}
                                                        </span>
                                                        <span className="text-dark-5 block text-[11px]">
                                                            ID: #{sub.id}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Parent Category */}
                                            <td className="px-6 py-4">
                                                <span className="bg-blue-light-5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold text-blue">
                                                    <Tag className="h-3 w-3" />
                                                    {sub.parent?.name ||
                                                        'Unassigned'}
                                                </span>
                                            </td>

                                            {/* Slug */}
                                            <td className="px-6 py-4 font-mono text-[11px] text-dark-4">
                                                {sub.slug}
                                            </td>

                                            {/* Products Count */}
                                            <td className="px-6 py-4 font-bold text-dark">
                                                {sub.products_count ?? 0}
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                                                        sub.is_active !== false
                                                            ? 'bg-green-light-6 text-green'
                                                            : 'bg-red-light-6 text-red'
                                                    }`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${
                                                            sub.is_active !==
                                                            false
                                                                ? 'bg-green'
                                                                : 'bg-red'
                                                        }`}
                                                    />
                                                    {sub.is_active !== false
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="space-x-2 px-6 py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEditModal(sub)
                                                    }
                                                    className="cursor-pointer rounded border border-gray-3 px-3 py-1 text-xs font-medium text-dark-3 transition hover:border-blue hover:text-blue"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(sub)
                                                    }
                                                    className="cursor-pointer rounded border border-red/20 px-3 py-1 text-xs font-medium text-red transition hover:bg-red/10"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Modular Category Modal */}
                <CategoryModal
                    isOpen={isModalOpen}
                    mode={modalMode}
                    targetType={modalTargetType}
                    category={editingCategory}
                    parentCategories={parentCategories}
                    onClose={() => setIsModalOpen(false)}
                />
            </div>
        </AdminLayout>
    );
}
