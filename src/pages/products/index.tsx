import React, { useState, useEffect, useCallback } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Store,
    ChevronLeft,
    ChevronRight,
    Layers,
    DollarSign,
    Box,
    Loader2,
    AlertCircle,
    ChevronsLeft,
    ChevronsRight
} from 'lucide-react';
import productService, { Product } from '../../services/product.service';
import toast from 'react-hot-toast';

const ProductPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;

    // Filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const categories = ['Electronics', 'Wearables', 'Accessories', 'Computers', 'Furniture', 'Fashion', 'Home', 'Sports'];

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1); // Reset to first page on search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch products
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await productService.getProducts({
                page: currentPage,
                limit: itemsPerPage,
                category: selectedCategory || undefined,
                search: debouncedSearch || undefined,
            });

            setProducts(response.data || []);
            setTotalPages(response.totalPages || 1);
            setTotalItems(response.totalItems || 0);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch products';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [currentPage, selectedCategory, debouncedSearch]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Handle category change
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    // Pagination handlers
    const goToFirstPage = () => setCurrentPage(1);
    const goToLastPage = () => setCurrentPage(totalPages);
    const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

    // Format price
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    // Get stock status
    const getStockStatus = (stock: number) => {
        if (stock === 0) return { label: 'Out of Stock', className: 'bg-red-500/10 text-red-500 border-red-500/20' };
        if (stock <= 10) return { label: 'Low Stock', className: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
        return { label: 'In Stock', className: 'bg-green-500/10 text-green-500 border-green-500/20' };
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

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="text-left">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Marketplace Products</h1>
                    <p className="text-slate-500 mt-1">Oversee and manage product listings from all registered sellers.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/10 active:scale-95 text-sm">
                        <Plus className="w-4 h-4" />
                        New Listing
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Products', value: totalItems.toLocaleString(), icon: Box, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Active Sellers', value: '184', icon: Store, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                    { label: 'Low Stock Alert', value: (products || []).filter(p => p.stock > 0 && p.stock <= 10).length.toString(), icon: Filter, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    { label: 'Revenue (Today)', value: '$12,450', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
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
                        placeholder="Search product name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1">
                        <Layers className="w-4 h-4 text-slate-400" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="bg-transparent border-none text-slate-600 text-sm focus:outline-none py-1.5 cursor-pointer appearance-none min-w-[140px]"
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <button
                        onClick={() => fetchProducts()}
                        className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 transition-all"
                        title="Refresh"
                    >
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
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
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Failed to load products</h3>
                    <p className="text-slate-500 mb-4">{error}</p>
                    <button
                        onClick={() => fetchProducts()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Table Container */}
            {!loading && !error && (
                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden backdrop-blur-sm self-start">
                    <div className="overflow-x-auto text-left">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-200">
                                    <th className="px-8 py-5">Product Info</th>
                                    <th className="px-8 py-5">Seller</th>
                                    <th className="px-8 py-5 text-center">Price</th>
                                    <th className="px-8 py-5 text-center">Stock</th>
                                    <th className="px-8 py-5 text-center">Status</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-16 text-center">
                                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                                <Box className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No products found</h3>
                                            <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product) => {
                                        const stockStatus = getStockStatus(product.stock);
                                        return (
                                            <tr key={product.id} className="group hover:bg-slate-50 transition-all border-b border-slate-100 last:border-none">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative">
                                                            <div className="w-14 h-14 rounded-2xl bg-slate-100 border-2 border-slate-200 p-0.5 overflow-hidden group-hover:border-blue-500/50 transition-all shadow-lg">
                                                                {product.imageUrl ? (
                                                                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-700" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center bg-slate-200 rounded-xl">
                                                                        <Box className="w-6 h-6 text-slate-400" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-slate-900 text-base leading-tight group-hover:text-blue-600 transition-colors">{product.name}</p>
                                                            <p className="text-xs text-slate-400 mt-1 line-clamp-1">{product.description}</p>
                                                            <p className="text-[10px] text-slate-400 font-medium mt-1">In {product.category}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 w-fit">
                                                        <Store className="w-3.5 h-3.5 text-blue-500" />
                                                        <span className="text-xs font-semibold text-slate-600">{product.seller?.username || 'Unknown'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <p className="font-bold text-slate-900 text-base">{formatPrice(product.price)}</p>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <p className="text-sm font-bold text-slate-900">{product.stock} <span className="text-slate-500 font-medium">units</span></p>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all ${stockStatus.className}`}>
                                                        {stockStatus.label}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button className="p-2.5 bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-xl border border-slate-200 transition-all active:scale-90" title="Edit Product">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-2.5 bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-xl border border-slate-200 transition-all" title="Delete Product">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-xl border border-slate-200 transition-all">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Controls with Pagination */}
                    {products.length > 0 && (
                        <div className="p-6 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-xs font-medium text-slate-500">
                                Showing <span className="font-bold text-slate-700">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                                <span className="font-bold text-slate-700">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
                                <span className="font-bold text-slate-700">{totalItems}</span> products
                            </p>

                            {totalPages > 1 && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={goToFirstPage}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        title="First page"
                                    >
                                        <ChevronsLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={goToPreviousPage}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        title="Previous page"
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
                                        title="Next page"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={goToLastPage}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        title="Last page"
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

export default ProductPage;

