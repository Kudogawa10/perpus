<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Kartu Petugas - {{ $user->name }}</title>
    <style>
        @page { margin: 0; }
        body { font-family: 'DejaVu Sans', sans-serif; margin:0; padding:10px; color:#0b3a66 }
        .card { width:100%; height:100%; border:2px solid #0b3a66; border-radius:8px; padding:14px; box-sizing:border-box }
        .brand { display:flex; align-items:center; gap:8px }
        .brand .title { font-weight:700; font-size:18px }
        .brand .title span { color: #3182ce }
        .content { display:flex; gap:12px; margin-top:10px }
        .photo { width:120px; height:120px; border-radius:8px; background:#fff; display:flex; align-items:center; justify-content:center; font-size:20px; color:#0b3a66; border:1px solid #e6eef8 }
        .info { flex:1 }
        .no { font-family: monospace; letter-spacing:0.06em; color:#0b3a66; margin-bottom:6px }
        .name { font-size:18px; font-weight:700; color:#0b3a66 }
        .meta { margin-top:8px; font-size:12px; color:#0b3a66 }
        .footer { margin-top:12px; font-size:10px; color:#666; border-top:1px dashed #e6eef8; padding-top:8px }
        .qr { width:86px; height:86px; border:1px solid #e6eef8; display:flex; align-items:center; justify-content:center; font-size:12px; color:#0b3a66 }
    </style>
</head>
<body>
    <div class="card">
        <div class="brand">
            <div class="title">{{ $settings['brand_name'] ?? 'Perpus' }}<span>Petugas</span></div>
            <div style="margin-left:auto;font-size:12px;color:#0b3a66">Kartu Petugas</div>
        </div>

        <div class="content">
            <div class="photo">
                @if($user->avatar)
                    <img src="{{ public_path('storage/' . $user->avatar) }}" style="width:100%;height:100%;object-fit:cover;border-radius:6px" />
                @else
                    {{ strtoupper(substr($user->name,0,1)) }}
                @endif
            </div>
            <div class="info">
                <div class="no">NIP: {{ $user->petugas->nip ?? ($user->no_anggota ?? '-') }}</div>
                <div class="name">{{ $user->name }}</div>
                <div class="meta">Jabatan: {{ $user->petugas->jabatan ?? 'Petugas Perpustakaan' }}</div>
                <div class="meta">Email: {{ $user->email }}</div>
                <div class="footer">{{ $settings['footer_text'] ?? 'MyPerpus — Sistem Manajemen Perpustakaan Digital' }}</div>
            </div>

            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px">
                <div class="qr">{{ $user->petugas->nip ?? ($user->no_anggota ?? '—') }}</div>
                <div style="font-size:11px;color:#666">Dikeluarkan: {{ now()->format('d/m/Y') }}</div>
            </div>
        </div>
    </div>
</body>
</html>
