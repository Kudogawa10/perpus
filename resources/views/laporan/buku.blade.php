<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Data Buku - MyPerpus</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 11px;
            color: #1a1a1a;
            margin: 30px 35px;
        }

        /* ── HEADER ─────────────────────────────────── */
        .kop {
            border-bottom: 3px solid #0f172a;
            padding-bottom: 14px;
            margin-bottom: 18px;
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
            width: 44px;
            height: 44px;
            background: #0f172a;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .brand-icon-text {
            color: #f59e0b;
            font-size: 22px;
            font-weight: 900;
            line-height: 1;
            padding: 8px;
        }

        .brand-name {
            font-size: 20px;
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
            font-size: 15px;
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
            padding: 10px 14px;
            margin-bottom: 16px;
            display: flex;
            gap: 30px;
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
            font-size: 11px;
            font-weight: 600;
            color: #0f172a;
        }

        /* ── TABLE ──────────────────────────────────── */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }

        thead tr {
            background: #0f172a;
        }

        thead th {
            color: #ffffff;
            padding: 9px 8px;
            text-align: left;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            border: 1px solid #1e293b;
        }

        thead th.center { text-align: center; }

        tbody tr:nth-child(even) {
            background: #f8fafc;
        }

        tbody tr:hover {
            background: #f1f5f9;
        }

        tbody td {
            padding: 8px 8px;
            border: 1px solid #e2e8f0;
            font-size: 10.5px;
            color: #334155;
            vertical-align: top;
        }

        tbody td.center { text-align: center; }
        tbody td.bold   { font-weight: 700; }

        .badge {
            display: inline-block;
            padding: 2px 7px;
            border-radius: 999px;
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
        }

        .badge-yes { background: #dcfce7; color: #166534; }
        .badge-no  { background: #f1f5f9; color: #64748b; }

        /* ── FOOTER TANDA TANGAN ─────────────────────── */
        .footer-section {
            margin-top: 20px;
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
            padding-top: 6px;
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
            <h1>Laporan Data Buku</h1>
            <p>Dokumen Resmi • Dicetak: {{ now()->translatedFormat('d F Y, H:i') }} WIB</p>
        </div>
    </div>
</div>

{{-- META INFO --}}
<div class="meta-box">
    <div class="meta-item">
        <label>Total Koleksi</label>
        <span>{{ $buku->count() }} Buku</span>
    </div>
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
        <span>LPB/{{ now()->format('Ymd') }}/{{ str_pad($buku->count(), 3, '0', STR_PAD_LEFT) }}</span>
    </div>
</div>

{{-- DATA TABLE --}}
<table>
    <thead>
        <tr>
            <th class="center" style="width:30px">No</th>
            <th style="width:180px">Judul Buku</th>
            <th style="width:90px">Kategori</th>
            <th style="width:120px">Penulis</th>
            <th style="width:110px">Penerbit</th>
            <th class="center" style="width:45px">Tahun</th>
            <th class="center" style="width:45px">ISBN</th>
            <th class="center" style="width:35px">Stok</th>
            <th class="center" style="width:40px">Tersedia</th>
            <th class="center" style="width:45px">Online</th>
        </tr>
    </thead>
    <tbody>
        @foreach($buku as $item)
        <tr>
            <td class="center">{{ $loop->iteration }}</td>
            <td class="bold">{{ $item->judul }}</td>
            <td>{{ $item->kategoriRelasi->nama ?? ($item->kategori ?? '-') }}</td>
            <td>{{ $item->penulis }}</td>
            <td>{{ $item->penerbit }}</td>
            <td class="center">{{ $item->tahun_terbit }}</td>
            <td class="center" style="font-size:9px">{{ $item->isbn ?: '-' }}</td>
            <td class="center bold">{{ $item->stok_total }}</td>
            <td class="center" style="color: {{ $item->stok_tersedia > 0 ? '#166534' : '#b91c1c' }}; font-weight:700">
                {{ $item->stok_tersedia }}
            </td>
            <td class="center">
                @if($item->bisa_online)
                    <span class="badge badge-yes">Ya</span>
                @else
                    <span class="badge badge-no">Tidak</span>
                @endif
            </td>
        </tr>
        @endforeach
    </tbody>
</table>

{{-- TANDA TANGAN --}}
<div class="footer-section">
    <div class="footer-kiri">
        <strong>Catatan:</strong>
        Dokumen ini dicetak secara otomatis oleh Sistem Informasi MyPerpus dan merupakan
        dokumen resmi yang sah. Harap simpan dengan baik sebagai arsip perpustakaan.
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
    MyPerpus — Sistem Informasi Perpustakaan Digital &bull; Laporan Data Buku &bull; Halaman <span class="pagenum"></span>
</div>

</body>
</html>
