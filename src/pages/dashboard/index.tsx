import React from 'react';
import {
    TrendingUp,
    TrendingDown,
    Users,
    DollarSign,
    ShoppingBag,
    ArrowUpRight,
    MoreHorizontal
} from 'lucide-react';

const DashboardPage: React.FC = () => {
    const stats = [
        { label: 'Total Revenue', value: '$45,231.89', change: '+20.1%', positive: true, icon: DollarSign },
        { label: 'Active Users', value: '+2350', change: '+18.2%', positive: true, icon: Users },
        { label: 'Sales', value: '+12,234', change: '+19.5%', positive: true, icon: ShoppingBag },
        { label: 'Active Now', value: '573', change: '-4.1%', positive: false, icon: TrendingUp },
    ];

    const recentOrders = [
        { id: '#3021', customer: 'John Doe', product: 'Premium Plan', amount: '$49.00', status: 'Completed' },
        { id: '#3022', customer: 'Sarah Miller', product: 'Enterprise License', amount: '$999.00', status: 'Pending' },
        { id: '#3023', customer: 'Robert Fox', product: 'Basic Monthly', amount: '$19.00', status: 'Completed' },
        { id: '#3024', customer: 'Julie Smith', product: 'Pro Annual', amount: '$299.00', status: 'Cancelled' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Overview</h1>
                <p className="text-slate-400 mt-1">Detailed management of your marketplace performance.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm hover:border-slate-700 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-blue-500">
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.positive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                }`}>
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
                        <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders Table */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
                        <button className="text-slate-500 hover:text-white transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-950/50 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {recentOrders.map((order, i) => (
                                    <tr key={i} className="hover:bg-slate-800/30 transition-colors text-sm">
                                        <td className="px-6 py-4 font-medium text-white">{order.id}</td>
                                        <td className="px-6 py-4 text-slate-300">{order.customer}</td>
                                        <td className="px-6 py-4 text-slate-400">{order.product}</td>
                                        <td className="px-6 py-4 font-semibold text-white">{order.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${order.status === 'Completed' ? 'bg-green-500/10 text-green-500' :
                                                    order.status === 'Pending' ? 'bg-amber-500/10 text-amber-500' :
                                                        'bg-red-500/10 text-red-500'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Upgrade Card / Tip */}
                <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-500/20">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-4">Go Unlimited</h2>
                        <p className="text-blue-100 mb-8 leading-relaxed">
                            Unlock advanced AI analytics and unlimited products with our Pro plan. Reach more customers today.
                        </p>
                        <button className="w-full py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 group">
                            Upgrade Now
                            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </div>
                    {/* Decorative background circle */}
                    <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-white/10 blur-3xl rounded-full" />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
