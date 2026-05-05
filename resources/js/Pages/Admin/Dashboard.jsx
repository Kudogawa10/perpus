import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, Users, ClipboardList, AlertTriangle, ChevronRight, BarChart2, Plus } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import clsx from 'clsx';
const COLORS = ['#0a0a0a', '#404040', '#808080', '#c0c0c0', '#e0e0e0'];
const StatusBadge = ({ status }) => {
    const map = {
        menunggu: 'badge-gold',
        disetujui: 'badge-blue',
        dipinjam: 'badge-green',
        dikembalikan: 'badge-gray',
        terlambat: 'badge-red',
        ditolak: 'badge-red',
    };
    const labels = {
        menunggu: 'Menunggu', disetujui: 'Disetujui', dipinjam: 'Dipinjam',
        dikembalikan: 'Dikembalikan', terlambat: 'Terlambat', ditolak: 'Ditolak',
    };
    return <span className={`badge ${map[status] || 'badge-gray'}`}>{labels[status] || status}</span>;
};
// ---- Custom Tooltip for Recharts ----
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
        return (<div className="card px-3 py-2 text-xs shadow-perpus-lg">
                <p className="font-semibold text-perpus-black dark:text-perpus-white mb-1">{label}</p>
                {payload.map((p) => (<p key={p.name} style={{ color: p.color }}>
                        {p.name}: <span className="font-bold">{p.value.toLocaleString('id-ID')}</span>
                    </p>))}
            </div>);
    }
    return null;
};
export default function AdminDashboard({ statistik, peminjaman_terbaru, anggota_baru }) {
    const stats = [
        {
            label: 'Total Koleksi Buku',
            value: statistik.total_buku.toLocaleString('id-ID'),
            icon: BookOpen,
            change: '+12',
            up: true,
            sub: 'koleksi',
            href: '/admin/buku',
            bg: 'bg-perpus-black dark:bg-perpus-white',
            ico: 'text-white dark:text-perpus-black',
        },
        {
            label: 'Total Anggota',
            value: statistik.total_anggota.toLocaleString('id-ID'),
            icon: Users,
            change: '+48',
            up: true,
            sub: 'anggota aktif',
            href: '/admin/anggota',
            bg: 'bg-perpus-gray-100 dark:bg-perpus-gray-800',
            ico: 'text-perpus-gray-700 dark:text-perpus-gray-300',
        },
        {
            label: 'Peminjaman Aktif',
            value: statistik.total_peminjaman_aktif.toLocaleString('id-ID'),
            icon: ClipboardList,
            change: statistik.total_peminjaman_hari_ini.toString(),
            up: true,
            sub: `+${statistik.total_peminjaman_hari_ini} hari ini`,
            href: '/admin/peminjaman',
            bg: 'bg-perpus-gray-100 dark:bg-perpus-gray-800',
            ico: 'text-perpus-gray-700 dark:text-perpus-gray-300',
        },
        {
            label: 'Buku Terlambat',
            value: statistik.buku_terlambat.toLocaleString('id-ID'),
            icon: AlertTriangle,
            change: '',
            up: false,
            sub: `Denda: Rp ${statistik.denda_total.toLocaleString('id-ID')}`,
            href: '/admin/peminjaman?status=terlambat',
            bg: 'bg-red-50 dark:bg-red-900/20',
            ico: 'text-red-600 dark:text-red-400',
        },
    ];
    return (<AppLayout title="Dashboard Admin">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* HEADER */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="page-title">Dashboard Admin</h1>
                        <p className="page-subtitle">
                            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/admin/buku/create" className="btn-primary">
                            <Plus className="w-4 h-4"/>
                            Tambah Buku
                        </Link>
                        <Link href="/admin/statistik" className="btn-secondary">
                            <BarChart2 className="w-4 h-4"/>
                            Laporan
                        </Link>
                    </div>
                </div>

                {/* STAT CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((s, i) => (<motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                            <Link href={s.href}>
                                <div className="card p-5 hover:shadow-perpus transition-all duration-200 cursor-pointer group">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', s.bg)}>
                                            <s.icon className={clsx('w-5 h-5', s.ico)}/>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-perpus-gray-300 group-hover:text-perpus-gray-500 transition-colors"/>
                                    </div>
                                    <p className="text-2xl font-display font-bold text-perpus-black dark:text-perpus-white">{s.value}</p>
                                    <p className="text-xs font-medium text-perpus-gray-400 uppercase tracking-wider mt-1">{s.label}</p>
                                    <p className="text-xs text-perpus-gray-400 mt-2">{s.sub}</p>
                                </div>
                            </Link>
                        </motion.div>))}
                </div>

                {/* CHARTS ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Area Chart - Peminjaman Mingguan */}
                    <div className="lg:col-span-2 card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-display font-semibold text-perpus-black dark:text-perpus-white">
                                    Tren Peminjaman
                                </h3>
                                <p className="text-xs text-perpus-gray-400 mt-0.5">7 hari terakhir</p>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={statistik.peminjaman_minggu} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorPeminjaman" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0a0a0a" stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor="#0a0a0a" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#a0a0a0' }} axisLine={false} tickLine={false}/>
                                <YAxis tick={{ fontSize: 11, fill: '#a0a0a0' }} axisLine={false} tickLine={false}/>
                                <Tooltip content={<CustomTooltip />}/>
                                <Area type="monotone" dataKey="total" name="Peminjaman" stroke="#0a0a0a" strokeWidth={2} fill="url(#colorPeminjaman)" dot={{ fill: '#0a0a0a', r: 3 }} activeDot={{ r: 5 }}/>
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Pie Chart - Kategori Populer */}
                    <div className="card p-6">
                        <h3 className="font-display font-semibold text-perpus-black dark:text-perpus-white mb-6">
                            Kategori Terpopuler
                        </h3>
                        <ResponsiveContainer width="100%" height={160}>
                            <PieChart>
                                <Pie data={statistik.kategori_populer} dataKey="total" nameKey="kategori" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                                    {statistik.kategori_populer.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]}/>))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />}/>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-4 space-y-1.5">
                            {statistik.kategori_populer.slice(0, 4).map((k, i) => (<div key={k.kategori} className="flex items-center gap-2 text-xs">
                                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }}/>
                                    <span className="text-perpus-gray-600 dark:text-perpus-gray-400 flex-1 truncate">{k.kategori}</span>
                                    <span className="font-semibold text-perpus-black dark:text-perpus-white">{k.total}</span>
                                </div>))}
                        </div>
                    </div>
                </div>

                {/* BUKU POPULER BAR CHART */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-display font-semibold text-perpus-black dark:text-perpus-white">Buku Paling Banyak Dipinjam</h3>
                        <Link href="/admin/statistik" className="text-xs text-perpus-gray-400 hover:text-perpus-black dark:hover:text-perpus-white">
                            Lihat semua →
                        </Link>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={statistik.buku_populer.map(b => ({ nama: b.buku.judul.substring(0, 20) + '...', total: b.total }))} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="nama" tick={{ fontSize: 10, fill: '#a0a0a0' }} axisLine={false} tickLine={false}/>
                            <YAxis tick={{ fontSize: 11, fill: '#a0a0a0' }} axisLine={false} tickLine={false}/>
                            <Tooltip content={<CustomTooltip />}/>
                            <Bar dataKey="total" name="Dipinjam" fill="#0a0a0a" radius={[4, 4, 0, 0]}/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* BOTTOM ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Peminjaman Terbaru */}
                    <div className="card overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-perpus-gray-100 dark:border-perpus-gray-800">
                            <h3 className="font-display font-semibold text-perpus-black dark:text-perpus-white">Peminjaman Terbaru</h3>
                            <Link href="/admin/peminjaman" className="text-xs text-perpus-gray-400 hover:text-perpus-black dark:hover:text-perpus-white">
                                Lihat semua →
                            </Link>
                        </div>
                        <div className="divide-y divide-perpus-gray-100 dark:divide-perpus-gray-800">
                            {peminjaman_terbaru.map(p => (<div key={p.id} className="flex items-center gap-3 px-5 py-3 hover:bg-perpus-gray-50 dark:hover:bg-perpus-gray-800/40 transition-colors">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-perpus-black dark:text-perpus-white truncate">{p.judul_buku}</p>
                                        <p className="text-xs text-perpus-gray-400 truncate">{p.nama_anggota} · {new Date(p.tanggal).toLocaleDateString('id-ID')}</p>
                                    </div>
                                    <StatusBadge status={p.status}/>
                                </div>))}
                        </div>
                    </div>

                    {/* Anggota Baru */}
                    <div className="card overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-perpus-gray-100 dark:border-perpus-gray-800">
                            <h3 className="font-display font-semibold text-perpus-black dark:text-perpus-white">Anggota Baru</h3>
                            <Link href="/admin/anggota" className="text-xs text-perpus-gray-400 hover:text-perpus-black dark:hover:text-perpus-white">
                                Lihat semua →
                            </Link>
                        </div>
                        <div className="divide-y divide-perpus-gray-100 dark:divide-perpus-gray-800">
                            {anggota_baru.map(a => (<div key={a.id} className="flex items-center gap-3 px-5 py-3 hover:bg-perpus-gray-50 dark:hover:bg-perpus-gray-800/40 transition-colors">
                                    <div className="w-8 h-8 rounded-xl bg-perpus-gray-100 dark:bg-perpus-gray-800 flex items-center justify-center text-sm font-bold text-perpus-gray-500 flex-shrink-0">
                                        {a.nama.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-perpus-black dark:text-perpus-white truncate">{a.nama}</p>
                                        <p className="text-xs text-perpus-gray-400 font-mono">{a.no_anggota}</p>
                                    </div>
                                    <span className="text-xs text-perpus-gray-400">
                                        {new Date(a.tanggal).toLocaleDateString('id-ID')}
                                    </span>
                                </div>))}
                        </div>
                    </div>
                </div>

                {/* QUICK ACTIONS */}
                <div>
                    <h3 className="font-display font-semibold text-perpus-black dark:text-perpus-white mb-4">Aksi Cepat</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
            { href: '/admin/buku/create', icon: '📚', label: 'Tambah Buku' },
            { href: '/admin/anggota', icon: '👥', label: 'Kelola Anggota' },
            { href: '/admin/peminjaman', icon: '📋', label: 'Kelola Peminjaman' },
            { href: '/admin/petugas', icon: '👨‍💼', label: 'Data Petugas' },
        ].map(a => (<Link key={a.href} href={a.href}>
                                <motion.div whileHover={{ y: -2 }} className="card p-4 text-center hover:shadow-perpus transition-all cursor-pointer">
                                    <span className="text-2xl">{a.icon}</span>
                                    <p className="text-sm font-medium text-perpus-black dark:text-perpus-white mt-2">{a.label}</p>
                                </motion.div>
                            </Link>))}
                    </div>
                </div>
            </div>
        </AppLayout>);
}
