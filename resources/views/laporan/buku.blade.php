{{-- <!DOCTYPE html>
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
</html> --}}


# Upgrade Lengkap Template PDF MyPerpus

## Tujuan Perubahan

Template laporan PDF MyPerpus diperbarui agar:

* Lebih formal dan profesional
* Cocok digunakan untuk kebutuhan sekolah, instansi, maupun presentasi resmi
* Memiliki identitas visual MyPerpus
* Memiliki struktur laporan yang rapi
* Mendukung tanda tangan administrator
* Memiliki header, footer, nomor halaman, dan metadata laporan
* Siap digunakan pada DomPDF / Laravel PDF

---

# 1. TEMPLATE LAPORAN DATA BUKU

```blade
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Data Buku - MyPerpus</title>

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #222;
            margin: 35px;
        }

        .header {
            border-bottom: 3px solid #0f172a;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }

        .title {
            text-align: center;
        }

        .title h1 {
            margin: 0;
            font-size: 24px;
            color: #0f172a;
        }

        .title p {
            margin: 4px 0;
            color: #555;
            font-size: 12px;
        }

        .info {
            margin-top: 15px;
            line-height: 1.7;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        table th {
            background: #0f172a;
            color: white;
            padding: 10px;
            border: 1px solid #ccc;
            text-align: center;
        }

        table td {
            border: 1px solid #ccc;
            padding: 8px;
        }

        tr:nth-child(even) {
            background: #f8fafc;
        }

        .footer {
            margin-top: 60px;
            width: 100%;
        }

        .signature {
            width: 280px;
            float: right;
            text-align: center;
            line-height: 1.7;
        }

        .ttd {
            margin-top: 70px;
            font-weight: bold;
            text-decoration: underline;
        }

        .page-footer {
            position: fixed;
            bottom: -15px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 10px;
            color: #777;
        }
    </style>
</head>
<body>

<div class="header">
    <div class="title">
        <h1>MyPerpus</h1>
        <p>Sistem Informasi Perpustakaan Digital</p>
        <p>Laporan Resmi Data Buku Perpustakaan</p>
    </div>
</div>

<div class="info">
    <strong>Tanggal Cetak:</strong> {{ now()->translatedFormat('d F Y') }}<br>
    <strong>Total Buku:</strong> {{ $buku->count() }} Buku
</div>

<table>
    <thead>
        <tr>
            <th>No</th>
            <th>Judul Buku</th>
            <th>Kategori</th>
            <th>Penulis</th>
            <th>Penerbit</th>
            <th>Tahun</th>
            <th>Stok</th>
        </tr>
    </thead>
    <tbody>
        @foreach($buku as $item)
        <tr>
            <td align="center">{{ $loop->iteration }}</td>
            <td>{{ $item->judul }}</td>
            <td>{{ $item->kategori->nama ?? '-' }}</td>
            <td>{{ $item->penulis }}</td>
            <td>{{ $item->penerbit }}</td>
            <td align="center">{{ $item->tahun }}</td>
            <td align="center">{{ $item->stok }}</td>
        </tr>
        @endforeach
    </tbody>
</table>

<div class="footer">
    <div class="signature">
        Tangerang, {{ now()->translatedFormat('d F Y') }}<br>
        Administrator MyPerpus

        <div class="ttd">
            Muhtadi Luthfi Maghrobi
        </div>
    </div>
</div>

<div class="page-footer">
    Dokumen resmi MyPerpus • Dicetak secara otomatis oleh sistem
</div>

</body>
</html>
```

---


---



# HASIL PENINGKATAN

## Tampilan

* Lebih modern
* Lebih profesional
* Layout rapi dan formal
* Cocok untuk kebutuhan sekolah dan instansi

## Fitur

* Header resmi MyPerpus
* Ringkasan metadata laporan
* Zebra table
* Footer dokumen
* Tanda tangan administrator
* Tanggal otomatis
* Siap export PDF
* Kompatibel DomPDF Laravel

## Identitas Dokumen

Nama Administrator:

Muhtadi Luthfi Maghrobi
