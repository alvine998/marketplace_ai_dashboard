import React, { useState, useEffect, useRef } from 'react';
import {
    Megaphone,
    Plus,
    Search,
    Filter,
    Pencil,
    Trash2,
    X,
    Loader2,
    Image as ImageIcon,
    Layout,
    Type,
    Smartphone,
    Save,
    Upload,
    MoreHorizontal,
    CheckCircle,
    XCircle,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import promoService, { Promo, PromoInput } from '../../services/promo.service';
import { getSafeImageUrl } from '../../utils/image';
import toast from 'react-hot-toast';

const PromoPage: React.FC = () => {
    // Data State
    const [promos, setPromos] = useState<Promo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 9;

    // UI State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPromo, setSelectedPromo] = useState<Promo | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Form State
    const [formData, setFormData] = useState<PromoInput>({
        title: '',
        message: '',
        ctaText: '',
        isActive: true,
        status: 'published',
        image: null
    });
    const [imagePreview, setImagePreview] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch Promos
    const fetchPromos = async () => {
        setIsLoading(true);
        try {
            const response = await promoService.getPromos({
                page: currentPage,
                limit: itemsPerPage,
                search: searchQuery
            });

            // Handle { items: [...], totalItems: ..., totalPages: ... } structure
            const data = response.items || response.data || (Array.isArray(response) ? response : []);
            setPromos(data);
            setTotalPages(response.totalPages || 1);
            setTotalItems(response.totalItems || data.length);
        } catch (error) {
            console.error('Error fetching promos:', error);
            toast.error('Gagal memuat daftar promosi');
            setPromos([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPromos();
    }, [currentPage, searchQuery]);

    // Handlers
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const openCreateModal = () => {
        setSelectedPromo(null);
        setFormData({
            title: '',
            message: '',
            ctaText: '',
            isActive: true,
            status: 'published',
            image: null
        });
        setImagePreview('');
        setIsModalOpen(true);
    };

    const openEditModal = (promo: Promo) => {
        setSelectedPromo(promo);
        setFormData({
            title: promo.title,
            message: promo.message,
            ctaText: promo.ctaText || '',
            isActive: promo.isActive,
            status: promo.status,
            image: null
        });
        setImagePreview(getSafeImageUrl(promo.imageUrl));
        setIsModalOpen(true);
    };

    const openDeleteModal = (promo: Promo) => {
        setSelectedPromo(promo);
        setIsDeleteModalOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.message) {
            toast.error('Judul dan Pesan wajib diisi');
            return;
        }

        setIsLoading(true);
        try {
            if (selectedPromo) {
                await promoService.updatePromo(selectedPromo.id, formData);
                toast.success('Promo berhasil diperbarui');
            } else {
                await promoService.createPromo(formData);
                toast.success('Promo berhasil dibuat');
            }
            setIsModalOpen(false);
            fetchPromos();
        } catch (error) {
            console.error('Error saving promo:', error);
            toast.error('Gagal menyimpan promo');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedPromo) return;

        setIsLoading(true);
        try {
            await promoService.deletePromo(selectedPromo.id);
            toast.success('Promo berhasil dihapus');
            setIsDeleteModalOpen(false);
            setPromos(promos.filter(p => p.id !== selectedPromo.id));
        } catch (error) {
            console.error('Error deleting promo:', error);
            toast.error('Gagal menghapus promo');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight text-left">Promosi / Pop-ups</h1>
                    <p className="text-slate-500 mt-1">Kelola banner promosi yang muncul saat pengguna membuka aplikasi.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Buat Promo Baru
                </button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col lg:flex-row items-center gap-4">
                <div className="flex-1 relative w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Cari promo..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
                    />
                </div>
                <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all">
                    <Filter className="w-5 h-5" />
                    Filter
                </button>
            </div>

            {/* Content List */}
            {isLoading && promos.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {promos.map((promo) => (
                        <div key={promo.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group relative">
                            {/* Image Header */}
                            <div className="relative h-48 bg-slate-100">
                                <img
                                    src={getSafeImageUrl(promo.imageUrl)}
                                    alt={promo.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                    }}
                                />
                                <div className="absolute top-3 left-3">
                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-widest backdrop-blur-md ${promo.isActive
                                        ? 'bg-green-500/90 text-white shadow-lg shadow-green-500/20'
                                        : 'bg-slate-500/90 text-white'
                                        }`}>
                                        {promo.isActive ? 'Aktif' : 'Non-Aktif'}
                                    </span>
                                </div>
                                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openEditModal(promo)}
                                        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition-all shadow-md"
                                        title="Edit"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(promo)}
                                        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all shadow-md"
                                        title="Hapus"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-5 space-y-3">
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <h3 className="font-bold text-slate-900 text-lg leading-tight line-clamp-1">{promo.title}</h3>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${promo.status === 'published'
                                            ? 'bg-blue-50 text-blue-600 border-blue-100'
                                            : 'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                            {promo.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{promo.message}</p>
                                </div>

                                {promo.ctaText && (
                                    <div className="pt-3 border-t border-slate-100">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-2 rounded-lg w-fit">
                                            <Layout className="w-3.5 h-3.5" />
                                            Btn: {promo.ctaText}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Add New Card (Empty State-ish) */}
                    <button
                        onClick={openCreateModal}
                        className="flex flex-col items-center justify-center gap-4 h-[340px] border-2 border-dashed border-slate-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
                    >
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <Plus className="w-6 h-6 text-slate-400 group-hover:text-blue-500" />
                        </div>
                        <p className="font-medium text-slate-500 group-hover:text-blue-600">Buat Promo Baru</p>
                    </button>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-xl font-semibold transition-all ${currentPage === page
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 flex items-center justify-between p-6 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-slate-900">
                                {selectedPromo ? 'Edit Promo' : 'Buat Promo Baru'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Title */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Type className="w-3.5 h-3.5" /> Judul
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                                        placeholder="Judul promo..."
                                    />
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <CheckCircle className="w-3.5 h-3.5" /> Status
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                        <option value="expired">Expired</option>
                                    </select>
                                </div>
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Smartphone className="w-3.5 h-3.5" /> Pesan
                                </label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    rows={3}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                                    placeholder="Isi pesan promo..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* CTA Text */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Layout className="w-3.5 h-3.5" /> Teks Tombol (CTA)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.ctaText}
                                        onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                        placeholder="Contoh: Beli Sekarang"
                                    />
                                </div>

                                {/* Active Toggle */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <CheckCircle className="w-3.5 h-3.5" /> Aktif?
                                    </label>
                                    <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                                        <span className="text-sm font-medium text-slate-700">Tampilkan Promo</span>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                            className={`w-11 h-6 rounded-full relative transition-all ${formData.isActive ? 'bg-green-500' : 'bg-slate-300'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isActive ? 'left-6' : 'left-1'}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <ImageIcon className="w-3.5 h-3.5" /> Gambar
                                </label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                                {!imagePreview ? (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50/50 transition-all"
                                    >
                                        <Upload className="w-6 h-6 text-slate-400" />
                                        <span className="text-sm text-slate-500">Klik untuk upload gambar</span>
                                    </button>
                                ) : (
                                    <div className="relative h-48 bg-slate-100 rounded-xl overflow-hidden group">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="p-2 bg-white rounded-lg text-slate-900 hover:bg-slate-100"
                                            >
                                                <Upload className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImagePreview('');
                                                    setFormData({ ...formData, image: null });
                                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                                }}
                                                className="p-2 bg-white rounded-lg text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2.5 text-slate-600 font-medium hover:text-slate-900 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {selectedPromo ? 'Simpan Perubahan' : 'Buat Promo'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && selectedPromo && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-8 h-8 text-red-600" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Hapus Promo?</h2>
                            <p className="text-slate-500">
                                Apakah Anda yakin ingin menghapus "{selectedPromo.title}"? Tindakan ini tidak dapat dibatalkan.
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-3 p-6 border-t border-slate-200">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-6 py-2.5 text-slate-600 font-medium hover:text-slate-900 bg-slate-100 rounded-xl transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl shadow-lg shadow-red-600/20 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromoPage;
