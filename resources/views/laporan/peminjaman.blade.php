<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Peminjaman & pengembalian Buku - MyPerpus</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 10px;
            color: #1a1a1a;
            margin: 28px 32px;
        }

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

        .meta-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 10px 14px;
            margin-bottom: 16px;
            display: flex;
            gap: 26px;
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
            padding: 8px 6px;
            text-align: left;
            font-size: 9px;
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
            padding: 7px 6px;
            border: 1px solid #e2e8f0;
            font-size: 9.5px;
            color: #334155;
            vertical-align: top;
        }

        tbody td.center { text-align: center; }
        tbody td.bold { font-weight: 700; color: #0f172a; }

        .muted { color: #94a3b8; }
        .mono { font-family: DejaVu Sans Mono, monospace; font-size: 8.5px; }

        .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 999px;
            font-size: 8px;
            font-weight: 700;
            text-transform: uppercase;
        }

        .badge-menunggu { background: #fef3c7; color: #92400e; }
        .badge-disetujui { background: #dbeafe; color: #1d4ed8; }
        .badge-dipinjam { background: #e0f2fe; color: #0369a1; }
        .badge-pengajuan_kembali { background: #ede9fe; color: #6d28d9; }
        .badge-dikembalikan { background: #dcfce7; color: #166534; }
        .badge-terlambat { background: #fee2e2; color: #991b1b; }
        .badge-ditolak { background: #f1f5f9; color: #475569; }

        .footer-section {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }

        .footer-kiri {
            font-size: 10px;
            color: #94a3b8;
            max-width: 300px;
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
            <h1>Laporan Peminjaman & pengembalian Buku</h1>
            <p>Dokumen Resmi &bull; Dicetak: {{ now()->translatedFormat('d F Y, H:i') }} WIB</p>
        </div>
    </div>
</div>

<div class="meta-box">
    <div class="meta-item">
        <label>Tahun Laporan</label>
        <span>{{ $tahun }}</span>
    </div>
    <div class="meta-item">
        <label>Total Transaksi</label>
        <span>{{ $peminjaman->count() }} Data</span>
    </div>
    <div class="meta-item">
        <label>Dikembalikan</label>
        <span>{{ $peminjaman->where('status', \App\Models\Peminjaman::STATUS_DIKEMBALIKAN)->count() }} Data</span>
    </div>
    <div class="meta-item">
        <label>Dicetak Oleh</label>
        <span>{{ $admin->name }}</span>
    </div>
    <div class="meta-item">
        <label>Nomor Dokumen</label>
        <span>LPP/{{ now()->format('Ymd') }}/{{ str_pad($peminjaman->count(), 3, '0', STR_PAD_LEFT) }}</span>
    </div>
</div>

<table>
    <thead>
        <tr>
            <th class="center" style="width:28px">No</th>
            <th style="width:75px">Kode</th>
            <th style="width:115px">Peminjam</th>
            <th style="width:150px">Buku</th>
            <th class="center" style="width:70px">Tgl Pinjam</th>
            <th class="center" style="width:78px">Rencana Kembali</th>
            <th class="center" style="width:82px">Tgl Pengembalian</th>
            <th class="center" style="width:70px">Status</th>
            <th class="center" style="width:62px">Denda</th>
            <th style="width:105px">Petugas</th>
        </tr>
    </thead>
    <tbody>
        @forelse($peminjaman as $item)
            @php
                $isReturned = $item->status === \App\Models\Peminjaman::STATUS_DIKEMBALIKAN;
                $tanggalPengembalian = $isReturned ? $item->tanggal_kembali_aktual : null;
                $statusClass = 'badge-' . str_replace(' ', '_', $item->status);
            @endphp
            <tr>
                <td class="center">{{ $loop->iteration }}</td>
                <td class="mono">{{ $item->kode_peminjaman }}</td>
                <td class="bold">{{ $item->user->name ?? '-' }}</td>
                <td>{{ $item->buku->judul ?? '-' }}</td>
                <td class="center">{{ optional($item->tanggal_pinjam)->format('d/m/Y') ?? '-' }}</td>
                <td class="center">{{ optional($item->tanggal_kembali_rencana)->format('d/m/Y') ?? '-' }}</td>
                <td class="center">
                    @if($tanggalPengembalian)
                        {{ $tanggalPengembalian->format('d/m/Y') }}
                    @elseif($isReturned)
                        <span class="muted">Belum tercatat</span>
                    @else
                        <span class="muted">-</span>
                    @endif
                </td>
                <td class="center">
                    <span class="badge {{ $statusClass }}">{{ str_replace('_', ' ', ucfirst($item->status)) }}</span>
                </td>
                <td class="center">
                    {{ $item->denda > 0 ? 'Rp ' . number_format($item->denda, 0, ',', '.') : '-' }}
                </td>
                <td>{{ $item->petugas->name ?? '-' }}</td>
            </tr>
        @empty
            <tr>
                <td colspan="10" class="center" style="padding: 20px; color: #94a3b8;">
                    Tidak ada data peminjaman untuk tahun ini.
                </td>
            </tr>
        @endforelse
    </tbody>
</table>

<div class="footer-section">
    <div class="footer-kiri">
        <strong>Catatan:</strong>
        Kolom tanggal pengembalian menampilkan tanggal pengembalian aktual hanya untuk
        transaksi berstatus dikembalikan. Dokumen ini sah sebagai arsip peminjaman perpustakaan.
    </div>
    <div class="ttd-box">
        <div class="ttd-kota">Tangerang, {{ now()->translatedFormat('d F Y') }}</div>
        <div class="ttd-jabatan">Administrator MyPerpus</div>
        <div class="ttd-nama">{{ $admin->name }}</div>
        <div class="ttd-nip">Administrator</div>
    </div>
</div>

<div class="page-footer">
    MyPerpus — Sistem Informasi Perpustakaan Digital &bull; Laporan Peminjaman Buku &bull; Halaman <span class="pagenum"></span>
</div>

</body>
</html>
