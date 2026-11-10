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
                parent_id:
                    targetType === 'sub' ? parentCategories[0]?.id || '' : '',
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gray-100 bg-white p-6 shadow-xl sm:p-7">
                {/* Modal Header */}
                <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-3.5">
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
                        className="cursor-pointer rounded-lg p-1 text-gray-400 transition hover:text-dark"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                    {/* If Subcategory: Select Parent Category */}
                    {targetType === 'sub' && (
                        <div>
                            <label className="mb-1.5 block font-semibold text-dark">
                                Parent Category{' '}
                                <span className="text-rose-600">*</span>
                            </label>
                            <select
                                required
                                value={form.data.parent_id}
                                onChange={(e) =>
                                    form.setData('parent_id', e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-3 bg-white px-3.5 py-2.5 text-sm text-dark transition focus:border-blue focus:outline-none"
                            >
                                <option value="">
                                    -- Select Parent Department --
                                </option>
                                {parentCategories.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                            {form.errors.parent_id && (
                                <span className="text-[11px] text-rose-600">
                                    {form.errors.parent_id}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Category Name */}
                    <div>
                        <label className="mb-1.5 block font-semibold text-dark">
                            {targetType === 'primary'
                                ? 'Category Name'
                                : 'Subcategory Name'}{' '}
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
                            onChange={(e) =>
                                form.setData('name', e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-3 bg-white px-3.5 py-2.5 text-sm font-medium text-dark transition focus:border-blue focus:outline-none"
                        />
                        {form.errors.name && (
                            <span className="text-[11px] text-rose-600">
                                {form.errors.name}
                            </span>
                        )}
                    </div>

                    {/* Real Image / Icon Upload with Live Preview */}
                    <div>
                        <label className="mb-1.5 block font-semibold text-dark">
                            {targetType === 'primary'
                                ? 'Category Icon'
                                : 'Subcategory Icon'}
                        </label>

                        {imagePreview ? (
                            <div className="flex items-center gap-4">
                                <div className="group relative flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-gray-3 bg-gray-1 p-2">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="max-h-full max-w-full rounded object-contain"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-2 -right-2 cursor-pointer rounded-full bg-rose-600 p-1 text-white shadow-md transition hover:bg-rose-700"
                                        title="Remove image"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>

                                <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-3 bg-white px-3.5 py-2 text-xs font-medium text-dark shadow-2xs transition hover:border-blue hover:text-blue">
                                    <Upload className="h-3.5 w-3.5" />
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
                            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-3 bg-gray-50/50 p-5 transition hover:border-blue hover:bg-blue/5">
                                <Upload className="mb-1.5 h-5 w-5 text-dark-4" />
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
                            <span className="text-[11px] text-rose-600">
                                {form.errors.icon}
                            </span>
                        )}
                    </div>

                    {/* Status Toggle */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                        <label className="flex cursor-pointer items-center gap-2.5">
                            <input
                                type="checkbox"
                                checked={form.data.is_active}
                                onChange={(e) =>
                                    form.setData('is_active', e.target.checked)
                                }
                                className="h-4 w-4 cursor-pointer rounded border-gray-3 text-blue focus:ring-blue"
                            />
                            <span className="text-xs font-medium text-dark">
                                Active
                            </span>
                        </label>
                    </div>

                    {/* Modal Actions */}
                    <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="cursor-pointer rounded-lg border border-gray-3 px-4 py-2 text-xs font-medium text-dark-3 transition hover:bg-gray-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue px-5 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-blue-dark disabled:opacity-70"
                        >
                            <Save className="h-4 w-4" />
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
