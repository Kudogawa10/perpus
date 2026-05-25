<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Peminjaman & pengembalian dan Kondisi Buku dari Petugas - MyPerpus</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 10.5px;
            color: #1a1a1a;
            margin: 25px 30px;
        }

        /* ── HEADER ─────────────────────────────────── */
        .kop {
            border-bottom: 3px solid #0f172a;
            padding-bottom: 14px;
            margin-bottom: 16px;
        }

        .kop-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .kop-brand {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .brand-icon {
            width: 42px;
            height: 42px;
            background: #0f172a;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .brand-icon-text {
            color: #f59e0b;
            font-size: 21px;
            font-weight: 900;
            padding: 8px;
        }

        .brand-name {
            font-size: 19px;
            font-weight: 900;
            color: #0f172a;
            letter-spacing: -0.5px;
        }

        .brand-sub {
            font-size: 10px;
            color: #64748b;
            margin-top: 2px;
        }

        .kop-judul {
            text-align: right;
        }

        .kop-judul h1 {
            font-size: 14px;
            font-weight: 700;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .kop-judul p {
            font-size: 10px;
            color: #64748b;
            margin-top: 3px;
        }

        /* ── META INFO ──────────────────────────────── */
        .meta-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 9px 14px;
            margin-bottom: 14px;
            display: flex;
            gap: 25px;
        }

        .meta-item label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #94a3b8;
            font-weight: 700;
            display: block;
            margin-bottom: 2px;
        }

        .meta-item span {
            font-size: 10.5px;
            font-weight: 600;
            color: #0f172a;
        }

        /* ── TABLE ──────────────────────────────────── */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 28px;
        }

        thead tr {
            background: #0f172a;
        }

        thead th {
            color: #ffffff;
            padding: 8px 7px;
            text-align: left;
            font-size: 9.5px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            border: 1px solid #1e293b;
        }

        thead th.center { text-align: center; }

        tbody tr:nth-child(even) {
            background: #f8fafc;
        }

        tbody td {
            padding: 7px 7px;
            border: 1px solid #e2e8f0;
            font-size: 10px;
            color: #334155;
            vertical-align: top;
        }

        tbody td.center { text-align: center; }
        tbody td.bold   { font-weight: 700; }

        .badge {
            display: inline-block;
            padding: 2px 7px;
            border-radius: 999px;
            font-size: 8.5px;
            font-weight: 700;
            text-transform: uppercase;
        }

        .badge-dikirim  { background: #fef3c7; color: #92400e; }
        .badge-ditinjau { background: #dcfce7; color: #166534; }

        .stok-display {
            font-weight: 700;
            font-size: 11px;
        }

        .stok-tersedia { color: #166534; }
        .stok-habis    { color: #991b1b; }

        /* ── FOOTER TANDA TANGAN ─────────────────────── */
        .footer-section {
            margin-top: 16px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }

        .footer-kiri {
            font-size: 10px;
            color: #94a3b8;
            max-width: 260px;
            line-height: 1.6;
        }

        .footer-kiri strong {
            display: block;
            color: #64748b;
            margin-bottom: 4px;
        }

        .ttd-box {
            text-align: center;
            width: 220px;
        }

        .ttd-kota {
            font-size: 11px;
            color: #334155;
            margin-bottom: 5px;
        }

        .ttd-jabatan {
            font-size: 10px;
            color: #64748b;
            margin-bottom: 60px;
        }

        .ttd-nama {
            font-size: 12px;
            font-weight: 700;
            color: #0f172a;
            border-top: 2px solid #0f172a;
            padding-top: 5px;
        }

        .ttd-nip {
            font-size: 9px;
            color: #64748b;
            margin-top: 2px;
        }

        /* ── PAGE FOOTER ─────────────────────────────── */
        .page-footer {
            position: fixed;
            bottom: -10px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 9px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 5px;
        }
    </style>
</head>
<body>

{{-- KOP SURAT --}}
<div class="kop">
    <div class="kop-inner">
        <div class="kop-brand">
            <div class="brand-icon">
                <div class="brand-icon-text">M</div>
            </div>
            <div>
                <div class="brand-name">MyPerpus</div>
                <div class="brand-sub">Sistem Informasi Perpustakaan Digital</div>
            </div>
        </div>
        <div class="kop-judul">
            <h1>Laporan Peminjaman & pengembalian dan Kondisi Buku</h1>
            <p>Laporan dari Petugas • Dicetak: {{ now()->translatedFormat('d F Y, H:i') }} WIB</p>
        </div>
    </div>
</div>

{{-- META INFO --}}
<div class="meta-box">
    <div class="meta-item">
        <label>Total Laporan</label>
        <span>{{ $laporan->count() }} Data</span>
    </div>
    @if(!empty($filters['status']))
    <div class="meta-item">
        <label>Filter Status</label>
        <span>{{ ucfirst($filters['status']) }}</span>
    </div>
    @endif
    @if(!empty($filters['search']))
    <div class="meta-item">
        <label>Filter Pencarian</label>
        <span>{{ $filters['search'] }}</span>
    </div>
    @endif
    <div class="meta-item">
        <label>Dicetak Oleh</label>
        <span>{{ $admin->name }}</span>
    </div>
    <div class="meta-item">
        <label>Tanggal Cetak</label>
        <span>{{ now()->translatedFormat('d F Y') }}</span>
    </div>
    <div class="meta-item">
        <label>Nomor Dokumen</label>
        <span>LLP/{{ now()->format('Ymd') }}/{{ str_pad($laporan->count(), 3, '0', STR_PAD_LEFT) }}</span>
    </div>
</div>

{{-- DATA TABLE --}}
<table>
    <thead>
        <tr>
            <th class="center" style="width:28px">No</th>
            <th style="width:80px">Tanggal</th>
            <th style="width:90px">Petugas</th>
            <th style="width:150px">Judul Buku</th>
            <th class="center" style="width:55px">Stok</th>
            <th style="width:145px">Kondisi Buku</th>
            <th style="width:140px">Catatan</th>
            <th class="center" style="width:60px">Status</th>
        </tr>
    </thead>
    <tbody>
        @forelse($laporan as $item)
        <tr>
            <td class="center">{{ $loop->iteration }}</td>
            <td>{{ \Carbon\Carbon::parse($item->created_at)->format('d/m/Y H:i') }}</td>
            <td class="bold">{{ $item->petugas->name ?? '-' }}</td>
            <td>{{ $item->buku->judul ?? '-' }}</td>
            <td class="center">
                <span class="{{ $item->stok_tersedia > 0 ? 'stok-tersedia' : 'stok-habis' }} stok-display">
                    {{ $item->stok_tersedia }}
                </span>
                <span style="color:#94a3b8">/{{ $item->stok_total }}</span>
            </td>
            <td>{{ $item->kondisi_buku }}</td>
            <td style="font-size:9.5px; color:#64748b">{{ $item->catatan ?: '-' }}</td>
            <td class="center">
                <span class="badge badge-{{ $item->status }}">{{ ucfirst($item->status) }}</span>
            </td>
        </tr>
        @empty
        <tr>
            <td colspan="8" class="center" style="padding: 20px; color: #94a3b8;">
                Tidak ada data laporan.
            </td>
        </tr>
        @endforelse
    </tbody>
</table>

{{-- TANDA TANGAN --}}
<div class="footer-section">
    <div class="footer-kiri">
        <strong>Catatan:</strong>
        Dokumen ini merupakan rekap laporan kondisi buku yang dikirimkan oleh petugas
        perpustakaan dan telah diterima oleh administrator. Dokumen ini sah tanpa tanda tangan basah.
    </div>
    <div class="ttd-box">
        <div class="ttd-kota">Tangerang, {{ now()->translatedFormat('d F Y') }}</div>
        <div class="ttd-jabatan">Administrator MyPerpus</div>
        <div class="ttd-nama">{{ $admin->name }}</div>
        <div class="ttd-nip">Administrator</div>
    </div>
</div>

{{-- PAGE FOOTER --}}
<div class="page-footer">
    MyPerpus — Sistem Informasi Perpustakaan Digital &bull; Laporan Kondisi Buku dari Petugas &bull; Halaman <span class="pagenum"></span>
</div>

</body>
</html>
