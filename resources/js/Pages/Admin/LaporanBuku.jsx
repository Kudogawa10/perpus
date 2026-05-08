import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { FileDown } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import clsx from 'clsx';

export default function AdminLaporanBuku({ laporan, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const doSearch = (e) => {
        e.preventDefault();
        router.get('/admin/laporan-buku', { ...filters, search }, { preserveState: true });
    };

    return (
        <AppLayout title="Laporan Buku Petugas">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-start justify-between">
                    <div className="page-header mb-0">
                        <h1 className="page-title">Laporan Buku dari Petugas</h1>
                        <p className="page-subtitle">Monitoring stok, kondisi buku, dan bukti penyerahan.</p>
                    </div>
                    <a
                        href={`/admin/laporan-buku/export?${new URLSearchParams(filters).toString()}`}
                        className="btn-secondary"
                        title="Export laporan petugas ke PDF"
                    >
                        <FileDown className="w-4 h-4"/>
                        Export PDF
                    </a>
                </div>

                <form onSubmit={doSearch} className="flex flex-wrap gap-3">
                    <input className="input flex-1 min-w-[240px]" placeholder="Cari buku, petugas, kondisi..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    <select className="input w-44" value={filters.status || ''} onChange={(e) => router.get('/admin/laporan-buku', { ...filters, status: e.target.value })}>
                        <option value="">Semua Status</option>
                        <option value="dikirim">Dikirim</option>
                        <option value="ditinjau">Ditinjau</option>
                    </select>
                    <button className="btn-primary px-4">Cari</button>
                </form>

                <div className="card overflow-hidden">
                    <table className="table-perpus">
                        <thead>
                            <tr>
                                <th>Waktu</th>
                                <th>Petugas</th>
                                <th>Buku</th>
                                <th>Stok</th>
                                <th>Kondisi/Catatan</th>
                                <th>Bukti</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {laporan.data.map((l) => (
                                <tr key={l.id}>
                                    <td>{new Date(l.created_at).toLocaleString('id-ID')}</td>
                                    <td>{l.petugas?.name || '-'}</td>
                                    <td>{l.buku?.judul || '-'}</td>
                                    <td>{l.stok_tersedia}/{l.stok_total}</td>
                                    <td className="max-w-[360px]">
                                        <p className="text-sm">{l.kondisi_buku}</p>
                                        {l.catatan ? <p className="text-xs text-perpus-gray-400 mt-1">{l.catatan}</p> : null}
                                    </td>
                                    <td>
                                        {l.bukti_gambar
                                            ? <a href={`/storage/${l.bukti_gambar}`} target="_blank" rel="noreferrer" className="text-sm underline">Lihat</a>
                                            : '—'}
                                    </td>
                                    <td>
                                        <span className={clsx('badge', l.status === 'ditinjau' ? 'badge-green' : 'badge-gold')}>
                                            {l.status}
                                        </span>
                                    </td>
                                    <td>
                                        {l.status !== 'ditinjau' ? (
                                            <button className="btn-secondary py-1 px-2 text-xs" onClick={() => router.post(`/admin/laporan-buku/${l.id}/tinjau`)}>
                                                Tandai Ditinjau
                                            </button>
                                        ) : (
                                            <span className="text-xs text-perpus-gray-400">
                                                {l.admin_peninjau?.name || 'Admin'} • {l.ditinjau_pada ? new Date(l.ditinjau_pada).toLocaleString('id-ID') : '-'}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {laporan.data.length === 0 && <div className="p-6 text-sm text-perpus-gray-500">Belum ada laporan.</div>}
                </div>
            </div>
        </AppLayout>
    );
}
