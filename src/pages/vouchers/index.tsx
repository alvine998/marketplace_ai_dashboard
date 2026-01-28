import React, { useState, useEffect, useCallback } from 'react';
import {
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Loader2,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Ticket,
    Calendar,
    CheckCircle2,
    XCircle,
    X,
    Save,
    RefreshCw,
    Percent,
    Banknote
} from 'lucide-react';
import voucherService, { Voucher, CreateVoucherPayload } from '../../services/voucher.service';
import toast from 'react-hot-toast';

const VouchersPage: React.FC = () => {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
    const [formData, setFormData] = useState<CreateVoucherPayload>({
        code: '',
        type: 'discount',
        valueType: 'percentage',
        value: 0,
        minTransaction: 0,
        maxLimit: 0,
        quota: 0,
        expiryDate: new Date().toISOString().split('T')[0],
        isActive: true
    });

    // Delete confirmation state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [voucherToDelete, setVoucherToDelete] = useState<Voucher | null>(null);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
            setItemsPerPage(10);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch vouchers
    const fetchVouchers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await voucherService.getVouchers({
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch || undefined,
                isActive: statusFilter === 'all' ? undefined : statusFilter === 'active'
            });

            // Handle both 'items' (new standard) and 'data' (legacy) response structures
            const voucherData = (response as any).items || response.data || [];

            setVouchers(voucherData);
            setTotalPages(response.totalPages || 1);
            setTotalItems(response.totalItems || 0);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Gagal mengambil data voucher';
            console.error("Fetch error:", err);
            // Only set error if it's not a 429 to avoid UI loops if specific error handling needed
            if (err.response?.status !== 429) {
                setError(errorMessage);
            }
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [currentPage, debouncedSearch, statusFilter, itemsPerPage]);

    useEffect(() => {
        fetchVouchers();
    }, [fetchVouchers]);

    const handleOpenCreateModal = () => {
        setEditingVoucher(null);
        setFormData({
            code: '',
            type: 'discount',
            valueType: 'percentage',
            value: 0,
            minTransaction: 0,
            maxLimit: 0,
            quota: 0,
            expiryDate: new Date().toISOString().split('T')[0],
            isActive: true
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (voucher: Voucher) => {
        setEditingVoucher(voucher);
        setFormData({
            code: voucher.code,
            type: voucher.type,
            valueType: voucher.valueType,
            value: voucher.value,
            minTransaction: voucher.minTransaction,
            maxLimit: voucher.maxLimit,
            quota: voucher.quota,
            expiryDate: voucher.expiryDate.split('T')[0],
            isActive: voucher.isActive
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            if (editingVoucher) {
                await voucherService.update(editingVoucher.id, formData);
                toast.success('Voucher berhasil diperbarui');
            } else {
                await voucherService.create(formData);
                toast.success('Voucher berhasil dibuat');
            }
            setIsModalOpen(false);
            fetchVouchers();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Gagal menyimpan voucher');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!voucherToDelete) return;
        try {
            setIsSaving(true);
            await voucherService.delete(voucherToDelete.id);
            toast.success('Voucher berhasil dihapus');
            setIsDeleteModalOpen(false);
            fetchVouchers();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Gagal menghapus voucher');
        } finally {
            setIsSaving(false);
            setVoucherToDelete(null);
        }
    };

    const handleToggleStatus = async (voucher: Voucher) => {
        try {
            await voucherService.update(voucher.id, { isActive: !voucher.isActive });
            toast.success(`Voucher berhasil ${!voucher.isActive ? 'diaktifkan' : 'dinonaktifkan'}`);
            fetchVouchers();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Gagal memperbarui status');
        }
    };

    // Pagination handlers
    const goToFirstPage = () => setCurrentPage(1);
    const goToLastPage = () => setCurrentPage(totalPages);
    const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="text-left">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manajemen Voucher</h1>
                    <p className="text-slate-500 mt-1">Buat dan kelola voucher diskon untuk marketplace Anda.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleOpenCreateModal}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/10 active:scale-95 text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Buat Voucher
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Voucher', value: totalItems.toLocaleString(), icon: Ticket, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Aktif Sekarang', value: vouchers.filter(v => v.isActive).length.toString(), icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
                    { label: 'Total Penggunaan', value: '452', icon: RefreshCw, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                    { label: 'Segera Kedaluwarsa', value: '12', icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center justify-between group hover:border-slate-300 transition-all shadow-sm">
                        <div className="text-left">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                        </div>
                        <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters bar */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 bg-white/70 p-4 rounded-3xl border border-slate-200 backdrop-blur-md">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari kode voucher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="bg-transparent border-none text-slate-600 text-sm focus:outline-none py-1.5 cursor-pointer appearance-none min-w-[140px]"
                        >
                            <option value="all">Semua Status</option>
                            <option value="active">Aktif Saja</option>
                            <option value="inactive">Tidak Aktif Saja</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Loading/Error State */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Gagal memuat voucher</h3>
                    <p className="text-slate-500 mb-4">{error}</p>
                    <button
                        onClick={fetchVouchers}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all"
                    >
                        Coba Lagi
                    </button>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden backdrop-blur-sm self-start">
                    <div className="overflow-x-auto text-left">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-200">
                                    <th className="px-8 py-5">Kode Voucher</th>
                                    <th className="px-8 py-5">Tipe & Nilai</th>
                                    <th className="px-8 py-5">Syarat</th>
                                    <th className="px-8 py-5">Penggunaan</th>
                                    <th className="px-8 py-5">Kedaluwarsa</th>
                                    <th className="px-8 py-5 text-center">Status</th>
                                    <th className="px-8 py-5 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {vouchers.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-8 py-16 text-center">
                                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                                <Ticket className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Voucher tidak ditemukan</h3>
                                            <p className="text-slate-500">Coba sesuaikan pencarian Anda atau buat voucher baru.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    vouchers.map((voucher) => (
                                        <tr key={voucher.id} className="group hover:bg-slate-50 transition-all border-b border-slate-100 last:border-none">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                        <Ticket className="w-5 h-5" />
                                                    </div>
                                                    <span className="font-bold text-slate-900 text-base font-mono">{voucher.code}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                                                        {voucher.valueType === 'percentage' ? <Percent className="w-3.5 h-3.5" /> : <Banknote className="w-3.5 h-3.5" />}
                                                        <span>{voucher.value}{voucher.valueType === 'percentage' ? '%' : ''} Diskon</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{voucher.type}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-1">
                                                    <p className="text-xs text-slate-600">Min: <span className="font-bold text-slate-900">{formatCurrency(voucher.minTransaction)}</span></p>
                                                    {voucher.maxLimit > 0 && (
                                                        <p className="text-xs text-slate-600">Maks: <span className="font-bold text-slate-900">{formatCurrency(voucher.maxLimit)}</span></p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden min-w-[60px]">
                                                        <div
                                                            className="h-full bg-blue-500 rounded-full"
                                                            style={{ width: `${Math.min((0 / voucher.quota) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-700">0/{voucher.quota}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Calendar className="w-4 h-4 text-slate-400" />
                                                    <span className="text-sm">{new Date(voucher.expiryDate).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <button
                                                    onClick={() => handleToggleStatus(voucher)}
                                                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${voucher.isActive
                                                        ? 'bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20'
                                                        : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
                                                        }`}
                                                >
                                                    {voucher.isActive ? 'Aktif' : 'Tidak Aktif'}
                                                </button>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleOpenEditModal(voucher)}
                                                        className="p-2.5 bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-xl border border-slate-200 transition-all active:scale-90"
                                                        title="Edit Voucher"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setVoucherToDelete(voucher);
                                                            setIsDeleteModalOpen(true);
                                                        }}
                                                        className="p-2.5 bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-xl border border-slate-200 transition-all"
                                                        title="Hapus Voucher"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Controls with Pagination */}
                    {vouchers.length > 0 && (
                        <div className="p-6 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                                <p className="text-xs font-medium text-slate-500">
                                    Menampilkan <span className="font-bold text-slate-700">{((currentPage - 1) * itemsPerPage) + 1}</span> sampai{' '}
                                    <span className="font-bold text-slate-700">{Math.min(currentPage * itemsPerPage, totalItems)}</span> dari{' '}
                                    <span className="font-bold text-slate-700">{totalItems}</span> voucher
                                </p>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="bg-white border border-slate-200 text-slate-600 text-xs rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                                >
                                    <option value={10}>10 per halaman</option>
                                    <option value={20}>20 per halaman</option>
                                    <option value={50}>50 per halaman</option>
                                    <option value={100}>100 per halaman</option>
                                </select>
                            </div>

                            {totalPages > 1 && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={goToFirstPage}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronsLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={goToPreviousPage}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {getPageNumbers().map((page, index) => (
                                            typeof page === 'number' ? (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === page
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            ) : (
                                                <span key={index} className="px-1 text-slate-400">...</span>
                                            )
                                        ))}
                                    </div>

                                    <button
                                        onClick={goToNextPage}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={goToLastPage}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronsRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between p-8 border-b border-slate-100">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">{editingVoucher ? 'Edit Voucher' : 'Buat Voucher Baru'}</h2>
                                <p className="text-slate-500 text-sm mt-1">Isi detail untuk voucher diskon.</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)] custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Code */}
                                <div className="space-y-2 text-left">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">Kode Voucher</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono"
                                        placeholder="E.g. SUMMER70"
                                    />
                                </div>

                                {/* Status */}
                                <div className="space-y-2 text-left">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">Status</label>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${formData.isActive ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                                    >
                                        <span className="font-bold">{formData.isActive ? 'Aktif' : 'Tidak Aktif'}</span>
                                        {formData.isActive ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Type */}
                                <div className="space-y-2 text-left">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tipe Voucher</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
                                    >
                                        <option value="discount">Diskon</option>
                                        <option value="shipping">Gratis Ongkir</option>
                                        <option value="cashback">Cashback</option>
                                    </select>
                                </div>

                                {/* Value Type */}
                                <div className="space-y-2 text-left">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tipe Nilai</label>
                                    <select
                                        value={formData.valueType}
                                        onChange={(e) => setFormData({ ...formData, valueType: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
                                    >
                                        <option value="percentage">Persentase (%)</option>
                                        <option value="fixed">Nominal Tetap (IDR)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Value */}
                                <div className="space-y-2 text-left">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nilai</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.value}
                                        onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                        min="0"
                                    />
                                </div>

                                {/* Quota */}
                                <div className="space-y-2 text-left">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kuota</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.quota}
                                        onChange={(e) => setFormData({ ...formData, quota: Number(e.target.value) })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Min Transaction */}
                                <div className="space-y-2 text-left">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Min. Transaksi (IDR)</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.minTransaction}
                                        onChange={(e) => setFormData({ ...formData, minTransaction: Number(e.target.value) })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                        min="0"
                                    />
                                </div>

                                {/* Max Limit */}
                                <div className="space-y-2 text-left">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Maks. Batas Diskon (IDR)</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.maxLimit}
                                        onChange={(e) => setFormData({ ...formData, maxLimit: Number(e.target.value) })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                        min="0"
                                    />
                                </div>
                            </div>

                            {/* Expiry Date */}
                            <div className="space-y-2 text-left">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tanggal Kedaluwarsa</label>
                                <input
                                    required
                                    type="date"
                                    value={formData.expiryDate}
                                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-6 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl font-bold transition-all border border-slate-200"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:bg-slate-700"
                                >
                                    {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    {editingVoucher ? 'Perbarui Voucher' : 'Buat Voucher'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-300">
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                                <Trash2 className="w-10 h-10 text-red-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Hapus Voucher?</h2>
                            <p className="text-slate-500 mt-2">
                                Apakah Anda yakin ingin menghapus <span className="font-bold text-slate-900 font-mono">"{voucherToDelete?.code}"</span>? Tindakan ini tidak dapat dibatalkan.
                            </p>
                        </div>
                        <div className="mt-8 flex gap-3">
                            <button
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setVoucherToDelete(null);
                                }}
                                className="flex-1 px-6 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl font-bold transition-all border border-slate-200"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isSaving}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-red-500/20 active:scale-95 disabled:bg-slate-700"
                            >
                                {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VouchersPage;
