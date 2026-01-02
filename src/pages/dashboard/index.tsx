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

                {/* Growth Analytics Chart */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-lg font-bold text-white">Growth Analytics</h2>
                            <p className="text-xs text-slate-500 mt-0.5">Revenue growth over the last 7 days</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 rounded-lg">
                                <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                                <span className="text-[10px] font-bold text-green-500">+12.5%</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 relative min-h-[200px] flex items-end justify-between gap-2 px-2">
                        {/* Custom SVG Line Chart */}
                        <svg className="absolute inset-0 w-full h-full pr-4" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M 0 180 Q 50 140 100 160 T 200 100 T 300 120 T 400 40 T 500 80"
                                fill="transparent"
                                stroke="#3b82f6"
                                strokeWidth="3"
                                className="w-full"
                                strokeLinecap="round"
                            />
                            <path
                                d="M 0 180 Q 50 140 100 160 T 200 100 T 300 120 T 400 40 T 500 80 L 500 200 L 0 200 Z"
                                fill="url(#chartGradient)"
                            />
                        </svg>

                        {/* Chart Bars (Visual purely for design) */}
                        {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                            <div key={i} className="group relative flex flex-col items-center gap-2 flex-1">
                                <div
                                    style={{ height: `${h}%` }}
                                    className="w-full max-w-[12px] bg-slate-800/50 rounded-t-full transition-all duration-500 group-hover:bg-blue-600/50 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] cursor-pointer"
                                />
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">Day {i + 1}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-800/50 grid grid-cols-2 gap-4">
                        <div className="text-left">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg. Daily</p>
                            <p className="text-xl font-bold text-white mt-0.5">$1,240</p>
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Projection</p>
                            <p className="text-xl font-bold text-blue-500 mt-0.5">$42.5k</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
