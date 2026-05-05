import React from 'react';
import { router, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, RotateCcw, XCircle, Printer } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import clsx from 'clsx';
export default function Riwayat({ riwayat }) {
    return (<AppLayout title="Riwayat Peminjaman">
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="page-header">
                    <h1 className="page-title">Riwayat Peminjaman</h1>
                    <p className="page-subtitle">{riwayat.total} total peminjaman selesai</p>
                </div>

                {riwayat.data.length === 0 ? (<div className="card p-16 text-center">
                        <RotateCcw className="w-12 h-12 text-perpus-gray-200 mx-auto mb-4"/>
                        <p className="text-perpus-gray-500">Belum ada riwayat peminjaman</p>
                    </div>) : (<div className="card overflow-hidden divide-y divide-perpus-gray-100 dark:divide-perpus-gray-800">
                        {riwayat.data.map((p, i) => {
                                const buku = p.buku || {};
                                return (<motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="flex items-center gap-4 p-4 hover:bg-perpus-gray-50 dark:hover:bg-perpus-gray-800/40 transition-colors">
                                        <div className="w-10 h-14 rounded-lg overflow-hidden bg-perpus-gray-100 dark:bg-perpus-gray-800 flex-shrink-0">
                                            {buku.cover
                            ? <img src={`/storage/${buku.cover}`} alt={buku.judul} className="w-full h-full object-cover"/>
                            : <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-4 h-4 text-perpus-gray-400"/></div>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm text-perpus-black dark:text-perpus-white truncate">{buku.judul || '—'}</p>
                                            <p className="text-xs text-perpus-gray-400 truncate">{buku.penulis || ''}</p>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <span className="text-xs text-perpus-gray-400 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3"/>
                                                    {new Date(p.tanggal_pinjam).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                                {Number(p.denda_berjalan || p.denda || 0) > 0 && (<span className="text-xs text-perpus-red font-medium">
                                                        Denda: Rp {Number(p.denda_berjalan || p.denda || 0).toLocaleString('id-ID')}
                                                    </span>)}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={clsx('badge', p.status === 'dikembalikan' ? 'badge-gray' : 'badge-red')}>
                                                {p.status === 'dikembalikan' ? <RotateCcw className="w-2.5 h-2.5"/> : <XCircle className="w-2.5 h-2.5"/>}
                                                {p.status === 'dikembalikan' ? 'Selesai' : 'Ditolak'}
                                            </span>
                                            {p.status === 'dikembalikan' && (
                                                <>
                                                    {p.has_ulasan ? (
                                                        <Link href="/ulasan-saya" className="btn-ghost inline-flex items-center gap-2 text-xs">Edit Ulasan</Link>
                                                    ) : (
                                                        <Link href={`/katalog/${p.buku?.id}`} className="btn-ghost inline-flex items-center gap-2 text-xs">Beri Ulasan</Link>
                                                    )}
                                                    <a href={`/peminjaman/${p.id}/cetak-struk-return`} target="_blank" rel="noreferrer" className="btn-ghost inline-flex items-center gap-2 text-xs">
                                                        <Printer className="w-3 h-3"/> Cetak Struk Pengembalian
                                                    </a>
                                                </>
                                            )}
                                        </div>
                                    </motion.div>);
                            })}
                    </div>)}

                {riwayat.last_page > 1 && (<div className="flex justify-center gap-1.5">
                        {riwayat.links.map((l, i) => (<button key={i} disabled={!l.url || l.active} onClick={() => l.url && router.get(l.url)} className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', l.active ? 'bg-perpus-black dark:bg-perpus-white text-white dark:text-perpus-black' : 'text-perpus-gray-500 hover:bg-perpus-gray-100 disabled:opacity-30')} dangerouslySetInnerHTML={{ __html: l.label }}/>))}
                    </div>)}
            </div>
        </AppLayout>);
}
