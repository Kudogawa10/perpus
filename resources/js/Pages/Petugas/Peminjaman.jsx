import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle2, XCircle, RotateCcw, Clock, AlertTriangle, BookOpen, User, Calendar, ClipboardList, Loader2, X } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import toast from 'react-hot-toast';
import clsx from 'clsx';
const STATUS_OPTS = [
    { value: '', label: 'Semua Status' },
    { value: 'menunggu', label: 'Menunggu Persetujuan' },
    { value: 'disetujui', label: 'Disetujui' },
    { value: 'pengajuan_kembali', label: 'Pengajuan Kembali' },
    { value: 'dipinjam', label: 'Sedang Dipinjam' },
    { value: 'terlambat', label: 'Terlambat' },
    { value: 'dikembalikan', label: 'Dikembalikan' },
    { value: 'ditolak', label: 'Ditolak' },
];
const STATUS_BADGE = {
    menunggu: { label: 'Menunggu', class: 'badge-gold', icon: Clock },
    disetujui: { label: 'Disetujui', class: 'badge-blue', icon: CheckCircle2 },
    dipinjam: { label: 'Dipinjam', class: 'badge-green', icon: BookOpen },
    pengajuan_kembali: { label: 'Pengajuan Kembali', class: 'badge-yellow', icon: Clock },
    dikembalikan: { label: 'Dikembalikan', class: 'badge-gray', icon: RotateCcw },
    terlambat: { label: 'Terlambat', class: 'badge-red', icon: AlertTriangle },
    ditolak: { label: 'Ditolak', class: 'badge-red', icon: XCircle },
};
// ---- Action Modal ----
function ActionModal({ peminjaman, action, onClose }) {
    const { data, setData, post, processing } = useForm({
        catatan: '',
        denda: 0,
        kondisi_buku_saat_serah: '',
        bukti_penyerahan: null,
    });
    const labels = {
        setujui: { title: 'Setujui Peminjaman', btn: 'Setujui', color: 'btn-success' },
        tolak: { title: 'Tolak Peminjaman', btn: 'Tolak', color: 'btn-danger' },
        serahkan: { title: 'Serahkan Buku', btn: 'Konfirmasi', color: 'btn-primary' },
        kembalikan: { title: 'Konfirmasi Pengembalian', btn: 'Kembalikan', color: 'btn-primary' },
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/petugas/peminjaman/${peminjaman.id}/${action}`, {
            onSuccess: () => { toast.success(`Peminjaman berhasil ${labels[action].btn.toLowerCase()}!`); onClose(); },
            onError: () => toast.error('Terjadi kesalahan.'),
            forceFormData: action === 'serahkan',
        });
    };
    // Calculate auto-denda for return
    const hari_terlambat = peminjaman.status === 'terlambat'
        ? Math.max(0, Math.floor((Date.now() - new Date(peminjaman.tanggal_kembali_rencana).getTime()) / 86400000))
        : 0;
    const auto_denda = Number(peminjaman.denda_berjalan || peminjaman.denda || 0);
    const buku = peminjaman.buku || {};
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card p-6 max-w-md w-full shadow-perpus-xl">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display font-semibold text-perpus-black dark:text-perpus-white">
                        {labels[action].title}
                    </h3>
                    <button onClick={onClose} className="btn-ghost p-1.5"><X className="w-4 h-4"/></button>
                </div>

                {/* Loan Info */}
                <div className="card p-4 mb-5 bg-perpus-gray-50 dark:bg-perpus-gray-800 border-0">
                    <div className="flex items-start gap-3">
                        <BookOpen className="w-4 h-4 text-perpus-gray-400 mt-0.5 flex-shrink-0"/>
                        <div>
                            <p className="font-semibold text-sm text-perpus-black dark:text-perpus-white">{buku.judul || '—'}</p>
                            <p className="text-xs text-perpus-gray-400 mt-0.5">{buku.penulis || ''}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 mt-3">
                        <User className="w-4 h-4 text-perpus-gray-400 mt-0.5 flex-shrink-0"/>
                        <div>
                            <p className="font-semibold text-sm text-perpus-black dark:text-perpus-white">{peminjaman.user.name}</p>
                            <p className="text-xs text-perpus-gray-400 font-mono">{peminjaman.user.no_anggota}</p>
                        </div>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs text-perpus-gray-500">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3"/>
                            Pinjam: {new Date(peminjaman.tanggal_pinjam).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3"/>
                            Rencana Kembali: {new Date(peminjaman.tanggal_kembali_rencana).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    {hari_terlambat > 0 && (<div className="mt-3 flex items-center gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0"/>
                            <p className="text-xs text-red-700 dark:text-red-400">
                                Terlambat <strong>{hari_terlambat} hari</strong> — Denda otomatis: <strong>Rp {auto_denda.toLocaleString('id-ID')}</strong>
                            </p>
                        </div>)}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {action === 'kembalikan' && hari_terlambat > 0 && (<div>
                            <label className="input-label">Jumlah Denda (Rp)</label>
                            <input type="number" value={data.denda || auto_denda} onChange={e => setData('denda', +e.target.value)} className="input" min="0"/>
                        </div>)}
                    {action === 'serahkan' && (
                        <>
                            <div>
                                <label className="input-label">Catatan Kondisi Buku (Wajib)</label>
                                <textarea
                                    value={data.kondisi_buku_saat_serah}
                                    onChange={e => setData('kondisi_buku_saat_serah', e.target.value)}
                                    className="input resize-none"
                                    rows={3}
                                    placeholder="Contoh: cover baik, halaman lengkap, ada lipatan kecil di sudut."
                                    required
                                />
                            </div>
                            <div>
                                <label className="input-label">Bukti Penyerahan (Opsional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setData('bukti_penyerahan', e.target.files?.[0] || null)}
                                    className="input"
                                />
                            </div>
                        </>
                    )}
                    <div>
                        <label className="input-label">Catatan {action === 'tolak' ? '(Wajib: alasan penolakan)' : '(Opsional)'}</label>
                        <textarea value={data.catatan} onChange={e => setData('catatan', e.target.value)} className="input resize-none" rows={3} placeholder={action === 'tolak' ? 'Alasan penolakan peminjaman...' : 'Catatan tambahan...'} required={action === 'tolak'}/>
                    </div>
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1">Batal</button>
                        <button type="submit" disabled={processing} className={clsx(labels[action].color, 'flex-1 inline-flex items-center justify-center gap-2')}>
                            {processing && <Loader2 className="w-4 h-4 animate-spin"/>}
                            {labels[action].btn}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>);
}
export default function PetugasPeminjaman({ peminjaman, stats, filters }) {
    const [modal, setModal] = useState(null);
    const [search, setSearch] = useState(filters.search || '');
    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/petugas/peminjaman', { ...filters, search }, { preserveState: true });
    };
    return (<AppLayout title="Kelola Peminjaman">
            <div className="max-w-7xl mx-auto space-y-6">

                <div className="page-header">
                    <h1 className="page-title">Kelola Peminjaman</h1>
                    <p className="page-subtitle">Proses dan pantau semua peminjaman buku</p>
                </div>

                {/* STAT PILLS */}
                <div className="flex flex-wrap gap-3">
                    {[
            { label: 'Menunggu', value: stats.menunggu, class: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' },
            { label: 'Dipinjam', value: stats.dipinjam, class: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' },
            { label: 'Terlambat', value: stats.terlambat, class: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' },
            { label: 'Dikembalikan Hari Ini', value: stats.dikembalikan_hari_ini, class: 'bg-perpus-gray-50 dark:bg-perpus-gray-800 text-perpus-gray-700 dark:text-perpus-gray-300 border-perpus-gray-200 dark:border-perpus-gray-700' },
        ].map(s => (<div key={s.label} className={clsx('flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium', s.class)}>
                            <span className="font-bold text-base">{s.value}</span>
                            <span>{s.label}</span>
                        </div>))}
                </div>

                {/* FILTERS */}
                <form onSubmit={handleSearch} className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-perpus-gray-400"/>
                        <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama anggota, judul buku, kode..." className="input pl-10"/>
                    </div>
                    <select value={filters.status} onChange={e => router.get('/petugas/peminjaman', { ...filters, status: e.target.value })} className="input w-56">
                        {STATUS_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <button type="submit" className="btn-primary px-4">Cari</button>
                </form>

                {/* TABLE */}
                <div className="card overflow-hidden">
                    <table className="table-perpus">
                        <thead>
                            <tr>
                                <th>Kode</th>
                                <th>Anggota</th>
                                <th>Buku</th>
                                <th>Tgl Pinjam</th>
                                <th>Tgl Kembali</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {peminjaman.data.map(p => {
            const st = STATUS_BADGE[p.status];
            const isLate = p.status === 'terlambat';
            return (<tr key={p.id} className={isLate ? 'bg-red-50/30 dark:bg-red-900/10' : ''}>
                                        <td>
                                            <span className="font-mono text-xs text-perpus-gray-500">{p.kode_peminjaman}</span>
                                        </td>
                                        <td>
                                            <div>
                                                <p className="font-medium text-sm">{p.user.name}</p>
                                                <p className="text-xs text-perpus-gray-400 font-mono">{p.user.no_anggota}</p>
                                            </div>
                                        </td>
                                                    <td>
                                                        {(() => { const bukuRow = p.buku || {}; return (
                                                            <>
                                                                <p className="font-medium text-sm truncate max-w-[180px]">{bukuRow.judul || '—'}</p>
                                                                <p className="text-xs text-perpus-gray-400 truncate">{bukuRow.penulis || ''}</p>
                                                            </>
                                                        ); })()}
                                                    </td>
                                        <td className="text-sm">{new Date(p.tanggal_pinjam).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                        <td>
                                            <p className={clsx('text-sm', isLate && 'text-perpus-red font-semibold')}>
                                                {new Date(p.tanggal_kembali_rencana).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            {isLate && (<p className="text-xs text-perpus-red">
                                                    Denda: Rp {Number(p.denda_berjalan || p.denda || 0).toLocaleString('id-ID')}
                                                </p>)}
                                        </td>
                                        <td>
                                            <span className={`badge ${st.class}`}>
                                                <st.icon className="w-2.5 h-2.5"/>
                                                {st.label}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-1">
                                                {p.status === 'menunggu' && (<>
                                                    <button onClick={() => setModal({ p, action: 'setujui' })} className="btn-success py-1 px-2 text-xs">Setujui</button>
                                                    <button onClick={() => setModal({ p, action: 'tolak' })} className="btn-danger py-1 px-2 text-xs">Tolak</button>
                                                </>)}
                                                {p.status === 'disetujui' && (<button onClick={() => setModal({ p, action: 'serahkan' })} className="btn-primary py-1 px-2 text-xs">Serahkan</button>)}
                                                {(p.status === 'dipinjam' || p.status === 'terlambat' || p.status === 'pengajuan_kembali') && (<button onClick={() => setModal({ p, action: 'kembalikan' })} className="btn-secondary py-1 px-2 text-xs">Kembalikan</button>)}
                                            </div>
                                        </td>
                                    </tr>);
        })}
                        </tbody>
                    </table>

                    {peminjaman.data.length === 0 && (<div className="py-14 text-center">
                            <ClipboardList className="w-10 h-10 text-perpus-gray-300 mx-auto mb-3"/>
                            <p className="text-perpus-gray-500">Tidak ada data peminjaman</p>
                        </div>)}
                </div>

                {/* PAGINATION */}
                {peminjaman.last_page > 1 && (<div className="flex items-center justify-between text-sm">
                        <p className="text-perpus-gray-400 text-xs">
                            Menampilkan {peminjaman.from}–{peminjaman.to} dari {peminjaman.total} peminjaman
                        </p>
                        <div className="flex gap-1.5">
                            {peminjaman.links.map((link, i) => (<button key={i} disabled={!link.url || link.active} onClick={() => link.url && router.get(link.url)} className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', link.active
                    ? 'bg-perpus-black dark:bg-perpus-white text-white dark:text-perpus-black'
                    : 'text-perpus-gray-500 hover:bg-perpus-gray-100 dark:hover:bg-perpus-gray-800 disabled:opacity-30 disabled:cursor-not-allowed')} dangerouslySetInnerHTML={{ __html: link.label }}/>))}
                        </div>
                    </div>)}
            </div>

            <AnimatePresence>
                {modal && (<ActionModal peminjaman={modal.p} action={modal.action} onClose={() => setModal(null)}/>)}
            </AnimatePresence>
        </AppLayout>);
}
