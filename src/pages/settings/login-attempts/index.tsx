import React, { useState, useEffect, useCallback } from 'react';
import {
    LogIn,
    Search,
    RefreshCw,
    Loader2,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Mail,
    Globe,
    ShieldCheck,
    ShieldAlert,
    Clock
} from 'lucide-react';
import logService, { LoginAttempt } from '../../../services/log.service';
import toast from 'react-hot-toast';

const LoginAttemptsPage: React.FC = () => {
    const [attempts, setAttempts] = useState<LoginAttempt[]>([]);
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

    // Fetch attempts
    const fetchAttempts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch || undefined,
            };

            const response = await logService.getLoginAttempts(params);

            setAttempts(response.data || []);
            setTotalPages(response.totalPages || 1);
            setTotalItems(response.totalItems || 0);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch login attempts';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [currentPage, debouncedSearch]);

    useEffect(() => {
        fetchAttempts();
    }, [fetchAttempts]);

    // Pagination handlers
    const goToFirstPage = () => setCurrentPage(1);
    const goToLastPage = () => setCurrentPage(totalPages);
    const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="text-left">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Login Attempts</h1>
                    <p className="text-slate-500 mt-1">Monitor all successful and failed authentication attempts.</p>
                </div>
            </div>

            {/* Filters & Table */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden backdrop-blur-sm self-start">
                <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by email or IP..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                    </div>
                    <button
                        onClick={() => fetchAttempts()}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition-all"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
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
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Failed to load attempts</h3>
                        <p className="text-slate-500 mb-4">{error}</p>
                        <button
                            onClick={() => fetchAttempts()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto text-left">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-200">
                                    <th className="px-8 py-5">Email</th>
                                    <th className="px-8 py-5">IP Address</th>
                                    <th className="px-8 py-5 text-center">Status</th>
                                    <th className="px-8 py-5">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-left">
                                {attempts.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-16 text-center">
                                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                                <LogIn className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No login attempts found</h3>
                                            <p className="text-slate-500">Try adjusting your search criteria.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    attempts.map((attempt) => (
                                        <tr key={attempt.id} className="group hover:bg-slate-50 transition-all border-b border-slate-100 last:border-none">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <Mail className="w-4 h-4 text-slate-400" />
                                                    <p className="font-semibold text-slate-900 text-sm">{attempt.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <Globe className="w-4 h-4 text-slate-400" />
                                                    <span className="text-sm font-medium text-slate-600">{attempt.ipAddress || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <div className="inline-flex items-center justify-center">
                                                    {attempt.isSuccess ? (
                                                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-green-500/20">
                                                            <ShieldCheck className="w-3 h-3" /> Success
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-red-500/20">
                                                            <ShieldAlert className="w-3 h-3" /> Failed
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {new Date(attempt.createdAt).toLocaleString()}
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
                {!loading && !error && attempts.length > 0 && (
                    <div className="p-6 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs font-medium text-slate-500">
                            Showing <span className="font-bold text-slate-700">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                            <span className="font-bold text-slate-700">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
                            <span className="font-bold text-slate-700">{totalItems}</span> attempts
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
                                <span className="text-xs font-bold text-slate-600 px-2">Page {currentPage} of {totalPages}</span>
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

export default LoginAttemptsPage;
