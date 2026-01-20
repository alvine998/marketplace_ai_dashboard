import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
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
    ChevronDown,
    Package,
    BarChart3,
    MessageSquare,
    Megaphone,
    Smartphone,
    Store,
    Shield,
    ShieldCheck,
    Layers,
    History,
    Activity
} from 'lucide-react';
import authService, { User } from '../../services/auth.service';

const MainLayout: React.FC = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [expandedMenus, setExpandedMenus] = useState<string[]>(['Settings']);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const currentUser = authService.getUser();
        setUser(currentUser);
    }, []);

    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    const toggleMenu = (label: string) => {
        setExpandedMenus(prev =>
            prev.includes(label) ? prev.filter(m => m !== label) : [...prev, label]
        );
    };

    interface SubMenuItem {
        icon: any;
        label: string;
        path: string;
    }

    interface MenuItem {
        icon: any;
        label: string;
        path?: string;
        subItems?: SubMenuItem[];
    }

    interface SearchableItem {
        label: string;
        path: string;
        icon: any;
        parent: string | null;
    }

    const menuItems: MenuItem[] = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/main/dashboard' },
        { icon: MessageSquare, label: 'AI Chat Orders', path: '/main/ai-orders' },
        { icon: Megaphone, label: 'Promotions', path: '/main/promos' },
        { icon: Store, label: 'Sellers', path: '/main/sellers' },
        { icon: Package, label: 'Products', path: '/main/products' },
        { icon: Users, label: 'Customers', path: '/main/customers' },
        {
            icon: Settings,
            label: 'Settings',
            subItems: [
                { icon: Shield, label: 'Admin Management', path: '/main/settings/admin' },
                { icon: ShieldCheck, label: 'Roles & Permissions', path: '/main/settings/roles' },
                { icon: Activity, label: 'Activity Logs', path: '/main/settings/activity-logs' },
                { icon: History, label: 'Login Attempts', path: '/main/settings/login-attempts' },
                { icon: Smartphone, label: 'Push Notification', path: '/main/push-notifications' },
                { icon: Layers, label: 'Product Category', path: '/main/settings/categories' },
            ]
        },
    ];

    const searchableItems: SearchableItem[] = menuItems.flatMap(item => {
        if (item.subItems) {
            return item.subItems.map(sub => ({
                label: sub.label,
                path: sub.path,
                icon: sub.icon,
                parent: item.label
            })) as SearchableItem[];
        }
        return [{
            label: item.label,
            path: item.path || '#',
            icon: item.icon,
            parent: null
        }] as SearchableItem[];
    });

    const searchResults = searchQuery.trim() === ''
        ? []
        : searchableItems.filter(item =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.parent && item.parent.toLowerCase().includes(searchQuery.toLowerCase()))
        );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('global-search') as HTMLInputElement;
                searchInput?.focus();
            }
            if (e.key === 'Escape') {
                setIsSearchFocused(false);
                setSearchQuery('');
            }
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setIsSearchFocused(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearchResultClick = (path: string) => {
        navigate(path);
        setSearchQuery('');
        setIsSearchFocused(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:relative lg:translate-x-0`}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="p-6">
                        <Link to="/main/dashboard" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <LayoutDashboard className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 tracking-tight">MarketAI</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
                        {menuItems.map((item) => {
                            const hasSubItems = !!item.subItems;
                            const isExpanded = expandedMenus.includes(item.label);
                            const isActive = item.path ? location.pathname === item.path : item.subItems?.some(s => location.pathname === s.path);

                            return (
                                <div key={item.label} className="space-y-1">
                                    {hasSubItems ? (
                                        <button
                                            onClick={() => toggleMenu(item.label)}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${isActive
                                                ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                                : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon className="w-5 h-5" />
                                                <span className="font-bold text-sm">{item.label}</span>
                                            </div>
                                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                        </button>
                                    ) : (
                                        <Link
                                            to={item.path || '#'}
                                            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${isActive
                                                ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                                : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon className="w-5 h-5" />
                                                <span className="font-bold text-sm">{item.label}</span>
                                            </div>
                                            {isActive && !hasSubItems && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
                                        </Link>
                                    )}

                                    {/* Submenu */}
                                    {hasSubItems && isExpanded && (
                                        <div className="pl-4 space-y-1 mt-1 animate-in slide-in-from-top-2 duration-200">
                                            {item.subItems?.map((sub) => {
                                                const isSubActive = location.pathname === sub.path;
                                                return (
                                                    <Link
                                                        key={sub.label}
                                                        to={sub.path}
                                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${isSubActive
                                                            ? 'text-blue-600 font-bold bg-blue-50'
                                                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        <sub.icon className={`w-4 h-4 ${isSubActive ? 'text-blue-600' : 'text-slate-400'}`} />
                                                        <span className="text-xs">{sub.label}</span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                        >
                            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                        <div ref={searchRef} className="relative hidden md:block">
                            <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-4 py-1.5 w-80 group focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
                                <Search className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500" />
                                <input
                                    id="global-search"
                                    type="text"
                                    placeholder="Search features... (⌘K)"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    className="bg-transparent border-none text-sm text-slate-900 placeholder-slate-400 focus:outline-none w-full"
                                />
                            </div>

                            {/* Search Results Dropdown */}
                            {isSearchFocused && (searchQuery || searchResults.length > 0) && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {searchResults.length > 0 ? (
                                        <div className="py-2">
                                            <div className="px-4 py-2 border-b border-slate-50">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Search Results</p>
                                            </div>
                                            <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                                                {searchResults.map((result) => (
                                                    <button
                                                        key={result.path}
                                                        onClick={() => handleSearchResultClick(result.path!)}
                                                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors group text-left"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 rounded-lg bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                                <result.icon className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-900">{result.label}</p>
                                                                {result.parent && (
                                                                    <p className="text-[10px] text-slate-500">{result.parent}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : searchQuery.trim() !== '' ? (
                                        <div className="p-8 text-center">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
                                                <Search className="w-6 h-6 text-slate-300" />
                                            </div>
                                            <p className="text-sm text-slate-500">No results found for "<span className="text-slate-900 font-bold">{searchQuery}</span>"</p>
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/main/notifications" className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-white" />
                        </Link>
                        <div className="h-8 w-px bg-slate-200 mx-2" />
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-slate-900">{user?.username || 'Guest'}</p>
                                <p className="text-xs text-slate-500">Administrator</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'Guest')}&background=0ea5e9&color=fff`} alt="Avatar" />
                            </div>
                            <button
                                onClick={handleLogout}
                                className="ml-2 p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
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
