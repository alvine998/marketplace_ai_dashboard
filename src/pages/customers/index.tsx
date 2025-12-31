import React from 'react';
import {
    Users,
    Search,
    Mail,
    Phone,
    MapPin,
    MoreHorizontal,
    MailQuestion,
    UserPlus,
    Filter,
    ArrowUpRight
} from 'lucide-react';

const CustomerPage: React.FC = () => {
    const customers = [
        { id: '1', name: 'Alvin Yoga', email: 'alvin@example.com', phone: '+62 812-3456-7890', location: 'Jakarta, ID', joined: 'Oct 12, 2023', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Alvin+Yoga&background=0ea5e9&color=fff' },
        { id: '2', name: 'Sarah Miller', email: 'sarah.m@hey.com', phone: '+1 (555) 001-2345', location: 'London, UK', joined: 'Nov 05, 2023', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Sarah+Miller&background=8b5cf6&color=fff' },
        { id: '3', name: 'John Smith', email: 'johnsmith@gmail.com', phone: '+1 (555) 987-6543', location: 'New York, US', joined: 'Dec 01, 2023', status: 'Inactive', avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=10b981&color=fff' },
        { id: '4', name: 'Elena Rodriguez', email: 'elena.r@corporate.com', phone: '+34 912 345 678', location: 'Madrid, ES', joined: 'Jan 15, 2024', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Elena+Rodriguez&background=f59e0b&color=fff' },
        { id: '5', name: 'Hiroshi Tanaka', email: 'hiro@tech.jp', phone: '+81 90-1234-5678', location: 'Tokyo, JP', joined: 'Feb 20, 2024', status: 'Pending', avatar: 'https://ui-avatars.com/api/?name=Hiroshi+Tanaka&background=ef4444&color=fff' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight text-left">Customers</h1>
                    <p className="text-slate-400 mt-1">Manage your customer relationships and data.</p>
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95">
                    <UserPlus className="w-5 h-5" />
                    New Customer
                </button>
            </div>

            {/* Search & Bulk Actions */}
            <div className="flex flex-col lg:flex-row items-center gap-4">
                <div className="flex-1 relative w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or country..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
                    />
                </div>
                <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all">
                    <Filter className="w-5 h-5" />
                    Filters
                </button>
            </div>

            {/* Customer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customers.map((customer) => (
                    <div key={customer.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-sm hover:border-slate-700 hover:shadow-xl hover:shadow-blue-500/5 transition-all group relative">
                        <button className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>

                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                                <img src={customer.avatar} alt={customer.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-lg text-white truncate">{customer.name}</h3>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className={`w-2 h-2 rounded-full ${customer.status === 'Active' ? 'bg-green-500' :
                                            customer.status === 'Pending' ? 'bg-amber-500' :
                                                'bg-slate-500'
                                        }`} />
                                    <span className="text-xs font-medium text-slate-400 uppercase tracking-tighter">{customer.status}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-300 transition-colors">
                                <Mail className="w-4 h-4 shrink-0" />
                                <span className="text-sm truncate">{customer.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-300 transition-colors">
                                <Phone className="w-4 h-4 shrink-0" />
                                <span className="text-sm truncate">{customer.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-300 transition-colors">
                                <MapPin className="w-4 h-4 shrink-0" />
                                <span className="text-sm truncate">{customer.location}</span>
                            </div>
                        </div>

                        <div className="pt-5 border-t border-slate-800 flex items-center justify-between">
                            <div className="text-xs text-slate-500 font-medium uppercase tracking-widest">Joined {customer.joined}</div>
                            <button className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-blue-500 hover:bg-blue-500 hover:text-white transition-all">
                                <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add New Customer Placeholder */}
                <button className="bg-slate-900 border-2 border-dashed border-slate-800/50 p-6 rounded-3xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group flex flex-col items-center justify-center min-h-[300px]">
                    <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-blue-500/10 group-hover:scale-110 transition-all text-slate-500 group-hover:text-blue-500">
                        <UserPlus className="w-7 h-7" />
                    </div>
                    <p className="font-bold text-white">Add Customer</p>
                    <p className="text-sm text-slate-500 mt-1 text-center">Register a new client manually to your database.</p>
                </button>
            </div>
        </div>
    );
};

export default CustomerPage;
