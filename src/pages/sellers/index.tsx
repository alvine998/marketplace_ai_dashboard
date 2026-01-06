import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Store,
    Search,
    Filter,
    MoreHorizontal,
    Plus,
    Mail,
    Phone,
    Calendar,
    ChevronRight,
    ShieldCheck,
    AlertCircle,
    Clock,
    ExternalLink,
    Ban,
    UserCheck,
    RefreshCw,
    Award
} from 'lucide-react';

interface Seller {
    id: string;
    name: string;
    shopName: string;
    email: string;
    joinDate: string;
    status: 'active' | 'official' | 'pending' | 'suspended';
    totalSales: string;
    rating: number;
}

const SellerPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'active' | 'official' | 'pending' | 'suspended'>('active');
    const [searchTerm, setSearchTerm] = useState('');

    const [sellers] = useState<Seller[]>([
        { id: '1', name: 'John Doe', shopName: 'Tech Haven', email: 'john@techhaven.com', joinDate: 'Jan 12, 2025', status: 'official', totalSales: '$24,500', rating: 4.8 },
        { id: '2', name: 'Sarah Miller', shopName: 'Eco Spark', email: 'sarah@ecospark.io', joinDate: 'Feb 05, 2025', status: 'pending', totalSales: '$0', rating: 0 },
        { id: '3', name: 'Robert Fox', shopName: 'Modern Gear', email: 'robert@moderngear.net', joinDate: 'Dec 20, 2024', status: 'suspended', totalSales: '$12,800', rating: 4.2 },
        { id: '4', name: 'Julie Smith', shopName: 'Creative Core', email: 'julie@creative.com', joinDate: 'Mar 15, 2025', status: 'official', totalSales: '$8,400', rating: 4.9 },
        { id: '5', name: 'Michael Chen', shopName: 'Urban Style', email: 'chen@urbanstyle.com', joinDate: 'Jan 30, 2025', status: 'active', totalSales: '$42,100', rating: 4.7 },
    ]);

    const filteredSellers = sellers.filter(seller => {
        const matchesSearch = seller.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            seller.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch && seller.status === activeTab;
    });

    const getStatusBadge = (status: Seller['status']) => {
        switch (status) {
            case 'official':
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-500 text-xs font-bold uppercase tracking-widest rounded-lg border border-indigo-500/20">
                        <Award className="w-3 h-3" /> Official
                    </span>
                );
            case 'active':
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-widest rounded-lg border border-green-500/20">
                        <UserCheck className="w-3 h-3" /> Active
                    </span>
                );
            case 'pending':
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-bold uppercase tracking-widest rounded-lg border border-amber-500/20">
                        <Clock className="w-3 h-3" /> Pending
                    </span>
                );
            case 'suspended':
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-widest rounded-lg border border-red-500/20">
                        <Ban className="w-3 h-3" /> Suspended
                    </span>
                );
        }
    };

    const tabs = [
        { id: 'active', label: 'Active Seller', icon: UserCheck },
        { id: 'official', label: 'Official Seller', icon: Award },
        { id: 'pending', label: 'Pending Seller', icon: Clock },
        { id: 'suspended', label: 'Suspend Seller', icon: Ban },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="text-left">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Seller Management</h1>
                    <p className="text-slate-500 mt-1">Review and manage all registered shop owners on your platform.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/10 active:scale-95">
                        <Plus className="w-5 h-5" />
                        Invite Seller
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-2 p-1 bg-white border border-slate-200 rounded-2xl w-fit shadow-sm">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
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

            {/* Filters & Table */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden backdrop-blur-sm self-start">
                <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by shop or name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto text-left">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-200">
                                <th className="px-8 py-5">Merchant / Shop</th>
                                <th className="px-8 py-5">Contact</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5">Sales</th>
                                <th className="px-8 py-5">Rating</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-left">
                            {filteredSellers.map((seller) => (
                                <tr key={seller.id} className="group hover:bg-slate-50 transition-all border-b border-slate-100 last:border-none">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-600 shadow-inner group-hover:scale-105 transition-transform">
                                                <Store className="w-6 h-6" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-slate-900 text-base leading-tight">{seller.shopName}</p>
                                                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                                                    Joined {seller.joinDate}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1.5 text-left">
                                            <div className="flex items-center gap-2 text-slate-600 text-sm">
                                                <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                {seller.email}
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium">{seller.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {getStatusBadge(seller.status)}
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="font-bold text-slate-900">{seller.totalSales}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-1.5">
                                            <span className="px-2 py-0.5 bg-blue-600/10 text-blue-500 text-xs font-bold rounded-lg border border-blue-500/20">
                                                ⭐ {seller.rating > 0 ? seller.rating : 'N/A'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/main/sellers/${seller.id}`)}
                                                className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-lg transition-all border border-slate-200"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                            <div className="relative group/actions">
                                                <button className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-lg transition-all border border-slate-200">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                                {/* Tooltip-style Actions Dropdown */}
                                                <div className="absolute bottom-full right-0 mb-2 w-40 bg-white border border-slate-200 rounded-xl shadow-2xl opacity-0 invisible group-hover/actions:opacity-100 group-hover/actions:visible transition-all z-10 p-1.5">
                                                    {activeTab === 'suspended' ? (
                                                        <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-green-500/10 text-green-500 text-xs font-bold rounded-lg transition-all">
                                                            <RefreshCw className="w-3.5 h-3.5" /> Reactivate
                                                        </button>
                                                    ) : (
                                                        <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-500/10 text-red-500 text-xs font-bold rounded-lg transition-all">
                                                            <Ban className="w-3.5 h-3.5" /> Suspend
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SellerPage;
