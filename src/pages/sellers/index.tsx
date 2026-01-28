import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Store,
    Search,
    MoreHorizontal,
    Plus,
    Mail,
    ExternalLink,
    Ban,
    UserCheck,
    RefreshCw,
    Award,
    Loader2,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ShieldCheck,
    Users,
    CheckCircle
} from 'lucide-react';
import sellerService, { Seller } from '../../services/seller.service';
import toast from 'react-hot-toast';

const SellerPage: React.FC = () => {
    const navigate = useNavigate();

    const [sellers, setSellers] = useState<Seller[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;

    // Filter state
    const [activeTab, setActiveTab] = useState<'all' | 'verified' | 'official' | 'unverified'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch sellers
    const fetchSellers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const params: any = {
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch || undefined,
            };

            // Apply tab filters
            if (activeTab === 'verified') {
                params.isVerified = true;
            } else if (activeTab === 'official') {
                params.isOfficial = true;
            } else if (activeTab === 'unverified') {
                params.isVerified = false;
            }

            const response = await sellerService.getSellers(params);

            setSellers(response.items || []);
            setTotalPages(response.totalPages || 1);
            setTotalItems(response.totalItems || 0);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Gagal mengambil data penjual';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [currentPage, activeTab, debouncedSearch]);

    useEffect(() => {
        fetchSellers();
    }, [fetchSellers]);

    // Handle tab change
    const handleTabChange = (tab: 'all' | 'verified' | 'official' | 'unverified') => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    // Pagination handlers
    const goToFirstPage = () => setCurrentPage(1);
    const goToLastPage = () => setCurrentPage(totalPages);
    const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

    // Action handlers
    const handleUpdateStatus = async (sellerId: string, isVerified: boolean) => {
        try {
            const action = isVerified ? 'verifikasi' : 'suspend';
            if (!window.confirm(`Apakah Anda yakin ingin men-${action} penjual ini?`)) return;

            setLoading(true);
            await sellerService.verifySeller(sellerId);

            toast.success(`Berhasil men-${action} penjual`);
            fetchSellers();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Gagal memperbarui status penjual';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Generate page numbers
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

    const getStatusBadge = (seller: Seller) => {
        if (seller.isOfficial) {
            return (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-500 text-xs font-bold uppercase tracking-widest rounded-lg border border-indigo-500/20">
                    <Award className="w-3 h-3" /> Resmi
                </span>
            );
        }
        if (seller.isVerified) {
            return (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-widest rounded-lg border border-green-500/20">
                    <ShieldCheck className="w-3 h-3" /> Terverifikasi
                </span>
            );
        }
        return (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-500/10 text-slate-500 text-xs font-bold uppercase tracking-widest rounded-lg border border-slate-500/20">
                <UserCheck className="w-3 h-3" /> Reguler
            </span>
        );
    };

    const tabs = [
        { id: 'all', label: 'Semua Penjual', icon: Users },
        { id: 'verified', label: 'Terverifikasi', icon: ShieldCheck },
        { id: 'unverified', label: 'Belum Verifikasi', icon: UserCheck },
        { id: 'official', label: 'Resmi', icon: Award },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="text-left">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manajemen Penjual</h1>
                    <p className="text-slate-500 mt-1">Tinjau dan kelola semua pemilik toko yang terdaftar di platform Anda.</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/10 active:scale-95">
                        <Plus className="w-5 h-5" />
                        Invite Seller
                    </button> */}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Penjual</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{totalItems}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                        <Store className="w-5 h-5" />
                    </div>
                </div>
                <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Penjual Terverifikasi</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{(sellers || []).filter(s => s.isVerified).length}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-green-500/10 text-green-500">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                </div>
                <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mitra Resmi</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{(sellers || []).filter(s => s.isOfficial).length}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500">
                        <Award className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-2 p-1 bg-white border border-slate-200 rounded-2xl w-fit shadow-sm">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Gagal memuat penjual</h3>
                    <p className="text-slate-500 mb-4">{error}</p>
                    <button
                        onClick={() => fetchSellers()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all"
                    >
                        Coba Lagi
                    </button>
                </div>
            )}

            {/* Table */}
            {!loading && !error && (
                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden backdrop-blur-sm self-start">
                    <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Cari berdasarkan nama toko..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                            />
                        </div>
                        <button
                            onClick={() => fetchSellers()}
                            className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition-all"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Perbarui
                        </button>
                    </div>

                    <div className="overflow-x-auto text-left">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-200">
                                    <th className="px-8 py-5">Toko</th>
                                    <th className="px-8 py-5">Pemilik</th>
                                    <th className="px-8 py-5">Alamat</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-left">
                                {sellers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-16 text-center">
                                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                                <Store className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Penjual tidak ditemukan</h3>
                                            <p className="text-slate-500">Coba sesuaikan kriteria pencarian atau filter Anda.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    sellers.map((seller) => (
                                        <tr key={seller.id} className="group hover:bg-slate-50 transition-all border-b border-slate-100 last:border-none">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
                                                        {seller.logoUrl ? (
                                                            <img src={seller.logoUrl} alt={seller.storeName} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Store className="w-6 h-6 text-blue-600" />
                                                        )}
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="font-bold text-slate-900 text-base leading-tight">{seller.storeName}</p>
                                                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{seller.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-1.5 text-left">
                                                    <p className="font-semibold text-slate-900">{seller.user?.username || 'Tidak Diketahui'}</p>
                                                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                        <Mail className="w-3.5 h-3.5" />
                                                        {seller.user?.email || '-'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-slate-600 text-sm line-clamp-2">{seller.address || '-'}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                {getStatusBadge(seller)}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => navigate(`/main/sellers/${seller.id}`)}
                                                        className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-lg transition-all border border-slate-200"
                                                        title="Lihat Detail"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </button>

                                                    {!seller.isVerified ? (
                                                        <button
                                                            onClick={() => handleUpdateStatus(seller.id, true)}
                                                            className="p-2 bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700 rounded-lg transition-all border border-green-200"
                                                            title="Verifikasi Penjual"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                    ) : ""}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {sellers.length > 0 && (
                        <div className="p-6 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-xs font-medium text-slate-500">
                                Menampilkan <span className="font-bold text-slate-700">{((currentPage - 1) * itemsPerPage) + 1}</span> sampai{' '}
                                <span className="font-bold text-slate-700">{Math.min(currentPage * itemsPerPage, totalItems)}</span> dari{' '}
                                <span className="font-bold text-slate-700">{totalItems}</span> penjual
                            </p>

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
        </div>
    );
};

export default SellerPage;

