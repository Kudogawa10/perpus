import React, { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Eye, Upload, X, BookOpen, Star, CheckCircle, Loader2 } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import toast from 'react-hot-toast';
import clsx from 'clsx';
// ---- Delete Confirmation Modal ----
function DeleteModal({ buku, onClose, onConfirm }) {
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="card p-6 max-w-sm w-full shadow-perpus-xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                        <Trash2 className="w-5 h-5 text-red-600"/>
                    </div>
                    <div>
                        <p className="font-semibold text-perpus-black dark:text-perpus-white">Hapus Buku</p>
                        <p className="text-xs text-perpus-gray-400">Tindakan ini tidak dapat dibatalkan</p>
                    </div>
                </div>
                <p className="text-sm text-perpus-gray-600 dark:text-perpus-gray-400 mb-6">
                    Apakah Anda yakin ingin menghapus buku <strong className="text-perpus-black dark:text-perpus-white">"{buku.judul}"</strong>?
                </p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="btn-secondary flex-1">Batal</button>
                    <button onClick={onConfirm} className="btn-danger flex-1">Hapus Buku</button>
                </div>
            </motion.div>
        </div>);
}
// ---- Add/Edit Book Form ----
function BukuFormModal({ buku, kategori, onClose }) {
    const isEdit = !!buku;
    const { data, setData, post, put, processing, errors } = useForm({
        judul: buku?.judul || '',
        penulis: buku?.penulis || '',
        penerbit: buku?.penerbit || '',
        tahun_terbit: buku?.tahun_terbit || new Date().getFullYear(),
        isbn: buku?.isbn || '',
        kategori: buku?.kategori || '',
        deskripsi: buku?.deskripsi || '',
        stok_total: buku?.stok_total || 1,
        halaman: buku?.halaman || 0,
        bahasa: buku?.bahasa || 'Indonesia',
        bisa_online: buku?.bisa_online || false,
        cover: null,
        file_pdf: null,
        _method: isEdit ? 'PUT' : 'POST',
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        const url = isEdit ? `/admin/buku/${buku.id}` : '/admin/buku';
        post(url, {
            forceFormData: true,
            onSuccess: () => { toast.success(isEdit ? 'Buku berhasil diperbarui!' : 'Buku berhasil ditambahkan!'); onClose(); },
            onError: () => toast.error('Terjadi kesalahan, periksa form Anda.'),
        });
    };
    return (<div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="card p-6 w-full max-w-2xl my-8 shadow-perpus-xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display font-semibold text-lg text-perpus-black dark:text-perpus-white">
                        {isEdit ? 'Edit Buku' : 'Tambah Buku Baru'}
                    </h2>
                    <button onClick={onClose} className="btn-ghost p-2"><X className="w-4 h-4"/></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="input-label">Judul Buku *</label>
                            <input type="text" value={data.judul} onChange={e => setData('judul', e.target.value)} className={clsx('input', errors.judul && 'border-red-400')} placeholder="Judul lengkap buku" required/>
                            {errors.judul && <p className="text-xs text-perpus-red mt-1">{errors.judul}</p>}
                        </div>
                        <div>
                            <label className="input-label">Penulis *</label>
                            <input type="text" value={data.penulis} onChange={e => setData('penulis', e.target.value)} className="input" placeholder="Nama penulis" required/>
                        </div>
                        <div>
                            <label className="input-label">Penerbit *</label>
                            <input type="text" value={data.penerbit} onChange={e => setData('penerbit', e.target.value)} className="input" placeholder="Nama penerbit" required/>
                        </div>
                        <div>
                            <label className="input-label">ISBN</label>
                            <input type="text" value={data.isbn} onChange={e => setData('isbn', e.target.value)} className="input" placeholder="978-xxx-xxx-xxx"/>
                        </div>
                        <div>
                            <label className="input-label">Tahun Terbit</label>
                            <input type="number" value={data.tahun_terbit} onChange={e => setData('tahun_terbit', +e.target.value)} className="input" min="1900" max={new Date().getFullYear()}/>
                        </div>
                        <div>
                            <label className="input-label">Kategori *</label>
                            <select value={data.kategori} onChange={e => setData('kategori', e.target.value)} className="input" required>
                                <option value="">Pilih kategori...</option>
                                {kategori.map(k => <option key={k.id} value={k.nama}>{k.nama}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="input-label">Bahasa</label>
                            <select value={data.bahasa} onChange={e => setData('bahasa', e.target.value)} className="input">
                                <option>Indonesia</option>
                                <option>Inggris</option>
                                <option>Arab</option>
                                <option>Lainnya</option>
                            </select>
                        </div>
                        <div>
                            <label className="input-label">Stok Total</label>
                            <input type="number" value={data.stok_total} onChange={e => setData('stok_total', +e.target.value)} className="input" min="0"/>
                        </div>
                        <div>
                            <label className="input-label">Jumlah Halaman</label>
                            <input type="number" value={data.halaman} onChange={e => setData('halaman', +e.target.value)} className="input" min="0"/>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="input-label">Deskripsi</label>
                            <textarea value={data.deskripsi} onChange={e => setData('deskripsi', e.target.value)} className="input resize-none" rows={3} placeholder="Sinopsis atau deskripsi singkat buku..."/>
                        </div>

                        {/* Upload Cover */}
                        <div>
                            <label className="input-label">Cover Buku</label>
                            <label className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-perpus-gray-200 dark:border-perpus-gray-700 cursor-pointer hover:border-perpus-gray-400 transition-colors">
                                <Upload className="w-5 h-5 text-perpus-gray-400"/>
                                <span className="text-xs text-perpus-gray-400">
                                    {data.cover ? data.cover.name : 'Klik untuk upload cover'}
                                </span>
                                <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && setData('cover', e.target.files[0])}/>
                            </label>
                        </div>

                        {/* Upload PDF */}
                        <div>
                            <label className="input-label">File PDF (Baca Online)</label>
                            <label className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-perpus-gray-200 dark:border-perpus-gray-700 cursor-pointer hover:border-perpus-gray-400 transition-colors">
                                <BookOpen className="w-5 h-5 text-perpus-gray-400"/>
                                <span className="text-xs text-perpus-gray-400">
                                    {data.file_pdf ? data.file_pdf.name : 'Klik untuk upload PDF'}
                                </span>
                                <input type="file" accept=".pdf" className="hidden" onChange={e => { if (e.target.files?.[0]) {
        setData('file_pdf', e.target.files[0]);
        setData('bisa_online', true);
    } }}/>
                            </label>
                        </div>

                        <div className="sm:col-span-2 flex items-center gap-3">
                            <input type="checkbox" id="bisa_online" checked={data.bisa_online} onChange={e => setData('bisa_online', e.target.checked)} className="w-4 h-4 rounded border-perpus-gray-300 text-perpus-black"/>
                            <label htmlFor="bisa_online" className="text-sm text-perpus-gray-700 dark:text-perpus-gray-300 cursor-pointer">
                                Aktifkan fitur baca online untuk buku ini
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1">Batal</button>
                        <button type="submit" disabled={processing} className="btn-primary flex-1">
                            {processing && <Loader2 className="w-4 h-4 animate-spin"/>}
                            {isEdit ? 'Simpan Perubahan' : 'Tambah Buku'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>);
}
export default function ManajemenBuku({ buku, kategori, filters }) {
    const [showForm, setShowForm] = useState(false);
    const [editBuku, setEditBuku] = useState(undefined);
    const [deleteBuku, setDeleteBuku] = useState(undefined);
    const [search, setSearch] = useState(filters.search || '');
    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/buku', { ...filters, search }, { preserveState: true });
    };
    const handleDelete = () => {
        if (!deleteBuku)
            return;
        router.delete(`/admin/buku/${deleteBuku.id}`, {
            onSuccess: () => { toast.success('Buku berhasil dihapus!'); setDeleteBuku(undefined); },
            onError: () => toast.error('Gagal menghapus buku.'),
        });
    };
    return (<AppLayout title="Manajemen Buku">
            <div className="max-w-7xl mx-auto space-y-6">

                <div className="flex items-start justify-between">
                    <div className="page-header mb-0">
                        <h1 className="page-title">Manajemen Buku</h1>
                        <p className="page-subtitle">{buku.total.toLocaleString('id-ID')} total koleksi</p>
                    </div>
                    <button onClick={() => { setEditBuku(undefined); setShowForm(true); }} className="btn-primary">
                        <Plus className="w-4 h-4"/>
                        Tambah Buku
                    </button>
                </div>

                {/* SEARCH + FILTER */}
                <form onSubmit={handleSearch} className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-perpus-gray-400"/>
                        <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari judul, penulis, ISBN..." className="input pl-10"/>
                    </div>
                    <select value={filters.kategori} onChange={e => router.get('/admin/buku', { ...filters, kategori: e.target.value })} className="input w-48">
                        <option value="">Semua Kategori</option>
                        {kategori.map(k => <option key={k.id} value={k.nama}>{k.nama}</option>)}
                    </select>
                    <button type="submit" className="btn-primary px-4">Cari</button>
                </form>

                {/* TABLE */}
                <div className="card overflow-hidden">
                    <table className="table-perpus">
                        <thead>
                            <tr>
                                <th>Buku</th>
                                <th>Kategori</th>
                                <th>ISBN</th>
                                <th>Stok</th>
                                <th>Rating</th>
                                <th>Online</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {buku.data.map(b => (<tr key={b.id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-12 rounded-lg overflow-hidden bg-perpus-gray-100 dark:bg-perpus-gray-800 flex-shrink-0">
                                                {b.cover
                ? <img src={`/storage/${b.cover}`} alt={b.judul} className="w-full h-full object-cover"/>
                : <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-3.5 h-3.5 text-perpus-gray-400"/></div>}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-sm truncate max-w-[200px]">{b.judul}</p>
                                                <p className="text-xs text-perpus-gray-400">{b.penulis} · {b.tahun_terbit}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="badge badge-gray">{b.kategori}</span></td>
                                    <td><span className="font-mono text-xs text-perpus-gray-500">{b.isbn || '-'}</span></td>
                                    <td>
                                        <div className="flex items-center gap-1">
                                            <span className={clsx('font-semibold text-sm', b.stok_tersedia > 0 ? 'text-perpus-green' : 'text-perpus-red')}>
                                                {b.stok_tersedia}
                                            </span>
                                            <span className="text-perpus-gray-400 text-xs">/{b.stok_total}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400"/>
                                            <span className="text-sm">{(b.rating ?? 0).toFixed(1)}</span>
                                        </div>
                                    </td>
                                    <td>
                                        {b.bisa_online
                ? <CheckCircle className="w-4 h-4 text-perpus-green"/>
                : <span className="text-perpus-gray-300">—</span>}
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-1">
                                            <Link href={`/katalog/${b.id}`} className="btn-ghost p-1.5" title="Lihat">
                                                <Eye className="w-3.5 h-3.5"/>
                                            </Link>
                                            <button onClick={() => { setEditBuku(b); setShowForm(true); }} className="btn-ghost p-1.5" title="Edit">
                                                <Edit2 className="w-3.5 h-3.5"/>
                                            </button>
                                            <button onClick={() => setDeleteBuku(b)} className="btn-ghost p-1.5 text-perpus-red hover:text-perpus-red" title="Hapus">
                                                <Trash2 className="w-3.5 h-3.5"/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>))}
                        </tbody>
                    </table>

                    {buku.data.length === 0 && (<div className="py-16 text-center">
                            <BookOpen className="w-10 h-10 text-perpus-gray-300 mx-auto mb-3"/>
                            <p className="text-perpus-gray-500">Tidak ada buku ditemukan</p>
                        </div>)}
                </div>

                {/* PAGINATION */}
                {buku.last_page > 1 && (<div className="flex items-center justify-between text-sm">
                        <p className="text-perpus-gray-400 text-xs">
                            Menampilkan {buku.from}–{buku.to} dari {buku.total.toLocaleString('id-ID')} buku
                        </p>
                        <div className="flex gap-1.5">
                            {buku.links.map((link, i) => (<button key={i} disabled={!link.url || link.active} onClick={() => link.url && router.get(link.url)} className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', link.active
                    ? 'bg-perpus-black dark:bg-perpus-white text-white dark:text-perpus-black'
                    : 'text-perpus-gray-500 hover:bg-perpus-gray-100 dark:hover:bg-perpus-gray-800 disabled:opacity-30 disabled:cursor-not-allowed')} dangerouslySetInnerHTML={{ __html: link.label }}/>))}
                        </div>
                    </div>)}
            </div>

            {/* MODALS */}
            <AnimatePresence>
                {showForm && (<BukuFormModal buku={editBuku} kategori={kategori} onClose={() => { setShowForm(false); setEditBuku(undefined); }}/>)}
                {deleteBuku && (<DeleteModal buku={deleteBuku} onClose={() => setDeleteBuku(undefined)} onConfirm={handleDelete}/>)}
            </AnimatePresence>
        </AppLayout>);
}
