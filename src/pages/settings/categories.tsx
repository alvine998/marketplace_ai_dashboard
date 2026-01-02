import React, { useState } from 'react';
import {
    Layers,
    Plus,
    Search,
    MoreHorizontal,
    ChevronRight,
    ChevronDown,
    Folder,
    Smartphone,
    Laptop,
    Glasses,
    Clock,
    Edit,
    Trash2,
    Box,
    Image as ImageIcon
} from 'lucide-react';

interface Category {
    id: string;
    name: string;
    icon: any;
    productCount: number;
    subcategories?: Category[];
}

const CategoryPage: React.FC = () => {
    const [categories] = useState<Category[]>([
        {
            id: '1', name: 'Electronics', icon: Laptop, productCount: 1240,
            subcategories: [
                { id: '1-1', name: 'Smartphones', icon: Smartphone, productCount: 450 },
                { id: '1-2', name: 'Laptops', icon: Laptop, productCount: 380 },
                { id: '1-3', name: 'Wearables', icon: Clock, productCount: 220 },
            ]
        },
        {
            id: '2', name: 'Fashion', icon: Box, productCount: 840,
            subcategories: [
                { id: '2-1', name: 'Men\'s Wear', icon: User, productCount: 410 },
                { id: '2-2', name: 'Women\'s Wear', icon: User, productCount: 380 },
            ]
        },
        { id: '3', name: 'Accessories', icon: Glasses, productCount: 520 },
    ]);

    const [expanded, setExpanded] = useState<string[]>(['1']);

    const toggleExpand = (id: string) => {
        setExpanded(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="text-left">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Product Categories</h1>
                    <p className="text-slate-400 mt-1">Organize your marketplace hierarchy and category icons.</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/10 active:scale-95 text-sm">
                    <Plus className="w-4 h-4" />
                    New Category
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Category Tree */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm shadow-xl">
                    <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Layers className="w-5 h-5 text-blue-500" /> Catalog Tree
                        </h2>
                        <div className="flex items-center gap-4">
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Total Categories: 12</p>
                        </div>
                    </div>

                    <div className="p-4 space-y-2">
                        {categories.map((cat) => (
                            <div key={cat.id} className="space-y-1">
                                <div className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${expanded.includes(cat.id) ? 'bg-slate-800/50 border-slate-700 shadow-lg' : 'bg-slate-950/20 border-slate-800 hover:border-slate-700'}`}>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => toggleExpand(cat.id)}
                                            className={`p-1.5 rounded-lg transition-all ${expanded.includes(cat.id) ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'hover:bg-slate-800 text-slate-500'}`}
                                        >
                                            {expanded.includes(cat.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                        </button>
                                        <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-blue-500 shadow-inner">
                                            <cat.icon className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-white text-base leading-tight">{cat.name}</p>
                                            <p className="text-xs text-slate-500 font-medium mt-0.5">{cat.productCount} Products</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-all">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-all">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {expanded.includes(cat.id) && cat.subcategories && (
                                    <div className="pl-14 space-y-2 mt-2 animate-in slide-in-from-top-2 duration-300">
                                        {cat.subcategories.map((sub) => (
                                            <div key={sub.id} className="flex items-center justify-between p-3.5 bg-slate-900 shadow-sm border border-slate-800 rounded-xl hover:border-slate-700 transition-all group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500">
                                                        <sub.icon className="w-4 h-4" />
                                                    </div>
                                                    <div className="text-xs text-left">
                                                        <p className="font-bold text-slate-200">{sub.name}</p>
                                                        <p className="text-slate-500 font-medium">{sub.productCount} Items</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-1.5 hover:bg-slate-700 text-slate-500 hover:text-white rounded-lg transition-all"><Edit className="w-3.5 h-3.5" /></button>
                                                    <button className="p-1.5 hover:bg-red-500/10 text-slate-500 hover:text-red-500 rounded-lg transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Creation View */}
                <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-sm text-left">
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-white">Quick Add Entry</h3>
                        <p className="text-xs text-slate-500 mt-1 font-medium italic">Create a new classification level</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Entry Name</label>
                            <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" placeholder="e.g. Gaming Gear" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Parent Level</label>
                            <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer">
                                <option value="none">Create as Root</option>
                                <option value="electronics">Electronics</option>
                                <option value="fashion">Fashion</option>
                            </select>
                        </div>

                        <div className="space-y-2 pt-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Assign Icon</label>
                            <div className="grid grid-cols-4 gap-2">
                                {[Box, Smartphone, Laptop, Clock, Folder, Layers, ImageIcon, Plus].map((Icon, i) => (
                                    <button key={i} className={`p-3 rounded-xl border border-slate-800 bg-slate-950 hover:bg-blue-600/10 hover:border-blue-500/50 transition-all flex items-center justify-center text-slate-500 hover:text-blue-500 ${i === 2 ? 'border-blue-500 text-blue-500 bg-blue-500/10' : ''}`}>
                                        <Icon className="w-5 h-5" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button className="w-full py-4 bg-slate-800 hover:bg-blue-600 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95 text-sm mt-4">
                            Confirm Classification
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Simple User icon proxy since User is not imported in original snippet but needed for Fashion subcat
const User: React.FC<any> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);

export default CategoryPage;
