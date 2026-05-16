<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Data Petugas - MyPerpus</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 10.5px;
            color: #1a1a1a;
            margin: 28px 32px;
        }

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
            line-height: 1;
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

        .meta-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 10px 14px;
            margin-bottom: 16px;
            display: flex;
            gap: 28px;
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
            vertical-align: middle;
        }

        tbody td.center { text-align: center; }
        tbody td.bold { font-weight: 700; }

        .badge {
            display: inline-block;
            padding: 2px 7px;
            border-radius: 999px;
            font-size: 8.5px;
            font-weight: 700;
            text-transform: uppercase;
        }

        .badge-aktif { background: #dcfce7; color: #166534; }
        .badge-nonaktif { background: #f1f5f9; color: #64748b; }
        .badge-ditangguhkan { background: #fee2e2; color: #991b1b; }

        .footer-section {
            margin-top: 16px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }

        .footer-kiri {
            font-size: 10px;
            color: #94a3b8;
            max-width: 320px;
            line-height: 1.6;
        }

        .footer-kiri strong {
            display: block;
            color: #64748b;
            margin-bottom: 4px;
        }

        .ttd-box {
            text-align: center;
            width: 240px;
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
            padding-top: 5px;
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
            <h1>Laporan Data Petugas</h1>
            <p>Dokumen Resmi Administrasi • Dicetak: {{ now()->translatedFormat('d F Y, H:i') }} WIB</p>
        </div>
    </div>
</div>

<div class="meta-box">
    <div class="meta-item">
        <label>Total Petugas</label>
        <span>{{ $petugas->count() }} Orang</span>
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
        <span>LPP/{{ now()->format('Ymd') }}/{{ str_pad($petugas->count(), 3, '0', STR_PAD_LEFT) }}</span>
    </div>
</div>

<table>
    <thead>
        <tr>
            <th class="center" style="width: 28px;">No</th>
            <th style="width: 150px;">Nama Petugas</th>
            <th style="width: 85px;">NIP</th>
            <th style="width: 110px;">Jabatan</th>
            <th style="width: 105px;">Bagian</th>
            <th style="width: 165px;">Email</th>
            <th style="width: 90px;">Telepon</th>
            <th class="center" style="width: 65px;">Status</th>
            <th class="center" style="width: 76px;">Terdaftar</th>
        </tr>
    </thead>
    <tbody>
        @forelse($petugas as $item)
            @php $status = $item->user->status ?? 'aktif'; @endphp
            <tr>
                <td class="center">{{ $loop->iteration }}</td>
                <td class="bold">{{ $item->user->name }}</td>
                <td style="font-family: monospace; font-size: 9.5px;">{{ $item->nip }}</td>
                <td>{{ $item->jabatan }}</td>
                <td>{{ $item->bagian }}</td>
                <td style="font-size: 9.5px;">{{ $item->user->email }}</td>
                <td>{{ $item->user->phone ?? '-' }}</td>
                <td class="center">
                    <span class="badge badge-{{ $status }}">{{ ucfirst($status) }}</span>
                </td>
                <td class="center">{{ \Carbon\Carbon::parse($item->user->created_at)->format('d/m/Y') }}</td>
            </tr>
        @empty
            <tr>
                <td colspan="9" class="center" style="padding: 18px;">Tidak ada data petugas.</td>
            </tr>
        @endforelse
    </tbody>
</table>

<div class="footer-section">
    <div class="footer-kiri">
        <strong>Catatan:</strong>
        Dokumen ini merupakan laporan resmi data petugas perpustakaan yang dicetak melalui
        sistem MyPerpus. Seluruh informasi di dalam laporan ini digunakan untuk kebutuhan
        administrasi internal dan pengawasan operasional perpustakaan.
    </div>
    <div class="ttd-box">
        <div class="ttd-kota">Tangerang, {{ now()->translatedFormat('d F Y') }}</div>
        <div class="ttd-jabatan">Administrator MyPerpus</div>
        <div class="ttd-nama">{{ $admin->name }}</div>
        <div class="ttd-nip">Tanda tangan admin</div>
    </div>
</div>

<div class="page-footer">
    MyPerpus — Sistem Informasi Perpustakaan Digital &bull; Laporan Data Petugas &bull; Halaman <span class="pagenum"></span>
</div>

</body>
</html>
