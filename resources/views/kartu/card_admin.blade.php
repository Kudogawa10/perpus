<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Kartu Admin - {{ $user->name }}</title>
    <style>
        @page { margin: 0; }
        body { font-family: 'DejaVu Sans', sans-serif; margin:0; padding:10px; color:#111 }
        .card { width:100%; height:100%; border:2px solid #2d2d2d; border-radius:8px; padding:14px; box-sizing:border-box; background:#f9f7f3 }
        .brand { display:flex; align-items:center; gap:8px }
        .brand .title { font-weight:700; font-size:18px }
        .brand .title span { color: #c9a84c }
        .content { display:flex; gap:12px; margin-top:10px }
        .photo { width:120px; height:120px; border-radius:8px; background:#fff; display:flex; align-items:center; justify-content:center; font-size:20px; color:#111; border:1px solid #eee }
        .info { flex:1 }
        .no { font-family: monospace; letter-spacing:0.06em; color:#111; margin-bottom:6px }
        .name { font-size:18px; font-weight:700; color:#111 }
        .meta { margin-top:8px; font-size:12px; color:#444 }
        .footer { margin-top:12px; font-size:10px; color:#666; border-top:1px dashed #eee; padding-top:8px }
        .qr { width:86px; height:86px; border:1px solid #eee; display:flex; align-items:center; justify-content:center; font-size:12px; color:#111 }
    </style>
</head>
<body>
    <div class="card">
        <div class="brand">
            <div class="title">{{ $settings['brand_name'] ?? 'My' }}<span>Perpus</span></div>
            <div style="margin-left:auto;font-size:12px;color:#666">Kartu Admin</div>
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
                <div class="no">ID: {{ $user->id }}</div>
                <div class="name">{{ $user->name }}</div>
                <div class="meta">Peran: Administrator</div>
                <div class="meta">Email: {{ $user->email }}</div>
                <div class="footer">{{ $settings['footer_text'] ?? 'MyPerpus — Sistem Manajemen Perpustakaan Digital' }}</div>
            </div>

            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px">
                <div class="qr">ADM-{{ str_pad($user->id, 4, '0', STR_PAD_LEFT) }}</div>
                <div style="font-size:11px;color:#666">Dikeluarkan: {{ now()->format('d/m/Y') }}</div>
            </div>
        </div>
    </div>
</body>
</html>
