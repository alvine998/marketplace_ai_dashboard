import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Trash2,
    Clock,
    Info,
    ShoppingCart,
    MessageSquare,
    AlertTriangle,
    ExternalLink,
    Share2,
    CheckCircle2
} from 'lucide-react';

const NotificationDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Mock data fetching based on ID
    const notification = {
        id,
        type: 'sale' as const,
        title: 'New Big Order Received!',
        message: 'Merchant "TechFlow Solutions" just processed a massive order for the AI Chat Pro Enterprise plan ($499.00/year). This is the 5th enterprise order from this merchant in the last 24 hours.\n\nSummary of Transaction:\n• Merchant: TechFlow Solutions\n• Package: AI Chat Pro Enterprise\n• Amount: $499.00\n• Payment Status: Success\n• Applied Coupon: None',
        timestamp: 'Jan 02, 2026 • 11:42 PM',
        priority: 'high',
        sender: 'Sales System'
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'system': return <Info className="w-8 h-8 text-blue-400" />;
            case 'sale': return <ShoppingCart className="w-8 h-8 text-green-400" />;
            case 'ai': return <MessageSquare className="w-8 h-8 text-indigo-400" />;
            case 'alert': return <AlertTriangle className="w-8 h-8 text-amber-400" />;
            default: return <Info className="w-8 h-8 text-slate-400" />;
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-right-4 fade-in duration-500">
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Inbox</span>
                </button>
                <div className="flex items-center gap-2">
                    <button className="p-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-500 rounded-xl transition-all">
                        <Trash2 className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Content Card */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-2xl">
                <div className="p-8 sm:p-12">
                    {/* Badge & Meta */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-slate-950 rounded-3xl shadow-inner border border-slate-800/50">
                                {getIcon(notification.type)}
                            </div>
                            <div className="text-left">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2.5 py-0.5 bg-blue-600/10 text-blue-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-blue-500/20">
                                        {notification.sender}
                                    </span>
                                    {notification.priority === 'high' && (
                                        <span className="px-2.5 py-0.5 bg-red-600/10 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-red-500/20 flex items-center gap-1">
                                            High Priority
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                                    <Clock className="w-3.5 h-3.5" /> {notification.timestamp}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-950/50 px-4 py-2 rounded-2xl border border-slate-800/50">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Verified Event</span>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="space-y-6 text-left">
                        <h2 className="text-3xl font-bold text-white leading-tight tracking-tight">
                            {notification.title}
                        </h2>
                        <div className="prose prose-invert max-w-none">
                            <p className="text-slate-400 text-lg leading-relaxed whitespace-pre-wrap">
                                {notification.message}
                            </p>
                        </div>
                    </div>

                    {/* CTA / Actions */}
                    <div className="mt-12 pt-10 border-t border-slate-800/50 flex flex-col sm:flex-row gap-4">
                        <button className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                            Go to Order Detail
                            <ExternalLink className="w-5 h-5" />
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all border border-slate-700/50 active:scale-95">
                            Mark as Resolved
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer Info */}
            <div className="text-center">
                <p className="text-xs text-slate-600 font-medium tracking-wide">
                    This is an automated notification from MarketAI Core Engine.
                    <br />Don't want to see these? <button className="text-blue-500 hover:underline">Adjust preferences</button>
                </p>
            </div>
        </div>
    );
};

export default NotificationDetailPage;
