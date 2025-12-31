import React from 'react';
import {
    Package,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    ExternalLink,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const ProductPage: React.FC = () => {
    const products = [
        { id: '1', name: 'Premium Wireless Headphones', category: 'Electronics', price: '$299.00', stock: 45, status: 'In Stock', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop' },
        { id: '2', name: 'Smart Fitness Tracker', category: 'Wearables', price: '$129.00', stock: 12, status: 'Low Stock', image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=100&h=100&fit=crop' },
        { id: '3', name: 'Leather Messenger Bag', category: 'Accessories', price: '$189.00', stock: 0, status: 'Out of Stock', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&h=100&fit=crop' },
        { id: '4', name: 'Mechanical Gaming Keyboard', category: 'Computers', price: '$159.00', stock: 89, status: 'In Stock', image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=100&h=100&fit=crop' },
        { id: '5', name: 'Ergonomic Office Chair', category: 'Furniture', price: '$449.00', stock: 23, status: 'In Stock', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=100&h=100&fit=crop' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Products</h1>
                    <p className="text-slate-400 mt-1">Manage your catalog and inventory.</p>
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95">
                    <Plus className="w-5 h-5" />
                    Add Product
                </button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-12 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all">
                        <Filter className="w-5 h-5" />
                        Filters
                    </button>
                    <select className="px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-300 hover:text-white focus:outline-none transition-all">
                        <option>All Categories</option>
                        <option>Electronics</option>
                        <option>Wearables</option>
                        <option>Accessories</option>
                    </select>
                </div>
            </div>

            {/* Product Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-950/50 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-white truncate">{product.name}</p>
                                                <p className="text-xs text-slate-500">ID: {product.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-300 text-sm">{product.category}</span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-white">
                                        {product.price}
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 text-sm">
                                        {product.stock} units
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${product.status === 'In Stock' ? 'bg-green-500/10 text-green-500' :
                                                product.status === 'Low Stock' ? 'bg-amber-500/10 text-amber-500' :
                                                    'bg-red-500/10 text-red-500'
                                            }`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 transition-all">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-800 flex items-center justify-between">
                    <p className="text-sm text-slate-500">Showing 1 to 5 of 24 products</p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-50 transition-all">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-50 transition-all">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
