import React from 'react';  
import { Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Clock, AlertCircle, CheckCircle2, XCircle, RotateCcw, ArrowRight, Loader2, Printer, ChevronRight } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import clsx from 'clsx';
const statusMap = {
    menunggu: { label: 'Menunggu Persetujuan', badge: 'badge-gold', icon: Clock, desc: 'Permintaan sedang diproses petugas' },
    disetujui: { label: 'Disetujui', badge: 'badge-blue', icon: CheckCircle2, desc: 'Segera ambil buku ke perpustakaan' },
    dipinjam: { label: 'Sedang Dipinjam', badge: 'badge-green', icon: BookOpen, desc: 'Buku sedang dalam peminjaman Anda' },
    terlambat: { label: 'Terlambat', badge: 'badge-red', icon: AlertCircle, desc: 'Segera kembalikan buku, denda terus bertambah' },
    dikembalikan: { label: 'Dikembalikan', badge: 'badge-gray', icon: RotateCcw, desc: 'Peminjaman selesai' },
    ditolak: { label: 'Ditolak', badge: 'badge-red', icon: XCircle, desc: 'Permintaan peminjaman ditolak' },
};
export default function PeminjamanPage({ peminjaman }) {
    const [cancelling, setCancelling] = React.useState(null);
    const handleCancel = async (id) => {
        const ok = await window.confirmAction('Batalkan peminjaman ini?');
        if (!ok) return;
        setCancelling(id);
        router.delete(`/peminjaman/${id}`, { onFinish: () => setCancelling(null) });
    };
    return (<AppLayout title="Peminjaman Saya">
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div className="page-header mb-0">
                        <h1 className="page-title">Peminjaman Aktif</h1>
                        <p className="page-subtitle">Daftar buku yang sedang Anda pinjam</p>
                    </div>
                    <Link href="/katalog" className="btn-primary text-sm">
                        <BookOpen className="w-4 h-4"/> Pinjam Buku
                    </Link>
                </div>

                {peminjaman.data.length === 0 ? (<div className="card p-16 text-center">
                        <BookOpen className="w-12 h-12 text-perpus-gray-200 mx-auto mb-4"/>
                        <p className="font-semibold text-perpus-gray-500">Tidak ada peminjaman aktif</p>
                        <p className="text-sm text-perpus-gray-400 mt-1">Mulai pinjam buku dari katalog kami</p>
                        <Link href="/katalog" className="btn-primary mt-6 inline-flex">Ke Katalog</Link>
                    </div>) : (<div className="space-y-4">
                        {peminjaman.data.map((p, i) => {
                const st = statusMap[p.status] ?? statusMap.menunggu;
                const Icon = st.icon;
                const tgl = new Date(p.tanggal_kembali_rencana);
                const daysLeft = Math.ceil((tgl.getTime() - Date.now()) / 86400000);
                const isLate = p.status === 'terlambat';
                const buku = p.buku || {};
                        return (<motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className={clsx('card p-5 cursor-pointer', isLate && 'border-red-200 dark:border-red-900/60')}
                            role="button"
                            tabIndex={0}
                            onClick={() => router.get(`/peminjaman/${p.id}`)}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { router.get(`/peminjaman/${p.id}`); } }}
                        >
                                    <div className="flex gap-4">
                                        {/* Cover */}
                                        <div className="w-14 h-20 rounded-xl overflow-hidden bg-perpus-gray-100 dark:bg-perpus-gray-800 flex-shrink-0">
                                            {buku.cover
                        ? <img src={`/storage/${buku.cover}`} alt={buku.judul} className="w-full h-full object-cover"/>
                        : <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-5 h-5 text-perpus-gray-400"/></div>}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <p className="font-semibold text-perpus-black dark:text-perpus-white line-clamp-1">{buku.judul || '—'}</p>
                                                    <p className="text-sm text-perpus-gray-400 mt-0.5">{buku.penulis || ''}</p>
                                                </div>
                                                <span className={`badge ${st.badge} flex-shrink-0`}>
                                                    <Icon className="w-2.5 h-2.5"/>{st.label}
                                                </span>
                                            </div>

                                            <p className="text-xs text-perpus-gray-400 mt-2">{st.desc}</p>

                                            <div className="flex flex-wrap items-center gap-4 mt-3">
                                                <div className="flex items-center gap-1.5 text-xs text-perpus-gray-500">
                                                    <Calendar className="w-3.5 h-3.5"/>
                                                    <span>Pinjam: {new Date(p.tanggal_pinjam).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <div className={clsx('flex items-center gap-1.5 text-xs font-medium', isLate ? 'text-perpus-red' : daysLeft <= 3 ? 'text-yellow-600 dark:text-yellow-400' : 'text-perpus-gray-500')}>
                                                    <Clock className="w-3.5 h-3.5"/>
                                                    {isLate ? `Terlambat ${Math.abs(daysLeft)} hari · Denda: Rp ${Number(p.denda_berjalan || p.denda || 0).toLocaleString('id-ID')}` : `Kembali: ${tgl.toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} (${daysLeft} hari lagi)`}
                                                </div>
                                                <span className="font-mono text-[11px] text-perpus-gray-300 dark:text-perpus-gray-600">{p.kode_peminjaman}</span>
                                            </div>

                                            <div className="flex items-center gap-2 mt-4">
                                                {buku.bisa_online && ['dipinjam', 'terlambat'].includes(p.status) && (<Link href={`/baca-online/${buku.id ?? ''}`} onClick={(e) => e.stopPropagation()} className="btn-primary text-xs py-1.5 px-3">
                                                        <BookOpen className="w-3.5 h-3.5"/> Baca Online
                                                    </Link>)}

                                                <a href={`/peminjaman/${p.id}?print=1`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="btn-ghost text-xs py-1.5 px-3 inline-flex items-center gap-2">
                                                    <Printer className="w-3.5 h-3.5"/> Cetak Struk
                                                </a>

                                                {p.status === 'menunggu' && (<button onClick={(e) => { e.stopPropagation(); handleCancel(p.id); }} disabled={cancelling === p.id} className="btn-secondary text-xs py-1.5 px-3 text-perpus-red border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                        {cancelling === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <XCircle className="w-3.5 h-3.5"/>}
                                                        Batalkan
                                                    </button>)}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>);
            })}
                    </div>)}

                {/* Pagination */}
                {peminjaman.last_page > 1 && (<div className="flex justify-center gap-1.5">
                        {peminjaman.links.map((l, i) => (<button key={i} disabled={!l.url || l.active} onClick={() => l.url && router.get(l.url)} className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', l.active ? 'bg-perpus-black dark:bg-perpus-white text-white dark:text-perpus-black' : 'text-perpus-gray-500 hover:bg-perpus-gray-100 dark:hover:bg-perpus-gray-800 disabled:opacity-30')} dangerouslySetInnerHTML={{ __html: l.label }}/>))}
                    </div>)}

                {/* Link to riwayat */}
                <div className="text-center">
                    <Link href="/riwayat" className="inline-flex items-center gap-1.5 text-sm text-perpus-gray-500 hover:text-perpus-black dark:hover:text-perpus-white transition-colors">
                        Lihat riwayat peminjaman <ArrowRight className="w-3.5 h-3.5"/>
                    </Link>
                </div>
            </div>
        </AppLayout>);
}
