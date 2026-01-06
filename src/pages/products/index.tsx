import React, { useState } from 'react';
import {
    Package,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Store,
    ChevronLeft,
    ChevronRight,
    ArrowUpRight,
    Layers,
    DollarSign,
    Box
} from 'lucide-react';

interface Product {
    id: string;
    name: string;
    shopName: string;
    category: string;
    price: string;
    stock: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
    image: string;
}

const ProductPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');

    const [products] = useState<Product[]>([
        { id: 'PRD-001', name: 'Premium Wireless Headphones', shopName: 'Tech Haven', category: 'Electronics', price: '$299.00', stock: 45, status: 'In Stock', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop' },
        { id: 'PRD-002', name: 'Smart Fitness Tracker', shopName: 'Modern Gear', category: 'Wearables', price: '$129.00', stock: 12, status: 'Low Stock', image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=100&h=100&fit=crop' },
        { id: 'PRD-003', name: 'Leather Messenger Bag', shopName: 'Urban Style', category: 'Accessories', price: '$189.00', stock: 0, status: 'Out of Stock', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&h=100&fit=crop' },
        { id: 'PRD-004', name: 'Mechanical Gaming Keyboard', shopName: 'Tech Haven', category: 'Computers', price: '$159.00', stock: 89, status: 'In Stock', image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=100&h=100&fit=crop' },
        { id: 'PRD-005', name: 'Ergonomic Office Chair', shopName: 'Eco Spark', category: 'Furniture', price: '$449.00', stock: 23, status: 'In Stock', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=100&h=100&fit=crop' },
        { id: 'PRD-006', name: 'Minimalist Desk Lamp', shopName: 'Eco Spark', category: 'Furniture', price: '$79.00', stock: 56, status: 'In Stock', image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=100&h=100&fit=crop' },
        { id: 'PRD-007', name: 'Ultra HD Camera', shopName: 'Tech Haven', category: 'Electronics', price: '$1,299.00', stock: 8, status: 'Low Stock', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop' },
    ]);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.shopName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['Electronics', 'Wearables', 'Accessories', 'Computers', 'Furniture'];

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
                    { label: 'Total Products', value: '4,120', icon: Box, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Active Sellers', value: '184', icon: Store, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                    { label: 'Low Stock Alert', value: '32', icon: Filter, color: 'text-amber-500', bg: 'bg-amber-500/10' },
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
                        placeholder="Search product name or shop..."
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
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-transparent border-none text-slate-600 text-sm focus:outline-none py-1.5 cursor-pointer appearance-none min-w-[140px]"
                        >
                            <option value="All Categories">All Categories</option>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <button className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 transition-all">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden backdrop-blur-sm self-start">
                <div className="overflow-x-auto text-left">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-200">
                                <th className="px-8 py-5">Product Info</th>
                                <th className="px-8 py-5">Published By</th>
                                <th className="px-8 py-5 text-center">Price</th>
                                <th className="px-8 py-5 text-center">Catalog</th>
                                <th className="px-8 py-5 text-center">Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="group hover:bg-slate-50 transition-all border-b border-slate-100 last:border-none">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-800 border-2 border-slate-800 p-0.5 overflow-hidden group-hover:border-blue-500/50 transition-all shadow-lg">
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                </div>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-slate-900 text-base leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight">{product.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold mt-1 tracking-widest">SKU: {product.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 w-fit group/shop hover:border-slate-300 transition-all cursor-pointer">
                                            <Store className="w-3.5 h-3.5 text-blue-500" />
                                            <span className="text-xs font-bold text-slate-600 group-hover/shop:text-slate-900 transition-colors capitalize">{product.shopName}</span>
                                            <ArrowUpRight className="w-3 h-3 text-slate-400 opacity-0 group-hover/shop:opacity-100 group-hover/shop:translate-x-0.5 group-hover/shop:-translate-y-0.5 transition-all" />
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <p className="font-black text-slate-900 text-lg tracking-tighter">{product.price}</p>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">In {product.category}</span>
                                        <p className="text-sm font-bold text-slate-900">{product.stock} <span className="text-slate-500 font-medium">units</span></p>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all ${product.status === 'In Stock' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                            product.status === 'Low Stock' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-lg shadow-amber-500/5' :
                                                'bg-red-500/10 text-red-500 border-red-500/20 shadow-lg shadow-red-500/5'
                                            }`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2.5 bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-xl border border-slate-200 transition-all active:scale-90" title="Modify Product">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-xl border border-slate-200 transition-all">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer Controls */}
                <div className="p-6 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Showing {filteredProducts.length} of 4,120 indexed items</p>
                    <div className="flex items-center gap-3">
                        <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-400 cursor-not-allowed flex items-center gap-2">
                            <ChevronLeft className="w-4 h-4" /> Prev
                        </button>
                        <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
