# Open Trip Professional Checklist

Dokumen ini adalah blueprint kebutuhan jika aplikasi MyPerpus akan diubah menjadi platform open trip profesional.

## Modul Pelanggan

- Registrasi, login, lupa password, verifikasi email, dan profil peserta.
- Katalog paket trip dengan pencarian, filter destinasi, tanggal, harga, durasi, kuota, dan tingkat kesulitan.
- Detail trip berisi itinerary harian, fasilitas, meeting point, syarat peserta, galeri, FAQ, dan kebijakan refund.
- Booking multi peserta dengan data identitas, kontak darurat, catatan alergi/medis, dan pilihan add-on.
- Riwayat booking, invoice, e-ticket, status pembayaran, dan status keberangkatan.
- Ulasan trip setelah perjalanan selesai.

## Modul Admin / Operator

- Dashboard penjualan, booking terbaru, trip akan berangkat, okupansi kuota, omzet, dan pembayaran tertunda.
- CRUD destinasi, kategori trip, paket trip, jadwal keberangkatan, harga, kuota, itinerary, fasilitas, add-on, dan galeri.
- Manajemen booking: konfirmasi, ubah status, refund, pembatalan, manifest peserta, dan export PDF/Excel.
- Manajemen pembayaran: upload bukti transfer, gateway payment, rekonsiliasi, invoice, dan kwitansi.
- Manajemen guide/tour leader, vendor, kendaraan, hotel, dan perlengkapan.
- Manajemen voucher/promo, diskon early bird, dan kode referral.
- Laporan omzet, peserta, trip terlaris, destinasi favorit, refund, dan performa marketing.
- Pengaturan konten legal: syarat ketentuan, kebijakan privasi, kebijakan refund, kontak, rekening bank, dan sosial media.

## Modul Operasional Trip

- Manifest peserta per keberangkatan.
- Checklist perlengkapan dan dokumen.
- Assignment guide/tour leader.
- Status keberangkatan: draft, published, open, guaranteed, full, closed, cancelled, completed.
- Broadcast informasi keberangkatan lewat email/WhatsApp gateway.
- Catatan internal peserta dan catatan operasional trip.

## Kebutuhan Teknis

- Docker Compose untuk development: Nginx, PHP-FPM, MySQL, Redis, Node/Vite, queue worker, scheduler, dan Mailpit.
- Queue worker aktif untuk email, notifikasi, invoice, dan broadcast.
- Scheduler aktif untuk reminder pembayaran, reminder keberangkatan, dan auto-close booking.
- Role dan permission: super admin, admin, finance, operator, guide, customer.
- Audit log untuk perubahan harga, jadwal, status booking, dan pembayaran.
- Backup database dan storage.
- Storage terstruktur untuk galeri trip, bukti pembayaran, invoice, dan dokumen peserta.
- Testing minimal untuk booking, payment flow, kuota, pembatalan, dan authorization.

## Prioritas Implementasi

1. Fondasi Docker dan environment development.
2. Desain ulang domain database dari buku/peminjaman menjadi trip/jadwal/booking/pembayaran.
3. Migrasi auth dan role agar cocok untuk operator open trip.
4. Bangun katalog trip dan detail trip.
5. Bangun booking, kuota, dan invoice.
6. Bangun dashboard admin/operator.
7. Tambahkan payment gateway, notifikasi, laporan, dan export.
