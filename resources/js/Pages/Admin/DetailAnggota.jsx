import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, BookMarked, AlertCircle, TrendingUp, User, Calendar, MapPin, DollarSign, Shield, Download, Share2 } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import clsx from 'clsx';
import toast from 'react-hot-toast';

export default function DetailAnggota({ anggota, stats }) {
    const statusBadge = {
        aktif: 'badge-green',
        nonaktif: 'badge-gray',
        ditangguhkan: 'badge-red',
    };

    const peminjamanStatus = {
        dipinjam: { cls: 'badge-blue', label: 'Dipinjam' },
        terlambat: { cls: 'badge-red', label: 'Terlambat' },
        dikembalikan: { cls: 'badge-green', label: 'Dikembalikan' },
        ditolak: { cls: 'badge-gray', label: 'Ditolak' },
        pending: { cls: 'badge-yellow', label: 'Pending' },
    };

    const printKTA = () => {
        const html = `<!doctype html><html><head><meta charset="utf-8"><title>Kartu Anggota - ${anggota.name}</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,"Helvetica Neue",Arial;margin:0;padding:24px;background:#f3f4f6} .card{max-width:520px;margin:0 auto;padding:20px;border-radius:12px;box-shadow:0 12px 30px rgba(0,0,0,0.12);background:#0b1320;color:#fff} .brand{font-size:12px;opacity:0.85} .no{font-family:monospace;letter-spacing:0.08em;margin-top:6px}</style></head><body><div class="card"><div style="display:flex;justify-content:space-between;align-items:center"><div><div class="brand">MyPerpus</div><h2 style="margin:6px 0 2px;font-size:20px">${anggota.name}</h2><div class="no">${anggota.no_anggota || '-'}</div></div><div style="text-align:right"><div style="font-size:12px;opacity:0.9">Bergabung ${new Date(anggota.created_at).toLocaleDateString('id-ID')}</div><div style="margin-top:8px;font-size:12px;opacity:0.9">${anggota.email}</div>${anggota.phone ? `<div style="font-size:12px;opacity:0.9;margin-top:4px">${anggota.phone}</div>` : ''}</div></div></div></body></html>`;
        const w = window.open('', '_blank');
        if (!w) return;
        w.document.write(html);
        w.document.close();
        w.focus();
        setTimeout(() => { w.print(); w.close(); }, 350);
    };

    const shareKTA = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: `Kartu Anggota - ${anggota.name}`, text: anggota.name, url: window.location.href });
            } catch (e) { /* ignore */ }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                toast.success('Link KTA disalin ke clipboard');
            } catch (e) {
                toast.error('Gagal menyalin link');
            }
        }
    };

    return (
        <AppLayout title={`Detail Anggota - ${anggota.name}`}>
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Back link */}
                <Link
                    href="/admin/anggota"
                    className="inline-flex items-center gap-2 text-sm text-perpus-gray-500 hover:text-perpus-black dark:hover:text-perpus-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Anggota
                </Link>

                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-6"
                >
                    <div className="flex flex-col sm:flex-row items-start gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-perpus-gray-100 dark:bg-perpus-gray-800 flex items-center justify-center text-xl font-bold text-perpus-gray-500 flex-shrink-0">
                            {anggota.avatar ? (
                                <img
                                    src={`/storage/${anggota.avatar}`}
                                    alt={anggota.name}
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            ) : (
                                anggota.name.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div className="mt-4 flex gap-2 w-full">
                            <a href={`/kartu/${anggota.id}`} target="_blank" rel="noreferrer" className="btn-secondary flex items-center gap-2">
                                <Download className="w-4 h-4"/> Unduh KTA
                            </a>
                            <button onClick={shareKTA} className="btn-secondary flex items-center gap-2">
                                <Share2 className="w-4 h-4"/> Bagikan
                            </button>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-3 mb-1">
                                <h1 className="font-display font-bold text-2xl text-perpus-black dark:text-perpus-white">
                                    {anggota.name}
                                </h1>
                                <span className={`badge ${statusBadge[anggota.status] || 'badge-gray'}`}>
                                    {anggota.status}
                                </span>
                            </div>
                            <p className="text-sm text-perpus-gray-500 mb-3">{anggota.email}</p>
                            <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-1.5 text-perpus-gray-500">
                                    <User className="w-3.5 h-3.5" />
                                    <span className="font-mono text-xs">{anggota.no_anggota}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-perpus-gray-500">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>Bergabung {new Date(anggota.created_at).toLocaleDateString('id-ID')}</span>
                                </div>
                                {anggota.phone && (
                                    <div className="flex items-center gap-1.5 text-perpus-gray-500">
                                        <Shield className="w-3.5 h-3.5" />
                                        <span>{anggota.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5 text-perpus-gray-500">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>{anggota.domisili || '—'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Dipinjam', value: stats.total_dipinjam, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                        { label: 'Sedang Aktif', value: stats.aktif, icon: BookMarked, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                        { label: 'Denda Total', value: `Rp ${Number(stats.denda_total).toLocaleString('id-ID')}`, icon: DollarSign, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
                        { label: 'Level Anggota', value: stats.level, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                    ].map((s) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card p-4"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center', s.bg)}>
                                    <s.icon className={clsx('w-4 h-4', s.color)} />
                                </div>
                            </div>
                            <p className="text-lg font-bold text-perpus-black dark:text-perpus-white">{s.value}</p>
                            <p className="text-xs text-perpus-gray-400">{s.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Peminjaman History */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card overflow-hidden"
                >
                    <div className="p-4 border-b border-perpus-gray-100 dark:border-perpus-gray-800">
                        <h2 className="font-semibold text-perpus-black dark:text-perpus-white">
                            Riwayat Peminjaman
                        </h2>
                    </div>
                    <table className="table-perpus">
                        <thead>
                            <tr>
                                <th>Buku</th>
                                <th>Tanggal Pinjam</th>
                                <th>Tanggal Kembali</th>
                                <th>Status</th>
                                <th>Denda</th>
                            </tr>
                        </thead>
                        <tbody>
                            {anggota.peminjaman?.length > 0 ? (
                                anggota.peminjaman.map((p) => {
                                    const st = peminjamanStatus[p.status] || { cls: 'badge-gray', label: p.status };
                                    return (
                                        <tr key={p.id}>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-10 rounded-md overflow-hidden bg-perpus-gray-100 dark:bg-perpus-gray-800 flex-shrink-0">
                                                        {p.buku?.cover ? (
                                                            <img
                                                                src={`/storage/${p.buku?.cover}`}
                                                                alt={p.buku?.judul}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <BookOpen className="w-3 h-3 text-perpus-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-sm truncate max-w-[220px] text-perpus-black dark:text-perpus-white">
                                                            {p.buku?.judul || '—'}
                                                        </p>
                                                        <p className="text-xs text-perpus-gray-400">{p.buku?.penulis || '—'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-sm text-perpus-gray-500">
                                                    {p.tanggal_pinjam ? new Date(p.tanggal_pinjam).toLocaleDateString('id-ID') : '—'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="text-sm text-perpus-gray-500">
                                                    {p.tanggal_kembali ? new Date(p.tanggal_kembali).toLocaleDateString('id-ID') : '—'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={clsx('badge', st.cls)}>{st.label}</span>
                                            </td>
                                            <td>
                                                <span
                                                    className={clsx(
                                                        'text-sm font-medium',
                                                        p.denda > 0 ? 'text-red-500' : 'text-perpus-gray-400'
                                                    )}
                                                >
                                                    Rp {Number(p.denda || 0).toLocaleString('id-ID')}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="py-14 text-center">
                                            <BookOpen className="w-10 h-10 text-perpus-gray-200 mx-auto mb-3" />
                                            <p className="text-perpus-gray-500">Belum ada riwayat peminjaman</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </motion.div>
            </div>
        </AppLayout>
    );
}

