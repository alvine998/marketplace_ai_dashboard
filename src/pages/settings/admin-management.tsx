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
    const [admins] = useState<AdminUser[]>([
        { id: '1', name: 'Alvin Yoga', email: 'alvin@marketai.com', role: 'Super Admin', status: 'active', lastActive: 'now' },
        { id: '2', name: 'Sarah Miller', email: 'sarah@marketai.com', role: 'Editor', status: 'active', lastActive: '2h ago' },
        { id: '3', name: 'John Doe', email: 'john@marketai.com', role: 'Viewer', status: 'invited', lastActive: 'N/A' },
        { id: '4', name: 'Michael Chen', email: 'chen@marketai.com', role: 'Editor', status: 'active', lastActive: 'Yesterday' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');

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
                    <span className="flex items-center gap-1.5 text-green-500 text-xs font-bold">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Active
                    </span>
                );
            case 'invited':
                return (
                    <span className="flex items-center gap-1.5 text-amber-500 text-xs font-bold">
                        <Clock className="w-3 h-3" />
                        Invited
                    </span>
                );
            case 'disabled':
                return (
                    <span className="flex items-center gap-1.5 text-red-500 text-xs font-bold">
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
                    <h1 className="text-3xl font-bold text-white tracking-tight">Admin Management</h1>
                    <p className="text-slate-400 mt-1">Control access permissions and dashboard user roles.</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/10 active:scale-95 text-sm">
                    <UserPlus className="w-4 h-4" />
                    Invite Associate
                </button>
            </div>

            {/* Main Table Container */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm self-start">
                <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto text-left">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-950/50 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-slate-800/50">
                                <th className="px-8 py-5">User Account</th>
                                <th className="px-8 py-5">Auth Role</th>
                                <th className="px-8 py-5">Activity Status</th>
                                <th className="px-8 py-5">Last Logged</th>
                                <th className="px-8 py-5 text-right">Access</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {admins.map((user) => (
                                <tr key={user.id} className="group hover:bg-slate-800/30 transition-all border-b border-slate-800/20 last:border-none">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform overflow-hidden shadow-inner">
                                                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=1e293b&color=6366f1`} alt="Avatar" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-white text-sm leading-tight">{user.name}</p>
                                                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 font-medium">
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
                                        <p className="text-xs text-slate-400 font-medium">{user.lastActive}</p>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opactiy-60 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-all border border-slate-700/50" title="Manage Permissions">
                                                <Key className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-all border border-slate-700/50" title="Edit Associate">
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 bg-slate-800 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-lg transition-all border border-slate-700/50" title="Disable Access">
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
        </div>
    );
};

export default AdminManagementPage;
