import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Settings,
    Bell,
    Search,
    Menu,
    X,
    LogOut,
    ChevronRight,
    Package,
    BarChart3
} from 'lucide-react';

const MainLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/main/dashboard' },
        { icon: Package, label: 'Products', path: '/main/products' },
        { icon: Users, label: 'Customers', path: '/main/customers' },
        { icon: BarChart3, label: 'Analytics', path: '/main/analytics' },
        { icon: Settings, label: 'Settings', path: '/main/settings' },
    ];

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans flex">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:relative lg:translate-x-0`}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="p-6">
                        <Link to="/main/dashboard" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <LayoutDashboard className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">MarketAI</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-1">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${isActive
                                            ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20'
                                            : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </div>
                                    {isActive && <ChevronRight className="w-4 h-4" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-slate-800">
                        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all">
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-slate-900/50 backdrop-blur-md border-bottom border-slate-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors"
                        >
                            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                        <div className="hidden md:flex items-center gap-2 bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-1.5 w-64 group focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
                            <Search className="w-4 h-4 text-slate-500 group-focus-within:text-blue-500" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-transparent border-none text-sm text-white placeholder-slate-500 focus:outline-none w-full"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-900" />
                        </button>
                        <div className="h-8 w-px bg-slate-800 mx-2" />
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-white">Alvin Yoga</p>
                                <p className="text-xs text-slate-500">Administrator</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                                <img src="https://ui-avatars.com/api/?name=Alvin+Yoga&background=0ea5e9&color=fff" alt="Avatar" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
