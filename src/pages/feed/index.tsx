import React, { useState, useRef } from 'react';
import {
    Rss,
    Search,
    Plus,
    Filter,
    Heart,
    MessageCircle,
    MoreHorizontal,
    Eye,
    Trash2,
    X,
    Image as ImageIcon,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    RefreshCw,
    Calendar,
    User,
    Upload
} from 'lucide-react';
import api from '../../services/api';
import authService from '../../services/auth.service';
import { getSafeImageUrl } from '../../utils/image';


interface FeedUser {
    id: string;
    username: string;
}

interface Feed {
    id: string;
    userId: string;
    content: string;
    imageUrl: string;
    likesCount: number;
    commentsCount: number;
    user: FeedUser;
    createdAt: string;
}

const FeedPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedFeed, setSelectedFeed] = useState<Feed | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 8;

    // Form state
    const [formData, setFormData] = useState({
        content: '',
        imageUrl: '',
        userId: ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Mock data
    const [feeds, setFeeds] = useState<Feed[]>([]);

    const fetchFeeds = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/feed', {
                params: {
                    page: currentPage,
                    limit: itemsPerPage,
                    search: searchQuery
                }
            });
            const { items, totalPages: total, totalItems: totalItems } = response.data;
            setFeeds(items || []);
            setTotalPages(total || 1);
            setTotalItems(totalItems || 0);
            console.log(response.data, 'data');
        } catch (error) {
            console.error('Error fetching feeds:', error);
            // Fallback for development if API fails
            // setFeeds([]);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchFeeds();
    }, [currentPage, searchQuery]);

    // Use feeds directly since filtering happens on backend
    const currentFeeds = feeds;

    // Pagination

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const openCreateModal = () => {
        setSelectedFeed(null);
        setFormData({ content: '', imageUrl: '', userId: '' });
        setImageFile(null);
        setImagePreview('');
        setIsModalOpen(true);
    };



    const openDeleteModal = (feed: Feed) => {
        setSelectedFeed(feed);
        setIsDeleteModalOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                setFormData({ ...formData, imageUrl: result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview('');
        setFormData({ ...formData, imageUrl: '' });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            let uploadedImageUrl = imageFile;

            // Now submit the feed with the uploaded image URL
            // Create new feed
            const response = await api.post('/feed', {
                content: formData.content,
                image: uploadedImageUrl
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Construct complete feed object with user details
            const currentUser = authService.getUser();
            const newFeed: Feed = {
                ...response.data,
                user: response.data.user || {
                    id: currentUser?.id || 'unknown',
                    username: currentUser?.username || 'user'
                }
            };

            setFeeds([newFeed, ...feeds]);

            setIsModalOpen(false);
        } catch (error) {
            console.error('Error submitting feed:', error);
            alert('Gagal menyimpan feed. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (selectedFeed) {
            setIsLoading(true);
            try {
                await api.delete(`/feed/${selectedFeed.id}`);
                setFeeds(feeds.filter(f => f.id !== selectedFeed.id));
                setIsDeleteModalOpen(false);
            } catch (error) {
                console.error('Error deleting feed:', error);
                alert('Gagal menghapus feed. Silakan coba lagi.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Pagination handlers
    const goToFirstPage = () => setCurrentPage(1);
    const goToLastPage = () => setCurrentPage(totalPages);
    const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight text-left">Feed</h1>
                    <p className="text-slate-500 mt-1">Kelola konten feed untuk aplikasi seluler.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Buat Feed Baru
                </button>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col lg:flex-row items-center gap-4">
                <div className="flex-1 relative w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Cari berdasarkan konten atau username..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
                    />
                </div>
                <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all">
                    <Filter className="w-5 h-5" />
                    Filter
                </button>
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                    Menampilkan <span className="font-semibold text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> sampai{' '}
                    <span className="font-semibold text-slate-700">{Math.min(currentPage * itemsPerPage, totalItems)}</span> dari{' '}
                    <span className="font-semibold text-slate-700">{totalItems}</span> feed
                </p>
            </div>

            {/* Feed Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentFeeds.map((feed) => (
                    <div key={feed.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                        {/* Image */}
                        <div className="relative h-48 bg-slate-100">
                            <img
                                src={getSafeImageUrl(feed.imageUrl)}
                                alt="Feed"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                }}
                            />
                            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">

                                <button
                                    onClick={() => openDeleteModal(feed)}
                                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all shadow-md"
                                    title="Hapus"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-3">
                            {/* User */}
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <User className="w-4 h-4 text-blue-600" />
                                </div>
                                <span className="text-sm font-semibold text-slate-900">@{feed.user?.username || 'User'}</span>
                            </div>

                            {/* Text */}
                            <p className="text-sm text-slate-600 line-clamp-2">{feed.content}</p>

                            {/* Stats */}
                            <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
                                <div className="flex items-center gap-1.5 text-slate-500">
                                    <Heart className="w-4 h-4" />
                                    <span className="text-xs font-medium">{feed.likesCount}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-500">
                                    <MessageCircle className="w-4 h-4" />
                                    <span className="text-xs font-medium">{feed.commentsCount}</span>
                                </div>
                                <div className="flex-1 text-right">
                                    <span className="text-[10px] text-slate-400">{formatDate(feed.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {currentFeeds.length === 0 && (
                <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        <Rss className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Tidak ada feed ditemukan</h3>
                    <p className="text-slate-500">Coba sesuaikan kriteria pencarian atau buat feed baru.</p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <button
                        onClick={goToFirstPage}
                        disabled={currentPage === 1}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        title="Halaman pertama"
                    >
                        <ChevronsLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        title="Halaman sebelumnya"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-xl font-semibold transition-all ${currentPage === page
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        title="Halaman berikutnya"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                    <button
                        onClick={goToLastPage}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        title="Halaman terakhir"
                    >
                        <ChevronsRight className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-slate-900">
                                Buat Feed Baru
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Content */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Rss className="w-3.5 h-3.5" /> Konten
                                </label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    rows={4}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                                    placeholder="Tulis konten feed..."
                                />
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <ImageIcon className="w-3.5 h-3.5" /> Gambar
                                </label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                                {!imagePreview ? (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                            <Upload className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-slate-600 group-hover:text-blue-600">Klik untuk upload gambar</p>
                                            <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP hingga 5MB</p>
                                        </div>
                                    </button>
                                ) : (
                                    <div className="relative h-48 bg-slate-100 rounded-xl overflow-hidden">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="p-3 bg-white rounded-xl text-slate-600 hover:bg-slate-100 transition-all shadow-lg"
                                                title="Ganti gambar"
                                            >
                                                <Upload className="w-5 h-5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="p-3 bg-white rounded-xl text-red-600 hover:bg-red-50 transition-all shadow-lg"
                                                title="Hapus gambar"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2.5 text-slate-600 font-medium hover:text-slate-900 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!formData.content || isLoading}
                                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                                Buat Feed
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && selectedFeed && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-8 h-8 text-red-600" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Hapus Feed?</h2>
                            <p className="text-slate-500">
                                Apakah Anda yakin ingin menghapus feed ini? Tindakan ini tidak dapat dibatalkan.
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-3 p-6 border-t border-slate-200">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-6 py-2.5 text-slate-600 font-medium hover:text-slate-900 transition-colors bg-slate-100 rounded-xl"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl shadow-lg shadow-red-600/20 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedPage;
