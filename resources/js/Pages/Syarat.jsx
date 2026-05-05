import React from 'react';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';

export default function Syarat() {
    return (
        <AppLayout title="Syarat & Ketentuan Peminjaman">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="page-header flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 text-sm text-perpus-gray-500 hover:text-perpus-black dark:hover:text-perpus-white transition-colors">
                            <ArrowLeft className="w-4 h-4"/> Kembali
                        </button>
                        <div>
                            <h1 className="page-title">Syarat &amp; Ketentuan Peminjaman</h1>
                            <p className="page-subtitle">Ketentuan umum penggunaan dan peminjaman buku di MyPerpus</p>
                        </div>
                    </div>
                </div>

                <div className="card p-6 space-y-4 text-sm">
                    <section>
                        <h2 className="font-semibold">1. Persyaratan Anggota</h2>
                        <p>Pengguna harus terdaftar sebagai anggota aktif dan membawa/menunjukkan identitas saat mengambil buku di perpustakaan.</p>
                    </section>

                    <section>
                        <h2 className="font-semibold">2. Durasi Peminjaman</h2>
                        <p>Durasi standar peminjaman adalah 14 hari kecuali ditentukan lain. Batas maksimal pengajuan peminjaman dapat mencapai 1 bulan jika disetujui petugas.</p>
                    </section>

                    <section>
                        <h2 className="font-semibold">3. Pengembalian &amp; Denda</h2>
                        <p>Pengembalian harus dilakukan pada atau sebelum tanggal rencana. Keterlambatan akan dikenakan denda Rp 1.000/hari per buku.</p>
                    </section>

                    <section>
                        <h2 className="font-semibold">4. Kehilangan dan Kerusakan</h2>
                        <p>Anggota bertanggung jawab atas kerusakan dan kehilangan buku. Kebijakan pengganti akan diberlakukan sesuai ketentuan perpustakaan.</p>
                    </section>

                    <section>
                        <h2 className="font-semibold">5. Pembatalan &amp; Penegakan</h2>
                        <p>Perpustakaan berhak menolak, menahan, atau membatalkan layanan peminjaman jika ditemukan pelanggaran terhadap ketentuan ini.</p>
                    </section>

                    <section>
                        <h2 className="font-semibold">Kontak</h2>
                        <p>Untuk pertanyaan atau sengketa, hubungi petugas perpustakaan di admin@myperpus.id atau datang langsung ke loket layanan.</p>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
