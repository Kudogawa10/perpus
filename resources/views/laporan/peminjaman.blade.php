<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Peminjaman {{ $tahun }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 10px; color: #111; }

        .header { padding: 20px 24px 16px; border-bottom: 2px solid #0a0a0a; margin-bottom: 16px; }
        .header-top { display: flex; justify-content: space-between; align-items: center; }
        .logo-text { font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
        .logo-text span { color: #c9a84c; }
        .report-title { font-size: 13px; font-weight: 600; margin-top: 4px; }
        .report-meta { font-size: 9px; color: #666; margin-top: 2px; }

        .summary-grid { display: flex; gap: 12px; margin: 0 24px 16px; }
        .summary-card { flex: 1; padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 6px; }
        .summary-num { font-size: 18px; font-weight: 700; color: #0a0a0a; }
        .summary-label { font-size: 9px; color: #888; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px; }

        table { width: 100%; border-collapse: collapse; margin: 0 24px; width: calc(100% - 48px); }
        thead tr { background: #0a0a0a; color: white; }
        thead th { padding: 8px 10px; text-align: left; font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; }
        tbody tr:nth-child(even) { background: #f8f8f8; }
        tbody tr { border-bottom: 1px solid #f0f0f0; }
        tbody td { padding: 7px 10px; font-size: 9.5px; }

        .status { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 8.5px; font-weight: 600; }
        .status-dikembalikan { background: #f0fdf4; color: #166534; }
        .status-dipinjam     { background: #eff6ff; color: #1e40af; }
        .status-terlambat    { background: #fef2f2; color: #991b1b; }
        .status-menunggu     { background: #fefce8; color: #854d0e; }
        .status-ditolak      { background: #fef2f2; color: #991b1b; }

        .footer { position: fixed; bottom: 0; left: 0; right: 0; padding: 8px 24px; border-top: 1px solid #e5e7eb; font-size: 8px; color: #999; display: flex; justify-content: space-between; }

        .page-break { page-break-after: always; }
    </style>
</head>
<body>

    <div class="header">
        <div class="header-top">
            <div>
                <div class="logo-text">My<span>Perpus</span></div>
                <div class="report-title">Laporan Peminjaman Buku Tahun {{ $tahun }}</div>
                <div class="report-meta">Dicetak: {{ now()->locale('id')->isoFormat('dddd, D MMMM YYYY [pukul] HH:mm') }}</div>
            </div>
            <div style="text-align:right; font-size:9px; color:#888;">
                <div>Total Data: {{ $peminjaman->count() }} peminjaman</div>
            </div>
        </div>
    </div>

    {{-- Summary --}}
    <div class="summary-grid">
        @php
            $total      = $peminjaman->count();
            $kembali    = $peminjaman->where('status', 'dikembalikan')->count();
            $terlambat  = $peminjaman->where('status', 'terlambat')->count();
            $dendaTotal = $peminjaman->sum('denda');
        @endphp
        <div class="summary-card">
            <div class="summary-num">{{ $total }}</div>
            <div class="summary-label">Total Peminjaman</div>
        </div>
        <div class="summary-card">
            <div class="summary-num">{{ $kembali }}</div>
            <div class="summary-label">Dikembalikan</div>
        </div>
        <div class="summary-card">
            <div class="summary-num">{{ $terlambat }}</div>
            <div class="summary-label">Terlambat</div>
        </div>
        <div class="summary-card">
            <div class="summary-num">Rp {{ number_format($dendaTotal, 0, ',', '.') }}</div>
            <div class="summary-label">Total Denda</div>
        </div>
    </div>

    {{-- Table --}}
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Kode</th>
                <th>Anggota</th>
                <th>Buku</th>
                <th>Tgl Pinjam</th>
                <th>Tgl Kembali</th>
                <th>Status</th>
                <th>Denda</th>
                <th>Petugas</th>
            </tr>
        </thead>
        <tbody>
            @foreach($peminjaman as $i => $p)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td style="font-family: monospace; font-size:8.5px; color:#666">{{ $p->kode_peminjaman }}</td>
                <td>
                    <strong>{{ $p->user->name }}</strong><br>
                    <span style="color:#999;font-size:8.5px">{{ $p->user->no_anggota }}</span>
                </td>
                <td>
                    {{ \Str::limit($p->buku->judul, 35) }}<br>
                    <span style="color:#999;font-size:8.5px">{{ $p->buku->penulis }}</span>
                </td>
                <td>{{ \Carbon\Carbon::parse($p->tanggal_pinjam)->format('d/m/Y') }}</td>
                <td>{{ \Carbon\Carbon::parse($p->tanggal_kembali_rencana)->format('d/m/Y') }}</td>
                <td>
                    <span class="status status-{{ $p->status }}">
                        {{ ucfirst($p->status) }}
                    </span>
                </td>
                <td>{{ $p->denda > 0 ? 'Rp ' . number_format($p->denda, 0, ',', '.') : '-' }}</td>
                <td>{{ $p->petugas?->name ?? '-' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <span>MyPerpus — Sistem Manajemen Perpustakaan Digital</span>
        <span>Laporan ini digenerate secara otomatis oleh sistem</span>
    </div>

</body>
</html>
