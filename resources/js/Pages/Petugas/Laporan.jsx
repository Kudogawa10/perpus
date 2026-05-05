import React from 'react';
import { router, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import clsx from 'clsx';

export default function PetugasLaporan({ data, bulan }) {
    const { data: form, setData, post, processing, reset, errors } = useForm({
        buku_id: '',
        stok_total: 0,
        stok_tersedia: 0,
        kondisi_buku: '',
        catatan: '',
        bukti_gambar: null,
    });

    const bukuDipilih = data.laporan_buku.find((b) => String(b.id) === String(form.buku_id));

    const submitLaporan = (e) => {
        e.preventDefault();
        post('/petugas/laporan', {
            forceFormData: true,
            onSuccess: () => {
                reset('kondisi_buku', 'catatan', 'bukti_gambar');
            },
        });
    };

    return (
        <AppLayout title="Laporan Buku">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="page-header">
                    <h1 className="page-title">Laporan Buku Petugas</h1>
                    <p className="page-subtitle">Kirim laporan stok, kondisi buku, dan bukti penyerahan ke Admin.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="card p-4"><p className="text-xs text-perpus-gray-400">Total Peminjaman</p><p className="text-2xl font-semibold">{data.total_peminjaman}</p></div>
                    <div className="card p-4"><p className="text-xs text-perpus-gray-400">Total Terlambat</p><p className="text-2xl font-semibold text-perpus-red">{data.total_terlambat}</p></div>
                    <div className="card p-4"><p className="text-xs text-perpus-gray-400">Total Denda Bulan Ini</p><p className="text-2xl font-semibold">Rp {Number(data.total_denda || 0).toLocaleString('id-ID')}</p></div>
                </div>

                <div className="card p-5">
                    <h2 className="font-semibold mb-4">Kirim Laporan Baru</h2>
                    <form onSubmit={submitLaporan} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="input-label">Pilih Buku</label>
                            <select
                                value={form.buku_id}
                                onChange={(e) => {
                                    const id = e.target.value;
                                    const selected = data.laporan_buku.find((b) => String(b.id) === id);
                                    setData('buku_id', id);
                                    setData('stok_total', selected?.stok_total ?? 0);
                                    setData('stok_tersedia', selected?.stok_tersedia ?? 0);
                                }}
                                className={clsx('input', errors.buku_id && 'border-red-400')}
                            >
                                <option value="">-- Pilih buku --</option>
                                {data.laporan_buku.map((b) => (
                                    <option key={b.id} value={b.id}>{b.judul} - {b.penulis}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="input-label">Stok Total</label>
                            <input type="number" min="0" className="input" value={form.stok_total} onChange={(e) => setData('stok_total', Number(e.target.value))} />
                        </div>
                        <div>
                            <label className="input-label">Stok Tersedia</label>
                            <input type="number" min="0" className="input" value={form.stok_tersedia} onChange={(e) => setData('stok_tersedia', Number(e.target.value))} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="input-label">Kondisi Buku</label>
                            <textarea className="input h-24 resize-none" value={form.kondisi_buku} onChange={(e) => setData('kondisi_buku', e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="input-label">Catatan Tambahan</label>
                            <textarea className="input h-20 resize-none" value={form.catatan} onChange={(e) => setData('catatan', e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="input-label">Upload Bukti Penyerahan (Gambar)</label>
                            <input type="file" accept="image/*" className="input" onChange={(e) => setData('bukti_gambar', e.target.files?.[0] || null)} />
                        </div>
                        {bukuDipilih && (
                            <p className="md:col-span-2 text-xs text-perpus-gray-400">
                                Dipinjam saat ini: {Number(bukuDipilih.stok_dipinjam || 0)} buku.
                            </p>
                        )}
                        <div className="md:col-span-2">
                            <button className="btn-primary" disabled={processing} type="submit">
                                {processing ? 'Mengirim...' : 'Kirim ke Admin'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="card overflow-hidden">
                    <div className="px-4 py-3 border-b border-perpus-gray-100 dark:border-perpus-gray-800 flex items-center justify-between">
                        <h2 className="font-semibold">Riwayat Laporan Terkirim</h2>
                        <input type="month" value={bulan} onChange={(e) => router.get('/petugas/laporan', { bulan: e.target.value })} className="input w-44" />
                    </div>
                    <table className="table-perpus">
                        <thead>
                            <tr>
                                <th>Tanggal</th>
                                <th>Buku</th>
                                <th>Stok</th>
                                <th>Kondisi</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.laporan_terkirim.map((l) => (
                                <tr key={l.id}>
                                    <td>{new Date(l.created_at).toLocaleString('id-ID')}</td>
                                    <td>{l.buku?.judul || '-'}</td>
                                    <td>{l.stok_tersedia}/{l.stok_total}</td>
                                    <td className="max-w-[360px] truncate">{l.kondisi_buku}</td>
                                    <td><span className={`badge ${l.status === 'ditinjau' ? 'badge-green' : 'badge-gold'}`}>{l.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {data.laporan_terkirim.length === 0 && <div className="p-6 text-sm text-perpus-gray-500">Belum ada laporan terkirim.</div>}
                </div>
            </div>
        </AppLayout>
    );
}
