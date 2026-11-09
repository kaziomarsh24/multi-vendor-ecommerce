import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import CategoryModal, { type CategoryWithStats } from '@/components/admin/CategoryModal';
import {
    Tag,
    Plus,
    FolderTree,
} from 'lucide-react';

interface CategoriesProps {
    parentCategories: CategoryWithStats[];
    subcategories: CategoryWithStats[];
}

export default function AdminCategories({ parentCategories, subcategories }: CategoriesProps) {
    const [activeTab, setActiveTab] = useState<'parents' | 'subcategories'>('parents');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [modalTargetType, setModalTargetType] = useState<'primary' | 'sub'>('primary');
    const [editingCategory, setEditingCategory] = useState<CategoryWithStats | null>(null);

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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-dark">Categories</h1>
                    </div>

                    <div className="flex items-center gap-2.5">
                        {activeTab === 'parents' ? (
                            <button
                                type="button"
                                onClick={() => openCreateModal('primary')}
                                className="px-4 py-2 rounded-lg bg-blue hover:bg-blue-dark text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Category</span>
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => openCreateModal('sub')}
                                className="px-4 py-2 rounded-lg bg-blue hover:bg-blue-dark text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
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
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                            activeTab === 'parents'
                                ? 'bg-blue text-white shadow-2xs'
                                : 'bg-gray-1 text-dark-4 hover:text-dark hover:bg-gray-2'
                        }`}
                    >
                        <Tag className="w-3.5 h-3.5" />
                        <span>Categories</span>
                        <span
                            className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                                activeTab === 'parents' ? 'bg-white/20 text-white' : 'bg-gray-3 text-dark-3'
                            }`}
                        >
                            {parentCategories.length}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('subcategories')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                            activeTab === 'subcategories'
                                ? 'bg-blue text-white shadow-2xs'
                                : 'bg-gray-1 text-dark-4 hover:text-dark hover:bg-gray-2'
                        }`}
                    >
                        <FolderTree className="w-3.5 h-3.5" />
                        <span>Subcategories</span>
                        <span
                            className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                                activeTab === 'subcategories' ? 'bg-white/20 text-white' : 'bg-gray-3 text-dark-3'
                            }`}
                        >
                            {subcategories.length}
                        </span>
                    </button>
                </div>

                {/* Tab 1: Primary Categories Table */}
                {activeTab === 'parents' && (
                    <div className="rounded-xl border border-gray-2 bg-white shadow-1 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-2 bg-gray-1 text-[11px] font-bold text-dark-4 uppercase tracking-wider">
                                        <th className="px-6 py-4">Department / Category</th>
                                        <th className="px-6 py-4">Slug</th>
                                        <th className="px-6 py-4">Subcategories</th>
                                        <th className="px-6 py-4">Total Products</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-2 text-xs">
                                    {parentCategories.map((cat) => (
                                        <tr key={cat.id} className="hover:bg-gray-1/50 transition">
                                            {/* Department / Category with Real Icon */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-1 border border-gray-2 p-1.5 flex items-center justify-center shrink-0">
                                                        {cat.icon_url ? (
                                                            <img
                                                                src={cat.icon_url}
                                                                alt={cat.name}
                                                                className="w-full h-full object-contain"
                                                                onError={(e) => {
                                                                    (e.currentTarget as HTMLImageElement).src = '/images/placeholder-product.svg';
                                                                }}
                                                            />
                                                        ) : (
                                                            <Tag className="w-5 h-5 text-dark-5" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-dark block">{cat.name}</span>
                                                        <span className="text-[11px] text-dark-5 block">
                                                            ID: #{cat.id}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Slug */}
                                            <td className="px-6 py-4 text-dark-4 font-mono text-[11px]">
                                                {cat.slug}
                                            </td>

                                            {/* Subcategories Count */}
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-light-5 text-blue">
                                                    {cat.children?.length ?? cat.children_count ?? 0} Subcategories
                                                </span>
                                            </td>

                                            {/* Total Products */}
                                            <td className="px-6 py-4 font-bold text-dark">
                                                {cat.products_count ?? 0}
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                                                        cat.is_active !== false
                                                            ? 'bg-green-light-6 text-green'
                                                            : 'bg-red-light-6 text-red'
                                                    }`}
                                                >
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full ${
                                                            cat.is_active !== false ? 'bg-green' : 'bg-red'
                                                        }`}
                                                    />
                                                    {cat.is_active !== false ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditModal(cat)}
                                                    className="px-3 py-1 rounded border border-gray-3 text-dark-3 text-xs font-medium hover:border-blue hover:text-blue transition cursor-pointer"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(cat)}
                                                    className="px-3 py-1 rounded border border-red/20 text-red text-xs font-medium hover:bg-red/10 transition cursor-pointer"
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
                    <div className="rounded-xl border border-gray-2 bg-white shadow-1 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-2 bg-gray-1 text-[11px] font-bold text-dark-4 uppercase tracking-wider">
                                        <th className="px-6 py-4">Subcategory</th>
                                        <th className="px-6 py-4">Parent Department</th>
                                        <th className="px-6 py-4">Slug</th>
                                        <th className="px-6 py-4">Total Products</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-2 text-xs">
                                    {subcategories.map((sub) => (
                                        <tr key={sub.id} className="hover:bg-gray-1/50 transition">
                                            {/* Subcategory Name & Real Icon */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-gray-1 border border-gray-2 p-1.5 flex items-center justify-center shrink-0">
                                                        {sub.icon_url ? (
                                                            <img
                                                                src={sub.icon_url}
                                                                alt={sub.name}
                                                                className="w-full h-full object-contain"
                                                                onError={(e) => {
                                                                    (e.currentTarget as HTMLImageElement).src = '/images/placeholder-product.svg';
                                                                }}
                                                            />
                                                        ) : (
                                                            <FolderTree className="w-4 h-4 text-dark-5" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-dark block">{sub.name}</span>
                                                        <span className="text-[11px] text-dark-5 block">
                                                            ID: #{sub.id}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Parent Category */}
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-light-5 text-blue">
                                                    <Tag className="w-3 h-3" />
                                                    {sub.parent?.name || 'Unassigned'}
                                                </span>
                                            </td>

                                            {/* Slug */}
                                            <td className="px-6 py-4 text-dark-4 font-mono text-[11px]">
                                                {sub.slug}
                                            </td>

                                            {/* Products Count */}
                                            <td className="px-6 py-4 font-bold text-dark">
                                                {sub.products_count ?? 0}
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                                                        sub.is_active !== false
                                                            ? 'bg-green-light-6 text-green'
                                                            : 'bg-red-light-6 text-red'
                                                    }`}
                                                >
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full ${
                                                            sub.is_active !== false ? 'bg-green' : 'bg-red'
                                                        }`}
                                                    />
                                                    {sub.is_active !== false ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditModal(sub)}
                                                    className="px-3 py-1 rounded border border-gray-3 text-dark-3 text-xs font-medium hover:border-blue hover:text-blue transition cursor-pointer"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(sub)}
                                                    className="px-3 py-1 rounded border border-red/20 text-red text-xs font-medium hover:bg-red/10 transition cursor-pointer"
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
