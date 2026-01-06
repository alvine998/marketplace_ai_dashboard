import React, { useState } from 'react';
import {
    Shield,
    UserPlus,
    Search,
    MoreVertical,
    Mail,
    Key,
    Trash2,
    Edit3,
    CheckCircle2,
    XCircle,
    Clock,
    ChevronRight,
    ShieldCheck,
    ShieldAlert,
    User
} from 'lucide-react';

interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: 'Super Admin' | 'Editor' | 'Viewer';
    status: 'active' | 'invited' | 'disabled';
    lastActive: string;
}

const AdminManagementPage: React.FC = () => {
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', role: 'Editor' as AdminUser['role'] });
    const [admins] = useState<AdminUser[]>([
        { id: '1', name: 'Alvin Yoga', email: 'alvin@marketai.com', role: 'Super Admin', status: 'active', lastActive: 'now' },
        { id: '2', name: 'Sarah Miller', email: 'sarah@marketai.com', role: 'Editor', status: 'active', lastActive: '2h ago' },
        { id: '3', name: 'John Doe', email: 'john@marketai.com', role: 'Viewer', status: 'invited', lastActive: 'N/A' },
        { id: '4', name: 'Michael Chen', email: 'chen@marketai.com', role: 'Editor', status: 'active', lastActive: 'Yesterday' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');

    const rolePermissions = {
        'Super Admin': [
            'Full platform access',
            'Manage other admin users',
            'Financial data visibility',
            'API configuration access'
        ],
        'Editor': [
            'Manage product catalog',
            'Handle seller approvals',
            'Broadcast notifications',
            'Respond to customer tickets'
        ],
        'Viewer': [
            'Read-only dashboard metrics',
            'View product listings',
            'Monitor system logs',
            'Track recent orders'
        ]
    };

    const getRoleBadge = (role: AdminUser['role']) => {
        switch (role) {
            case 'Super Admin':
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-500 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-indigo-500/20">
                        <ShieldCheck className="w-3 h-3" /> {role}
                    </span>
                );
            case 'Editor':
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-blue-500/20">
                        <Shield className="w-3 h-3" /> {role}
                    </span>
                );
            case 'Viewer':
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-500/10 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-slate-500/20">
                        <User className="w-3 h-3" /> {role}
                    </span>
                );
        }
    };

    const getStatusBadge = (status: AdminUser['status']) => {
        switch (status) {
            case 'active':
                return (
                    <span className="flex items-center gap-1.5 text-green-500 text-xs font-bold font-['Inter']">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Active
                    </span>
                );
            case 'invited':
                return (
                    <span className="flex items-center gap-1.5 text-amber-500 text-xs font-bold font-['Inter']">
                        <Clock className="w-3 h-3" />
                        Invited
                    </span>
                );
            case 'disabled':
                return (
                    <span className="flex items-center gap-1.5 text-red-500 text-xs font-bold font-['Inter']">
                        <XCircle className="w-3 h-3" />
                        Disabled
                    </span>
                );
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="text-left">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Management</h1>
                    <p className="text-slate-500 mt-1 font-medium">Control access permissions and dashboard user roles.</p>
                </div>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/10 active:scale-95 text-sm"
                >
                    <UserPlus className="w-4 h-4" />
                    Invite Associate
                </button>
            </div>

            {/* Main Table Container */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden self-start shadow-sm">
                <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto text-left">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-slate-200">
                                <th className="px-8 py-5">User Account</th>
                                <th className="px-8 py-5">Auth Role</th>
                                <th className="px-8 py-5">Activity Status</th>
                                <th className="px-8 py-5">Last Logged</th>
                                <th className="px-8 py-5 text-right">Access</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {admins.map((user) => (
                                <tr key={user.id} className="group hover:bg-slate-800/30 transition-all border-b border-slate-800/20 last:border-none">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform overflow-hidden shadow-inner">
                                                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=f8fafc&color=6366f1`} alt="Avatar" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-white text-sm leading-tight">{user.name}</p>
                                                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 font-medium italic font-['Inter']">
                                                    <Mail className="w-3 h-3" /> {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {getRoleBadge(user.role)}
                                    </td>
                                    <td className="px-8 py-6">
                                        {getStatusBadge(user.status)}
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-xs text-slate-400 font-bold font-['Inter']">{user.lastActive}</p>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opactiy-60 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-all border border-slate-700/50 shadow-sm" title="Manage Permissions">
                                                <Key className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-lg transition-all border border-slate-200 shadow-sm" title="Edit Associate">
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-lg transition-all border border-slate-200 shadow-sm" title="Disable Access">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowInviteModal(false)} />
                    <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 text-left">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Invite Associate</h2>
                                <p className="text-slate-500 text-sm font-medium mt-1">Grant administrative access to your dashboard</p>
                            </div>
                            <div className="p-3 bg-indigo-600/10 rounded-2xl border border-indigo-500/20">
                                <UserPlus className="w-6 h-6 text-indigo-500" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter collaborator name"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                    value={newAdmin.name}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="associate@marketai.com"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-['Inter']"
                                    value={newAdmin.email}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Dashboard Role</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(['Super Admin', 'Editor', 'Viewer'] as AdminUser['role'][]).map((role) => (
                                        <button
                                            key={role}
                                            onClick={() => setNewAdmin({ ...newAdmin, role })}
                                            className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 group ${newAdmin.role === role
                                                ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-600/20'
                                                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                                                }`}
                                        >
                                            {role === 'Super Admin' && <ShieldCheck className={`w-5 h-5 ${newAdmin.role === role ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'}`} />}
                                            {role === 'Editor' && <Shield className={`w-5 h-5 ${newAdmin.role === role ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'}`} />}
                                            {role === 'Viewer' && <User className={`w-5 h-5 ${newAdmin.role === role ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'}`} />}
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${newAdmin.role === role ? 'text-white' : 'text-slate-500 group-hover:text-slate-900'}`}>{role}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Role Permissions Box */}
                            <div className="bg-slate-950/50 border border-slate-800 rounded-3xl p-5">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
                                    <Key className="w-3.5 h-3.5 text-indigo-500" /> Authorized Capabilities
                                </h4>
                                <ul className="grid grid-cols-1 gap-3">
                                    {rolePermissions[newAdmin.role].map((perm, i) => (
                                        <li key={i} className="flex items-center gap-3 text-xs font-medium text-slate-500">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500/50" />
                                            {perm}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="mt-10 flex gap-3">
                            <button
                                onClick={() => setShowInviteModal(false)}
                                className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-2xl transition-all active:scale-95 text-xs uppercase tracking-widest"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setShowInviteModal(false)}
                                className="flex-2 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95 text-xs uppercase tracking-widest"
                            >
                                Send Invitation
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminManagementPage;
