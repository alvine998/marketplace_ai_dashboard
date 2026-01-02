import React, { useState } from 'react';
import {
    CreditCard,
    Search,
    Filter,
    MoreVertical,
    User,
    Calendar,
    BadgeCheck,
    Timer,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    Download
} from 'lucide-react';

const AIChatOrdersPage: React.FC = () => {
    const orders = [
        { id: 'ORD-7721', user: 'TechFlow Solutions', email: 'billing@techflow.com', plan: 'AI Pro Monthly', date: 'Jan 02, 2026', amount: '$49.00', status: 'Active', expiry: 'Feb 02, 2026' },
        { id: 'ORD-7650', user: 'Global Merch Co.', email: 'admin@globalmerch.io', plan: 'AI Enterprise', date: 'Jan 01, 2026', amount: '$499.00', status: 'Active', expiry: 'Jan 01, 2027' },
        { id: 'ORD-7589', user: 'Crafty Creations', email: 'hello@crafty.shop', plan: 'AI Basic', date: 'Dec 28, 2025', amount: '$19.00', status: 'Canceled', expiry: 'Jan 28, 2026' },
        { id: 'ORD-7521', user: 'Urban Gear', email: 'orders@urbangear.com', plan: 'AI Pro Monthly', date: 'Dec 24, 2025', amount: '$49.00', status: 'Expired', expiry: 'Jan 24, 2026' },
        { id: 'ORD-7442', user: 'Wellness Hub', email: 'jane@wellnesshub.id', plan: 'AI Pro Annual', date: 'Dec 20, 2025', amount: '$490.00', status: 'Active', expiry: 'Dec 20, 2026' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">AI Chat Orders</h1>
                    <p className="text-slate-400 mt-1">Management of all users who purchased AI features.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl border border-slate-700 transition-all">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                    <div className="bg-linear-to-tr from-blue-600 to-indigo-600 p-px rounded-xl">
                        <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-transparent text-white font-semibold rounded-[11px] transition-all">
                            <TrendingUp className="w-4 h-4" />
                            View Revenue
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Quick View */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Active Subscriptions', val: '1,284', color: 'text-green-400', icon: BadgeCheck },
                    { label: 'Monthly AI Revenue', val: '$14,520', color: 'text-blue-400', icon: CreditCard },
                    { label: 'Pending Renewals', val: '43', color: 'text-amber-400', icon: Timer },
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-slate-950/80 border border-slate-800 ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-bold text-white mt-0.5">{stat.val}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by User, Email, or Order ID..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                </div>
                <button className="px-6 py-3 bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-300 hover:text-white flex items-center gap-2 transition-all">
                    <Filter className="w-5 h-5" />
                    More Filters
                </button>
            </div>

            {/* Orders Table */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-950/50 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                                <th className="px-6 py-5">Order Info</th>
                                <th className="px-6 py-5">User / Merchant</th>
                                <th className="px-6 py-5">Plan Detail</th>
                                <th className="px-6 py-5">Amount</th>
                                <th className="px-6 py-5">Expiry</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-800/30 transition-all group">
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-blue-400">{order.id}</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> {order.date}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                                                <User className="w-5 h-5 text-slate-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-white truncate">{order.user}</p>
                                                <p className="text-xs text-slate-500 truncate">{order.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-medium text-slate-300 px-2 py-1 bg-slate-800/50 rounded-lg border border-slate-700">
                                            {order.plan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-white decoration-blue-500/30 underline-offset-4 decoration-2">
                                        {order.amount}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-400">
                                        {order.expiry}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${order.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                            order.status === 'Canceled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                'bg-slate-800 text-slate-400 border-slate-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <button className="p-2 text-slate-500 hover:text-white transition-all hover:bg-slate-700/50 rounded-xl">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                <div className="p-6 border-t border-slate-800/50 flex items-center justify-between bg-slate-950/20">
                    <p className="text-xs font-medium text-slate-500">
                        Showing <span className="text-slate-300">5</span> of <span className="text-slate-300">1,284</span> orders
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-white transition-all active:scale-95">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        {[1, 2, 3].map((p) => (
                            <button key={p} className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${p === 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                                }`}>
                                {p}
                            </button>
                        ))}
                        <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-white transition-all active:scale-95">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIChatOrdersPage;
