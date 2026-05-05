import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function UlasanIndex() {
    const { props } = usePage();
    const initial = props.ulasan || { data: [] };
    const [ulasan, setUlasan] = useState(initial.data);

    const handleReplyChange = (index, value) => {
        setUlasan(prev => {
            const copy = [...prev];
            copy[index] = { ...copy[index], balasan: value };
            return copy;
        });
    };

    const handleReply = async (id, index) => {
        try {
            const payload = { balasan: ulasan[index].balasan || '' };
            const res = await axios.patch(`/admin/ulasan/${id}`, payload);
            if (res && res.data) {
                setUlasan(prev => prev.map(u => u.id === id ? res.data : u));
                toast.success('Balasan berhasil disimpan');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal menyimpan balasan');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Hapus ulasan ini?')) return;
        try {
            await axios.delete(`/admin/ulasan/${id}`);
            setUlasan(prev => prev.filter(u => u.id !== id));
            toast.success('Ulasan berhasil dihapus');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal menghapus ulasan');
        }
    };

    return (
        <AppLayout title="Kelola Ulasan">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="page-header">
                    <h1 className="page-title">Kelola Ulasan</h1>
                    <p className="page-subtitle">Lihat, sunting, atau hapus ulasan pengguna</p>
                </div>

                <div className="space-y-3">
                    {ulasan.length === 0 && <div className="text-sm text-perpus-gray-500">Tidak ada ulasan.</div>}
                    {ulasan.map((u, idx) => (
                        <div key={u.id} className="card p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <div className="font-medium">{u.user?.name}</div>
                                    <div className="text-xs text-perpus-gray-400">{u.buku?.judul}</div>
                                </div>
                                <div className="text-xs text-perpus-gray-400 mt-1">{new Date(u.created_at).toLocaleString('id-ID')}</div>
                                <div className="mt-3">
                                    <p className="text-sm text-perpus-black dark:text-perpus-white">{u.komentar}</p>
                                </div>

                                {u.balasan ? (
                                    <div className="mt-4 p-3 rounded border bg-perpus-gray-50 dark:bg-perpus-gray-800">
                                        <div className="text-sm font-medium">Balasan oleh {u.balasan_admin ? u.balasan_admin.name : u.balasanAdmin?.name || 'Admin'}</div>
                                        <div className="text-xs text-perpus-gray-400">{u.balasan_dibalas_pada ? new Date(u.balasan_dibalas_pada).toLocaleString('id-ID') : ''}</div>
                                        <div className="mt-2 text-sm text-perpus-gray-700 dark:text-perpus-gray-300">{u.balasan}</div>
                                    </div>
                                ) : null}
                            </div>

                            <div className="flex flex-col gap-2 w-full md:w-64">
                                <textarea value={u.balasan || ''} onChange={e => handleReplyChange(idx, e.target.value)} className="input w-full" rows={3} placeholder="Tulis balasan untuk pengguna..." />
                                <button onClick={() => handleReply(u.id, idx)} className="btn-primary">Balas</button>
                                <button onClick={() => handleDelete(u.id)} className="btn-ghost text-perpus-red">Hapus</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
