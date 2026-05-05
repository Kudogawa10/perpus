<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Struk Pengembalian - {{ $peminjaman->kode_peminjaman }}</title>
    <style>
        *{box-sizing:border-box}
        body{font-family: 'DejaVu Sans', sans-serif; color:#111; font-size:12px; padding:12px}
        .logo{font-weight:700;font-size:16px}
        .logo span{color:#c9a84c}
        .meta{font-size:11px;color:#666;margin-top:4px}
        .section{margin-top:10px}
        .line{display:flex;justify-content:space-between;margin:6px 0}
        .small{font-size:11px;color:#666}
        .footer{margin-top:12px;font-size:11px;color:#666}
        .center{text-align:center}
    </style>
</head>
<body>
    <div class="center">
        <div class="logo">My<span>Perpus</span></div>
        <div class="meta">Struk Pengembalian — {{ now()->format('d/m/Y H:i') }}</div>
    </div>

    <div class="section">
        <div class="line"><div><strong>Kode</strong></div><div style="font-family:monospace">{{ $peminjaman->kode_peminjaman }}</div></div>
        <div class="line"><div><strong>Nama</strong></div><div>{{ $peminjaman->user->name }}</div></div>
        <div class="line"><div><strong>No Anggota</strong></div><div>{{ $peminjaman->user->no_anggota }}</div></div>
        <div class="line"><div><strong>Buku</strong></div><div>{{ $peminjaman->buku->judul }} — {{ $peminjaman->buku->penulis }}</div></div>
        <div class="line"><div><strong>Pinjam</strong></div><div>{{ \Carbon\Carbon::parse($peminjaman->tanggal_pinjam)->format('d/m/Y') }}</div></div>
        <div class="line"><div><strong>Kembali (aktual)</strong></div><div>{{ \Carbon\Carbon::parse($peminjaman->tanggal_kembali_aktual)->format('d/m/Y') }}</div></div>
        <div class="line"><div><strong>Denda</strong></div><div>{{ $peminjaman->denda > 0 ? 'Rp ' . number_format($peminjaman->denda,0,',','.') : '-' }}</div></div>
    </div>

    <div class="footer center">
        <div>Terima kasih telah menggunakan MyPerpus.</div>
        <div style="margin-top:6px;font-size:10px;color:#999">MyPerpus — Sistem Manajemen Perpustakaan Digital</div>
    </div>
</body>
</html>
