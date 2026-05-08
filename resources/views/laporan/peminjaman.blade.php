# 2. TEMPLATE LAPORAN PEMINJAMAN

```blade
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Peminjaman - MyPerpus</title>

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            margin: 35px;
            color: #222;
        }

        .header {
            text-align: center;
            border-bottom: 3px solid #111827;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }

        .header h1 {
            margin: 0;
            color: #111827;
            font-size: 24px;
        }

        .header p {
            margin: 3px 0;
            color: #555;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th {
            background: #111827;
            color: white;
            padding: 10px;
            border: 1px solid #ccc;
        }

        td {
            border: 1px solid #ccc;
            padding: 8px;
        }

        tr:nth-child(even) {
            background: #f9fafb;
        }

        .summary {
            margin-top: 15px;
            line-height: 1.8;
        }

        .signature {
            width: 280px;
            float: right;
            margin-top: 60px;
            text-align: center;
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
    <p>Laporan Data Peminjaman Buku</p>
</div>

<div class="summary">
    <strong>Tanggal Cetak:</strong> {{ now()->translatedFormat('d F Y') }}<br>
    <strong>Total Data:</strong> {{ $peminjaman->count() }} Peminjaman
</div>

<table>
    <thead>
        <tr>
            <th>No</th>
            <th>Nama Peminjam</th>
            <th>Buku</th>
            <th>Tanggal Pinjam</th>
            <th>Tanggal Kembali</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
        @foreach($peminjaman as $item)
        <tr>
            <td align="center">{{ $loop->iteration }}</td>
            <td>{{ $item->user->name ?? '-' }}</td>
            <td>{{ $item->buku->judul ?? '-' }}</td>
            <td>{{ $item->tanggal_pinjam }}</td>
            <td>{{ $item->tanggal_kembali }}</td>
            <td align="center">{{ $item->status }}</td>
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
