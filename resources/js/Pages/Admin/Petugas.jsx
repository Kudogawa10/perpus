import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Upload, X, Loader2, UserCheck } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import toast from 'react-hot-toast';
import clsx from 'clsx';
function PetugasForm({ p, onClose }) {
    const isEdit = !!p;
    const { data, setData, post, processing, errors } = useForm({
        name: p?.user?.name || '',
        email: p?.user?.email || '',
        phone: p?.user?.phone || '',
        password: '',
        nip: p?.nip || '',
        jabatan: p?.jabatan || '',
        bagian: p?.bagian || '',
        tentang: p?.tentang || '',
        foto: null,
        _method: isEdit ? 'PUT' : 'POST',
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        const url = isEdit ? `/admin/petugas/${p.id}` : '/admin/petugas';
        post(url, {
            forceFormData: true,
            onSuccess: () => { toast.success(isEdit ? 'Petugas diperbarui!' : 'Petugas ditambahkan!'); onClose(); },
            onError: () => toast.error('Periksa kembali data Anda.'),
        });
    };
    return (<div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 w-full max-w-lg my-8">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display font-semibold text-perpus-black dark:text-perpus-white">{isEdit ? 'Edit Petugas' : 'Tambah Petugas Baru'}</h3>
                    <button onClick={onClose} className="btn-ghost p-1.5"><X className="w-4 h-4"/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="input-label">Nama Lengkap *</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={clsx('input', errors.name && 'border-red-400')} required/>
                            {errors.name && <p className="text-xs text-perpus-red mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="input-label">Email *</label>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="input" required/>
                            {errors.email && <p className="text-xs text-perpus-red mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="input-label">Telepon</label>
                            <input type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)} className="input"/>
                        </div>
                        {!isEdit && (<div className="col-span-2">
                                <label className="input-label">Password *</label>
                                <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="input" placeholder="Min. 8 karakter" required={!isEdit}/>
                            </div>)}
                        <div>
                            <label className="input-label">NIP *</label>
                            <input type="text" value={data.nip} onChange={e => setData('nip', e.target.value)} className="input" required/>
                            {errors.nip && <p className="text-xs text-perpus-red mt-1">{errors.nip}</p>}
                        </div>
                        <div>
                            <label className="input-label">Jabatan *</label>
                            <input type="text" value={data.jabatan} onChange={e => setData('jabatan', e.target.value)} className="input" placeholder="Kepala Perpustakaan" required/>
                        </div>
                        <div>
                            <label className="input-label">Bagian / Divisi *</label>
                            <input type="text" value={data.bagian} onChange={e => setData('bagian', e.target.value)} className="input" placeholder="Layanan Peminjaman" required/>
                        </div>
                        <div>
                            <label className="input-label">Foto</label>
                            <label className="flex items-center gap-2 p-2.5 rounded-xl border border-perpus-gray-200 dark:border-perpus-gray-700 cursor-pointer hover:border-perpus-gray-400 transition-colors">
                                <Upload className="w-4 h-4 text-perpus-gray-400 flex-shrink-0"/>
                                <span className="text-xs text-perpus-gray-400 truncate">{data.foto ? data.foto.name : 'Upload foto'}</span>
                                <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && setData('foto', e.target.files[0])}/>
                            </label>
                        </div>
                        <div className="col-span-2">
                            <label className="input-label">Tentang (Bio)</label>
                            <textarea value={data.tentang} onChange={e => setData('tentang', e.target.value)} className="input resize-none" rows={3} placeholder="Deskripsi singkat petugas..."/>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1">Batal</button>
                        <button type="submit" disabled={processing} className="btn-primary flex-1">
                            {processing && <Loader2 className="w-4 h-4 animate-spin"/>}
                            {isEdit ? 'Simpan Perubahan' : 'Tambah Petugas'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>);
}
export default function AdminPetugas({ petugas }) {
    const [showForm, setShowForm] = useState(false);
    const [editData, setEditData] = useState();
    const handleDelete = async (p) => {
        const ok = await window.confirmAction(`Hapus petugas "${p.user?.name}"?`);
        if (!ok) return;
        router.delete(`/admin/petugas/${p.id}`, {
            onSuccess: () => toast.success('Petugas dihapus'),
            onError: () => toast.error('Gagal menghapus'),
        });
    };
    const byBagian = petugas.reduce((acc, p) => {
        if (!acc[p.bagian])
            acc[p.bagian] = [];
        acc[p.bagian].push(p);
        return acc;
    }, {});
    return (<AppLayout title="Manajemen Petugas">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-start justify-between">
                    <div className="page-header mb-0">
                        <h1 className="page-title">Manajemen Petugas</h1>
                        <p className="page-subtitle">{petugas.length} petugas aktif</p>
                    </div>
                    <button onClick={() => { setEditData(undefined); setShowForm(true); }} className="btn-primary">
                        <Plus className="w-4 h-4"/> Tambah Petugas
                    </button>
                </div>

                {petugas.length === 0 ? (<div className="card p-16 text-center">
                        <UserCheck className="w-12 h-12 text-perpus-gray-200 mx-auto mb-4"/>
                        <p className="text-perpus-gray-500">Belum ada data petugas</p>
                        <button onClick={() => setShowForm(true)} className="btn-primary mt-4 inline-flex">Tambah Petugas</button>
                    </div>) : (Object.entries(byBagian).map(([bagian, list]) => (<section key={bagian}>
                            <div className="flex items-center gap-3 mb-4">
                                <h2 className="font-semibold text-perpus-black dark:text-perpus-white">{bagian}</h2>
                                <div className="flex-1 h-px bg-perpus-gray-100 dark:bg-perpus-gray-800"/>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {list.map(p => (<motion.div key={p.id} whileHover={{ y: -2 }} className="card p-5">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-perpus-gray-100 dark:bg-perpus-gray-800 flex-shrink-0">
                                                {p.foto
                    ? <img src={`/storage/${p.foto}`} alt={p.user?.name} className="w-full h-full object-cover"/>
                    : <div className="w-full h-full flex items-center justify-center font-bold text-perpus-gray-400 text-lg">{p.user?.name?.charAt(0)}</div>}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm text-perpus-black dark:text-perpus-white truncate">{p.user?.name}</p>
                                                <p className="text-xs text-perpus-gray-400">{p.jabatan}</p>
                                                <span className="font-mono text-[10px] text-perpus-gray-300">{p.nip}</span>
                                            </div>
                                        </div>
                                        {p.tentang && <p className="text-xs text-perpus-gray-500 line-clamp-2 mb-3">{p.tentang}</p>}
                                        <div className="flex gap-2">
                                            <button onClick={() => { setEditData(p); setShowForm(true); }} className="btn-secondary text-xs py-1.5 flex-1 justify-center">
                                                <Edit2 className="w-3.5 h-3.5"/> Edit
                                            </button>
                                            <button onClick={() => handleDelete(p)} className="btn-ghost p-1.5 text-perpus-red hover:text-perpus-red">
                                                <Trash2 className="w-3.5 h-3.5"/>
                                            </button>
                                        </div>
                                    </motion.div>))}
                            </div>
                        </section>)))}
            </div>

            <AnimatePresence>
                {showForm && <PetugasForm p={editData} onClose={() => { setShowForm(false); setEditData(undefined); }}/>}
            </AnimatePresence>
        </AppLayout>);
}
