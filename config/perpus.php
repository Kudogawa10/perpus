<?php

return [
    // Daftar wilayah JABODETABEK untuk dropdown domisili dan validasi
    'jabodetabek' => [
        'Jakarta Pusat',
        'Jakarta Utara',
        'Jakarta Selatan',
        'Jakarta Barat',
        'Jakarta Timur',
        'Kepulauan Seribu',
        'Bogor',
        'Kabupaten Bogor',
        'Depok',
        'Tangerang',
        'Kabupaten Tangerang',
        'Tangerang Selatan',
        'Bekasi',
        'Kabupaten Bekasi',
    ],
    // Kata kunci wilayah yang diizinkan untuk login (digunakan saat memeriksa domisili)
    'allowed_login_keywords' => ['Jakarta', 'Bogor', 'Depok', 'Tangerang', 'Bekasi'],
];
