import React, { useState, useEffect, useRef } from 'react';
import {
    Layers,
    Plus,
    Search,
    ChevronRight,
    ChevronDown,
    Edit,
    Trash2,
    X,
    Loader2,
    AlertCircle,
    Upload,
    Image as ImageIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import categoryService, { Category } from '../../services/category.service';
import uploadService from '../../services/upload.service';

interface FormData {
    name: string;
    icon: File | null;
    iconPreview: string | null;
    parentId: string | null;
}

const CategoryPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    // Form states
    const [formData, setFormData] = useState<FormData>({
        name: '',
        icon: null,
        iconPreview: null,
        parentId: null,
    });

    // Delete confirmation
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Fetch categories
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await categoryService.getAll({ limit: 100 });
            setCategories(response.data || []);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const toggleExpand = (id: string) => {
        setExpanded(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    // Get parent categories (categories without parentId)
    const getParentCategories = () => categories.filter(c => !c.parentId);

    // Get subcategories of a parent
    const getSubcategories = (parentId: string) => categories.filter(c => c.parentId === parentId);


    // Handle file selection
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setFormData(prev => ({
                ...prev,
                icon: file,
                iconPreview: previewUrl,
            }));
        }
    };

    // Remove selected image
    const removeImage = () => {
        if (formData.iconPreview) {
            URL.revokeObjectURL(formData.iconPreview);
        }
        setFormData(prev => ({
            ...prev,
            icon: null,
            iconPreview: null,
        }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Open modal for create
    const openCreateModal = (parentId?: string) => {
        setModalMode('create');
        setEditingCategory(null);
        setFormData({
            name: '',
            icon: null,
            iconPreview: null,
            parentId: parentId || null,
        });
        setShowModal(true);
    };

    // Open modal for edit
    const openEditModal = (category: Category) => {
        setModalMode('edit');
        setEditingCategory(category);
        setFormData({
            name: category.name,
            icon: null,
            iconPreview: category.imageUrl || null,
            parentId: category.parentId || null,
        });
        setShowModal(true);
    };

    // Close modal and cleanup
    const closeModal = () => {
        if (formData.iconPreview && formData.icon) {
            URL.revokeObjectURL(formData.iconPreview);
        }
        setShowModal(false);
    };

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error('Category name is required');
            return;
        }

        setFormLoading(true);
        try {
            let iconUrl: string | undefined;

            // Upload image first if a new file is selected
            if (formData.icon) {
                const uploadResponse = await uploadService.uploadImage(formData.icon);
                iconUrl = uploadResponse.url;
            } else if (modalMode === 'edit' && editingCategory?.imageUrl && !formData.icon) {
                // Keep existing imageUrl if no new file uploaded during edit
                iconUrl = editingCategory.imageUrl;
            }

            const payload = {
                name: formData.name,
                imageUrl: iconUrl,
                parentId: formData.parentId,
            };

            if (modalMode === 'create') {
                await categoryService.create(payload);
                toast.success('Category created successfully');
            } else if (editingCategory) {
                await categoryService.update(editingCategory.id, payload);
                toast.success('Category updated successfully');
            }
            closeModal();
            fetchCategories();
        } catch (error: any) {
            toast.error(error.response?.data?.message || `Failed to ${modalMode} category`);
        } finally {
            setFormLoading(false);
        }
    };

    // Handle delete
    const handleDelete = async (id: string) => {
        setDeleteLoading(true);
        try {
            await categoryService.delete(id);
            toast.success('Category deleted successfully');
            setDeleteConfirm(null);
            fetchCategories();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete category');
        } finally {
            setDeleteLoading(false);
        }
    };

    // Filter categories by search
    const filteredParentCategories = getParentCategories().filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="text-left">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Product Categories</h1>
                    <p className="text-slate-500 mt-1">Organize your marketplace hierarchy and category icons.</p>
                </div>
                <button
                    onClick={() => openCreateModal()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/10 active:scale-95 text-sm"
                >
                    <Plus className="w-4 h-4" />
                    New Category
                </button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search categories..."
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            ) : categories.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        <Layers className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No categories yet</h3>
                    <p className="text-slate-500 mb-6">Create your first category to organize products</p>
                    <button
                        onClick={() => openCreateModal()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Create Category
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Category Tree */}
                    <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Layers className="w-5 h-5 text-blue-600" /> Catalog Tree
                            </h2>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                                Total: {categories.length}
                            </p>
                        </div>

                        <div className="p-4 space-y-2">
                            {filteredParentCategories.length === 0 ? (
                                <div className="text-center py-8 text-slate-500">
                                    No categories match your search
                                </div>
                            ) : (
                                filteredParentCategories.map((cat) => {
                                    const subs = getSubcategories(cat.id);
                                    const hasSubcategories = subs.length > 0;

                                    return (
                                        <div key={cat.id} className="space-y-1">
                                            <div className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${expanded.includes(cat.id) ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                                                <div className="flex items-center gap-4">
                                                    <button
                                                        onClick={() => toggleExpand(cat.id)}
                                                        disabled={!hasSubcategories}
                                                        className={`p-1.5 rounded-lg transition-all ${hasSubcategories
                                                            ? expanded.includes(cat.id)
                                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                                                : 'hover:bg-slate-100 text-slate-400'
                                                            : 'text-slate-200 cursor-default'
                                                            }`}
                                                    >
                                                        {expanded.includes(cat.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                                    </button>
                                                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                                                        {cat.imageUrl ? (
                                                            <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <ImageIcon className="w-5 h-5 text-slate-400" />
                                                        )}
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="font-bold text-slate-900 text-base leading-tight">{cat.name}</p>
                                                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                                                            {subs.length} Subcategories
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => openCreateModal(cat.id)}
                                                        className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-lg transition-all"
                                                        title="Add subcategory"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openEditModal(cat)}
                                                        className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-lg transition-all"
                                                        title="Edit category"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(cat.id)}
                                                        className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-all"
                                                        title="Delete category"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Subcategories */}
                                            {expanded.includes(cat.id) && hasSubcategories && (
                                                <div className="pl-14 space-y-2 mt-2 animate-in slide-in-from-top-2 duration-300">
                                                    {subs.map((sub) => (
                                                        <div key={sub.id} className="flex items-center justify-between p-3.5 bg-white shadow-sm border border-slate-100 rounded-xl hover:border-slate-200 transition-all group">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                                                                    {sub.imageUrl ? (
                                                                        <img src={sub.imageUrl} alt={sub.name} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <ImageIcon className="w-4 h-4 text-slate-400" />
                                                                    )}
                                                                </div>
                                                                <div className="text-xs text-left">
                                                                    <p className="font-bold text-slate-700">{sub.name}</p>
                                                                    <p className="text-slate-400 font-medium">Subcategory</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={() => openEditModal(sub)}
                                                                    className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-lg transition-all"
                                                                >
                                                                    <Edit className="w-3.5 h-3.5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => setDeleteConfirm(sub.id)}
                                                                    className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-all"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Quick Stats Sidebar */}
                    <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm text-left">
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-slate-900">Category Stats</h3>
                            <p className="text-xs text-slate-500 mt-1 font-medium">Overview of your catalog</p>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Total Categories</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{categories.length}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Parent Categories</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{getParentCategories().length}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Subcategories</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{categories.length - getParentCategories().length}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => openCreateModal()}
                            className="w-full py-4 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 font-bold rounded-2xl transition-all shadow-sm active:scale-95 text-sm mt-6"
                        >
                            Add New Category
                        </button>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">
                                {modalMode === 'create' ? 'Create Category' : 'Edit Category'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder-slate-400"
                                    placeholder="e.g. Electronics, Fashion"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Parent Category</label>
                                <select
                                    value={formData.parentId || ''}
                                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value || null })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">Create as Root Category</option>
                                    {getParentCategories()
                                        .filter(c => c.id !== editingCategory?.id)
                                        .map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                </select>
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category Icon</label>

                                {formData.iconPreview ? (
                                    <div className="relative">
                                        <div className="w-full h-40 rounded-xl border-2 border-slate-200 overflow-hidden bg-slate-50">
                                            <img
                                                src={formData.iconPreview}
                                                alt="Preview"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-lg"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <p className="text-xs text-slate-500 mt-2 text-center">
                                            {formData.icon ? formData.icon.name : 'Current icon'}
                                        </p>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full h-40 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-3"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                                            <Upload className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-slate-600">Click to upload icon</p>
                                            <p className="text-xs text-slate-400 mt-1">PNG, JPG, SVG up to 5MB</p>
                                        </div>
                                    </div>
                                )}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {modalMode === 'create' ? 'Create' : 'Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 p-6 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-7 h-7 text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Category?</h3>
                        <p className="text-slate-500 text-sm mb-6">
                            This action cannot be undone. All subcategories will also be affected.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                disabled={deleteLoading}
                                className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {deleteLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryPage;
