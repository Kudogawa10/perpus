import React from 'react';
import { router } from '@inertiajs/react';
import { Download } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
        return (<div className="card px-3 py-2 text-xs shadow-perpus-lg">
                <p className="font-semibold mb-1">{label}</p>
                {payload.map((p) => <p key={p.name} style={{ color: p.color }}>{p.name}: <b>{p.value}</b></p>)}
            </div>);
    }
    return null;
};
export default function Statistik({ per_bulan, summary, top_buku, top_kategori, tahun }) {
    const summaryItems = [
        { label: 'Total Peminjaman', value: summary.total_peminjaman_tahun.toLocaleString('id-ID') },
        { label: 'Anggota Baru', value: summary.total_anggota_baru_tahun.toLocaleString('id-ID') },
        { label: 'Buku Baru', value: summary.total_buku_baru_tahun.toLocaleString('id-ID') },
        { label: 'Total Denda', value: `Rp ${summary.total_denda_tahun.toLocaleString('id-ID')}` },
        { label: 'Buku Tersedia', value: summary.buku_tersedia.toLocaleString('id-ID') },
        { label: 'Stok Habis', value: summary.buku_habis.toLocaleString('id-ID') },
    ];
    return (<AppLayout title="Statistik">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-start justify-between">
                    <div className="page-header mb-0">
                        <h1 className="page-title">Statistik & Laporan</h1>
                        <p className="page-subtitle">Analisis data perpustakaan tahun {tahun}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select value={tahun} onChange={e => router.get('/admin/statistik', { tahun: e.target.value })} className="input py-2 w-28">
                            {[2022, 2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <a href={`/admin/statistik/export?tahun=${tahun}`} className="btn-primary text-sm">
                            <Download className="w-4 h-4"/> Export PDF
                        </a>
                    </div>
                </div>

                {/* Summary Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {summaryItems.map(s => (<div key={s.label} className="card p-4 text-center">
                            <p className="text-xl font-display font-bold text-perpus-black dark:text-perpus-white">{s.value}</p>
                            <p className="text-[11px] text-perpus-gray-400 uppercase tracking-wider mt-1">{s.label}</p>
                        </div>))}
                </div>

                {/* Trend Chart */}
                <div className="card p-6">
                    <h3 className="font-display font-semibold text-perpus-black dark:text-perpus-white mb-6">Tren Peminjaman Tahun {tahun}</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={per_bulan} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="gPinjam" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0a0a0a" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#0a0a0a" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="gKembali" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#38a169" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#38a169" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#a0a0a0' }} axisLine={false} tickLine={false}/>
                            <YAxis tick={{ fontSize: 11, fill: '#a0a0a0' }} axisLine={false} tickLine={false}/>
                            <Tooltip content={<CustomTooltip />}/>
                            <Legend wrapperStyle={{ fontSize: '12px' }}/>
                            <Area type="monotone" dataKey="total" name="Dipinjam" stroke="#0a0a0a" strokeWidth={2} fill="url(#gPinjam)" dot={{ r: 3, fill: '#0a0a0a' }}/>
                            <Area type="monotone" dataKey="kembali" name="Dikembalikan" stroke="#38a169" strokeWidth={2} fill="url(#gKembali)" dot={{ r: 3, fill: '#38a169' }}/>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Buku */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card p-6">
                        <h3 className="font-display font-semibold text-perpus-black dark:text-perpus-white mb-4">Top 10 Buku Terpopuler</h3>
                        <div className="space-y-3">
                            {top_buku.map((b, i) => (<div key={b.id} className="flex items-center gap-3">
                                    <span className="w-5 text-xs font-bold text-perpus-gray-400 text-right">{i + 1}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-perpus-black dark:text-perpus-white truncate">{b.judul}</p>
                                        <p className="text-xs text-perpus-gray-400 truncate">{b.penulis}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-1.5 bg-perpus-gray-100 dark:bg-perpus-gray-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-perpus-black dark:bg-perpus-white rounded-full" style={{ width: `${Math.min(100, (b.peminjaman_count / (top_buku[0]?.peminjaman_count || 1)) * 100)}%` }}/>
                                        </div>
                                        <span className="text-xs font-semibold text-perpus-black dark:text-perpus-white w-6 text-right">{b.peminjaman_count}</span>
                                    </div>
                                </div>))}
                        </div>
                    </div>

                    {/* Top Kategori */}
                    <div className="card p-6">
                        <h3 className="font-display font-semibold text-perpus-black dark:text-perpus-white mb-4">Distribusi Kategori</h3>
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={top_kategori.slice(0, 8)} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                                <XAxis type="number" tick={{ fontSize: 10, fill: '#a0a0a0' }} axisLine={false} tickLine={false}/>
                                <YAxis dataKey="nama" type="category" tick={{ fontSize: 11, fill: '#606060' }} axisLine={false} tickLine={false} width={80}/>
                                <Tooltip content={<CustomTooltip />}/>
                                <Bar dataKey="buku_count" name="Jumlah Buku" fill="#0a0a0a" radius={[0, 4, 4, 0]}/>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </AppLayout>);
}
