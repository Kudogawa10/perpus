import React from 'react';
import { Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Clock, ArrowRight } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
export default function BacaOnlineIndex({ buku_dipinjam, buku_online, progress, filters }) {
    const [search, setSearch] = React.useState(filters.search || '');
    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/baca-online', { search }, { preserveState: true });
    };
    return (<AppLayout title="Baca Online">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="page-header">
                    <h1 className="page-title">Baca Online</h1>
                    <p className="page-subtitle">Akses koleksi buku digital langsung dari browser Anda</p>
                </div>

                {/* Lanjutkan Membaca */}
                {progress.length > 0 && (<div>
                        <h2 className="font-display font-semibold text-lg text-perpus-black dark:text-perpus-white mb-4">Lanjutkan Membaca</h2>
                        <div className="space-y-3">
                            {progress.map(p => {
                                const buku = p.buku || {};
                                return (<Link key={p.id} href={`/baca-online/${buku.id ?? ''}`}>
                                    <motion.div whileHover={{ x: 3 }} className="card p-4 flex items-center gap-4">
                                        <div className="w-10 h-14 rounded-lg overflow-hidden bg-perpus-gray-100 flex-shrink-0">
                                            {buku.cover ? <img src={`/storage/${buku.cover}`} alt={buku.judul} className="w-full h-full object-cover"/>
                    : <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-4 h-4 text-perpus-gray-400"/></div>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm text-perpus-black dark:text-perpus-white truncate">{buku.judul || '—'}</p>
                                            <p className="text-xs text-perpus-gray-400">{buku.penulis || ''}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="flex-1 h-1 bg-perpus-gray-100 dark:bg-perpus-gray-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-perpus-black dark:bg-perpus-white rounded-full" style={{ width: `${Math.min(100, Math.round((p.halaman / (buku.halaman || 100)) * 100))}%` }}/>
                                                </div>
                                                <span className="text-xs text-perpus-gray-400 flex items-center gap-1">
                                                    <Clock className="w-3 h-3"/> Hal. {p.halaman}
                                                </span>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-perpus-gray-400 flex-shrink-0"/>
                                    </motion.div>
                                </Link>);
                            })}
                        </div>
                    </div>)}

                {/* Buku yang Dipinjam dengan akses online */}
                {buku_dipinjam.length > 0 && (<div>
                        <h2 className="font-display font-semibold text-lg text-perpus-black dark:text-perpus-white mb-4">Buku Pinjaman Anda</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {buku_dipinjam.map(b => (<Link key={b.id} href={`/baca-online/${b.id}`}>
                                    <motion.div whileHover={{ y: -3 }} className="group">
                                        <div className="book-cover mb-2">
                                            {b.cover ? <img src={`/storage/${b.cover}`} alt={b.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                    : <div className="w-full h-full flex items-center justify-center bg-perpus-gray-100 dark:bg-perpus-gray-800"><BookOpen className="w-6 h-6 text-perpus-gray-400"/></div>}
                                            <div className="absolute inset-0 bg-perpus-black/0 group-hover:bg-perpus-black/10 transition-colors flex items-center justify-center">
                                                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-semibold">Baca Sekarang</span>
                                            </div>
                                        </div>
                                        <p className="text-xs font-semibold text-perpus-black dark:text-perpus-white line-clamp-2">{b.judul}</p>
                                        <p className="text-[11px] text-perpus-gray-400 mt-0.5">{b.penulis}</p>
                                    </motion.div>
                                </Link>))}
                        </div>
                    </div>)}

                {/* Semua Buku Online */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-display font-semibold text-lg text-perpus-black dark:text-perpus-white">Semua Buku Digital</h2>
                        <span className="text-xs text-perpus-gray-400">{buku_online.total} buku tersedia</span>
                    </div>

                    <form onSubmit={handleSearch} className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-perpus-gray-400"/>
                            <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari buku digital..." className="input pl-10"/>
                        </div>
                    </form>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {buku_online.data.map((b, i) => (<motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                                <Link href={`/baca-online/${b.id}`}>
                                    <div className="group">
                                        <div className="book-cover mb-2">
                                            {b.cover ? <img src={`/storage/${b.cover}`} alt={b.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                : <div className="w-full h-full flex items-center justify-center bg-perpus-gray-100 dark:bg-perpus-gray-800"><BookOpen className="w-5 h-5 text-perpus-gray-400"/></div>}
                                        </div>
                                        <p className="text-xs font-semibold text-perpus-black dark:text-perpus-white line-clamp-2">{b.judul}</p>
                                        <p className="text-[11px] text-perpus-gray-400 mt-0.5 truncate">{b.penulis}</p>
                                    </div>
                                </Link>
                            </motion.div>))}
                    </div>
                </div>
            </div>
        </AppLayout>);
}
