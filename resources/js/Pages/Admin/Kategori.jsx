import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Loader2, Layers } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import toast from 'react-hot-toast';
import clsx from 'clsx';
function KategoriForm({ k, onClose }) {
    const isEdit = !!k;
    const { data, setData, post, put, processing, errors } = useForm({
        nama: k?.nama || '', deskripsi: k?.deskripsi || '', icon: k?.icon || '📚', _method: isEdit ? 'PUT' : 'POST',
    });
    const icons = ['📚', '📖', '🔬', '💻', '🏛️', '🧠', '📊', '🧩', '🎓', '✍️', '☪️', '🏥', '🎨', '🌍', '🎭', '⚗️', '🏆', '💡'];
    const handleSubmit = (e) => {
        e.preventDefault();
        const url = isEdit ? `/admin/kategori/${k.id}` : '/admin/kategori';
        post(url, {
            onSuccess: () => { toast.success(isEdit ? 'Kategori diperbarui!' : 'Kategori ditambahkan!'); onClose(); },
            onError: () => toast.error('Periksa kembali data.'),
        });
    };
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display font-semibold text-perpus-black dark:text-perpus-white">{isEdit ? 'Edit Kategori' : 'Tambah Kategori'}</h3>
                    <button onClick={onClose} className="btn-ghost p-1.5"><X className="w-4 h-4"/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="input-label">Nama Kategori *</label>
                        <input type="text" value={data.nama} onChange={e => setData('nama', e.target.value)} className={clsx('input', errors.nama && 'border-red-400')} placeholder="cth: Teknologi" required/>
                        {errors.nama && <p className="text-xs text-perpus-red mt-1">{errors.nama}</p>}
                    </div>
                    <div>
                        <label className="input-label">Deskripsi</label>
                        <textarea value={data.deskripsi} onChange={e => setData('deskripsi', e.target.value)} className="input resize-none" rows={2} placeholder="Deskripsi singkat kategori..."/>
                    </div>
                    <div>
                        <label className="input-label">Icon</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {icons.map(ic => (<button key={ic} type="button" onClick={() => setData('icon', ic)} className={clsx('w-9 h-9 rounded-lg text-lg transition-all', data.icon === ic ? 'bg-perpus-black dark:bg-perpus-white ring-2 ring-perpus-black dark:ring-perpus-white' : 'bg-perpus-gray-100 dark:bg-perpus-gray-800 hover:bg-perpus-gray-200 dark:hover:bg-perpus-gray-700')}>
                                    {ic}
                                </button>))}
                        </div>
                    </div>
                    <div className="flex gap-3 pt-1">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1">Batal</button>
                        <button type="submit" disabled={processing} className="btn-primary flex-1">
                            {processing && <Loader2 className="w-4 h-4 animate-spin"/>}
                            {isEdit ? 'Simpan' : 'Tambah'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>);
}
export default function AdminKategori({ kategori }) {
    const [showForm, setShowForm] = useState(false);
    const [editData, setEditData] = useState();
    const handleDelete = async (k) => {
        const ok = await window.confirmAction(`Hapus kategori "${k.nama}"?`);
        if (!ok) return;
        router.delete(`/admin/kategori/${k.id}`, {
            onSuccess: () => toast.success('Kategori dihapus'),
            onError: () => toast.error('Tidak bisa menghapus — kategori masih memiliki buku'),
        });
    };
    return (<AppLayout title="Kategori Buku">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-start justify-between">
                    <div className="page-header mb-0">
                        <h1 className="page-title">Kategori Buku</h1>
                        <p className="page-subtitle">{kategori.length} kategori tersedia</p>
                    </div>
                    <button onClick={() => { setEditData(undefined); setShowForm(true); }} className="btn-primary">
                        <Plus className="w-4 h-4"/> Tambah Kategori
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {kategori.map((k, i) => (<motion.div key={k.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="card p-5 hover:shadow-perpus transition-all">
                            <div className="flex items-start justify-between mb-3">
                                <span className="text-3xl">{k.icon}</span>
                                <div className="flex gap-1">
                                    <button onClick={() => { setEditData(k); setShowForm(true); }} className="btn-ghost p-1.5" title="Edit">
                                        <Edit2 className="w-3.5 h-3.5"/>
                                    </button>
                                    <button onClick={() => handleDelete(k)} className="btn-ghost p-1.5 text-perpus-red" title="Hapus">
                                        <Trash2 className="w-3.5 h-3.5"/>
                                    </button>
                                </div>
                            </div>
                            <h3 className="font-semibold text-perpus-black dark:text-perpus-white">{k.nama}</h3>
                            {k.deskripsi && <p className="text-xs text-perpus-gray-400 mt-1 line-clamp-2">{k.deskripsi}</p>}
                            <div className="mt-3 flex items-center justify-between">
                                <span className="text-xs text-perpus-gray-400 font-mono">/{k.slug}</span>
                                <span className="badge badge-gray text-[10px]">{k.buku_count} buku</span>
                            </div>
                        </motion.div>))}
                </div>

                {kategori.length === 0 && (<div className="card p-16 text-center">
                        <Layers className="w-12 h-12 text-perpus-gray-200 mx-auto mb-4"/>
                        <p className="text-perpus-gray-500">Belum ada kategori. Tambahkan kategori pertama.</p>
                        <button onClick={() => setShowForm(true)} className="btn-primary mt-4 inline-flex">Tambah Kategori</button>
                    </div>)}
            </div>

            <AnimatePresence>
                {showForm && <KategoriForm k={editData} onClose={() => { setShowForm(false); setEditData(undefined); }}/>}
            </AnimatePresence>
        </AppLayout>);
}
