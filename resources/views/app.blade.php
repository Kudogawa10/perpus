<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title inertia>{{ config('app.name', 'MyPerpus') }}</title>

    <!-- Google Fonts - Premium Typography -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Syne:wght@400..800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

    <!-- Favicon -->
    <link rel="icon" type="image" href="asset/logo1.png">
    <link rel="apple-touch-icon" href="asset/logo1.png">
    <meta name="theme-color" content="#0a0a0a">

    <!-- SEO Meta -->
    <meta name="description" content="MyPerpus - Sistem Manajemen Perpustakaan Digital. Pinjam buku, baca online, dan kelola keanggotaan Anda.">
    <meta property="og:title" content="MyPerpus - Perpustakaan Digital">
    <meta property="og:description" content="Sistem Manajemen Perpustakaan Digital Modern">
    <meta property="og:type" content="website">

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx'])
    @inertiaHead
</head>
<body class="font-sans antialiased h-full bg-perpus-white dark:bg-perpus-black text-perpus-black dark:text-perpus-white transition-colors duration-300">
    @inertia
</body>
</html>
