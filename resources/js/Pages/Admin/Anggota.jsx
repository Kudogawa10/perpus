import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, UserCheck, Trash2, Users, X, Loader2, FileDown } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import toast from 'react-hot-toast';
import clsx from 'clsx';
function StatusModal({ user, onClose }) {
    const [status, setStatus] = React.useState(user.status);
    const [loading, setLoading] = React.useState(false);
    const handle = () => {
        setLoading(true);
        router.patch(`/admin/anggota/${user.id}/status`, { status }, {
            onSuccess: () => { toast.success('Status diperbarui'); onClose(); },
            onError: () => toast.error('Gagal memperbarui status'),
            onFinish: () => setLoading(false),
        });
    };
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card p-6 max-w-sm w-full">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-perpus-black dark:text-perpus-white">Ubah Status Anggota</h3>
                    <button onClick={onClose} className="btn-ghost p-1"><X className="w-4 h-4"/></button>
                </div>
                <p className="text-sm text-perpus-gray-500 mb-4"><b className="text-perpus-black dark:text-perpus-white">{user.name}</b></p>
                <div className="space-y-2 mb-5">
                    {['aktif', 'nonaktif', 'ditangguhkan'].map(s => (<label key={s} className={clsx('flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors', status === s ? 'border-perpus-black dark:border-perpus-white bg-perpus-gray-50 dark:bg-perpus-gray-800' : 'border-perpus-gray-200 dark:border-perpus-gray-700 hover:bg-perpus-gray-50 dark:hover:bg-perpus-gray-800')}>
                            <input type="radio" name="status" value={s} checked={status === s} onChange={() => setStatus(s)} className="accent-perpus-black"/>
                            <span className="text-sm font-medium capitalize text-perpus-black dark:text-perpus-white">{s}</span>
                        </label>))}
                </div>
                <div className="flex gap-3">
                    <button onClick={onClose} className="btn-secondary flex-1">Batal</button>
                    <button onClick={handle} disabled={loading} className="btn-primary flex-1">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Simpan'}
                    </button>
                </div>
            </motion.div>
        </div>);
}
export default function AdminAnggota({ anggota, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusModal, setStatusModal] = useState(null);
    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/anggota', { ...filters, search }, { preserveState: true });
    };
    const handleDelete = async (user) => {
        const ok = await window.confirmAction(`Hapus anggota "${user.name}"? Tindakan ini tidak bisa dibatalkan.`);
        if (!ok) return;
        router.delete(`/admin/anggota/${user.id}`, {
            onSuccess: () => toast.success('Anggota dihapus'),
            onError: () => toast.error('Gagal menghapus anggota'),
        });
    };
    const statusBadge = {
        aktif: 'badge-green',
        nonaktif: 'badge-gray',
        ditangguhkan: 'badge-red',
    };
    return (<AppLayout title="Manajemen Anggota">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-start justify-between">
                    <div className="page-header mb-0">
                        <h1 className="page-title">Manajemen Anggota</h1>
                        <p className="page-subtitle">{anggota.total.toLocaleString('id-ID')} anggota terdaftar</p>
                    </div>
                    <a
                        href="/admin/statistik/export/users"
                        className="btn-secondary"
                        title="Export semua data anggota ke PDF"
                    >
                        <FileDown className="w-4 h-4"/>
                        Export PDF
                    </a>
                </div>

                {/* Search + Filter */}
                <form onSubmit={handleSearch} className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-perpus-gray-400"/>
                        <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama, email, no. anggota..." className="input pl-10"/>
                    </div>
                    <select value={filters.status || ''} onChange={e => router.get('/admin/anggota', { ...filters, status: e.target.value })} className="input w-44">
                        <option value="">Semua Status</option>
                        <option value="aktif">Aktif</option>
                        <option value="nonaktif">Nonaktif</option>
                        <option value="ditangguhkan">Ditangguhkan</option>
                    </select>
                    <button type="submit" className="btn-primary px-4">Cari</button>
                </form>

                {/* Table */}
                <div className="card overflow-hidden">
                    <table className="table-perpus">
                        <thead>
                            <tr>
                                <th>Anggota</th>
                                <th>No. Anggota</th>
                                <th>Telepon</th>
                                <th>Domisili</th>
                                <th>Total Pinjam</th>
                                <th>Status</th>
                                <th>Bergabung</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {anggota.data.map(u => (<tr key={u.id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-perpus-gray-100 dark:bg-perpus-gray-800 flex items-center justify-center text-sm font-bold text-perpus-gray-500 flex-shrink-0">
                                                {u.avatar
                ? <img src={`/storage/${u.avatar}`} alt={u.name} className="w-full h-full object-cover rounded-xl"/>
                : u.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm text-perpus-black dark:text-perpus-white">{u.name}</p>
                                                <p className="text-xs text-perpus-gray-400">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="font-mono text-xs text-perpus-gray-500">{u.no_anggota}</span></td>
                                    <td><span className="text-sm text-perpus-gray-500">{u.phone || '—'}</span></td>
                                    <td><span className="text-sm text-perpus-gray-500">{u.domisili || '—'}</span></td>
                                    <td><span className="font-semibold text-sm">{u.peminjaman_count}</span></td>
                                    <td><span className={`badge ${statusBadge[u.status] || 'badge-gray'}`}>{u.status}</span></td>
                                    <td><span className="text-xs text-perpus-gray-400">{new Date(u.created_at).toLocaleDateString('id-ID')}</span></td>
                                    <td>
                                        <div className="flex items-center gap-1">
                                            <Link href={`/admin/anggota/${u.id}`} className="btn-ghost p-1.5" title="Detail">
                                                <Eye className="w-3.5 h-3.5"/>
                                            </Link>
                                            <button onClick={() => setStatusModal(u)} className="btn-ghost p-1.5" title="Ubah Status">
                                                <UserCheck className="w-3.5 h-3.5"/>
                                            </button>
                                            <button onClick={() => handleDelete(u)} className="btn-ghost p-1.5 text-perpus-red hover:text-perpus-red" title="Hapus">
                                                <Trash2 className="w-3.5 h-3.5"/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>))}
                        </tbody>
                    </table>
                    {anggota.data.length === 0 && (<div className="py-14 text-center">
                            <Users className="w-10 h-10 text-perpus-gray-200 mx-auto mb-3"/>
                            <p className="text-perpus-gray-500">Tidak ada anggota ditemukan</p>
                        </div>)}
                </div>

                {/* Pagination */}
                {anggota.last_page > 1 && (<div className="flex items-center justify-between text-xs">
                        <p className="text-perpus-gray-400">Menampilkan {anggota.from}–{anggota.to} dari {anggota.total}</p>
                        <div className="flex gap-1.5">
                            {anggota.links.map((l, i) => (<button key={i} disabled={!l.url || l.active} onClick={() => l.url && router.get(l.url)} className={clsx('px-3 py-1.5 rounded-lg font-medium transition-colors', l.active ? 'bg-perpus-black dark:bg-perpus-white text-white dark:text-perpus-black' : 'text-perpus-gray-500 hover:bg-perpus-gray-100 dark:hover:bg-perpus-gray-800 disabled:opacity-30')} dangerouslySetInnerHTML={{ __html: l.label }}/>))}
                        </div>
                    </div>)}
            </div>

            <AnimatePresence>
                {statusModal && <StatusModal user={statusModal} onClose={() => setStatusModal(null)}/>}
            </AnimatePresence>
        </AppLayout>);
}
