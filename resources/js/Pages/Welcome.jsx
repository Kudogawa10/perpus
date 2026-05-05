import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, Search, BookMarked, Globe, Shield, Zap, ChevronDown } from 'lucide-react';
const stats = [
    { num: '10.000+', label: 'Koleksi Buku' },
    { num: '5.000+', label: 'Anggota Aktif' },
    { num: '500+', label: 'Buku Online' },
    { num: '50+', label: 'Kategori' },
];
const features = [
    {
        icon: BookMarked,
        title: 'Peminjaman Digital',
        desc: 'Ajukan peminjaman kapan saja, pantau status secara real-time dari mana pun.',
    },
    {
        icon: Globe,
        title: 'Baca Online',
        desc: 'Akses ratusan buku digital langsung dari browser tanpa perlu mengunduh.',
    },
    {
        icon: Shield,
        title: '3 Level Akses',
        desc: 'Sistem role Pengguna, Petugas, dan Admin yang terstruktur dan aman.',
    },
    {
        icon: Zap,
        title: 'Realtime & Cepat',
        desc: 'Notifikasi instan untuk persetujuan, jatuh tempo, dan pembaruan stok.',
    },
];
const katList = [
    '📖 Fiksi', '🔬 Sains', '💻 Teknologi', '🏛️ Sejarah',
    '🧠 Filsafat', '📊 Ekonomi', '🧩 Psikologi', '🎓 Pendidikan',
    '✍️ Sastra', '☪️ Agama', '🏥 Kesehatan', '🎨 Seni & Budaya',
];
export default function Welcome() {
    const [scrollY, setScrollY] = useState(0);
    useEffect(() => {
        const handler = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handler, { passive: true });
        return () => window.removeEventListener('scroll', handler);
    }, []);
    return (<div className="min-h-screen bg-perpus-white dark:bg-perpus-black overflow-x-hidden">

            {/* NAV */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 40 ? 'bg-perpus-white/90 dark:bg-perpus-black/90 backdrop-blur-xl border-b border-perpus-gray-100 dark:border-perpus-gray-900' : ''}`}>
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        {/* <div className="w-8 h-8 rounded-lg bg-perpus-black dark:bg-perpus-white flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-white dark:text-perpus-black"/>
                        </div> */}
                        <span className="font-display font-bold text-lg text-perpus-black dark:text-perpus-white">
                            My<span className="text-perpus-gold">Perpus</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/login" className="btn-ghost text-sm">Masuk</Link>
                        <Link href="/register" className="btn-primary text-sm px-4 py-2">Daftar Gratis</Link>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">

                {/* Background grid */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]">
                    <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
            backgroundSize: '60px 60px',
        }}/>
                </div>

                {/* Floating circles */}
                <motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-24 right-[10%] w-64 h-64 rounded-full border border-perpus-gray-200 dark:border-perpus-gray-800 opacity-40"/>
                <motion.div animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }} className="absolute bottom-32 left-[8%] w-40 h-40 rounded-full border border-perpus-gray-200 dark:border-perpus-gray-800 opacity-30"/>

                <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-perpus-gray-200 dark:border-perpus-gray-800 text-xs font-medium text-perpus-gray-500 mb-8">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
                            Perpustakaan Digital Indonesia
                        </div>

                        <h1 className="font-display font-bold text-5xl sm:text-7xl text-perpus-black dark:text-perpus-white leading-[0.95] mb-6">
                            Semua Buku,<br />
                            <span className="font-serif italic text-perpus-gray-400 dark:text-perpus-gray-500">
                                Dalam Satu
                            </span>{' '}
                            <span className="relative">
                                Genggaman
                                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                                    <path d="M2 8 Q75 2 150 8 Q225 14 298 8" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                                </svg>
                            </span>
                        </h1>

                        <p className="text-perpus-gray-500 dark:text-perpus-gray-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                            MyPerpus hadir sebagai solusi perpustakaan digital modern. Pinjam buku, baca online,
                            dan kelola keanggotaan dengan mudah — kapan saja, di mana saja.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link href="/register" className="btn-primary px-8 py-3.5 text-base">
                                Mulai Sekarang — Gratis
                                <ArrowRight className="w-4 h-4"/>
                            </Link>
                            <Link href="/login" className="btn-secondary px-8 py-3.5 text-base">
                                Sudah Punya Akun?
                            </Link>
                        </div>

                        {/* Quick Search */}
                        <div className="mt-10 max-w-lg mx-auto">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-perpus-gray-400"/>
                                <input type="text" placeholder="Cari judul buku, penulis..." className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm bg-perpus-gray-50 dark:bg-perpus-gray-900 border border-perpus-gray-200 dark:border-perpus-gray-800 focus:outline-none focus:ring-2 focus:ring-perpus-black/10 dark:focus:ring-perpus-white/10 text-perpus-black dark:text-perpus-white placeholder:text-perpus-gray-400" onKeyDown={e => {
            if (e.key === 'Enter') {
                window.location.href = `/login?redirect=/katalog?search=${encodeURIComponent(e.target.value)}`;
            }
        }}/>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-perpus-gray-300 hidden sm:block">
                                    Tekan Enter ↵
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Scroll cue */}
                    <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="mt-16 flex justify-center">
                        <ChevronDown className="w-5 h-5 text-perpus-gray-300 dark:text-perpus-gray-700"/>
                    </motion.div>
                </div>
            </section>

            {/* STATS */}
            <section className="py-16 border-y border-perpus-gray-100 dark:border-perpus-gray-900">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
                        {stats.map((s, i) => (<motion.div key={s.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                <p className="font-display font-bold text-3xl text-perpus-black dark:text-perpus-white">{s.num}</p>
                                <p className="text-xs text-perpus-gray-400 mt-1.5 uppercase tracking-widest">{s.label}</p>
                            </motion.div>))}
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="py-24 max-w-5xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-display font-bold text-3xl sm:text-4xl text-perpus-black dark:text-perpus-white mb-4">
                        Semua yang Anda Butuhkan
                    </motion.h2>
                    <p className="text-perpus-gray-500 max-w-md mx-auto">
                        Sistem perpustakaan lengkap dengan fitur modern untuk anggota, petugas, dan admin.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {features.map((f, i) => (<motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }} className="card p-6 hover:shadow-perpus transition-all duration-200">
                            <div className="w-10 h-10 rounded-xl bg-perpus-gray-100 dark:bg-perpus-gray-800 flex items-center justify-center mb-4">
                                <f.icon className="w-5 h-5 text-perpus-black dark:text-perpus-white"/>
                            </div>
                            <h3 className="font-display font-semibold text-lg text-perpus-black dark:text-perpus-white mb-2">{f.title}</h3>
                            <p className="text-perpus-gray-500 text-sm leading-relaxed">{f.desc}</p>
                        </motion.div>))}
                </div>
            </section>

            {/* KATEGORI */}
            <section className="py-16 bg-perpus-gray-50 dark:bg-perpus-gray-900">
                <div className="max-w-5xl mx-auto px-6">
                    <h2 className="font-display font-bold text-2xl text-perpus-black dark:text-perpus-white text-center mb-10">
                        Kategori Koleksi
                    </h2>
                    <div className="flex flex-wrap justify-center gap-3">
                        {katList.map((kat, i) => (<motion.div key={kat} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="px-4 py-2 rounded-full bg-perpus-white dark:bg-perpus-gray-800 border border-perpus-gray-200 dark:border-perpus-gray-700 text-sm text-perpus-gray-700 dark:text-perpus-gray-300 hover:border-perpus-gray-400 dark:hover:border-perpus-gray-500 transition-colors cursor-pointer">
                                {kat}
                            </motion.div>))}
                    </div>
                </div>
            </section>

            {/* 3 ROLES */}
            {/* <section className="py-24 max-w-5xl mx-auto px-6">
                <div className="text-center mb-14">
                    <h2 className="font-display font-bold text-3xl text-perpus-black dark:text-perpus-white mb-3">
                        Untuk Semua Peran
                    </h2>
                    <p className="text-perpus-gray-500">Satu platform, tiga level akses yang disesuaikan.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
            { role: 'Pengguna', icon: '🙋', badge: 'Anggota', color: 'border-perpus-gray-200 dark:border-perpus-gray-800', features: ['Pinjam hingga 3 buku', 'Baca buku online', 'Kartu anggota digital', 'Pantau status peminjaman', 'Riwayat lengkap'] },
            { role: 'Petugas', icon: '👨‍💼', badge: 'Staf', color: 'border-perpus-black dark:border-perpus-white', features: ['Proses peminjaman', 'Serahkan & terima buku', 'Kelola anggota', 'Buat laporan', 'Update stok buku'] },
            { role: 'Admin', icon: '⚙️', badge: 'Administrator', color: 'border-perpus-gray-200 dark:border-perpus-gray-800', features: ['Full CRUD buku', 'Kelola kategori', 'Manajemen petugas', 'Statistik & analitik', 'Ekspor laporan PDF'] },
        ].map((r, i) => (<motion.div key={r.role} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className={`card p-6 border-2 ${r.color}`}>
                            <div className="text-3xl mb-3">{r.icon}</div>
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="font-display font-bold text-xl text-perpus-black dark:text-perpus-white">{r.role}</h3>
                                <span className="badge badge-gray text-[10px]">{r.badge}</span>
                            </div>
                            <ul className="space-y-2">
                                {r.features.map(f => (<li key={f} className="flex items-center gap-2 text-sm text-perpus-gray-600 dark:text-perpus-gray-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-perpus-black dark:bg-perpus-white flex-shrink-0"/>
                                        {f}
                                    </li>))}
                            </ul>
                        </motion.div>))}
                </div>
            </section> */}

            {/* CTA */}
            <section className="py-20 bg-perpus-black dark:bg-perpus-gray-900">
                <div className="max-w-2xl mx-auto px-6 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
                            Bergabung dengan MyPerpus
                        </h2>
                        <p className="text-perpus-gray-400 mb-8">
                            Daftar gratis sekarang dan nikmati akses ke ribuan koleksi buku digital.
                        </p>
                        <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-perpus-black font-semibold hover:opacity-90 transition-opacity">
                            Daftar Gratis Sekarang
                            <ArrowRight className="w-4 h-4"/>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-8 border-t border-perpus-gray-100 dark:border-perpus-gray-900">
                <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-perpus-black dark:text-perpus-white text-sm">
                            My<span className="text-perpus-gold">Perpus</span>
                        </span>
                    </div>
                    <p className="text-xs text-perpus-gray-400">
                        © {new Date().getFullYear()} MyPerpus — Perpustakaan Digital Indonesia
                    </p>
                </div>
            </footer>
        </div>);
}
