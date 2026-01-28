import React, { useState } from 'react';
import {
    FolderTree,
    Search,
    Plus,
    Filter,
    Pencil,
    Trash2,
    X,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    RefreshCw,
    Folder,
    Tag
} from 'lucide-react';

interface Category {
    id: string;
    name: string;
}

interface SubCategory {
    id: string;
    categoryId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

const SubCategoriesPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
    const itemsPerPage = 8;

    // Form state
    const [formData, setFormData] = useState({
        categoryId: '',
        name: ''
    });

    // Mock categories
    const categories: Category[] = [
        { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Elektronik' },
        { id: '550e8400-e29b-41d4-a716-446655440010', name: 'Fashion' },
        { id: '550e8400-e29b-41d4-a716-446655440020', name: 'Kesehatan' },
        { id: '550e8400-e29b-41d4-a716-446655440030', name: 'Rumah Tangga' },
        { id: '550e8400-e29b-41d4-a716-446655440040', name: 'Olahraga' }
    ];

    // Mock subcategories
    const [subCategories, setSubCategories] = useState<SubCategory[]>([
        { id: '1', categoryId: '550e8400-e29b-41d4-a716-446655440000', name: 'Smartphone', createdAt: '2026-01-27T06:26:02.958Z', updatedAt: '2026-01-27T06:26:02.958Z' },
        { id: '2', categoryId: '550e8400-e29b-41d4-a716-446655440000', name: 'Laptop', createdAt: '2026-01-26T10:00:00.000Z', updatedAt: '2026-01-26T10:00:00.000Z' },
        { id: '3', categoryId: '550e8400-e29b-41d4-a716-446655440000', name: 'Tablet', createdAt: '2026-01-26T09:00:00.000Z', updatedAt: '2026-01-26T09:00:00.000Z' },
        { id: '4', categoryId: '550e8400-e29b-41d4-a716-446655440000', name: 'Aksesoris', createdAt: '2026-01-25T14:00:00.000Z', updatedAt: '2026-01-25T14:00:00.000Z' },
        { id: '5', categoryId: '550e8400-e29b-41d4-a716-446655440010', name: 'Pakaian Pria', createdAt: '2026-01-25T12:00:00.000Z', updatedAt: '2026-01-25T12:00:00.000Z' },
        { id: '6', categoryId: '550e8400-e29b-41d4-a716-446655440010', name: 'Pakaian Wanita', createdAt: '2026-01-25T11:00:00.000Z', updatedAt: '2026-01-25T11:00:00.000Z' },
        { id: '7', categoryId: '550e8400-e29b-41d4-a716-446655440010', name: 'Sepatu', createdAt: '2026-01-24T16:00:00.000Z', updatedAt: '2026-01-24T16:00:00.000Z' },
        { id: '8', categoryId: '550e8400-e29b-41d4-a716-446655440010', name: 'Tas', createdAt: '2026-01-24T15:00:00.000Z', updatedAt: '2026-01-24T15:00:00.000Z' },
        { id: '9', categoryId: '550e8400-e29b-41d4-a716-446655440020', name: 'Suplemen', createdAt: '2026-01-24T10:00:00.000Z', updatedAt: '2026-01-24T10:00:00.000Z' },
        { id: '10', categoryId: '550e8400-e29b-41d4-a716-446655440020', name: 'Vitamin', createdAt: '2026-01-23T09:00:00.000Z', updatedAt: '2026-01-23T09:00:00.000Z' },
        { id: '11', categoryId: '550e8400-e29b-41d4-a716-446655440030', name: 'Perabotan', createdAt: '2026-01-23T08:00:00.000Z', updatedAt: '2026-01-23T08:00:00.000Z' },
        { id: '12', categoryId: '550e8400-e29b-41d4-a716-446655440040', name: 'Alat Fitness', createdAt: '2026-01-22T14:00:00.000Z', updatedAt: '2026-01-22T14:00:00.000Z' }
    ]);

    // Get category name by ID
    const getCategoryName = (categoryId: string) => {
        return categories.find(c => c.id === categoryId)?.name || 'Unknown';
    };

    // Filter subcategories
    const filteredSubCategories = subCategories.filter(sub => {
        const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategoryFilter === 'all' || sub.categoryId === selectedCategoryFilter;
        return matchesSearch && matchesCategory;
    });

    // Pagination
    const totalPages = Math.ceil(filteredSubCategories.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentSubCategories = filteredSubCategories.slice(startIndex, startIndex + itemsPerPage);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const openCreateModal = () => {
        setSelectedSubCategory(null);
        setFormData({ categoryId: categories[0]?.id || '', name: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (subCategory: SubCategory) => {
        setSelectedSubCategory(subCategory);
        setFormData({
            categoryId: subCategory.categoryId,
            name: subCategory.name
        });
        setIsModalOpen(true);
    };

    const openDeleteModal = (subCategory: SubCategory) => {
        setSelectedSubCategory(subCategory);
        setIsDeleteModalOpen(true);
    };

    const handleSubmit = () => {
        setIsLoading(true);
        setTimeout(() => {
            if (selectedSubCategory) {
                // Update existing
                setSubCategories(subCategories.map(s => s.id === selectedSubCategory.id ? {
                    ...s,
                    categoryId: formData.categoryId,
                    name: formData.name,
                    updatedAt: new Date().toISOString()
                } : s));
            } else {
                // Create new
                const newSubCategory: SubCategory = {
                    id: crypto.randomUUID(),
                    categoryId: formData.categoryId,
                    name: formData.name,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                setSubCategories([newSubCategory, ...subCategories]);
            }
            setIsLoading(false);
            setIsModalOpen(false);
        }, 800);
    };

    const handleDelete = () => {
        if (selectedSubCategory) {
            setIsLoading(true);
            setTimeout(() => {
                setSubCategories(subCategories.filter(s => s.id !== selectedSubCategory.id));
                setIsLoading(false);
                setIsDeleteModalOpen(false);
            }, 500);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Pagination handlers
    const goToFirstPage = () => setCurrentPage(1);
    const goToLastPage = () => setCurrentPage(totalPages);
    const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight text-left">Sub Kategori</h1>
                    <p className="text-slate-500 mt-1">Kelola sub kategori produk untuk marketplace.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Sub Kategori
                </button>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col lg:flex-row items-center gap-4">
                <div className="flex-1 relative w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Cari sub kategori..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
                    />
                </div>
                <select
                    value={selectedCategoryFilter}
                    onChange={(e) => {
                        setSelectedCategoryFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="px-5 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm cursor-pointer"
                >
                    <option value="all">Semua Kategori</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                    Menampilkan <span className="font-semibold text-slate-700">{startIndex + 1}</span> sampai{' '}
                    <span className="font-semibold text-slate-700">{Math.min(startIndex + itemsPerPage, filteredSubCategories.length)}</span> dari{' '}
                    <span className="font-semibold text-slate-700">{filteredSubCategories.length}</span> sub kategori
                </p>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sub Kategori</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kategori Induk</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Dibuat</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Diperbarui</th>
                                <th className="text-center py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {currentSubCategories.map((sub) => (
                                <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                                <Tag className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <span className="font-semibold text-slate-900">{sub.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                            <Folder className="w-3 h-3" />
                                            {getCategoryName(sub.categoryId)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-slate-600 text-sm">{formatDate(sub.createdAt)}</td>
                                    <td className="py-4 px-6 text-slate-600 text-sm">{formatDate(sub.updatedAt)}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                onClick={() => openEditModal(sub)}
                                                className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(sub)}
                                                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {currentSubCategories.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                            <FolderTree className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Tidak ada sub kategori ditemukan</h3>
                        <p className="text-slate-500">Coba sesuaikan kriteria pencarian atau tambah sub kategori baru.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <button onClick={goToFirstPage} disabled={currentPage === 1} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all" title="Halaman pertama">
                        <ChevronsLeft className="w-5 h-5" />
                    </button>
                    <button onClick={goToPreviousPage} disabled={currentPage === 1} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all" title="Halaman sebelumnya">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-xl font-semibold transition-all ${currentPage === page
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                    <button onClick={goToNextPage} disabled={currentPage === totalPages} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all" title="Halaman berikutnya">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                    <button onClick={goToLastPage} disabled={currentPage === totalPages} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all" title="Halaman terakhir">
                        <ChevronsRight className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-slate-900">
                                {selectedSubCategory ? 'Edit Sub Kategori' : 'Tambah Sub Kategori Baru'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Category Select */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Folder className="w-3.5 h-3.5" /> Kategori Induk
                                </label>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
                                >
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Name Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Tag className="w-3.5 h-3.5" /> Nama Sub Kategori
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                    placeholder="Contoh: Smartphone"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
                            <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-medium hover:text-slate-900 transition-colors">
                                Batal
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!formData.name || !formData.categoryId || isLoading}
                                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                                {selectedSubCategory ? 'Simpan Perubahan' : 'Tambah'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && selectedSubCategory && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-8 h-8 text-red-600" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Hapus Sub Kategori?</h2>
                            <p className="text-slate-500">
                                Apakah Anda yakin ingin menghapus "{selectedSubCategory.name}"? Tindakan ini tidak dapat dibatalkan.
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-3 p-6 border-t border-slate-200">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="px-6 py-2.5 text-slate-600 font-medium hover:text-slate-900 transition-colors bg-slate-100 rounded-xl">
                                Batal
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl shadow-lg shadow-red-600/20 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubCategoriesPage;
