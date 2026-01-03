import React, { useState } from 'react';
import {
    ShieldCheck,
    Lock,
    Eye,
    Edit3,
    Trash2,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Search,
    Info,
    LayoutDashboard,
    Package,
    Users,
    Store,
    Megaphone,
    Smartphone,
    Layers,
    Shield
} from 'lucide-react';

interface Permission {
    id: string;
    label: string;
    description: string;
    category: string;
}

interface RolePermissions {
    [role: string]: string[];
}

const RolePermissionsPage: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState<'Super Admin' | 'Editor' | 'Viewer'>('Super Admin');
    const [searchTerm, setSearchTerm] = useState('');

    const roles = [
        { id: 'Super Admin', label: 'Super Admin', icon: ShieldCheck, color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
        { id: 'Editor', label: 'Content Editor', icon: Edit3, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        { id: 'Viewer', label: 'View Only', icon: Eye, color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-500/20' },
    ];

    const permissions: Permission[] = [
        // Dashboard
        { id: 'dash_view', label: 'View Analytics', description: 'Access to revenue and growth charts', category: 'Dashboard' },
        { id: 'dash_export', label: 'Export Reports', description: 'Download CSV/PDF reports', category: 'Dashboard' },

        // Inventory
        { id: 'prod_view', label: 'View Products', description: 'Browse all seller inventory', category: 'Inventory' },
        { id: 'prod_edit', label: 'Moderate Products', description: 'Edit or remove platform listings', category: 'Inventory' },
        { id: 'prod_cat', label: 'Manage Categories', description: 'Create and map product categories', category: 'Inventory' },

        // Merchants
        { id: 'sell_view', label: 'View Sellers', description: 'Access merchant profiles', category: 'Merchants' },
        { id: 'sell_verify', label: 'Verify Merchants', description: 'Approve or suspend shop accounts', category: 'Merchants' },

        // Communications
        { id: 'push_send', label: 'Send Push Notifications', description: 'Broadcast global alerts', category: 'Communications' },
        { id: 'promo_manage', label: 'Manage Promotions', description: 'Configure home screen banners', category: 'Communications' },

        // System
        { id: 'admin_manage', label: 'Manage Team', description: 'Invite and remove associate admins', category: 'System' },
        { id: 'settings_edit', label: 'Platform Settings', description: 'Modify core system variables', category: 'System' },
    ];

    const [rolePermissions, setRolePermissions] = useState<RolePermissions>({
        'Super Admin': permissions.map(p => p.id),
        'Editor': ['dash_view', 'prod_view', 'prod_edit', 'prod_cat', 'sell_view', 'push_send', 'promo_manage'],
        'Viewer': ['dash_view', 'prod_view', 'sell_view'],
    });

    const togglePermission = (permId: string) => {
        if (selectedRole === 'Super Admin') return; // Protect Super Admin

        setRolePermissions(prev => {
            const currentPerms = prev[selectedRole] || [];
            const newPerms = currentPerms.includes(permId)
                ? currentPerms.filter(id => id !== permId)
                : [...currentPerms, permId];
            return { ...prev, [selectedRole]: newPerms };
        });
    };

    const categories = Array.from(new Set(permissions.map(p => p.category)));

    const filteredPermissions = permissions.filter(p =>
        p.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="text-left">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Role Permissions</h1>
                    <p className="text-slate-400 mt-1 font-medium italic">Define granular access levels for administrative staff.</p>
                </div>
            </div>

            {/* Role Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {roles.map((role) => (
                    <button
                        key={role.id}
                        onClick={() => setSelectedRole(role.id as any)}
                        className={`p-6 bg-slate-900 border transition-all rounded-4xl text-left group relative overflow-hidden ${selectedRole === role.id
                            ? `${role.border} bg-slate-900 shadow-2xl shadow-indigo-500/10`
                            : 'border-slate-800 hover:border-slate-700 opacity-60'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className={`p-3 rounded-2xl ${role.bg} ${role.color} group-hover:scale-110 transition-transform`}>
                                <role.icon className="w-6 h-6" />
                            </div>
                            {selectedRole === role.id && <div className="p-1 px-3 bg-indigo-500 text-white text-[10px] font-bold rounded-lg uppercase tracking-widest">Active Focus</div>}
                        </div>
                        <div className="relative z-10">
                            <h4 className="text-lg font-bold text-white">{role.label}</h4>
                            <p className="text-xs text-slate-500 mt-1 font-medium">{rolePermissions[role.id].length} Permissions Enabled</p>
                        </div>
                        {selectedRole === role.id && <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-3xl" />}
                    </button>
                ))}
            </div>

            {/* Permissions Engine */}
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-sm">
                <div className="p-8 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="text-left flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                            <Lock className="w-6 h-6 text-indigo-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white uppercase tracking-tight">{selectedRole} Policy</h3>
                            <p className="text-slate-500 text-xs font-medium">Toggle individual capabilities below</p>
                        </div>
                    </div>
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Filter permissions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3 pl-11 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        />
                    </div>
                </div>

                <div className="p-8 space-y-10">
                    {categories.map((cat) => (
                        <div key={cat} className="space-y-4">
                            <h4 className="flex items-center gap-3 text-indigo-500 text-[10px] font-bold uppercase tracking-[0.2em] px-2">
                                <span className="w-8 h-px bg-indigo-500/20" />
                                {cat} Operations
                                <span className="flex-1 h-px bg-indigo-500/20" />
                            </h4>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {filteredPermissions.filter(p => p.category === cat).map((perm) => (
                                    <div
                                        key={perm.id}
                                        onClick={() => togglePermission(perm.id)}
                                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${rolePermissions[selectedRole].includes(perm.id)
                                            ? 'bg-slate-950 border-indigo-500/30'
                                            : 'bg-slate-950/20 border-slate-800/50 grayscale opacity-60'
                                            } hover:border-indigo-500/50`}
                                    >
                                        <div className="flex items-start gap-4 text-left">
                                            <div className={`mt-1 p-2 rounded-xl transition-colors ${rolePermissions[selectedRole].includes(perm.id) ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-600'
                                                }`}>
                                                {cat === 'Dashboard' && <LayoutDashboard className="w-4 h-4" />}
                                                {cat === 'Inventory' && <Package className="w-4 h-4" />}
                                                {cat === 'Merchants' && <Store className="w-4 h-4" />}
                                                {cat === 'Communications' && <Smartphone className="w-4 h-4" />}
                                                {cat === 'System' && <Shield className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-bold transition-colors ${rolePermissions[selectedRole].includes(perm.id) ? 'text-white' : 'text-slate-500'
                                                    }`}>{perm.label}</p>
                                                <p className="text-[10px] font-medium text-slate-500 mt-1 leading-relaxed">{perm.description}</p>
                                            </div>
                                        </div>
                                        <div className={`w-10 h-6 rounded-full p-1 transition-colors relative ${rolePermissions[selectedRole].includes(perm.id) ? 'bg-indigo-600' : 'bg-slate-800'
                                            }`}>
                                            <div className={`w-4 h-4 rounded-full bg-white shadow-lg transition-transform ${rolePermissions[selectedRole].includes(perm.id) ? 'translate-x-4' : 'translate-x-0'
                                                }`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Insight */}
                <div className="p-6 bg-indigo-600/5 border-t border-slate-800 flex items-center justify-center gap-4">
                    <Info className="w-4 h-4 text-indigo-400" />
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                        Changes to <span className="text-indigo-400">{selectedRole}</span> will apply globally to all assigned associates. <span className="text-slate-300 ml-2">Super Admin is immutable.</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RolePermissionsPage;
