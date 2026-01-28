import React, { useState, useEffect, useCallback } from 'react';
import {
    TrendingUp,
    Users,
    DollarSign,
    ShoppingBag,
    MoreHorizontal,
    Box,
    Store,
    Loader2,
    AlertCircle,
    Trophy,
    ArrowUpRight
} from 'lucide-react';
import dashboardService, { DashboardSummary, DashboardAnalytics } from '../../services/dashboard.service';
import toast from 'react-hot-toast';

const DashboardPage: React.FC = () => {
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const [summaryData, analyticsData] = await Promise.all([
                dashboardService.getSummary(),
                dashboardService.getAnalytics()
            ]);
            setSummary(summaryData);
            setAnalytics(analyticsData);
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to fetch dashboard data';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const formatCurrency = (value: number | string) => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(num);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] animate-in fade-in duration-500">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <p className="text-slate-500 font-medium tracking-wide">Memuat kecerdasan marketplace...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center animate-in fade-in duration-500">
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Terjadi kesalahan</h2>
                <p className="text-slate-500 mb-8 max-w-md">{error}</p>
                <button
                    onClick={fetchData}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                    Coba Lagi
                </button>
            </div>
        );
    }

    const stats = [
        { label: 'Total Pendapatan', value: formatCurrency(summary?.totalRevenue || 0), change: '+12.5%', positive: true, icon: DollarSign, color: 'text-blue-500' },
        { label: 'Total Pengguna', value: summary?.totalUsers.toLocaleString() || '0', change: '+8.2%', positive: true, icon: Users, color: 'text-indigo-500' },
        { label: 'Transaksi', value: summary?.totalTransactions.toLocaleString() || '0', change: '+15.4%', positive: true, icon: ShoppingBag, color: 'text-emerald-500' },
        { label: 'Total Produk', value: summary?.totalProducts.toLocaleString() || '0', change: '+4.1%', positive: true, icon: Box, color: 'text-amber-500' },
        { label: 'Total Penjual', value: summary?.totalSellers.toLocaleString() || '0', change: '+2.3%', positive: true, icon: Store, color: 'text-rose-500' },
    ];

    // Chart logic
    const revenueTrend = analytics?.revenueTrend || [];
    const maxRevenue = Math.max(...revenueTrend.map(d => d.revenue), 1000000);
    const chartWidth = 500;
    const chartHeight = 200;
    const padding = 20;

    const points = revenueTrend.map((d, i) => {
        const x = (i / (revenueTrend.length - 1 || 1)) * (chartWidth - padding * 2) + padding;
        const y = chartHeight - ((d.revenue / maxRevenue) * (chartHeight - padding * 2) + padding);
        return { x, y };
    });

    const linePath = points.length > 0
        ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
        : '';

    const areaPath = linePath ? `${linePath} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z` : '';

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Ringkasan Marketplace</h1>
                    <p className="text-slate-500 mt-1">Indikator waktu nyata dari kesehatan dan performa ekosistem Anda.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={fetchData} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm group">
                        <TrendingUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-200 p-6 rounded-4xl shadow-sm hover:border-slate-300 transition-all group overflow-hidden relative">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 z-0" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-2xl bg-slate-50 border border-slate-100 ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg ${stat.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {stat.change}
                                    <ArrowUpRight className="w-3 h-3" />
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
                            <p className="text-xl font-bold text-slate-900 mt-1 wrap-break-word">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Top Products Table */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Produk Terlaris</h2>
                            <p className="text-sm text-slate-500 mt-1">Produk dengan volume penjualan tertinggi bulan ini.</p>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-2xl text-amber-500">
                            <Trophy className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                                    <th className="px-8 py-5">Detail Produk</th>
                                    <th className="px-8 py-5 text-center">Harga</th>
                                    <th className="px-8 py-5 text-center">Total Terjual</th>
                                    <th className="px-8 py-5 text-right">Pendapatan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {analytics?.topProducts.map((item, i) => (
                                    <tr key={i} className="hover:bg-slate-50/80 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs shadow-sm group-hover:border-blue-200 transition-colors">
                                                    #{i + 1}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.product.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ID: {item.productId.split('-')[0]}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center font-semibold text-slate-600">
                                            {formatCurrency(item.product.price)}
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs border border-blue-100">
                                                {item.totalSold} Unit
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right font-bold text-slate-900">
                                            {formatCurrency(item.totalSold * item.product.price)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-auto p-6 bg-slate-50/50 border-t border-slate-100 text-center">
                        <button className="text-sm font-bold text-blue-600 hover:text-blue-500 transition-colors flex items-center gap-2 mx-auto">
                            Lihat Laporan Inventaris Lengkap <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Growth Analytics Chart */}
                <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm p-8 flex flex-col relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl z-0" />

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Performa Pendapatan</h2>
                                <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Analisis Tren</p>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-[10px] border border-emerald-100">
                                <TrendingUp className="w-3 h-3" />
                                +12.5%
                            </div>
                        </div>

                        <div className="flex-1 relative min-h-[250px] mb-8">
                            {revenueTrend.length > 0 ? (
                                <>
                                    <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                                        <defs>
                                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        {areaPath && <path d={areaPath} fill="url(#chartGradient)" />}
                                        {linePath && <path d={linePath} fill="transparent" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-lg" />}
                                    </svg>

                                    <div className="absolute -bottom-2 left-0 right-0 flex justify-between px-2">
                                        {revenueTrend.map((d, i) => (
                                            <div key={i} className="flex flex-col items-center">
                                                <span className="text-[8px] font-bold text-slate-400 uppercase rotate-45 origin-left mt-2 whitespace-nowrap">
                                                    {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                    <p className="text-slate-400 font-bold text-sm">Data Tren Tidak Mencukupi</p>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-auto pt-8 border-t border-slate-100">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Periode</p>
                                <p className="text-xl font-bold text-slate-900">
                                    {formatCurrency(revenueTrend.reduce((acc, curr) => acc + curr.revenue, 0))}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Indeks Pertumbuhan</p>
                                <p className="text-xl font-bold text-blue-600">8.4 / 10</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
