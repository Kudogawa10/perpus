import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
export default function PetugasDashboard({ stats, butuh_perhatian, chart_data }) {
    const cards = [
        { label: 'Menunggu Persetujuan', value: stats.menunggu, icon: Clock, href: '/petugas/peminjaman?status=menunggu', bg: 'bg-yellow-50 dark:bg-yellow-900/20', ico: 'text-yellow-600 dark:text-yellow-400', urgent: stats.menunggu > 0 },
        { label: 'Sedang Dipinjam', value: stats.dipinjam, icon: BookOpen, href: '/petugas/peminjaman?status=dipinjam', bg: 'bg-blue-50 dark:bg-blue-900/20', ico: 'text-blue-600 dark:text-blue-400', urgent: false },
        { label: 'Terlambat', value: stats.terlambat, icon: AlertTriangle, href: '/petugas/peminjaman?status=terlambat', bg: 'bg-red-50 dark:bg-red-900/20', ico: 'text-red-600 dark:text-red-400', urgent: stats.terlambat > 0 },
        { label: 'Kembali Hari Ini', value: stats.dikembalikan_hari_ini, icon: CheckCircle2, href: '/petugas/peminjaman', bg: 'bg-green-50 dark:bg-green-900/20', ico: 'text-green-600 dark:text-green-400', urgent: false },
    ];
    return (<AppLayout title="Dashboard Petugas">
            <div className="max-w-5xl mx-auto space-y-8">
                <div>
                    <h1 className="page-title">Dashboard Petugas</h1>
                    <p className="page-subtitle">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {cards.map((c, i) => (<motion.div key={c.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                            <Link href={c.href}>
                                <div className={`card p-5 hover:shadow-perpus transition-all cursor-pointer relative ${c.urgent ? 'border-2' : ''}`}>
                                    {c.urgent && <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full animate-pulse"/>}
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${c.bg}`}>
                                        <c.icon className={`w-4 h-4 ${c.ico}`}/>
                                    </div>
                                    <p className="text-2xl font-display font-bold text-perpus-black dark:text-perpus-white">{c.value}</p>
                                    <p className="text-xs text-perpus-gray-400 uppercase tracking-wider mt-1">{c.label}</p>
                                </div>
                            </Link>
                        </motion.div>))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Chart */}
                    <div className="lg:col-span-3 card p-6">
                        <h3 className="font-display font-semibold text-perpus-black dark:text-perpus-white mb-4">Peminjaman 7 Hari Terakhir</h3>
                        <ResponsiveContainer width="100%" height={180}>
                            <AreaChart data={chart_data} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0a0a0a" stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor="#0a0a0a" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#a0a0a0' }} axisLine={false} tickLine={false}/>
                                <YAxis tick={{ fontSize: 10, fill: '#a0a0a0' }} axisLine={false} tickLine={false}/>
                                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #efefef', borderRadius: '8px', fontSize: '12px' }}/>
                                <Area type="monotone" dataKey="total" name="Peminjaman" stroke="#0a0a0a" strokeWidth={2} fill="url(#grad)" dot={{ fill: '#0a0a0a', r: 3 }}/>
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Butuh Perhatian */}
                    <div className="lg:col-span-2 card overflow-hidden">
                        <div className="px-5 py-4 border-b border-perpus-gray-100 dark:border-perpus-gray-800 flex items-center justify-between">
                            <h3 className="font-display font-semibold text-perpus-black dark:text-perpus-white">Butuh Perhatian</h3>
                            <Link href="/petugas/peminjaman" className="text-xs text-perpus-gray-400 hover:text-perpus-black dark:hover:text-perpus-white">Semua →</Link>
                        </div>
                        <div className="divide-y divide-perpus-gray-100 dark:divide-perpus-gray-800 max-h-64 overflow-y-auto">
                            {butuh_perhatian.length === 0 ? (<div className="p-8 text-center text-perpus-gray-400 text-sm">Tidak ada item mendesak</div>) : butuh_perhatian.map(p => (<div key={p.id} className="px-5 py-3 hover:bg-perpus-gray-50 dark:hover:bg-perpus-gray-800/40 transition-colors">
                                    <p className="text-sm font-medium text-perpus-black dark:text-perpus-white truncate">{p.user?.name}</p>
                                    <p className="text-xs text-perpus-gray-400 truncate">{p.buku?.judul}</p>
                                    <span className={`badge text-[10px] mt-1 ${p.status === 'menunggu' ? 'badge-gold' : 'badge-red'}`}>{p.status}</span>
                                </div>))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <h3 className="font-display font-semibold text-perpus-black dark:text-perpus-white mb-4">Aksi Cepat</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
            { href: '/petugas/peminjaman', icon: '📋', label: 'Kelola Peminjaman' },
            { href: '/petugas/buku', icon: '📚', label: 'Kelola Buku' },
            { href: '/petugas/anggota', icon: '👥', label: 'Data Anggota' },
            { href: '/petugas/laporan', icon: '📊', label: 'Laporan Bulanan' },
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
