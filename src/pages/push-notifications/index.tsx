import React, { useState } from 'react';
import {
    Send,
    Smartphone,
    Type,
    MessageSquare,
    Users,
    Target,
    Eye,
    RefreshCw,
    Plus,
    Image as ImageIcon,
    Clock,
    Layout,
    ChevronRight,
    BellRing,
    BadgeCheck
} from 'lucide-react';

const PushNotificationPage: React.FC = () => {
    const [push, setPush] = useState({
        title: 'Flash Sale Dimulai! ⚡️',
        body: 'Jangan sampai ketinggalan! Dapatkan diskon hingga 50% untuk semua elektronik favorit Anda. Klik untuk belanja sekarang!',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80',
        audience: 'all',
        type: 'promo'
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSending, setIsSending] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            const previewUrl = URL.createObjectURL(file);
            setPush(prev => ({ ...prev, image: previewUrl }));
        }
    };

    const handleSend = () => {
        setIsSending(true);
        setTimeout(() => {
            setIsSending(false);
            alert('Notifikasi push berhasil dikirim ke ' + push.audience + ' pengguna!');
        }, 2000);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700 h-[calc(100vh-160px)]">
            {/* Left: Composer */}
            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar text-left">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Notifikasi Push</h1>
                        <p className="text-slate-500 mt-1">Tulis dan siarkan pesan push ke aplikasi seluler.</p>
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={isSending}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/10 active:scale-95 ${isSending ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                            }`}
                    >
                        {isSending ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        {isSending ? 'Menyiarkan...' : 'Kirim Notifikasi'}
                    </button>
                </div>

                <div className="space-y-8 bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
                    {/* Form Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Type className="w-3.5 h-3.5" /> Judul Notifikasi
                                </label>
                                <input
                                    type="text"
                                    value={push.title}
                                    onChange={(e) => setPush({ ...push, title: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium placeholder-slate-400 font-['Inter']"
                                    placeholder="Buat judul yang menarik..."
                                />
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <MessageSquare className="w-3.5 h-3.5" /> Isi Pesan
                                </label>
                                <textarea
                                    rows={4}
                                    value={push.body}
                                    onChange={(e) => setPush({ ...push, body: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none placeholder-slate-400"
                                    placeholder="Apa pembaruannya?"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Audience */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Target className="w-3.5 h-3.5" /> Target Pemirsa
                                </label>
                                <select
                                    value={push.audience}
                                    onChange={(e) => setPush({ ...push, audience: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer placeholder-slate-400"
                                >
                                    <option value="all">Semua Pengguna Aplikasi (12.482)</option>
                                    <option value="premium">Hanya Penjual Premium</option>
                                    <option value="ios">Pengguna iOS</option>
                                    <option value="android">Pengguna Android</option>
                                    <option value="inactive">Tidak Aktif (30+ hari)</option>
                                </select>
                            </div>

                            {/* Action Type */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Layout className="w-3.5 h-3.5" /> Fitur / Aksi Klik
                                </label>
                                <select
                                    value={push.type}
                                    onChange={(e) => setPush({ ...push, type: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer placeholder-slate-400"
                                >
                                    <option value="promo">Buka Halaman Promosi</option>
                                    <option value="chat">Buka Daftar Chat AI</option>
                                    <option value="dashboard">Buka Layar Beranda</option>
                                    <option value="external">Buka Tautan Browser</option>
                                </select>
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <ImageIcon className="w-3.5 h-3.5" /> Gambar Media Kaya (Opsional)
                                </label>
                                <div className="relative group">
                                    <label className="flex flex-col items-center justify-center w-full h-32 bg-slate-50 border-2 border-dashed border-slate-200 hover:border-indigo-500/50 hover:bg-indigo-500/5 rounded-2xl cursor-pointer transition-all">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <ImageIcon className="w-8 h-8 text-slate-500 mb-2 group-hover:text-indigo-500 transition-colors" />
                                            <p className="text-xs text-slate-400">
                                                <span className="font-bold text-indigo-500">Klik untuk mengunggah</span> atau seret dan lepas
                                            </p>
                                            <p className="text-[10px] text-slate-600 mt-1 italic font-medium">Direkomendasikan: 1024px x 512px (rasio 2:1)</p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                    {selectedFile && (
                                        <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-lg w-fit">
                                            <BadgeCheck className="w-3 h-3 text-green-500" />
                                            {selectedFile.name}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Preview */}
            <div className="w-[380px] hidden lg:flex flex-col items-center shrink-0">
                <p className="text-[10px] font-bold text-slate-500 mb-6 flex items-center gap-2 uppercase tracking-[0.2em]">
                    <Eye className="w-3 h-3" /> Pratinjau Push Langsung
                </p>

                {/* Device Wrapper */}
                <div className="relative w-[300px] aspect-9/19 scale-110 origin-top">
                    {/* Background Mock */}
                    <div className="absolute inset-0 rounded-[3rem] border-[6px] border-slate-800 overflow-hidden shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1557683316-973673baf926?w=400&q=80"
                            className="w-full h-full object-cover blur-sm brightness-50"
                            alt="Wall"
                        />

                        {/* Lock Screen Meta */}
                        <div className="absolute top-12 left-0 right-0 text-center text-white/90">
                            <p className="text-5xl font-thin tracking-tight">11:50</p>
                            <p className="text-[10px] font-medium mt-1 uppercase tracking-widest opacity-60">Jumat, 2 Jan</p>
                        </div>

                        {/* The Notification Card */}
                        <div className="absolute top-40 left-3 right-3 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-xl">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                        <BellRing className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <div className="flex items-center justify-between gap-2 mb-0.5">
                                            <p className="text-[11px] font-bold text-white/90 uppercase tracking-widest truncate">MarketAI</p>
                                            <p className="text-[9px] text-white/40 whitespace-nowrap">sekarang</p>
                                        </div>
                                        <p className="text-xs font-bold text-white mb-0.5 truncate">{push.title || 'Tambah Judul'}</p>
                                        <p className="text-[11px] text-white/70 leading-snug line-clamp-2">
                                            {push.body || 'Tulis pesan push Anda di sebelah kiri...'}
                                        </p>
                                    </div>
                                </div>

                                {push.image && (
                                    <div className="mt-2.5 h-24 w-full rounded-xl overflow-hidden">
                                        <img
                                            src={push.image}
                                            className="w-full h-full object-cover"
                                            alt="Push"
                                            onError={(e) => e.currentTarget.style.display = 'none'}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bottom Swiper */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                            <div className="w-24 h-1 bg-white/20 rounded-full" />
                            <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Geser ke atas untuk membuka</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PushNotificationPage;
