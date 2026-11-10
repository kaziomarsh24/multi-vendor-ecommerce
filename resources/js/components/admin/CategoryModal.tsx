import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Save, Upload } from 'lucide-react';
import type { Category } from '@/types/ecommerce';

export interface CategoryWithStats extends Category {
    products_count?: number;
    children_count?: number;
    children?: (Category & { products_count?: number })[];
    parent?: Category | null;
    is_active?: boolean;
}

interface CategoryModalProps {
    isOpen: boolean;
    mode: 'create' | 'edit';
    targetType: 'primary' | 'sub';
    category: CategoryWithStats | null;
    parentCategories: CategoryWithStats[];
    onClose: () => void;
}

export default function CategoryModal({
    isOpen,
    mode,
    targetType,
    category,
    parentCategories,
    onClose,
}: CategoryModalProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const form = useForm({
        _method: 'POST',
        parent_id: '' as string | number,
        name: '',
        icon: null as File | null,
        is_active: true,
    });

    useEffect(() => {
        if (!isOpen) return;

        if (mode === 'create') {
            setImagePreview(null);
            form.setData({
                _method: 'POST',
                parent_id: targetType === 'sub' ? parentCategories[0]?.id || '' : '',
                name: '',
                icon: null,
                is_active: true,
            });
        } else if (category) {
            setImagePreview(category.icon_url || null);
            form.setData({
                _method: 'PUT',
                parent_id: category.parent_id || '',
                name: category.name || '',
                icon: null,
                is_active: category.is_active !== false,
            });
        }
    }, [isOpen, mode, targetType, category]);

    if (!isOpen) return null;

    const handleClose = () => {
        form.reset();
        setImagePreview(null);
        onClose();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setData('icon', file);
            const reader = new FileReader();
            reader.onload = (ev) => {
                setImagePreview(ev.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        form.setData('icon', null);
        setImagePreview(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'create') {
            form.post('/admin/categories', {
                forceFormData: true,
                onSuccess: handleClose,
            });
        } else if (category) {
            form.post(`/admin/categories/${category.id}`, {
                forceFormData: true,
                onSuccess: handleClose,
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-gray-100 mb-5">
                    <h3 className="text-base font-bold text-dark">
                        {mode === 'create'
                            ? targetType === 'primary'
                                ? 'Add New Category'
                                : 'Add New Subcategory'
                            : targetType === 'primary'
                            ? 'Edit Category'
                            : 'Edit Subcategory'}
                    </h3>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="text-gray-400 hover:text-dark p-1 rounded-lg transition cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                    {/* If Subcategory: Select Parent Category */}
                    {targetType === 'sub' && (
                        <div>
                            <label className="block font-semibold text-dark mb-1.5">
                                Parent Category <span className="text-rose-600">*</span>
                            </label>
                            <select
                                required
                                value={form.data.parent_id}
                                onChange={(e) => form.setData('parent_id', e.target.value)}
                                className="w-full bg-white border border-gray-3 rounded-lg px-3.5 py-2.5 text-dark text-sm focus:outline-none focus:border-blue transition"
                            >
                                <option value="">-- Select Parent Department --</option>
                                {parentCategories.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                            {form.errors.parent_id && (
                                <span className="text-rose-600 text-[11px]">{form.errors.parent_id}</span>
                            )}
                        </div>
                    )}

                    {/* Category Name */}
                    <div>
                        <label className="block font-semibold text-dark mb-1.5">
                            {targetType === 'primary' ? 'Category Name' : 'Subcategory Name'}{' '}
                            <span className="text-rose-600">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder={
                                targetType === 'primary'
                                    ? 'e.g. Gaming Gear & Gadgets'
                                    : 'e.g. Mechanical Keyboards'
                            }
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            className="w-full bg-white border border-gray-3 rounded-lg px-3.5 py-2.5 text-dark text-sm focus:outline-none focus:border-blue transition font-medium"
                        />
                        {form.errors.name && (
                            <span className="text-rose-600 text-[11px]">{form.errors.name}</span>
                        )}
                    </div>

                    {/* Real Image / Icon Upload with Live Preview */}
                    <div>
                        <label className="block font-semibold text-dark mb-1.5">
                            {targetType === 'primary' ? 'Category Icon' : 'Subcategory Icon'}
                        </label>

                        {imagePreview ? (
                            <div className="flex items-center gap-4">
                                <div className="relative w-20 h-20 rounded-xl border border-gray-3 bg-gray-1 p-2 flex items-center justify-center shrink-0 group">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="max-h-full max-w-full object-contain rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-2 -right-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-1 shadow-md transition cursor-pointer"
                                        title="Remove image"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>

                                <label className="px-3.5 py-2 rounded-lg border border-gray-3 bg-white text-dark text-xs font-medium hover:border-blue hover:text-blue transition cursor-pointer flex items-center gap-1.5 shadow-2xs">
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>Change</span>
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        ) : (
                            <label className="border-2 border-dashed border-gray-3 hover:border-blue rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer bg-gray-50/50 hover:bg-blue/5 transition">
                                <Upload className="w-5 h-5 text-dark-4 mb-1.5" />
                                <span className="text-xs font-medium text-dark">
                                    Upload icon
                                </span>
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                        {form.errors.icon && (
                            <span className="text-rose-600 text-[11px]">{form.errors.icon}</span>
                        )}
                    </div>

                    {/* Status Toggle */}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        <label className="flex items-center gap-2.5 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.data.is_active}
                                onChange={(e) => form.setData('is_active', e.target.checked)}
                                className="w-4 h-4 rounded border-gray-3 text-blue focus:ring-blue cursor-pointer"
                            />
                            <span className="text-xs font-medium text-dark">
                                Active
                            </span>
                        </label>
                    </div>

                    {/* Modal Actions */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border border-gray-3 rounded-lg text-dark-3 hover:bg-gray-1 font-medium text-xs transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="bg-blue hover:bg-blue-dark text-white px-5 py-2 rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition cursor-pointer disabled:opacity-70"
                        >
                            <Save className="w-4 h-4" />
                            <span>
                                {form.processing
                                    ? 'Saving...'
                                    : mode === 'create'
                                    ? 'Create Category'
                                    : 'Save Changes'}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
