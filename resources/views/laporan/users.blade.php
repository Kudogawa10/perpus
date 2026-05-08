{{-- <!DOCTYPE html>
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
</html> --}}


# 3. TEMPLATE LAPORAN DATA PENGGUNA

```blade
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Pengguna - MyPerpus</title>

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            margin: 35px;
            color: #1f2937;
        }

        .header {
            text-align: center;
            border-bottom: 3px solid #1e293b;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
            color: #1e293b;
        }

        .header p {
            margin: 3px 0;
            color: #555;
        }

        .meta {
            margin-top: 15px;
            line-height: 1.8;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th {
            background: #1e293b;
            color: white;
            border: 1px solid #ccc;
            padding: 10px;
        }

        td {
            border: 1px solid #ccc;
            padding: 8px;
        }

        tr:nth-child(even) {
            background: #f8fafc;
        }

        .signature {
            width: 280px;
            float: right;
            text-align: center;
            margin-top: 60px;
        }

        .name {
            margin-top: 70px;
            font-weight: bold;
            text-decoration: underline;
        }
    </style>
</head>
<body>

<div class="header">
    <h1>MyPerpus</h1>
    <p>Sistem Informasi Perpustakaan Digital</p>
    <p>Laporan Data Pengguna Sistem</p>
</div>

<div class="meta">
    <strong>Tanggal Cetak:</strong> {{ now()->translatedFormat('d F Y') }}<br>
    <strong>Total Pengguna:</strong> {{ $users->count() }} Pengguna
</div>

<table>
    <thead>
        <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Role</th>
            <th>Tanggal Registrasi</th>
        </tr>
    </thead>
    <tbody>
        @foreach($users as $user)
        <tr>
            <td align="center">{{ $loop->iteration }}</td>
            <td>{{ $user->name }}</td>
            <td>{{ $user->email }}</td>
            <td align="center">{{ $user->role }}</td>
            <td align="center">{{ $user->created_at->format('d/m/Y') }}</td>
        </tr>
        @endforeach
    </tbody>
</table>

<div class="signature">
    Tangerang, {{ now()->translatedFormat('d F Y') }}<br>
    Administrator MyPerpus

    <div class="name">
        Muhtadi Luthfi Maghrobi
    </div>
</div>

</body>
</html>
```

---