import React, { useState, useCallback } from 'react';
import { Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid3X3, List, SlidersHorizontal, BookOpen, Star, X } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import debounce from 'lodash/debounce'; // lodash is available as a utility
import clsx from 'clsx';
const sortOptions = [
    { value: 'terbaru', label: 'Terbaru' },
    { value: 'terpopuler', label: 'Terpopuler' },
    { value: 'rating', label: 'Rating Tertinggi' },
    { value: 'judul', label: 'Judul A-Z' },
    { value: 'penulis', label: 'Penulis A-Z' },
];
export default function Katalog({ buku, kategori, filters }) {
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [localSearch, setLocalSearch] = useState(filters.search || '');
    const applyFilter = (params) => {
        router.get('/katalog', { ...filters, ...params }, { preserveState: true, replace: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSearch = useCallback(debounce((val) => applyFilter({ search: val, page: 1 }), 400), []);
    const handleSearch = (e) => {
        setLocalSearch(e.target.value);
        debouncedSearch(e.target.value);
    };
    return (<AppLayout title="Katalog Buku">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* HEADER */}
                <div className="page-header">
                    <h1 className="page-title">Katalog Buku</h1>
                    <p className="page-subtitle">
                        {buku.total.toLocaleString('id-ID')} buku tersedia untuk Anda
                    </p>
                </div>

                {/* SEARCH + CONTROLS BAR */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-perpus-gray-400"/>
                        <input type="search" value={localSearch} onChange={handleSearch} placeholder="Cari judul, penulis, ISBN..." className="input pl-10 py-3"/>
                        {localSearch && (<button onClick={() => { setLocalSearch(''); applyFilter({ search: '', page: 1 }); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-perpus-gray-400 hover:text-perpus-gray-600">
                                <X className="w-4 h-4"/>
                            </button>)}
                    </div>

                    {/* Sort */}
                    <select value={filters.sort} onChange={e => applyFilter({ sort: e.target.value })} className="input py-3 w-full sm:w-48">
                        {sortOptions.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                    </select>

                    {/* Filter Toggle */}
                    <button onClick={() => setShowFilters(!showFilters)} className={clsx('btn-secondary py-3 gap-2', showFilters && 'bg-perpus-black text-white dark:bg-perpus-white dark:text-perpus-black')}>
                        <SlidersHorizontal className="w-4 h-4"/>
                        <span>Filter</span>
                    </button>

                    {/* View Mode */}
                    <div className="flex gap-1 p-1 rounded-xl border border-perpus-gray-200 dark:border-perpus-gray-700">
                        <button onClick={() => setViewMode('grid')} className={clsx('p-2 rounded-lg transition-colors', viewMode === 'grid' ? 'bg-perpus-black dark:bg-perpus-white text-white dark:text-perpus-black' : 'text-perpus-gray-400 hover:text-perpus-gray-600')}>
                            <Grid3X3 className="w-4 h-4"/>
                        </button>
                        <button onClick={() => setViewMode('list')} className={clsx('p-2 rounded-lg transition-colors', viewMode === 'list' ? 'bg-perpus-black dark:bg-perpus-white text-white dark:text-perpus-black' : 'text-perpus-gray-400 hover:text-perpus-gray-600')}>
                            <List className="w-4 h-4"/>
                        </button>
                    </div>
                </div>

                {/* FILTER PANEL */}
                <AnimatePresence>
                    {showFilters && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="card p-5 overflow-hidden">
                            <div className="flex flex-wrap gap-6">
                                {/* Kategori */}
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-perpus-gray-400 mb-3">Kategori</p>
                                    <div className="flex flex-wrap gap-2">
                                        <button onClick={() => applyFilter({ kategori: '' })} className={clsx('px-3 py-1.5 rounded-full text-xs font-medium transition-colors', !filters.kategori
                ? 'bg-perpus-black dark:bg-perpus-white text-white dark:text-perpus-black'
                : 'bg-perpus-gray-100 dark:bg-perpus-gray-800 text-perpus-gray-600 dark:text-perpus-gray-400 hover:bg-perpus-gray-200 dark:hover:bg-perpus-gray-700')}>
                                            Semua
                                        </button>
                                        {kategori.map(k => (<button key={k.id} onClick={() => applyFilter({ kategori: k.slug })} className={clsx('px-3 py-1.5 rounded-full text-xs font-medium transition-colors', filters.kategori === k.slug
                    ? 'bg-perpus-black dark:bg-perpus-white text-white dark:text-perpus-black'
                    : 'bg-perpus-gray-100 dark:bg-perpus-gray-800 text-perpus-gray-600 dark:text-perpus-gray-400 hover:bg-perpus-gray-200 dark:hover:bg-perpus-gray-700')}>
                                                {k.nama} ({k.total_buku})
                                            </button>))}
                                    </div>
                                </div>

                                {/* Ketersediaan */}
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-perpus-gray-400 mb-3">Ketersediaan</p>
                                    <div className="flex items-center gap-2.5">
                                        <input id="tersedia" type="checkbox" checked={filters.tersedia} onChange={e => applyFilter({ tersedia: e.target.checked })} className="w-4 h-4 rounded border-perpus-gray-300 text-perpus-black focus:ring-perpus-black/20"/>
                                        <label htmlFor="tersedia" className="text-sm text-perpus-gray-700 dark:text-perpus-gray-300 cursor-pointer">
                                            Hanya tampilkan yang tersedia
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </motion.div>)}
                </AnimatePresence>

                {/* ACTIVE FILTERS */}
                {(filters.search || filters.kategori || filters.tersedia) && (<div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-perpus-gray-400">Filter aktif:</span>
                        {filters.search && (<span className="badge badge-black gap-1.5">
                                <Search className="w-2.5 h-2.5"/>
                                {filters.search}
                                <button onClick={() => { setLocalSearch(''); applyFilter({ search: '' }); }} className="hover:opacity-70">
                                    <X className="w-2.5 h-2.5"/>
                                </button>
                            </span>)}
                        {filters.kategori && (<span className="badge badge-black gap-1.5">
                                {kategori.find(k => k.slug === filters.kategori)?.nama}
                                <button onClick={() => applyFilter({ kategori: '' })} className="hover:opacity-70">
                                    <X className="w-2.5 h-2.5"/>
                                </button>
                            </span>)}
                        {filters.tersedia && (<span className="badge badge-black gap-1.5">
                                Tersedia
                                <button onClick={() => applyFilter({ tersedia: false })} className="hover:opacity-70">
                                    <X className="w-2.5 h-2.5"/>
                                </button>
                            </span>)}
                    </div>)}

                {/* BOOK GRID / LIST */}
                {buku.data.length === 0 ? (<div className="card p-16 text-center">
                        <BookOpen className="w-12 h-12 text-perpus-gray-300 mx-auto mb-4"/>
                        <p className="font-semibold text-perpus-gray-500">Buku tidak ditemukan</p>
                        <p className="text-sm text-perpus-gray-400 mt-1">Coba ubah kata kunci atau filter Anda</p>
                    </div>) : viewMode === 'grid' ? (<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {buku.data.map((b, i) => (<motion.div key={b.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                                <Link href={`/katalog/${b.id}`}>
                                    <div className="group cursor-pointer">
                                        <div className="book-cover mb-3 group-hover:shadow-perpus transition-all duration-200">
                                            {b.cover ? (<img src={`/storage/${b.cover}`} alt={b.judul} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"/>) : (<div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-perpus-gray-100 to-perpus-gray-200 dark:from-perpus-gray-800 dark:to-perpus-gray-700">
                                                    <BookOpen className="w-6 h-6 text-perpus-gray-400"/>
                                                    <span className="text-[9px] text-perpus-gray-400 text-center px-2 leading-tight">{b.judul}</span>
                                                </div>)}
                                            {b.stok_tersedia === 0 && (<div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold">Tidak Tersedia</span>
                                                </div>)}
                                            {b.bisa_online && (<div className="absolute top-2 left-2">
                                                    <span className="badge badge-black text-[9px] px-1.5">📖 Online</span>
                                                </div>)}
                                        </div>
                                        <div className="px-0.5">
                                            <p className="text-xs font-semibold text-perpus-black dark:text-perpus-white line-clamp-2 leading-snug">{b.judul}</p>
                                            <p className="text-[11px] text-perpus-gray-400 mt-0.5 truncate">{b.penulis}</p>
                                            <div className="flex items-center justify-between mt-1.5">
                                                <div className="flex items-center gap-0.5">
                                                    <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400"/>
                                                    <span className="text-[11px] text-perpus-gray-400">{Number.isFinite(Number(b.rating)) ? Number(b.rating).toFixed(1) : '—'}</span>
                                                </div>
                                                <span className={clsx('text-[10px] font-medium', b.stok_tersedia > 0 ? 'text-perpus-green' : 'text-perpus-red')}>
                                                    {b.stok_tersedia > 0 ? `${b.stok_tersedia} tersedia` : 'Habis'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>))}
                    </div>) : (<div className="card overflow-hidden">
                        <table className="table-perpus">
                            <thead>
                                <tr>
                                    <th>Buku</th>
                                    <th>Kategori</th>
                                    <th>Stok</th>
                                    <th>Rating</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {buku.data.map((b) => (<tr key={b.id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-14 rounded-lg overflow-hidden bg-perpus-gray-100 flex-shrink-0">
                                                    {b.cover
                    ? <img src={`/storage/${b.cover}`} alt={b.judul} className="w-full h-full object-cover"/>
                    : <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-4 h-4 text-perpus-gray-400"/></div>}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm">{b.judul}</p>
                                                    <p className="text-xs text-perpus-gray-400">{b.penulis} • {b.tahun_terbit}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="badge badge-gray">{b.kategori}</span></td>
                                        <td>
                                            <span className={clsx('text-sm font-medium', b.stok_tersedia > 0 ? 'text-perpus-green' : 'text-perpus-red')}>
                                                {b.stok_tersedia}/{b.stok_total}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400"/>
                                                <span className="text-sm">{Number.isFinite(Number(b.rating)) ? Number(b.rating).toFixed(1) : '—'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <Link href={`/katalog/${b.id}`} className="btn-ghost text-xs px-3 py-1.5">
                                                Detail
                                            </Link>
                                        </td>
                                    </tr>))}
                            </tbody>
                        </table>
                    </div>)}

                {/* PAGINATION */}
                {buku.last_page > 1 && (<div className="flex items-center justify-center gap-2">
                        {buku.links.map((link, i) => (<button key={i} disabled={!link.url || link.active} onClick={() => link.url && router.get(link.url)} className={clsx('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors', link.active
                    ? 'bg-perpus-black dark:bg-perpus-white text-white dark:text-perpus-black'
                    : 'text-perpus-gray-500 hover:bg-perpus-gray-100 dark:hover:bg-perpus-gray-800 disabled:opacity-30 disabled:cursor-not-allowed')} dangerouslySetInnerHTML={{ __html: link.label }}/>))}
                    </div>)}
            </div>
        </AppLayout>);
}
