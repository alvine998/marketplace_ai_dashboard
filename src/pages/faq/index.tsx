import React, { useState, useEffect } from 'react';
import {
    HelpCircle,
    Search,
    Plus,
    Pencil,
    Trash2,
    X,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    RefreshCw,
    GripVertical,
    ChevronDown,
    ChevronUp,
    MessageSquareText
} from 'lucide-react';
import api from '../../services/api';

interface FAQ {
    id: string;
    question: string;
    answer: string;
    order: number;
    createdAt: string;
    updatedAt: string;
}

const FAQPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const itemsPerPage = 8;

    // Form state
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        order: 0
    });

    // Mock data
    const [faqs, setFaqs] = useState<FAQ[]>([]);

    const fetchFaqs = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/faqs');
            setFaqs(response.data.data || []); // Assuming API returns { data: [...] } or array
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            // Fallback for development/demo if API fails
            // setFaqs([]); 
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    // Filter FAQs based on search
    const filteredFAQs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => a.order - b.order);

    // Pagination
    const totalPages = Math.ceil(filteredFAQs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentFAQs = filteredFAQs.slice(startIndex, startIndex + itemsPerPage);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const openCreateModal = () => {
        setSelectedFAQ(null);
        setFormData({
            question: '',
            answer: '',
            order: faqs.length + 1
        });
        setIsModalOpen(true);
    };

    const openEditModal = (faq: FAQ) => {
        setSelectedFAQ(faq);
        setFormData({
            question: faq.question,
            answer: faq.answer,
            order: faq.order
        });
        setIsModalOpen(true);
    };

    const openDeleteModal = (faq: FAQ) => {
        setSelectedFAQ(faq);
        setIsDeleteModalOpen(true);
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            if (selectedFAQ) {
                // Update existing FAQ
                await api.put(`/faqs/${selectedFAQ.id}`, {
                    question: formData.question,
                    answer: formData.answer,
                    order: formData.order
                });

                setFaqs(faqs.map(f => f.id === selectedFAQ.id ? {
                    ...f,
                    question: formData.question,
                    answer: formData.answer,
                    order: formData.order,
                    updatedAt: new Date().toISOString()
                } : f));
            } else {
                // Create new FAQ
                const response = await api.post('/faqs', {
                    question: formData.question,
                    answer: formData.answer,
                    order: formData.order
                });
                const newFAQ: FAQ = response.data;
                setFaqs([...faqs, newFAQ]);
            }

            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving FAQ:', error);
            alert('Gagal menyimpan FAQ. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (selectedFAQ) {
            setIsLoading(true);
            try {
                await api.delete(`/faqs/${selectedFAQ.id}`);

                setFaqs(faqs.filter(f => f.id !== selectedFAQ.id));
                setIsDeleteModalOpen(false);
            } catch (error) {
                console.error('Error deleting FAQ:', error);
                alert('Gagal menghapus FAQ. Silakan coba lagi.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
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
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight text-left">FAQ</h1>
                    <p className="text-slate-500 mt-1">Kelola pertanyaan yang sering diajukan.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Tambah FAQ
                </button>
            </div>

            {/* Search */}
            <div className="flex flex-col lg:flex-row items-center gap-4">
                <div className="flex-1 relative w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Cari pertanyaan atau jawaban..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                    Menampilkan <span className="font-semibold text-slate-700">{startIndex + 1}</span> sampai{' '}
                    <span className="font-semibold text-slate-700">{Math.min(startIndex + itemsPerPage, filteredFAQs.length)}</span> dari{' '}
                    <span className="font-semibold text-slate-700">{filteredFAQs.length}</span> FAQ
                </p>
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
                {currentFAQs.map((faq) => (
                    <div key={faq.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        {/* Question Header */}
                        <div
                            className="flex items-center gap-4 p-5 cursor-pointer hover:bg-slate-50 transition-colors"
                            onClick={() => toggleExpand(faq.id)}
                        >
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                                <HelpCircle className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">
                                        #{faq.order}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-slate-900 text-left">{faq.question}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); openEditModal(faq); }}
                                    className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all"
                                    title="Edit"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); openDeleteModal(faq); }}
                                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                                    title="Hapus"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                {expandedId === faq.id ? (
                                    <ChevronUp className="w-5 h-5 text-slate-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-slate-400" />
                                )}
                            </div>
                        </div>

                        {/* Answer (Expandable) */}
                        {expandedId === faq.id && (
                            <div className="px-5 pb-5 border-t border-slate-100 pt-4 animate-in slide-in-from-top-2 duration-200">
                                <div className="flex items-start gap-3">
                                    <MessageSquareText className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                                    <p className="text-slate-600 text-sm leading-relaxed text-left">{faq.answer}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {currentFAQs.length === 0 && (
                <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        <HelpCircle className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Tidak ada FAQ ditemukan</h3>
                    <p className="text-slate-500">Coba sesuaikan kriteria pencarian atau tambah FAQ baru.</p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <button onClick={goToFirstPage} disabled={currentPage === 1} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all" title="Halaman pertama">
                        <ChevronsLeft className="w-5 h-5" />
                    </button>
                    <button onClick={goToPreviousPage} disabled={currentPage === 1} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all" title="Halaman sebelumnya">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-xl font-semibold transition-all ${currentPage === page
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                    <button onClick={goToNextPage} disabled={currentPage === totalPages} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all" title="Halaman berikutnya">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                    <button onClick={goToLastPage} disabled={currentPage === totalPages} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all" title="Halaman terakhir">
                        <ChevronsRight className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-slate-900">
                                {selectedFAQ ? 'Edit FAQ' : 'Tambah FAQ Baru'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Order */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <GripVertical className="w-3.5 h-3.5" /> Urutan
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                    className="w-32 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                />
                            </div>

                            {/* Question */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <HelpCircle className="w-3.5 h-3.5" /> Pertanyaan
                                </label>
                                <input
                                    type="text"
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                    placeholder="Tulis pertanyaan..."
                                />
                            </div>

                            {/* Answer */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <MessageSquareText className="w-3.5 h-3.5" /> Jawaban
                                </label>
                                <textarea
                                    value={formData.answer}
                                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                    rows={5}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                                    placeholder="Tulis jawaban..."
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
                            <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-medium hover:text-slate-900 transition-colors">
                                Batal
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!formData.question || !formData.answer || isLoading}
                                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                                {selectedFAQ ? 'Simpan Perubahan' : 'Tambah FAQ'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && selectedFAQ && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-8 h-8 text-red-600" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Hapus FAQ?</h2>
                            <p className="text-slate-500">
                                Apakah Anda yakin ingin menghapus FAQ ini? Tindakan ini tidak dapat dibatalkan.
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-3 p-6 border-t border-slate-200">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="px-6 py-2.5 text-slate-600 font-medium hover:text-slate-900 transition-colors bg-slate-100 rounded-xl">
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

export default FAQPage;
