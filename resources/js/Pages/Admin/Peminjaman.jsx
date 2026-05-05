import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Search, RotateCcw, Trash2, ClipboardList } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import toast from 'react-hot-toast';
import clsx from 'clsx';
const STATUS_BADGE = {
    menunggu: 'badge-gold', disetujui: 'badge-blue', dipinjam: 'badge-green',
    pengajuan_kembali: 'badge-yellow', dikembalikan: 'badge-gray', terlambat: 'badge-red', ditolak: 'badge-red',
};
export default function AdminPeminjaman({ peminjaman, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/peminjaman', { ...filters, search }, { preserveState: true });
    };
    const handleSetujui = async (id) => {
        const ok = await (window.confirmAction ? window.confirmAction('Setujui peminjaman ini?') : Promise.resolve(confirm('Setujui peminjaman ini?')));
        if (!ok) return;
        router.post(`/admin/peminjaman/${id}/setujui`, {}, {
            onSuccess: () => toast.success('Peminjaman disetujui'),
            onError: () => toast.error('Gagal'),
        });
    };
    const handleKembali = async (id) => {
        const ok = await (window.confirmAction ? window.confirmAction('Konfirmasi pengembalian buku ini?') : Promise.resolve(confirm('Konfirmasi pengembalian buku ini?')));
        if (!ok) return;
        router.post(`/admin/peminjaman/${id}/kembalikan`, {}, {
            onSuccess: () => toast.success('Dikembalikan'),
            onError: () => toast.error('Gagal'),
        });
    };
    const handleDelete = async (id) => {
        const ok = await (window.confirmAction ? window.confirmAction('Hapus data peminjaman ini?') : Promise.resolve(confirm('Hapus data peminjaman ini?')));
        if (!ok) return;
        router.delete(`/admin/peminjaman/${id}`, {
            onSuccess: () => toast.success('Data dihapus'),
            onError: () => toast.error('Tidak bisa menghapus peminjaman aktif'),
        });
    };
    return (<AppLayout title="Kelola Peminjaman">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="page-header">
                    <h1 className="page-title">Kelola Peminjaman</h1>
                    <p className="page-subtitle">{peminjaman.total.toLocaleString('id-ID')} total data peminjaman</p>
                </div>

                {/* Filters */}
                <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
                    <div className="relative flex-1 min-w-48">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-perpus-gray-400"/>
                        <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari anggota, buku, kode..." className="input pl-10"/>
                    </div>
                    <select value={filters.status || ''} onChange={e => router.get('/admin/peminjaman', { ...filters, status: e.target.value })} className="input w-44">
                        <option value="">Semua Status</option>
                        {['menunggu', 'disetujui', 'dipinjam', 'pengajuan_kembali', 'terlambat', 'dikembalikan', 'ditolak'].map(s => (<option key={s} value={s} className="capitalize">{s}</option>))}
                    </select>
                    <input type="date" value={filters.dari || ''} onChange={e => router.get('/admin/peminjaman', { ...filters, dari: e.target.value })} className="input w-36" title="Dari tanggal"/>
                    <input type="date" value={filters.sampai || ''} onChange={e => router.get('/admin/peminjaman', { ...filters, sampai: e.target.value })} className="input w-36" title="Sampai tanggal"/>
                    <button type="submit" className="btn-primary px-4">Cari</button>
                </form>

                {/* Table */}
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
                                <th>Denda</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {peminjaman.data.map(p => (<tr key={p.id} className={p.status === 'terlambat' ? 'bg-red-50/20 dark:bg-red-900/5' : ''}>
                                    <td><span className="font-mono text-xs text-perpus-gray-400">{p.kode_peminjaman}</span></td>
                                    <td>
                                        <p className="font-medium text-sm">{p.user?.name}</p>
                                        <p className="text-xs text-perpus-gray-400 font-mono">{p.user?.no_anggota}</p>
                                    </td>
                                    <td><p className="text-sm truncate max-w-[180px]">{p.buku?.judul}</p></td>
                                    <td className="text-sm">{new Date(p.tanggal_pinjam).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                    <td className={clsx('text-sm', p.status === 'terlambat' && 'text-perpus-red font-semibold')}>
                                        {new Date(p.tanggal_kembali_rencana).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td><span className={`badge ${STATUS_BADGE[p.status] || 'badge-gray'} capitalize`}>{p.status}</span></td>
                                    <td className="text-sm">
                                        {Number(p.denda_berjalan || p.denda || 0) > 0
                                            ? `Rp ${Number(p.denda_berjalan || p.denda || 0).toLocaleString('id-ID')}`
                                            : '—'}
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-1">
                                            {p.status === 'menunggu' && (<button onClick={() => handleSetujui(p.id)} className="btn-success py-1 px-2 text-xs">Setujui</button>)}
                                            {['dipinjam', 'terlambat', 'pengajuan_kembali'].includes(p.status) && (<button onClick={() => handleKembali(p.id)} className="btn-secondary py-1 px-2 text-xs">
                                                    <RotateCcw className="w-3 h-3"/> Kembali
                                                </button>)}
                                            {!['dipinjam', 'terlambat'].includes(p.status) && (<button onClick={() => handleDelete(p.id)} className="btn-ghost p-1.5 text-perpus-red">
                                                    <Trash2 className="w-3.5 h-3.5"/>
                                                </button>)}
                                        </div>
                                    </td>
                                </tr>))}
                        </tbody>
                    </table>
                    {peminjaman.data.length === 0 && (<div className="py-14 text-center">
                            <ClipboardList className="w-10 h-10 text-perpus-gray-200 mx-auto mb-3"/>
                            <p className="text-perpus-gray-500">Tidak ada data peminjaman</p>
                        </div>)}
                </div>

                {peminjaman.last_page > 1 && (<div className="flex items-center justify-between text-xs">
                        <p className="text-perpus-gray-400">Menampilkan {peminjaman.from}–{peminjaman.to} dari {peminjaman.total}</p>
                        <div className="flex gap-1.5">
                            {peminjaman.links.map((l, i) => (<button key={i} disabled={!l.url || l.active} onClick={() => l.url && router.get(l.url)} className={clsx('px-3 py-1.5 rounded-lg font-medium transition-colors', l.active ? 'bg-perpus-black dark:bg-perpus-white text-white dark:text-perpus-black' : 'text-perpus-gray-500 hover:bg-perpus-gray-100 dark:hover:bg-perpus-gray-800 disabled:opacity-30')} dangerouslySetInnerHTML={{ __html: l.label }}/>))}
                        </div>
                    </div>)}
            </div>
        </AppLayout>);
}
