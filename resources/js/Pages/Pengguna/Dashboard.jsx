import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, BookMarked, Star, ArrowRight, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import clsx from 'clsx';
// ---- Stat Card Component ----
function StatCard({ icon: Icon, label, value, sub, color }) {
    return (<motion.div whileHover={{ y: -2 }} className="stat-card">
            <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', color)}>
                <Icon className="w-5 h-5"/>
            </div>
            <div>
                <p className="stat-number">{value}</p>
                <p className="stat-label">{label}</p>
                {sub && <p className="text-xs text-perpus-gray-400 mt-0.5">{sub}</p>}
            </div>
        </motion.div>);
}
// ---- Book Card ----
function BookCard({ buku, compact = false }) {
    if (!buku) {
        return (<div className="card-hover group">
                <motion.div whileHover={{ y: -3 }} className="card-hover group">
                    <div className="book-cover mb-3">
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-perpus-gray-200 dark:bg-perpus-gray-700">
                            <BookOpen className="w-8 h-8 text-perpus-gray-400"/>
                            <span className="text-[9px] text-perpus-gray-400 text-center px-2 leading-tight">Data buku tidak tersedia</span>
                        </div>
                    </div>
                </motion.div>
            </div>);
    }

    return (<Link href={`/katalog/${buku.id ?? ''}`}>
            <motion.div whileHover={{ y: -3 }} className="card-hover group">
                <div className="book-cover mb-3">
                    {(buku.cover) ? (<img src={`/storage/${buku.cover}`} alt={buku.judul ?? ''} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"/>) : (<div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-perpus-gray-200 dark:bg-perpus-gray-700">
                            <BookOpen className="w-8 h-8 text-perpus-gray-400"/>
                            <span className="text-[9px] text-perpus-gray-400 text-center px-2 leading-tight">{buku.judul ?? ''}</span>
                        </div>)}
                    {buku.bisa_online && (<div className="absolute top-2 right-2">
                            <span className="badge badge-black text-[10px]">Online</span>
                        </div>)}
                </div>
                <div className="px-1">
                    <p className="text-sm font-semibold text-perpus-black dark:text-perpus-white line-clamp-2 leading-snug">
                        {buku.judul}
                    </p>
                    <p className="text-xs text-perpus-gray-400 mt-1 truncate">{buku.penulis}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                        <Star className="w-3 h-3 text-perpus-gold fill-perpus-gold"/>
                        <span className="text-xs text-perpus-gray-500">
                            {(buku.rating !== undefined && buku.rating !== null)
                                ? Number(buku.rating).toFixed(1)
                                : '—'}
                        </span>
                    </div>
                </div>
            </motion.div>
        </Link>);
}
// ---- Status Badge ----
function StatusBadge({ status }) {
    const map = {
        menunggu: { label: 'Menunggu', class: 'badge-gold' },
        disetujui: { label: 'Disetujui', class: 'badge-blue' },
        dipinjam: { label: 'Dipinjam', class: 'badge-green' },
        dikembalikan: { label: 'Selesai', class: 'badge-gray' },
        terlambat: { label: 'Terlambat', class: 'badge-red' },
        ditolak: { label: 'Ditolak', class: 'badge-red' },
    };
    const s = map[status] || map.menunggu;
    return <span className={`badge ${s.class}`}>{s.label}</span>;
}
export default function Dashboard({ stats, peminjaman_aktif, buku_rekomendasi, buku_baru, peminjaman_akan_kembali }) {
    const { auth } = usePage().props;
    const hour = new Date().getHours();
    const greeting = hour < 11 ? 'Selamat Pagi' : hour < 15 ? 'Selamat Siang' : hour < 18 ? 'Selamat Sore' : 'Selamat Malam';
    return (<AppLayout title="Dashboard">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* WELCOME HEADER */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="font-display font-bold text-2xl text-perpus-black dark:text-perpus-white">
                            {greeting}, <span className="text-gradient">{auth.user.name.split(' ')[0]}</span> 👋
                        </h1>
                        <p className="text-perpus-gray-500 text-sm mt-1">
                            No. Anggota: <span className="font-mono font-semibold text-perpus-black dark:text-perpus-white">{auth.user.no_anggota}</span>
                        </p>
                    </div>
                    <Link href="/katalog" className="btn-primary hidden sm:inline-flex">
                        Jelajahi Buku
                        <ArrowRight className="w-4 h-4"/>
                    </Link>
                </div>

                {/* STATS GRID */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={BookMarked} label="Sedang Dipinjam" value={stats.sedang_dipinjam} color="bg-perpus-black dark:bg-perpus-white text-white dark:text-perpus-black"/>
                    <StatCard icon={BookOpen} label="Total Dipinjam" value={stats.total_dipinjam} color="bg-perpus-gray-100 dark:bg-perpus-gray-800 text-perpus-gray-700 dark:text-perpus-gray-300"/>
                    <StatCard icon={TrendingUp} label="Buku Dibaca Online" value={stats.buku_dibaca_online} color="bg-perpus-gray-100 dark:bg-perpus-gray-800 text-perpus-gray-700 dark:text-perpus-gray-300"/>
                    <StatCard icon={Star} label="Poin Anggota" value={stats.poin_anggota} sub="Tukarkan di katalog" color="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"/>
                </div>

                {/* ALERT: Buku Akan Jatuh Tempo */}
                {peminjaman_akan_kembali.length > 0 && (<motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="flex items-start gap-3 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5"/>
                        <div>
                            <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                                {peminjaman_akan_kembali.length} buku harus dikembalikan dalam 3 hari ke depan
                            </p>
                            <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-0.5">
                                Segera kembalikan untuk menghindari denda keterlambatan.
                            </p>
                        </div>
                        <Link href="/peminjaman" className="ml-auto text-xs font-medium text-yellow-700 dark:text-yellow-300 hover:underline whitespace-nowrap">
                            Lihat →
                        </Link>
                    </motion.div>)}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ACTIVE LOANS */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-display font-semibold text-lg text-perpus-black dark:text-perpus-white">
                                Peminjaman Aktif
                            </h2>
                            <Link href="/peminjaman" className="text-sm text-perpus-gray-500 hover:text-perpus-black dark:hover:text-perpus-white transition-colors">
                                Lihat semua →
                            </Link>
                        </div>

                        {peminjaman_aktif.length === 0 ? (<div className="card p-8 text-center">
                                <BookOpen className="w-10 h-10 text-perpus-gray-300 mx-auto mb-3"/>
                                <p className="text-perpus-gray-500 text-sm">Tidak ada peminjaman aktif</p>
                                <Link href="/katalog" className="btn-primary mt-4 inline-flex">
                                    Pinjam Buku Sekarang
                                </Link>
                            </div>) : (<div className="space-y-3">
                                {peminjaman_aktif.map((p) => {
                                    const buku = p.buku || {};
                                    return (<motion.div key={p.id} whileHover={{ x: 2 }} className="card p-4 flex items-center gap-4">
                                            <div className="w-12 h-16 rounded-lg overflow-hidden bg-perpus-gray-100 dark:bg-perpus-gray-800 flex-shrink-0">
                                                {buku.cover ? (<img src={`/storage/${buku.cover}`} alt={buku.judul ?? ''} className="w-full h-full object-cover"/>) : (<div className="w-full h-full flex items-center justify-center">
                                                        <BookOpen className="w-5 h-5 text-perpus-gray-400"/>
                                                    </div>)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm text-perpus-black dark:text-perpus-white truncate">
                                                    {buku.judul ?? '—'}
                                                </p>
                                                <p className="text-xs text-perpus-gray-400 mt-0.5">{buku.penulis ?? ''}</p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <div className="flex items-center gap-1 text-xs text-perpus-gray-500">
                                                        <Calendar className="w-3 h-3"/>
                                                        <span>Kembali: {new Date(p.tanggal_kembali_rencana).toLocaleDateString('id-ID')}</span>
                                                    </div>
                                                    <StatusBadge status={p.status}/>
                                                </div>
                                            </div>
                                            {buku.bisa_online && (<Link href={`/baca-online/${buku.id ?? ''}`} className="btn-ghost text-xs px-3 py-1.5">
                                                    <BookOpen className="w-3.5 h-3.5"/>
                                                    Baca
                                                </Link>)}
                                        </motion.div>);
                                })}
                            </div>)}
                    </div>

                    {/* QUICK ACTIONS */}
                    <div className="space-y-4">
                        <h2 className="font-display font-semibold text-lg text-perpus-black dark:text-perpus-white">
                            Aksi Cepat
                        </h2>
                        <div className="space-y-2">
                            {[
            { href: '/katalog', icon: '📚', label: 'Cari & Pinjam Buku', sub: 'Jelajahi 10.000+ koleksi' },
            { href: '/baca-online', icon: '📖', label: 'Baca Online', sub: '500+ buku digital' },
            { href: '/profile', icon: '🪪', label: 'Kartu Anggota Digital', sub: 'Lihat KTA Anda' },
            { href: '/riwayat', icon: '📋', label: 'Riwayat Peminjaman', sub: 'Semua histori' },
        ].map(action => (<Link key={action.href} href={action.href}>
                                    <motion.div whileHover={{ x: 3 }} className="card p-3.5 flex items-center gap-3 hover:border-perpus-gray-300 dark:hover:border-perpus-gray-600 transition-colors">
                                        <span className="text-xl">{action.icon}</span>
                                        <div>
                                            <p className="text-sm font-semibold text-perpus-black dark:text-perpus-white">{action.label}</p>
                                            <p className="text-xs text-perpus-gray-400">{action.sub}</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-perpus-gray-400 ml-auto"/>
                                    </motion.div>
                                </Link>))}
                        </div>
                    </div>
                </div>

                {/* BOOK RECOMMENDATIONS */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-display font-semibold text-lg text-perpus-black dark:text-perpus-white">
                            Rekomendasi Untuk Anda
                        </h2>
                        <Link href="/katalog" className="text-sm text-perpus-gray-500 hover:text-perpus-black dark:hover:text-perpus-white transition-colors">
                            Lihat semua →
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {buku_rekomendasi.slice(0, 6).map((buku) => (<BookCard key={buku.id} buku={buku}/>))}
                    </div>
                </div>

                {/* NEW ARRIVALS */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-display font-semibold text-lg text-perpus-black dark:text-perpus-white">
                            Koleksi Terbaru
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {buku_baru.slice(0, 6).map((buku) => (<BookCard key={buku.id} buku={buku}/>))}
                    </div>
                </div>
            </div>
        </AppLayout>);
}
