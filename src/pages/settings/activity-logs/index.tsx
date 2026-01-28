import React, { useState, useEffect, useCallback } from 'react';
import {
    Activity,
    Search,
    RefreshCw,
    Loader2,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    User,
    Clock,
    Globe,
    Info,
    Database
} from 'lucide-react';
import logService, { ActivityLog } from '../../../services/log.service';
import toast from 'react-hot-toast';

const ActivityLogsPage: React.FC = () => {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;

    // Filter state
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

    // Fetch logs
    const fetchLogs = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch || undefined,
            };

            const response = await logService.getActivityLogs(params);

            setLogs(response.data || []);
            setTotalPages(response.totalPages || 1);
            setTotalItems(response.totalItems || 0);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Gagal mengambil log aktivitas';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [currentPage, debouncedSearch]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    // Pagination handlers
    const goToFirstPage = () => setCurrentPage(1);
    const goToLastPage = () => setCurrentPage(totalPages);
    const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

    const getActionColor = (action: string) => {
        const a = action.toUpperCase();
        if (a.includes('CREATE') || a.includes('LOGIN')) return 'bg-green-500/10 text-green-500 border-green-500/20';
        if (a.includes('UPDATE')) return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        if (a.includes('DELETE')) return 'bg-red-500/10 text-red-500 border-red-500/20';
        return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="text-left">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Log Aktivitas</h1>
                    <p className="text-slate-500 mt-1">Jejak audit dari semua tindakan administratif yang dilakukan di platform.</p>
                </div>
            </div>

            {/* Filters & Table */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden backdrop-blur-sm self-start">
                <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Cari log berdasarkan aksi atau detail..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                    </div>
                    <button
                        onClick={() => fetchLogs()}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition-all"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Segarkan
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Gagal memuat log</h3>
                        <p className="text-slate-500 mb-4">{error}</p>
                        <button
                            onClick={() => fetchLogs()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all"
                        >
                            Coba Lagi
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto text-left">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-200">
                                    <th className="px-8 py-5">ID Pengguna</th>
                                    <th className="px-8 py-5">Aksi</th>
                                    <th className="px-8 py-5">Alamat IP</th>
                                    <th className="px-8 py-5">Detail</th>
                                    <th className="px-8 py-5">Waktu</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-left">
                                {logs.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-16 text-center">
                                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                                <Activity className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Tidak ada log aktivitas ditemukan</h3>
                                            <p className="text-slate-500">Coba sesuaikan kriteria pencarian Anda.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log) => (
                                        <tr key={log.id} className="group hover:bg-slate-50 transition-all border-b border-slate-100 last:border-none">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                                        <User className="w-4 h-4" />
                                                    </div>
                                                    <p className="font-semibold text-slate-900 text-xs truncate max-w-[120px]" title={log.userId}>{log.userId}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${getActionColor(log.action)}`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                                                    <span className="text-sm font-medium text-slate-600">{log.ipAddress || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-start gap-2">
                                                        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                                        <div className="text-xs text-slate-600 overflow-hidden">
                                                            {Object.entries(log.details || {}).map(([key, value]) => (
                                                                <div key={key} className="flex gap-2">
                                                                    <span className="font-bold text-slate-400 uppercase text-[9px]">{key}:</span>
                                                                    <span className="truncate">{JSON.stringify(value)}</span>
                                                                </div>
                                                            ))}
                                                            {(!log.details || Object.keys(log.details).length === 0) && <span className="text-slate-400 italic">Tidak ada detail tambahan</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {new Date(log.createdAt).toLocaleString()}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && !error && logs.length > 0 && (
                    <div className="p-6 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs font-medium text-slate-500">
                            Menampilkan <span className="font-bold text-slate-700">{((currentPage - 1) * itemsPerPage) + 1}</span> sampai{' '}
                            <span className="font-bold text-slate-700">{Math.min(currentPage * itemsPerPage, totalItems)}</span> dari{' '}
                            <span className="font-bold text-slate-700">{totalItems}</span> log
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
                                <span className="text-xs font-bold text-slate-600 px-2">Halaman {currentPage} dari {totalPages}</span>
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
        </div>
    );
};

export default ActivityLogsPage;
