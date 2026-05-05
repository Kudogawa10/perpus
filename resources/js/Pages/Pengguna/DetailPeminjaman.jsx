import React, { useEffect, useState, useRef } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { toDataURL } from 'qrcode';
import { Calendar, Clock, Printer, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function DetailPeminjaman({ peminjaman }) {
    const [qrSrc, setQrSrc] = useState(null);
    const receiptRef = useRef(null);

    useEffect(() => {
        const payload = JSON.stringify({ id: peminjaman.id, kode: peminjaman.kode_peminjaman });
        toDataURL(payload, { width: 240, margin: 1 })
            .then(setQrSrc)
            .catch(() => setQrSrc(null));
    }, [peminjaman]);

    // If the page was opened with ?print=1, auto-trigger printing once QR is generated
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (!params.get('print')) return;
        // Wait a bit for DOM/QR to be ready
        const t = setTimeout(() => {
            try {
                printReceipt();
            } catch (e) {
                console.error('Auto-print failed', e);
            }
        }, 700);
        return () => clearTimeout(t);
    }, [qrSrc]);

    const buku = peminjaman.buku || {};

    const printReceipt = () => {
        if (!receiptRef.current) return;
        const w = window.open('', '_blank');
        const html = `
            <html>
            <head>
              <title>Struk Peminjaman - ${peminjaman.kode_peminjaman}</title>
              <style>body{font-family:Arial,Helvetica,sans-serif;padding:18px;color:#111} .h{font-weight:700;margin-bottom:8px}</style>
            </head>
            <body>${receiptRef.current.innerHTML}</body>
            </html>`;
        w.document.write(html);
        w.document.close();
        w.focus();
        w.print();
        w.close();
    };

    const fmtDate = (d) => d ? new Date(d).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';

    return (
        <AppLayout title={`Detail Peminjaman — ${peminjaman.kode_peminjaman}`}>
            <div className="max-w-3xl mx-auto space-y-6">

                <div className="flex items-center gap-3">
                    <button onClick={() => window.history.back()} className="btn-ghost inline-flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4"/> Kembali
                    </button>
                    <h1 className="text-lg font-semibold">Struk & Detail Peminjaman</h1>
                </div>

                <div className="card p-5">
                    <div className="flex gap-4">
                        <div className="w-28 h-40 rounded-lg overflow-hidden bg-perpus-gray-100 flex-shrink-0">
                            {buku.cover
                                ? <img src={`/storage/${buku.cover}`} alt={buku.judul} className="w-full h-full object-cover"/>
                                : <div className="w-full h-full flex items-center justify-center text-perpus-gray-400">No Cover</div>}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="font-semibold text-perpus-black dark:text-perpus-white">{buku.judul || '—'}</h2>
                                    <p className="text-sm text-perpus-gray-500 mt-1">{buku.penulis || ''}</p>
                                    <p className="text-xs text-perpus-gray-400 font-mono mt-2">{peminjaman.kode_peminjaman}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-perpus-gray-500">Status</div>
                                    <div className="font-semibold mt-1">{peminjaman.status}</div>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-perpus-gray-600">
                                <div>
                                    <div className="text-xs text-perpus-gray-400">Tanggal Pinjam</div>
                                    <div className="font-medium">{fmtDate(peminjaman.tanggal_pinjam)}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-perpus-gray-400">Rencana Kembali</div>
                                    <div className="font-medium">{fmtDate(peminjaman.tanggal_kembali_rencana)}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-perpus-gray-400">Tanggal Kembali Aktual</div>
                                    <div className="font-medium">{fmtDate(peminjaman.tanggal_kembali_aktual)}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-perpus-gray-400">Denda</div>
                                    <div className="font-medium">Rp {Number(peminjaman.denda_berjalan || peminjaman.denda || 0).toLocaleString('id-ID')}</div>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-3">
                                <a href={`/peminjaman/${peminjaman.id}/cetak-struk`} target="_blank" rel="noreferrer" className="btn-primary inline-flex items-center gap-2">
                                    <Printer className="w-4 h-4"/> Cetak Struk
                                </a>
                                <a href={qrSrc || '#'} target="_blank" rel="noreferrer" className="btn-secondary inline-flex items-center gap-2">
                                    Lihat QR
                                </a>
                                {peminjaman.status === 'dikembalikan' && (
                                    <>
                                        <Link href={`/katalog/${peminjaman.buku?.id}`} className="btn-ghost inline-flex items-center gap-2">Beri Ulasan</Link>
                                        <a href={`/peminjaman/${peminjaman.id}/cetak-struk-return`} target="_blank" rel="noreferrer" className="btn-ghost inline-flex items-center gap-2">Cetak Struk Pengembalian</a>
                                    </>
                                )}

                                {(peminjaman.status === 'dipinjam' || peminjaman.status === 'terlambat') && (
                                    <button onClick={async () => {
                                        if (!confirm('Ajukan pengembalian buku ini?')) return;
                                        try {
                                            await axios.post(`/peminjaman/${peminjaman.id}/ajukan-kembali`);
                                            toast.success('Pengajuan pengembalian dikirim');
                                            setTimeout(() => window.location.reload(), 800);
                                        } catch (e) {
                                            toast.error(e.response?.data?.message || 'Gagal mengajukan pengembalian');
                                        }
                                    }} className="btn-warning bg-red-700 p-2 rounded-lg inline-flex items-center gap-2">Ajukan Pengembalian</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card p-5 flex items-center gap-6">
                    <div>
                        <div className="text-xs text-perpus-gray-400">QR Code Peminjaman</div>
                        {qrSrc ? <img src={qrSrc} alt="QR Code" className="w-40 h-40 mt-2"/> : <div className="w-40 h-40 mt-2 bg-perpus-gray-100"/>}
                    </div>

                    <div className="flex-1 text-sm text-perpus-gray-600">
                        <div className="font-semibold">Peminjam</div>
                        <div>{peminjaman.user ? peminjaman.user.name : '-'}</div>
                        <div className="text-xs text-perpus-gray-400 font-mono mt-2">{peminjaman.user ? peminjaman.user.no_anggota : ''}</div>

                        <div className="mt-4">
                            <div className="text-xs text-perpus-gray-400">Buku</div>
                            <div className="font-medium">{buku.judul || '—'}</div>
                            <div className="text-xs text-perpus-gray-400">{buku.penulis || ''}</div>
                        </div>
                    </div>
                </div>

                {/* Hidden receipt used for printing */}
                <div ref={receiptRef} style={{ display: 'none' }}>
                        <div style={{ maxWidth: 320 }}>
                        <h3 style={{ marginBottom: 6 }}>STRUK PEMINJAMAN</h3>
                        <div style={{ marginBottom: 6 }}>Kode: {peminjaman.kode_peminjaman}</div>
                        <div style={{ marginBottom: 6 }}>Nama: {peminjaman.user ? peminjaman.user.name : '-'}</div>
                        <div style={{ marginBottom: 6 }}>Buku: {buku.judul || '—'} — {buku.penulis || ''}</div>
                        <div style={{ marginBottom: 6 }}>Pinjam: {fmtDate(peminjaman.tanggal_pinjam)}</div>
                        <div style={{ marginBottom: 6 }}>Rencana Kembali: {fmtDate(peminjaman.tanggal_kembali_rencana)}</div>
                        <div style={{ marginBottom: 6 }}>Denda: Rp {Number(peminjaman.denda_berjalan || peminjaman.denda || 0).toLocaleString('id-ID')}</div>
                        {qrSrc && (<div style={{ marginTop: 8 }}><img src={qrSrc} alt="QR" style={{ width: 160 }} /></div>)}
                        <div style={{ marginTop: 12 }}>Terima kasih telah menggunakan layanan perpustakaan.</div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
