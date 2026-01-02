import React, { useState } from 'react';
import {
    Megaphone,
    Smartphone,
    Image as ImageIcon,
    Link as LinkIcon,
    Calendar,
    Trash2,
    Save,
    Eye,
    Layout,
    Plus,
    RefreshCw,
    X,
    Type,
    BadgeCheck
} from 'lucide-react';

const PromoPage: React.FC = () => {
    const [promo, setPromo] = useState({
        title: 'Mid-Season Mega Sale!',
        message: 'Get up to 70% off on all electronic items. Limited time offer only for app users!',
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
        cta: 'Shop Now',
        link: 'https://marketai.com/sale',
        isActive: true
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            // Create a preview URL
            const previewUrl = URL.createObjectURL(file);
            setPromo(prev => ({ ...prev, image: previewUrl }));
        }
    };

    const handleSave = () => {
        setIsSaving(true);
        console.log('Starting image upload...', selectedFile);
        // Simulate upload delay
        setTimeout(() => {
            console.log('Upload complete! Saving promo data:', promo);
            setIsSaving(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700 h-[calc(100vh-160px)]">
            {/* Left Section: Editor Form */}
            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Pop-up Promo</h1>
                        <p className="text-slate-400 mt-1">Configure the home screen promotion for your mobile apps.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all border border-slate-700/50">
                            <Plus className="w-4 h-4" />
                            Draft
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/10 active:scale-95 ${isSaving ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white'
                                }`}
                        >
                            {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {isSaving ? 'Syncing...' : 'Publish Changes'}
                        </button>
                    </div>
                </div>

                <div className="space-y-8 bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-sm">
                    {/* Status Toggle */}
                    <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50 group">
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${promo.isActive ? 'bg-green-500/10 text-green-500' : 'bg-slate-800 text-slate-500'}`}>
                                <Megaphone className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Promotion Visibility</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Show this pop-up for all mobile users on app launch.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setPromo({ ...promo, isActive: !promo.isActive })}
                            className={`w-12 h-6 rounded-full relative transition-all duration-300 ${promo.isActive ? 'bg-green-600' : 'bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${promo.isActive ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Type className="w-3.5 h-3.5" /> Promo Title
                            </label>
                            <input
                                type="text"
                                value={promo.title}
                                onChange={(e) => setPromo({ ...promo, title: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                                placeholder="Enter title..."
                            />
                        </div>

                        {/* CTA Text */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Layout className="w-3.5 h-3.5" /> CTA Button Text
                            </label>
                            <input
                                type="text"
                                value={promo.cta}
                                onChange={(e) => setPromo({ ...promo, cta: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                placeholder="Button label..."
                            />
                        </div>
                    </div>

                    {/* Message Area */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Smartphone className="w-3.5 h-3.5" /> Promotion Message
                        </label>
                        <textarea
                            rows={3}
                            value={promo.message}
                            onChange={(e) => setPromo({ ...promo, message: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                            placeholder="Tell them something exciting..."
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2 text-left">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <ImageIcon className="w-3.5 h-3.5" /> Featured Promo Image
                        </label>
                        <div className="relative group">
                            <label className="flex flex-col items-center justify-center w-full h-32 bg-slate-950 border-2 border-dashed border-slate-800 hover:border-blue-500/50 hover:bg-blue-500/5 rounded-2xl cursor-pointer transition-all">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <ImageIcon className="w-8 h-8 text-slate-500 mb-2 group-hover:text-blue-500 transition-colors" />
                                    <p className="text-xs text-slate-400">
                                        <span className="font-bold text-blue-500">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-[10px] text-slate-600 mt-1">PNG, JPG or WebP (max. 2MB)</p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </label>
                            {selectedFile && (
                                <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-800/50 px-3 py-1.5 rounded-lg w-fit">
                                    <BadgeCheck className="w-3 h-3 text-green-500" />
                                    {selectedFile.name}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Target Link */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" /> Target Destination Link
                        </label>
                        <input
                            type="text"
                            value={promo.link}
                            onChange={(e) => setPromo({ ...promo, link: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                            placeholder="Where should they go?"
                        />
                    </div>
                </div>
            </div>

            {/* Right Section: Live Phone Preview */}
            <div className="w-[380px] hidden lg:flex flex-col items-center justify-center shrink-0">
                <div className="relative flex flex-col items-center select-none group">
                    <p className="text-[10px] font-bold text-slate-500 mb-4 flex items-center gap-2 uppercase tracking-[0.2em]">
                        <Eye className="w-3 h-3" /> Live Preview
                    </p>

                    {/* Phone Frame */}
                    <div className="w-[320px] h-[640px] bg-slate-900 rounded-[3rem] border-8 border-slate-800 shadow-[0_0_0_2px_#334155,0_40px_80px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-50 flex items-center justify-center">
                            <div className="w-10 h-1 bg-slate-700/50 rounded-full" />
                        </div>

                        {/* App Content Placeholder */}
                        <div className="w-full h-full bg-[#020617] p-6 pt-12">
                            <div className="flex items-center justify-between mb-8 opacity-40">
                                <div className="space-y-1.5 flex-1 pr-12">
                                    <div className="h-4 bg-slate-800 rounded-full w-3/4" />
                                    <div className="h-3 bg-slate-800 rounded-full w-1/2" />
                                </div>
                                <div className="w-10 h-10 rounded-full bg-slate-800" />
                            </div>
                            <div className="grid grid-cols-2 gap-4 opacity-20">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="aspect-square bg-slate-800 rounded-2xl" />
                                ))}
                            </div>

                            {/* Popup Overlay */}
                            <div className={`absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 z-40 transition-all duration-500 overflow-hidden ${promo.isActive ? 'scale-100 opacity-100' : 'scale-75 opacity-0 invisible'}`}>
                                <div className="w-full bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-75 duration-500">
                                    {/* Close Button */}
                                    <button className="absolute top-4 right-4 p-2 bg-slate-950/50 text-white rounded-full hover:bg-slate-900 transition-all z-20">
                                        <X className="w-4 h-4" />
                                    </button>

                                    {/* Promo Image */}
                                    <div className="h-44 w-full relative">
                                        <img
                                            src={promo.image}
                                            alt="Preview"
                                            className="w-full h-full object-cover transition-opacity duration-300"
                                            onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL'}
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent" />
                                    </div>

                                    {/* Text Content */}
                                    <div className="p-6 pt-2 text-center">
                                        <h4 className="text-xl font-bold text-white mb-2 leading-tight">
                                            {promo.title || 'Add a Title'}
                                        </h4>
                                        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                                            {promo.message || 'Write a message to your users...'}
                                        </p>
                                        <button className="w-full py-4 bg-linear-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                                            {promo.cta || 'Click Me'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Home Indicator */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-800 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromoPage;
