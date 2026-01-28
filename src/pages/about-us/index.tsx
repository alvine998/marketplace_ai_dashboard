import React, { useState, useEffect } from 'react';
import {
    Info,
    Save,
    RefreshCw,
    Smartphone,
    FileText,
    Link2,
    Mail,
    Phone,
    MapPin,
    Globe,
    Instagram,
    Facebook,
    Twitter,
    Youtube,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

interface AppConfig {
    key: string;
    value: string;
}

interface ConfigField {
    key: string;
    label: string;
    icon: React.ElementType;
    placeholder: string;
    type: 'text' | 'textarea' | 'url' | 'email' | 'tel';
}

const AboutUsPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Config fields definition
    const configFields: ConfigField[] = [
        { key: 'app_name', label: 'Nama Aplikasi', icon: Smartphone, placeholder: 'Nama aplikasi Anda', type: 'text' },
        { key: 'app_description', label: 'Deskripsi Aplikasi', icon: FileText, placeholder: 'Deskripsi singkat tentang aplikasi', type: 'textarea' },
        { key: 'about_us', label: 'Tentang Kami', icon: Info, placeholder: 'Ceritakan tentang perusahaan atau bisnis Anda', type: 'textarea' },
        { key: 'website_url', label: 'Website', icon: Globe, placeholder: 'https://www.example.com', type: 'url' },
        { key: 'contact_email', label: 'Email Kontak', icon: Mail, placeholder: 'email@example.com', type: 'email' },
        { key: 'contact_phone', label: 'Nomor Telepon', icon: Phone, placeholder: '+62 xxx xxxx xxxx', type: 'tel' },
        { key: 'address', label: 'Alamat', icon: MapPin, placeholder: 'Alamat lengkap kantor atau toko', type: 'textarea' },
        { key: 'instagram_url', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/username', type: 'url' },
        { key: 'facebook_url', label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/page', type: 'url' },
        { key: 'twitter_url', label: 'Twitter/X', icon: Twitter, placeholder: 'https://twitter.com/username', type: 'url' },
        { key: 'youtube_url', label: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/channel', type: 'url' },
        { key: 'terms_url', label: 'URL Syarat & Ketentuan', icon: Link2, placeholder: 'https://example.com/terms', type: 'url' },
        { key: 'privacy_url', label: 'URL Kebijakan Privasi', icon: Link2, placeholder: 'https://example.com/privacy', type: 'url' },
    ];

    // Config state - initialize with empty values
    const [configs, setConfigs] = useState<Record<string, string>>(() => {
        const initial: Record<string, string> = {};
        configFields.forEach(field => {
            initial[field.key] = '';
        });
        return initial;
    });

    // Mock initial data (in real app, this would be fetched from API)
    useEffect(() => {
        setIsLoading(true);
        // Simulate API fetch
        setTimeout(() => {
            setConfigs({
                app_name: 'Marketplace App',
                app_description: 'Aplikasi marketplace terlengkap untuk jual beli online.',
                about_us: 'Kami adalah platform marketplace yang menghubungkan penjual dan pembeli dari seluruh Indonesia.',
                website_url: 'https://marketplace.example.com',
                contact_email: 'support@marketplace.com',
                contact_phone: '+62 812 3456 7890',
                address: 'Jl. Sudirman No. 123, Jakarta Pusat 10110',
                instagram_url: 'https://instagram.com/marketplace',
                facebook_url: 'https://facebook.com/marketplace',
                twitter_url: '',
                youtube_url: '',
                terms_url: 'https://marketplace.example.com/terms',
                privacy_url: 'https://marketplace.example.com/privacy',
            });
            setIsLoading(false);
        }, 500);
    }, []);

    const handleChange = (key: string, value: string) => {
        setConfigs(prev => ({ ...prev, [key]: value }));
    };

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSave = async (key: string, value: string) => {
        setIsSaving(true);
        try {
            // In real implementation, this would be an API call:
            // await fetch('/app-config', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ key, value })
            // });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));

            console.log('Saving config:', { key, value });
            showToast(`${key} berhasil disimpan`, 'success');
        } catch (error) {
            showToast(`Gagal menyimpan ${key}`, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveAll = async () => {
        setIsSaving(true);
        try {
            // In real implementation, save all configs one by one or use batch endpoint
            for (const field of configFields) {
                const value = configs[field.key];
                // await fetch('/app-config', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({ key: field.key, value })
                // });
            }

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            showToast('Semua konfigurasi berhasil disimpan', 'success');
        } catch (error) {
            showToast('Gagal menyimpan konfigurasi', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                    <p className="text-slate-500">Memuat konfigurasi...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg animate-in slide-in-from-top-5 duration-300 ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                    {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="font-medium">{toast.message}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight text-left">Tentang Kami</h1>
                    <p className="text-slate-500 mt-1">Kelola informasi aplikasi yang ditampilkan kepada pengguna.</p>
                </div>
                <button
                    onClick={handleSaveAll}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Simpan Semua
                </button>
            </div>

            {/* Config Sections */}
            <div className="space-y-6">
                {/* App Info Section */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                        <h2 className="font-bold text-slate-900 flex items-center gap-2">
                            <Smartphone className="w-5 h-5 text-blue-500" />
                            Informasi Aplikasi
                        </h2>
                    </div>
                    <div className="p-6 space-y-6">
                        {configFields.slice(0, 3).map((field) => (
                            <ConfigInput
                                key={field.key}
                                field={field}
                                value={configs[field.key]}
                                onChange={handleChange}
                                onSave={handleSave}
                                isSaving={isSaving}
                            />
                        ))}
                    </div>
                </div>

                {/* Contact Info Section */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                        <h2 className="font-bold text-slate-900 flex items-center gap-2">
                            <Mail className="w-5 h-5 text-green-500" />
                            Informasi Kontak
                        </h2>
                    </div>
                    <div className="p-6 space-y-6">
                        {configFields.slice(3, 7).map((field) => (
                            <ConfigInput
                                key={field.key}
                                field={field}
                                value={configs[field.key]}
                                onChange={handleChange}
                                onSave={handleSave}
                                isSaving={isSaving}
                            />
                        ))}
                    </div>
                </div>

                {/* Social Media Section */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                        <h2 className="font-bold text-slate-900 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-purple-500" />
                            Media Sosial
                        </h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {configFields.slice(7, 11).map((field) => (
                            <ConfigInput
                                key={field.key}
                                field={field}
                                value={configs[field.key]}
                                onChange={handleChange}
                                onSave={handleSave}
                                isSaving={isSaving}
                            />
                        ))}
                    </div>
                </div>

                {/* Legal Section */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                        <h2 className="font-bold text-slate-900 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-amber-500" />
                            Dokumen Legal
                        </h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {configFields.slice(11).map((field) => (
                            <ConfigInput
                                key={field.key}
                                field={field}
                                value={configs[field.key]}
                                onChange={handleChange}
                                onSave={handleSave}
                                isSaving={isSaving}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Config Input Component
interface ConfigInputProps {
    field: ConfigField;
    value: string;
    onChange: (key: string, value: string) => void;
    onSave: (key: string, value: string) => void;
    isSaving: boolean;
}

const ConfigInput: React.FC<ConfigInputProps> = ({ field, value, onChange, onSave, isSaving }) => {
    const Icon = field.icon;

    return (
        <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Icon className="w-3.5 h-3.5" />
                {field.label}
            </label>
            <div className="flex gap-2">
                {field.type === 'textarea' ? (
                    <textarea
                        value={value}
                        onChange={(e) => onChange(field.key, e.target.value)}
                        rows={3}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                        placeholder={field.placeholder}
                    />
                ) : (
                    <input
                        type={field.type}
                        value={value}
                        onChange={(e) => onChange(field.key, e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        placeholder={field.placeholder}
                    />
                )}
                <button
                    onClick={() => onSave(field.key, value)}
                    disabled={isSaving}
                    className="px-4 py-3 bg-slate-100 hover:bg-blue-500 text-slate-500 hover:text-white rounded-xl transition-all disabled:opacity-50"
                    title="Simpan"
                >
                    <Save className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default AboutUsPage;
