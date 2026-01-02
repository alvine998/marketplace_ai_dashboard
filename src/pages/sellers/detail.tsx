import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Store,
    Award,
    Mail,
    Phone,
    Calendar,
    MapPin,
    TrendingUp,
    Package,
    Star,
    ShieldCheck,
    Clock,
    ExternalLink,
    Ban,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    ChevronRight
} from 'lucide-react';

const SellerDetailPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock data for a single seller
    const seller = {
        id: id || '1',
        name: 'John Doe',
        shopName: 'Tech Haven',
        email: 'john@techhaven.com',
        phone: '+1 (555) 123-4567',
        joinDate: 'Jan 12, 2025',
        status: 'official' as 'official' | 'active' | 'pending' | 'suspended',
        address: '123 Innovation Drive, Silicon Valley, CA 94025',
        bio: 'Tech Haven is a premium electronics reseller focused on providing the latest cutting-edge gadgets to tech enthusiasts worldwide.',
        metrics: {
            totalSales: '$424,500',
            totalOrders: 1240,
            rating: 4.8,
            conversion: '12.4%'
        },
        recentOrders: [
            { id: 'ORD-9921', customer: 'Sarah Miller', date: '2h ago', amount: '$1,200', status: 'delivered' },
            { id: 'ORD-9918', customer: 'Michael Chen', date: '5h ago', amount: '$450', status: 'processing' },
            { id: 'ORD-9915', customer: 'Julie Smith', date: 'Yesterday', amount: '$890', status: 'shipped' },
        ]
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Back Button & Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/main/sellers')}
                        className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="text-left">
                        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            {seller.shopName}
                            {seller.status === 'official' && <div className="p-1 bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/20"><Award className="w-4 h-4 text-white" /></div>}
                        </h1>
                        <p className="text-slate-400 mt-1 flex items-center gap-2 font-medium">
                            <Store className="w-4 h-4 text-slate-500" />
                            Shop ID: {seller.id} • Registered since {seller.joinDate}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {seller.status === 'suspended' ? (
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95 text-sm">
                            <RefreshCw className="w-4 h-4" /> Activate Shop
                        </button>
                    ) : (
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95 text-sm">
                            <Ban className="w-4 h-4" /> Suspend Shop
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Revenue Growth', value: seller.metrics.totalSales, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
                    { label: 'Total Volume', value: seller.metrics.totalOrders, icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Store Rating', value: `${seller.metrics.rating} Stars`, icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    { label: 'Conversion Rate', value: seller.metrics.conversion, icon: ShieldCheck, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between group hover:border-slate-700 transition-all shadow-xl">
                        <div className="text-left">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                        </div>
                        <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
                {/* Detailed Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                            <AlertCircle className="w-5 h-5 text-blue-500" /> Professional Profile
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Business Owner</label>
                                    <p className="text-white font-bold">{seller.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Contact Email</label>
                                    <p className="text-white font-bold flex items-center gap-2"><Mail className="w-4 h-4 text-slate-500" /> {seller.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Phone Number</label>
                                    <p className="text-white font-bold flex items-center gap-2"><Phone className="w-4 h-4 text-slate-500" /> {seller.phone}</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Operating Address</label>
                                    <p className="text-white font-medium leading-relaxed flex gap-2"><MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" /> {seller.address}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Shop Status</label>
                                    <div className="pt-1">
                                        <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-indigo-500/20">
                                            {seller.status} Account
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 pt-8 border-t border-slate-800">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Shop Biography</label>
                            <p className="text-slate-400 text-sm leading-relaxed italic">"{seller.bio}"</p>
                        </div>
                    </div>

                    {/* Transactions */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" /> Recent Activity
                            </h3>
                            <button className="text-xs font-bold text-blue-500 hover:text-blue-400">View All Archive</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-950/50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-800/50">
                                        <th className="px-8 py-4">Transaction ID</th>
                                        <th className="px-8 py-4">Customer</th>
                                        <th className="px-8 py-4">Amount</th>
                                        <th className="px-8 py-4">Fulfillment</th>
                                        <th className="px-8 py-4 text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {seller.recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-800/30 transition-all border-b border-slate-800/20 last:border-none">
                                            <td className="px-8 py-5 text-sm font-bold text-white">{order.id}</td>
                                            <td className="px-8 py-5 text-sm text-slate-400">{order.customer}</td>
                                            <td className="px-8 py-5 text-sm font-bold text-white">{order.amount}</td>
                                            <td className="px-8 py-5">
                                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-lg uppercase tracking-widest border ${order.status === 'delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                    order.status === 'processing' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                        'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right text-xs text-slate-500">{order.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Tools */}
                <div className="space-y-6">
                    <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 bg-white/5 rounded-full -mr-8 -mt-8 group-hover:scale-125 transition-transform duration-700" />
                        <div className="relative z-10">
                            <Award className="w-12 h-12 mb-4 text-indigo-200" />
                            <h4 className="text-xl font-bold mb-2">Verified Merchant</h4>
                            <p className="text-indigo-100 text-sm leading-relaxed mb-6 italic opacity-80">This seller has completed the official documentation process for premium selling privileges.</p>
                            <button className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all active:scale-95 shadow-lg">Verify Next Review</button>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-left">
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Account Integrity</h4>
                        <div className="space-y-4">
                            <button className="w-full flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-all group">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-slate-500 group-hover:text-blue-500" />
                                    <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">Broadcast Message</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-500" />
                            </button>
                            <button className="w-full flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-all group">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-4 h-4 text-slate-500 group-hover:text-blue-500" />
                                    <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">Audit Change Log</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-500" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerDetailPage;
