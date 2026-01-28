import React, { useState } from 'react';
import {
    Bot,
    MessageSquare,
    Zap,
    Brain,
    ToggleRight,
    User,
    Send,
    MoreVertical,
    Settings2,
    Sparkles,
    History,
    Circle
} from 'lucide-react';

const AIChatPage: React.FC = () => {
    const [isAIEnabled, setIsAIEnabled] = useState(true);
    const [selectedChat, setSelectedChat] = useState('1');

    const chats = [
        { id: '1', name: 'John Doe', lastMsg: 'Apakah ada warna biru?', time: '2mnt lalu', unread: true, status: 'AI Aktif' },
        { id: '2', name: 'Sarah Miller', lastMsg: 'Terima kasih atas bantuannya!', time: '15mnt lalu', unread: false, status: 'Selesai' },
        { id: '3', name: 'Robert Fox', lastMsg: 'Kapan akan dikirim?', time: '1jam lalu', unread: false, status: 'AI Aktif' },
        { id: '4', name: 'Elena Rodriguez', lastMsg: 'Tertarik dengan pesanan grosir.', time: '3jam lalu', unread: true, status: 'AI Aktif' },
    ];

    const messages = [
        { id: 1, sender: 'buyer', text: 'Halo! Saya tertarik dengan Headphone Wireless Premium.', time: '10:00' },
        { id: 2, sender: 'ai', text: 'Halo! Senang mendengarnya. Headphone Wireless Premium adalah salah satu produk terlaris kami. Apa yang bisa saya bantu hari ini?', time: '10:00' },
        { id: 3, sender: 'buyer', text: 'Apakah sudah termasuk tas penyimpanan?', time: '10:01' },
        { id: 4, sender: 'ai', text: 'Ya, sudah termasuk tas penyimpanan hardshell berkualitas tinggi, kabel pengisi daya USB-C, dan kabel audio 3.5mm untuk penggunaan kabel.', time: '10:01' },
        { id: 5, sender: 'buyer', text: 'Bagus. Bagaimana dengan daya tahan baterai?', time: '10:02' },
    ];

    return (
        <div className="h-[calc(screen-120px)] flex bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm animate-in fade-in duration-700">
            {/* Left Sidebar - Chat List */}
            <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between mb-4 text-left">
                        <h2 className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Pesan Pembeli</h2>
                        <button className="text-slate-400 hover:text-slate-900 transition-colors">
                            <History className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari percakapan..."
                            className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-900 placeholder-slate-400"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {chats.map((chat) => (
                        <button
                            key={chat.id}
                            onClick={() => setSelectedChat(chat.id)}
                            className={`w-full p-4 flex gap-3 hover:bg-slate-100/50 transition-all border-b border-slate-200/50 relative ${selectedChat === chat.id ? 'bg-blue-50 border-r-2 border-r-blue-500' : ''}`}
                        >
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                                    <User className="w-6 h-6 text-slate-400" />
                                </div>
                                {chat.unread && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
                                )}
                            </div>
                            <div className="flex-1 text-left min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <p className="font-semibold text-slate-900 text-sm truncate">{chat.name}</p>
                                    <span className="text-[10px] text-slate-400">{chat.time}</span>
                                </div>
                                <p className="text-xs text-slate-500 truncate mb-1">{chat.lastMsg}</p>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${chat.status === 'Selesai' ? 'bg-slate-200 text-slate-500' : 'bg-blue-100 text-blue-600'
                                    }`}>
                                    {chat.status}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50/30">
                {/* Chat Header */}
                <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">John Doe</p>
                            <p className="text-[10px] text-green-600 flex items-center gap-1 font-medium">
                                <Circle className="w-1.5 h-1.5 fill-current" /> Daring
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full border border-blue-100">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold uppercase tracking-widest">AI Menjawab</span>
                        </div>
                        <button className="text-slate-400 hover:text-slate-900 transition-colors">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Messages Panel */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'buyer' ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-[70%] group ${msg.sender === 'buyer' ? 'order-1' : 'order-2'}`}>
                                <div className={`p-4 rounded-2xl relative ${msg.sender === 'buyer'
                                    ? 'bg-white border border-slate-200 text-slate-600 rounded-tl-none shadow-sm'
                                    : 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-500/20'
                                    }`}>
                                    {msg.sender === 'ai' && (
                                        <div className="absolute -top-7 right-0 text-[10px] font-bold text-blue-400 flex items-center gap-1">
                                            <Bot className="w-3 h-3" /> AI Pintar
                                        </div>
                                    )}
                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                    <p className={`text-[10px] mt-2 ${msg.sender === 'buyer' ? 'text-slate-400' : 'text-blue-100'}`}>
                                        {msg.time}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-center">
                        <div className="bg-white border border-slate-200 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                            <span className="text-[10px] text-slate-500 font-medium font-['Inter']">AI sedang menyusun jawaban...</span>
                        </div>
                    </div>
                </div>

                {/* Message Input */}
                <div className="p-6 border-t border-slate-200 bg-white">
                    <div className="relative group">
                        <textarea
                            placeholder="Balas manual atau biarkan AI menanganinya..."
                            rows={1}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-6 pr-32 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none group-focus-within:border-blue-500/50 text-slate-900 placeholder-slate-400"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <button className="p-2 text-slate-500 hover:text-white transition-colors">
                                <Zap className="w-5 h-5" />
                            </button>
                            <button className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95">
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - AI Configuration */}
            <div className="w-72 border-l border-slate-200 flex flex-col bg-slate-50/50">
                <div className="p-6 border-b border-slate-200 flex items-center gap-2 bg-white">
                    <Settings2 className="w-5 h-5 text-blue-500" />
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Pengaturan AI</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Status Toggle */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Bot className="w-4 h-4 text-blue-400" />
                                <span className="text-xs font-bold text-slate-200">Sistem Aktif</span>
                            </div>
                            <button
                                onClick={() => setIsAIEnabled(!isAIEnabled)}
                                className={`w-10 h-5 rounded-full relative transition-all duration-300 ${isAIEnabled ? 'bg-blue-600' : 'bg-slate-700'}`}
                            >
                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${isAIEnabled ? 'left-6' : 'left-1'}`} />
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                            Saat diaktifkan, AI akan secara otomatis menangani semua pertanyaan pembeli yang masuk berdasarkan data toko Anda.
                        </p>
                    </div>

                    {/* AI Tone */}
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                            <Brain className="w-4 h-4 text-purple-400" /> Nada Interaksi
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {['Profesional', 'Ramah', 'Singkat', 'Detail'].map((tone) => (
                                <button key={tone} className={`px-3 py-2 rounded-lg text-[10px] font-bold border transition-all ${tone === 'Ramah'
                                    ? 'bg-blue-600/10 border-blue-500/50 text-blue-400'
                                    : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                                    }`}>
                                    {tone}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="pt-6 border-t border-slate-800 space-y-4 text-left">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Performa</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400">Total Balasan AI</span>
                                <span className="text-xs font-bold text-white">1,284</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400">Waktu Tersimpan</span>
                                <span className="text-xs font-bold text-green-400">~12.5 jam</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400">Intervensi Manusia</span>
                                <span className="text-xs font-bold text-amber-400">8.2%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subscription Upgrade */}
                <div className="p-4 m-4 bg-linear-to-br from-indigo-600/20 to-blue-600/20 border border-blue-500/20 rounded-2xl">
                    <p className="text-[10px] font-bold text-blue-400 mb-2 flex items-center gap-1 uppercase tracking-tighter">
                        <Sparkles className="w-3 h-3" /> Kredit AI Rendah
                    </p>
                    <p className="text-xs text-slate-300 mb-3 leading-tight">Asisten AI Anda telah menangani 95 pesan bulan ini.</p>
                    <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-lg transition-all active:scale-95 shadow-lg shadow-blue-500/20">
                        Top Up Kredit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIChatPage;

const Search = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
);
