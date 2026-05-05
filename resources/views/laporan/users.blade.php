<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Daftar Anggota</title>
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
                <th>Nama</th>
                <th>No Anggota</th>
                <th>Email</th>
                <th>Telepon</th>
                <th>Domisili</th>
                <th>Terdaftar</th>
            </tr>
        </thead>
        <tbody>
            @foreach($users as $i => $u)
            <tr>
                <td>{{ $i+1 }}</td>
                <td>{{ $u->name }}</td>
                <td>{{ $u->no_anggota }}</td>
                <td>{{ $u->email }}</td>
                <td>{{ $u->phone ?? '-' }}</td>
                <td>{{ $u->domisili ?? '-' }}</td>
                <td>{{ $u->created_at->format('d/m/Y') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div style="margin-top:12px;font-size:11px;color:#666">MyPerpus — Sistem Manajemen Perpustakaan Digital</div>
</body>
</html>
