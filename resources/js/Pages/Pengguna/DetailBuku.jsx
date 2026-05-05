import React, { useState, useEffect } from 'react';
import { Link, useForm, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, Star, Globe, ArrowLeft, BookMarked, Loader2, CheckCircle } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import axios from 'axios';
export default function DetailBuku({ buku, is_dipinjam, buku_serupa, bisa_ulasan }) {
    const bukuSafe = buku || {};
    const [pinjamProcessing, setPinjamProcessing] = useState(false);

    // Ulasan (review) form & list
    const { data: ulasanData, setData: setUlasanData, reset: resetUlasan } = useForm({ buku_id: bukuSafe.id, rating: 5, komentar: '' });
    const [ulasanList, setUlasanList] = useState(bukuSafe.ulasan || []);
    const [sendingUlasan, setSendingUlasan] = useState(false);

    // Default return deadline = now + default duration (14 days)
    const defaultDays = 14;
    const defaultRencana = new Date();
    defaultRencana.setDate(defaultRencana.getDate() + defaultDays);
    const pad = (n) => String(n).padStart(2, '0');
    const toInputDate = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
    const toInputTime = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

    const [rDate, setRDate] = useState(toInputDate(defaultRencana));
    const [rTime, setRTime] = useState(toInputTime(defaultRencana));
    // Pickup date/time (required)
    const now = new Date();
    const [pDate, setPDate] = useState(toInputDate(now));
    const [pTime, setPTime] = useState(toInputTime(now));
    const [acceptedSyarat, setAcceptedSyarat] = useState(false);

    const handlePinjam = () => {
        if (!acceptedSyarat) {
            toast.error('Anda harus menyetujui syarat dan ketentuan peminjaman.');
            return;
        }

        // combine pickup and return date + time into Y-m-d H:i:s
        const tanggal_pinjam = `${pDate} ${pTime}:00`;
        const tanggal_kembali_rencana = `${rDate} ${rTime}:00`;

        const payload = {
            buku_id: buku.id,
            tanggal_pinjam,
            tanggal_kembali_rencana,
            accepted_syarat: acceptedSyarat ? '1' : '0',
        };

        setPinjamProcessing(true);
        router.post('/peminjaman', payload, {
            onSuccess: () => {
                toast.success('Permintaan peminjaman dikirim!');
            },
            onError: (errors) => {
                const msg = errors?.accepted_syarat ? errors.accepted_syarat[0] : (Object.values(errors)[0] || 'Terjadi kesalahan');
                toast.error(msg);
            },
            onFinish: () => setPinjamProcessing(false),
        });
    };
    useEffect(() => {
        setUlasanList(bukuSafe.ulasan || []);
    }, [bukuSafe.id]);

    const avgRating = ulasanList.length
        ? ulasanList.reduce((s, u) => s + u.rating, 0) / ulasanList.length
        : 0;

    // Real-time listener (if Echo configured)
    useEffect(() => {
        if (! bukuSafe.id) return;
        const channelName = `buku.${bukuSafe.id}`;
        if (window?.Echo) {
            try {
                const ch = window.Echo.channel(channelName);
                ch.listen('UlasanCreated', (e) => {
                    const u = e.ulasan;
                    setUlasanList(prev => [u, ...prev.filter(x => x.id !== u.id)]);
                });
            } catch (err) {
                // ignore
            }
        }
        return () => {
            if (window?.Echo) {
                try { window.Echo.leave(channelName); } catch (e) {}
            }
        };
    }, [bukuSafe.id]);

    const handleSubmitUlasan = async () => {
        setSendingUlasan(true);
        try {
            const payload = { buku_id: ulasanData.buku_id, rating: ulasanData.rating, komentar: ulasanData.komentar };
            const res = await axios.post('/ulasan', payload);
            if (res && res.data) {
                setUlasanList(prev => [res.data, ...prev.filter(x => x.id !== res.data.id)]);
                toast.success('Ulasan tersimpan');
                resetUlasan();
            }
        } catch (err) {
            const msg = err.response?.data?.message || (err.response?.data?.errors ? Object.values(err.response.data.errors)[0] : 'Gagal menyimpan ulasan');
            toast.error(msg);
        } finally {
            setSendingUlasan(false);
        }
    };
    return (<AppLayout title={bukuSafe.judul || ''}>
            <div className="max-w-5xl mx-auto space-y-8">
                <Link href="/katalog" className="inline-flex items-center gap-2 text-sm text-perpus-gray-500 hover:text-perpus-black dark:hover:text-perpus-white transition-colors">
                    <ArrowLeft className="w-4 h-4"/> Kembali ke Katalog
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Cover */}
                    <div className="md:col-span-1">
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="book-cover w-full max-w-[240px] mx-auto shadow-perpus-xl">
                                                        {bukuSafe.cover
                        ? <img src={`/storage/${bukuSafe.cover}`} alt={bukuSafe.judul} className="w-full h-full object-cover"/>
                        : <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-perpus-gray-100 dark:bg-perpus-gray-800">
                                                                        <BookOpen className="w-12 h-12 text-perpus-gray-400"/>
                                                                        <p className="text-xs text-perpus-gray-400 text-center px-4">{bukuSafe.judul || ''}</p>
                                                                    </div>}
                        </motion.div>

                        {/* Actions */}
                        <div className="mt-6 space-y-3">
                                {is_dipinjam ? (<div className="flex items-center gap-2 justify-center p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-sm text-green-700 dark:text-green-400 font-medium">
                                    <CheckCircle className="w-4 h-4"/> Sedang Dipinjam
                                </div>) : buku.stok_tersedia > 0 ? (<button onClick={handlePinjam} disabled={pinjamProcessing} className="btn-primary w-full py-3">
                                        {pinjamProcessing ? <Loader2 className="w-4 h-4 animate-spin"/> : <BookMarked className="w-4 h-4"/>}
                                    Pinjam Buku Ini
                                </button>) : (<button disabled className="btn-secondary w-full py-3 opacity-50 cursor-not-allowed">
                                    Stok Habis
                                </button>)}
                            {bukuSafe.bisa_online && (<Link href={`/baca-online/${bukuSafe.id ?? ''}`} className="btn-secondary w-full py-3 flex items-center justify-center gap-2">
                                    <Globe className="w-4 h-4"/> Baca Online
                                </Link>)}
                        </div>

                        {/* Form tanggal + waktu pengambilan dan pengembalian */}
                        <div className="mt-3 card p-3 text-sm">
                            <div className="text-xs text-perpus-gray-400">Tanggal & Waktu Pengambilan</div>
                            <div className="flex gap-2 mt-2">
                                <input type="date" value={pDate} onChange={e => setPDate(e.target.value)} className="input" />
                                <input type="time" value={pTime} onChange={e => setPTime(e.target.value)} className="input w-32" />
                            </div>

                            <div className="text-xs text-perpus-gray-400 mt-4">Tanggal & Waktu Pengembalian (opsional)</div>
                            <div className="flex gap-2 mt-2">
                                <input type="date" value={rDate} onChange={e => setRDate(e.target.value)} className="input" />
                                <input type="time" value={rTime} onChange={e => setRTime(e.target.value)} className="input w-32" />
                            </div>

                            <div className="flex items-center gap-2 mt-3">
                                <input id="accepted-syarat" type="checkbox" checked={acceptedSyarat} onChange={e => setAcceptedSyarat(e.target.checked)} className="checkbox" />
                                <label htmlFor="accepted-syarat" className="text-sm text-perpus-gray-500">Saya setuju dengan <a href="/syarat" className="text-perpus-black">Syarat &amp; Ketentuan</a></label>
                            </div>

                            <div className="text-xs text-perpus-gray-400 mt-2">Batas maksimal: 1 bulan dari tanggal pengambilan.</div>
                        </div>

                        {/* Meta */}
                        <div className="mt-6 card p-4 space-y-2.5 text-sm">
                            {[
            { label: 'Stok', value: `${bukuSafe.stok_tersedia} / ${bukuSafe.stok_total}`, color: bukuSafe.stok_tersedia > 0 ? 'text-perpus-green' : 'text-perpus-red' },
            { label: 'Halaman', value: `${bukuSafe.halaman} hal` },
            { label: 'Bahasa', value: bukuSafe.bahasa },
            { label: 'Tahun', value: bukuSafe.tahun_terbit },
            { label: 'ISBN', value: bukuSafe.isbn || '-' },
        ].map(m => (<div key={m.label} className="flex justify-between">
                                    <span className="text-perpus-gray-500">{m.label}</span>
                                    <span className={clsx('font-medium text-perpus-black dark:text-perpus-white', m.color)}>{m.value}</span>
                                </div>))}
                        </div>
                    </div>

                    {/* Detail */}
                    <div className="md:col-span-2 space-y-6">
                        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
                            <span className="badge badge-black text-xs mb-3">{bukuSafe.kategori}</span>
                            <h1 className="font-display font-bold text-3xl text-perpus-black dark:text-perpus-white leading-tight">{bukuSafe.judul}</h1>
                            <p className="text-perpus-gray-500 mt-2 text-lg">{bukuSafe.penulis}</p>
                            <p className="text-sm text-perpus-gray-400">{bukuSafe.penerbit} · {bukuSafe.tahun_terbit}</p>

                            <div className="flex items-center gap-2 mt-3">
                                {[1, 2, 3, 4, 5].map(s => (<Star key={s} className={clsx('w-4 h-4', s <= Math.round(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-perpus-gray-200 dark:text-perpus-gray-700')}/>))}
                                <span className="text-sm font-medium text-perpus-black dark:text-perpus-white">{avgRating.toFixed(1)}</span>
                                <span className="text-sm text-perpus-gray-400">({ulasanList.length ?? 0} ulasan)</span>
                            </div>
                        </motion.div>

                        <div className="divider"/>

                        <div>
                            <h2 className="font-semibold text-perpus-black dark:text-perpus-white mb-3">Deskripsi</h2>
                            <p className="text-perpus-gray-600 dark:text-perpus-gray-400 leading-relaxed text-sm">
                                {buku.deskripsi || 'Belum ada deskripsi untuk buku ini.'}
                            </p>
                        </div>

                        {/* Ulasan */}
                        <div>
                            <h2 className="font-semibold text-perpus-black dark:text-perpus-white mb-4">Ulasan Pembaca</h2>

                            {/* Form tulis ulasan */}
                                <div className="card p-4 mb-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold">Tulis Ulasan Anda</div>
                                    <div className="text-xs text-perpus-gray-400">Nilai 1-5</div>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <button key={s} type="button" onClick={() => setUlasanData('rating', s)} className={clsx('w-8 h-8 rounded flex items-center justify-center', s <= ulasanData.rating ? 'bg-yellow-400 text-white' : 'bg-perpus-gray-100 dark:bg-perpus-gray-800')}>
                                            <Star className="w-4 h-4" />
                                        </button>
                                    ))}
                                </div>
                                    <textarea value={ulasanData.komentar} onChange={e => setUlasanData('komentar', e.target.value)} className="input mt-3" rows={3} placeholder="Berikan komentar (opsional)" />
                                <div className="mt-3 flex items-center justify-between">
                                        { (typeof bisa_ulasan !== 'undefined' ? bisa_ulasan : true) ? (
                                            <button onClick={handleSubmitUlasan} disabled={sendingUlasan} className="btn-primary inline-flex items-center gap-2">
                                                {sendingUlasan ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Kirim Ulasan'}
                                            </button>
                                        ) : (
                                            <div className="text-sm text-perpus-red">Hanya pengguna yang pernah meminjam buku ini yang boleh mengulas.</div>
                                        )}
                                        <div className="text-xs text-perpus-gray-400">Ulasan akan tampil secara real-time jika fitur diaktifkan.</div>
                                </div>
                            </div>

                            {/* Daftar ulasan */}
                            <div className="space-y-3">
                                {ulasanList.length === 0 && <div className="text-sm text-perpus-gray-500">Belum ada ulasan untuk buku ini.</div>}
                                {ulasanList.slice(0, 10).map(u => (<div key={u.id} className="card p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm font-semibold text-perpus-black dark:text-perpus-white">{u.user?.name ?? 'Anonim'}</p>
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map(s => (<Star key={s} className={clsx('w-3 h-3', s <= u.rating ? 'text-yellow-400 fill-yellow-400' : 'text-perpus-gray-200')}/>))}
                                            </div>
                                        </div>
                                        {u.komentar && <p className="text-sm text-perpus-gray-500">{u.komentar}</p>}
                                        {u.balasan ? (
                                            <div className="mt-3 p-3 rounded border bg-perpus-gray-50 dark:bg-perpus-gray-800">
                                                <div className="text-xs font-medium">Balasan Admin {u.balasanAdmin?.name || u.balasan_admin?.name || ''}</div>
                                                <div className="text-sm text-perpus-gray-700 dark:text-perpus-gray-300 mt-1">{u.balasan}</div>
                                            </div>
                                        ) : null}
                                    </div>))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buku Serupa */}
                {buku_serupa.length > 0 && (<div>
                        <h2 className="font-display font-semibold text-lg text-perpus-black dark:text-perpus-white mb-4">Buku Serupa</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                            {buku_serupa.slice(0, 6).map(b => (<Link key={b.id} href={`/katalog/${b.id}`}>
                                    <motion.div whileHover={{ y: -3 }} className="group">
                                        <div className="book-cover mb-2">
                                            {b.cover ? <img src={`/storage/${b.cover}`} alt={b.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                    : <div className="w-full h-full flex items-center justify-center bg-perpus-gray-100 dark:bg-perpus-gray-800"><BookOpen className="w-5 h-5 text-perpus-gray-400"/></div>}
                                        </div>
                                        <p className="text-xs font-medium text-perpus-black dark:text-perpus-white line-clamp-2">{b.judul}</p>
                                    </motion.div>
                                </Link>))}
                        </div>
                    </div>)}
            </div>
        </AppLayout>);
}
