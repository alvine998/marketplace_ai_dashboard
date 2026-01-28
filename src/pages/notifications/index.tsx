import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Bell,
    CheckCheck,
    Trash2,
    Search,
    Filter,
    ChevronRight,
    Info,
    ShoppingCart,
    MessageSquare,
    AlertTriangle,
    Clock
} from 'lucide-react';

export type NotificationType = 'system' | 'sale' | 'ai' | 'alert';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    priority: 'low' | 'medium' | 'high';
}

const NotificationsPage: React.FC = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([
        { id: '1', type: 'system', title: 'Pembaruan Keamanan Sistem', message: 'Profil administratif Anda telah berhasil diperbarui dengan patch keamanan terbaru.', timestamp: '2 menit lalu', isRead: false, priority: 'high' },
        { id: '2', type: 'sale', title: 'Pesanan Besar Baru Diterima!', message: 'Merchant "TechFlow" baru saja memproses pesanan untuk AI Chat Pro (Rp7.499.000).', timestamp: '15 menit lalu', isRead: false, priority: 'medium' },
        { id: '3', type: 'ai', title: 'Performa Asisten AI', message: 'Agen dukungan otomatis Anda mencapai tingkat kepuasan 98% hari ini.', timestamp: '1 jam lalu', isRead: true, priority: 'low' },
        { id: '4', type: 'alert', title: 'Peringatan Kredit Rendah', message: '"EcoStore" memiliki kurang dari 10 kredit tersisa untuk sesi AI mereka.', timestamp: '3 jam lalu', isRead: true, priority: 'medium' },
        { id: '5', type: 'system', title: 'Analitik Mingguan Siap', message: 'Laporan performa marketplace Anda untuk minggu ini sekarang tersedia untuk diunduh.', timestamp: 'Kemarin', isRead: true, priority: 'low' },
    ]);

    const [filter, setFilter] = useState<'all' | NotificationType>('all');

    const filteredNotifications = filter === 'all'
        ? notifications
        : notifications.filter(n => n.type === filter);

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case 'system': return <Info className="w-5 h-5 text-blue-400" />;
            case 'sale': return <ShoppingCart className="w-5 h-5 text-green-400" />;
            case 'ai': return <MessageSquare className="w-5 h-5 text-indigo-400" />;
            case 'alert': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
        }
    };

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    const deleteNotification = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setNotifications(notifications.filter(n => n.id !== id));
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-left">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Notifikasi</h1>
                    <p className="text-slate-500 mt-1">Tetap terupdate dengan semua yang terjadi di marketplace Anda.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={markAllRead}
                        className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-xl border border-slate-200 shadow-sm transition-all text-sm font-medium"
                    >
                        <CheckCheck className="w-4 h-4" />
                        Tandai semua dibaca
                    </button>
                </div>
            </div>

            {/* Tabs & Search */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto no-scrollbar">
                    {['all', 'system', 'sale', 'ai', 'alert'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setFilter(t as any)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filter === t
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                        >
                            {t === 'all' ? 'semua' : t === 'system' ? 'sistem' : t === 'sale' ? 'penjualan' : t === 'ai' ? 'ai' : 'peringatan'}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-64 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari notifikasi..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                    />
                </div>
            </div>

            {/* List */}
            <div className="space-y-3">
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((n) => (
                        <div
                            key={n.id}
                            onClick={() => navigate(`/main/notifications/${n.id}`)}
                            className={`group flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${n.isRead
                                ? 'bg-white/50 border-slate-200 opacity-80'
                                : 'bg-white border-slate-200 shadow-sm shadow-blue-500/5'
                                } hover:border-slate-300 hover:bg-slate-50`}
                        >
                            {!n.isRead && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                            )}

                            <div className={`p-3 rounded-xl shrink-0 ${n.isRead ? 'bg-slate-50' : 'bg-slate-100 shadow-inner'
                                }`}>
                                {getIcon(n.type)}
                            </div>

                            <div className="flex-1 min-w-0 text-left">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className={`text-sm font-bold truncate ${n.isRead ? 'text-slate-600' : 'text-slate-900'}`}>
                                        {n.title}
                                    </h3>
                                    <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1.5 shrink-0 ml-4">
                                        <Clock className="w-3 h-3" /> {n.timestamp}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 line-clamp-1 group-hover:line-clamp-none transition-all duration-300">
                                    {n.message}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => deleteNotification(e, n.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <ChevronRight className="w-4 h-4 text-slate-600" />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                        <Bell className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">Tidak ada notifikasi ditemukan dalam kategori ini.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
