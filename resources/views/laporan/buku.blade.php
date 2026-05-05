<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Buku</title>
    <style>
        body{font-family: 'DejaVu Sans', sans-serif; font-size:12px; color:#111}
        .header{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #0a0a0a;padding:12px}
        .logo{font-weight:700;font-size:18px}
        .logo span{color:#c9a84c}
        table{width:100%;border-collapse:collapse;margin-top:10px}
        th,td{padding:6px;border:1px solid #eee;font-size:11px}
        th{background:#f3f3f3}
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">My<span>Perpus</span></div>
        <div>Dicetak: {{ now()->format('d/m/Y H:i') }}</div>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Judul</th>
                <th>Penulis</th>
                <th>Kategori</th>
                <th>Stok Total</th>
                <th>Stok Tersedia</th>
                <th>Terdaftar</th>
            </tr>
        </thead>
        <tbody>
            @foreach($buku as $i => $b)
            <tr>
                <td>{{ $i+1 }}</td>
                <td>{{ $b->judul }}</td>
                <td>{{ $b->penulis }}</td>
                <td>{{ $b->kategori?->nama ?? '-' }}</td>
                <td>{{ $b->stok_total ?? '-' }}</td>
                <td>{{ $b->stok_tersedia ?? '-' }}</td>
                <td>{{ $b->created_at->format('d/m/Y') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div style="margin-top:12px;font-size:11px;color:#666">MyPerpus — Sistem Manajemen Perpustakaan Digital</div>
</body>
</html>
