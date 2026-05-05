import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { usePage, Link } from '@inertiajs/react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function UlasanIndex() {
    const { props } = usePage();
    const ulasanPage = props.ulasan || { data: [], links: [] };
    const initial = ulasanPage.data || [];
    const links = ulasanPage.links || [];
    const { auth } = props;
    const currentUser = auth?.user || null;

    const [items, setItems] = useState(initial);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ rating: 5, komentar: '' });

    const startEdit = (u) => {
        setEditingId(u.id);
        setForm({ rating: u.rating || 5, komentar: u.komentar || '' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setForm({ rating: 5, komentar: '' });
    };

    const saveEdit = async (id) => {
        try {
            const res = await axios.patch(`/ulasan/${id}`, { rating: form.rating, komentar: form.komentar });
            if (res && res.data) {
                setItems(prev => prev.map(it => it.id === id ? res.data : it));
                toast.success('Ulasan diperbarui');
                cancelEdit();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal memperbarui ulasan');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Hapus ulasan ini?')) return;
        try {
            await axios.delete(`/ulasan/${id}`);
            setItems(prev => prev.filter(i => i.id !== id));
            toast.success('Ulasan dihapus');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal menghapus ulasan');
        }
    };

    return (
        <AppLayout title="Riwayat Ulasan Saya">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="page-header">
                    <h1 className="page-title">Riwayat Ulasan</h1>
                    <p className="page-subtitle">Daftar ulasan yang Anda buat pada buku.</p>
                </div>

                <div className="space-y-3">
                    {items.length === 0 && <div className="text-sm text-perpus-gray-500">Belum ada ulasan.</div>}
                    {items.map(u => (
                        <div key={u.id} className="card p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium"><Link href={`/katalog/${u.buku?.id}`}>{u.buku?.judul || '—'}</Link></div>
                                    <div className="text-xs text-perpus-gray-400">{new Date(u.created_at).toLocaleString('id-ID')}</div>
                                </div>
                                <div className="text-perpus-gold font-semibold">{u.rating} ★</div>
                            </div>

                            {editingId === u.id ? (
                                <div className="mt-3 space-y-2">
                                    <div>
                                        <label className="text-xs">Rating</label>
                                        <select className="input w-28 mt-1" value={form.rating} onChange={e => setForm({...form, rating: parseInt(e.target.value)})}>
                                            {[5,4,3,2,1].map(v => <option key={v} value={v}>{v} ★</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs">Komentar</label>
                                        <textarea className="input w-full mt-1" rows={4} value={form.komentar} onChange={e => setForm({...form, komentar: e.target.value})} />
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={() => saveEdit(u.id)} className="btn-primary">Simpan</button>
                                        <button onClick={cancelEdit} className="btn-ghost">Batal</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {u.komentar && <p className="text-sm text-perpus-gray-500 mt-2">{u.komentar}</p>}
                                    {u.balasan ? (
                                        <div className="mt-3 p-3 rounded border bg-perpus-gray-50 dark:bg-perpus-gray-800">
                                            <div className="text-sm font-medium">Balasan Admin</div>
                                            <div className="text-xs text-perpus-gray-400">{u.balasan_dibalas_pada ? new Date(u.balasan_dibalas_pada).toLocaleString('id-ID') : ''}</div>
                                            <div className="mt-2 text-sm text-perpus-gray-700 dark:text-perpus-gray-300">{u.balasan}</div>
                                        </div>
                                    ) : null}

                                    <div className="flex gap-2 mt-3">
                                        {(currentUser && currentUser.id === u.user_id) && (
                                            <>
                                                <button onClick={() => startEdit(u)} className="btn-ghost">Edit</button>
                                                <button onClick={() => handleDelete(u.id)} className="btn-ghost text-perpus-red">Hapus</button>
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {links.length > 0 && (
                    <div className="flex items-center justify-center gap-2 mt-4">
                        {links.map((l, idx) => (
                            l.url ? (
                                <Link key={idx} href={l.url} className={l.active ? 'btn-primary' : 'btn-ghost'} preserveState={false}>
                                    <span dangerouslySetInnerHTML={{ __html: l.label }} />
                                </Link>
                            ) : (
                                <button key={idx} className="btn-ghost opacity-50" disabled>
                                    <span dangerouslySetInnerHTML={{ __html: l.label }} />
                                </button>
                            )
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
