import React, { useState } from 'react';
import {
    Search,
    UserPlus,
    Filter,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    MoreHorizontal,
    Eye,
    Pencil,
    Trash2
} from 'lucide-react';

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    joined: string;
    status: 'Active' | 'Inactive' | 'Pending';
    avatar: string;
}

const CustomerPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 6;

    // Extended mock data
    const allCustomers: Customer[] = [
        { id: '1', name: 'Alvin Yoga', email: 'alvin@example.com', phone: '+62 812-3456-7890', location: 'Jakarta, ID', joined: '12 Okt 2023', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Alvin+Yoga&background=0ea5e9&color=fff' },
        { id: '2', name: 'Sarah Miller', email: 'sarah.m@hey.com', phone: '+1 (555) 001-2345', location: 'London, UK', joined: '05 Nov 2023', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Sarah+Miller&background=8b5cf6&color=fff' },
        { id: '3', name: 'John Smith', email: 'johnsmith@gmail.com', phone: '+1 (555) 987-6543', location: 'New York, US', joined: '01 Des 2023', status: 'Inactive', avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=10b981&color=fff' },
        { id: '4', name: 'Elena Rodriguez', email: 'elena.r@corporate.com', phone: '+34 912 345 678', location: 'Madrid, ES', joined: '15 Jan 2024', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Elena+Rodriguez&background=f59e0b&color=fff' },
        { id: '5', name: 'Hiroshi Tanaka', email: 'hiro@tech.jp', phone: '+81 90-1234-5678', location: 'Tokyo, JP', joined: '20 Feb 2024', status: 'Pending', avatar: 'https://ui-avatars.com/api/?name=Hiroshi+Tanaka&background=ef4444&color=fff' },
        { id: '6', name: 'Maria Santos', email: 'maria.santos@mail.com', phone: '+55 11 9876-5432', location: 'São Paulo, BR', joined: '10 Mar 2024', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Maria+Santos&background=ec4899&color=fff' },
        { id: '7', name: 'David Chen', email: 'david.chen@company.cn', phone: '+86 138-0013-8000', location: 'Shanghai, CN', joined: '25 Mar 2024', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=David+Chen&background=14b8a6&color=fff' },
        { id: '8', name: 'Anna Kowalski', email: 'anna.k@email.pl', phone: '+48 501 234 567', location: 'Warsaw, PL', joined: '02 Apr 2024', status: 'Inactive', avatar: 'https://ui-avatars.com/api/?name=Anna+Kowalski&background=6366f1&color=fff' },
        { id: '9', name: 'Michael Brown', email: 'michael.b@enterprise.com', phone: '+1 (555) 123-4567', location: 'Chicago, US', joined: '18 Apr 2024', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Michael+Brown&background=84cc16&color=fff' },
        { id: '10', name: 'Yuki Yamamoto', email: 'yuki.y@company.jp', phone: '+81 80-9876-5432', location: 'Osaka, JP', joined: '05 Mei 2024', status: 'Pending', avatar: 'https://ui-avatars.com/api/?name=Yuki+Yamamoto&background=f97316&color=fff' },
        { id: '11', name: 'Pierre Dupont', email: 'pierre.d@mail.fr', phone: '+33 6 12 34 56 78', location: 'Paris, FR', joined: '20 Mei 2024', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Pierre+Dupont&background=0891b2&color=fff' },
        { id: '12', name: 'Sophie Williams', email: 'sophie.w@startup.com', phone: '+44 7700 900123', location: 'Manchester, UK', joined: '01 Jun 2024', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Sophie+Williams&background=a855f7&color=fff' },
        { id: '13', name: 'Ahmed Hassan', email: 'ahmed.h@business.ae', phone: '+971 50 123 4567', location: 'Dubai, AE', joined: '15 Jun 2024', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Ahmed+Hassan&background=dc2626&color=fff' },
        { id: '14', name: 'Lisa Anderson', email: 'lisa.a@corp.com', phone: '+1 (555) 234-5678', location: 'Seattle, US', joined: '02 Jul 2024', status: 'Inactive', avatar: 'https://ui-avatars.com/api/?name=Lisa+Anderson&background=059669&color=fff' },
        { id: '15', name: 'Marco Rossi', email: 'marco.r@azienda.it', phone: '+39 348 123 4567', location: 'Milan, IT', joined: '18 Jul 2024', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Marco+Rossi&background=7c3aed&color=fff' },
    ];

    // Filter customers based on search query
    const filteredCustomers = allCustomers.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination calculations
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

    // Reset to first page when search changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    // Pagination handlers
    const goToFirstPage = () => setCurrentPage(1);
    const goToLastPage = () => setCurrentPage(totalPages);
    const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight text-left">Pelanggan</h1>
                    <p className="text-slate-500 mt-1">Kelola hubungan dan data pelanggan Anda.</p>
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95">
                    <UserPlus className="w-5 h-5" />
                    Pelanggan Baru
                </button>
            </div>

            {/* Search & Bulk Actions */}
            <div className="flex flex-col lg:flex-row items-center gap-4">
                <div className="flex-1 relative w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Cari berdasarkan nama, email, atau negara..."
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
                    Menampilkan <span className="font-semibold text-slate-700">{startIndex + 1}</span> sampai{' '}
                    <span className="font-semibold text-slate-700">{Math.min(endIndex, filteredCustomers.length)}</span> dari{' '}
                    <span className="font-semibold text-slate-700">{filteredCustomers.length}</span> pelanggan
                </p>
            </div>

            {/* Customer Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Pelanggan</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Telepon</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Lokasi</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Bergabung</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="text-center py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {currentCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
                                                <img src={customer.avatar} alt={customer.name} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="font-semibold text-slate-900">{customer.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-slate-600">{customer.email}</td>
                                    <td className="py-4 px-6 text-slate-600">{customer.phone}</td>
                                    <td className="py-4 px-6 text-slate-600">{customer.location}</td>
                                    <td className="py-4 px-6 text-slate-600">{customer.joined}</td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${customer.status === 'Active'
                                            ? 'bg-green-100 text-green-700'
                                            : customer.status === 'Pending'
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${customer.status === 'Active'
                                                ? 'bg-green-500'
                                                : customer.status === 'Pending'
                                                    ? 'bg-amber-500'
                                                    : 'bg-slate-400'
                                                }`} />
                                            {customer.status === 'Active' ? 'Aktif' : customer.status === 'Pending' ? 'Tertunda' : 'Tidak Aktif'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-center gap-1">
                                            <button className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all" title="Lihat">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all" title="Ubah">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all" title="Hapus">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {currentCustomers.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Pelanggan tidak ditemukan</h3>
                        <p className="text-slate-500">Coba sesuaikan kriteria pencarian atau filter Anda.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    {/* First Page */}
                    <button
                        onClick={goToFirstPage}
                        disabled={currentPage === 1}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-all"
                        title="First page"
                    >
                        <ChevronsLeft className="w-5 h-5" />
                    </button>

                    {/* Previous Page */}
                    <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-all"
                        title="Previous page"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                        {getPageNumbers().map((page, index) => (
                            typeof page === 'number' ? (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 rounded-xl font-semibold transition-all ${currentPage === page
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    {page}
                                </button>
                            ) : (
                                <span key={index} className="px-2 text-slate-400">
                                    {page}
                                </span>
                            )
                        ))}
                    </div>

                    {/* Next Page */}
                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-all"
                        title="Next page"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Last Page */}
                    <button
                        onClick={goToLastPage}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-all"
                        title="Last page"
                    >
                        <ChevronsRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default CustomerPage;
