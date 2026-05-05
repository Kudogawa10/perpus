<?php

namespace Database\Seeders;

use App\Models\{User, Buku, Kategori, Petugas, Peminjaman};
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ============================================================
        // 1. ROLES
        // ============================================================
        $roles = ['admin', 'petugas', 'pengguna'];
        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }

        if (app()->environment('production')) {
            $this->seedProductionAdmin();
            return;
        }

        // ============================================================
        // 2. ADMIN
        // ============================================================
        $admin = User::firstOrCreate(
            ['email' => 'admin@myperpus.id'],
            [
                'name'       => 'Administrator MyPerpus',
                'password'   => Hash::make('password'),
                'no_anggota' => 'ADMIN001',
                'status'     => 'aktif',
            ]
        );
        $admin->assignRole('admin');

        // ============================================================
        // 3. PETUGAS
        // ============================================================
        $petugasData = [
            [
                'user' => [
                    'name'    => 'Budi Santoso',
                    'email'   => 'petugas@myperpus.id',
                    'phone'   => '081234567890',
                ],
                'petugas' => [
                    'nip'     => 'PT2024001',
                    'jabatan' => 'Kepala Perpustakaan',
                    'bagian'  => 'Manajemen',
                    'tentang' => 'Berpengalaman 10 tahun di bidang pengelolaan perpustakaan digital.',
                ],
            ],
            [
                'user' => [
                    'name'    => 'Siti Rahayu',
                    'email'   => 'siti@myperpus.id',
                    'phone'   => '081234567891',
                ],
                'petugas' => [
                    'nip'     => 'PT2024002',
                    'jabatan' => 'Petugas Layanan',
                    'bagian'  => 'Layanan Peminjaman',
                    'tentang' => 'Melayani anggota dengan ramah dan profesional.',
                ],
            ],
            [
                'user' => [
                    'name'    => 'Ahmad Fauzi',
                    'email'   => 'ahmad@myperpus.id',
                    'phone'   => '081234567892',
                ],
                'petugas' => [
                    'nip'     => 'PT2024003',
                    'jabatan' => 'Petugas Katalog',
                    'bagian'  => 'Pengolahan Koleksi',
                    'tentang' => 'Ahli dalam pengkatalogan dan pengolahan koleksi buku.',
                ],
            ],
            [
                'user' => [
                    'name'    => 'Dewi Kusuma',
                    'email'   => 'dewi@myperpus.id',
                    'phone'   => '081234567893',
                ],
                'petugas' => [
                    'nip'     => 'PT2024004',
                    'jabatan' => 'Petugas Digital',
                    'bagian'  => 'Layanan Digital',
                    'tentang' => 'Mengelola layanan baca online dan digitalisasi koleksi.',
                ],
            ],
        ];

        foreach ($petugasData as $data) {
            $user = User::firstOrCreate(
                ['email' => $data['user']['email']],
                array_merge($data['user'], [
                    'password'   => Hash::make('password'),
                    'no_anggota' => User::generateNoAnggota(),
                    'status'     => 'aktif',
                ])
            );
            $user->assignRole('petugas');
            Petugas::firstOrCreate(['user_id' => $user->id], array_merge($data['petugas'], ['user_id' => $user->id]));
        }

        // ============================================================
        // 4. ANGGOTA DEMO
        // ============================================================
        $anggotaDemo = User::firstOrCreate(
            ['email' => 'anggota@myperpus.id'],
            [
                'name'       => 'Rina Anggota',
                'password'   => Hash::make('password'),
                'no_anggota' => User::generateNoAnggota(),
                'phone'      => '081299999999',
                'status'     => 'aktif',
            ]
        );
        $anggotaDemo->assignRole('pengguna');

        // Additional fake members
        for ($i = 1; $i <= 20; $i++) {
            $user = User::firstOrCreate(
                ['email' => "anggota{$i}@myperpus.id"],
                [
                    'name'       => "Anggota Demo {$i}",
                    'password'   => Hash::make('password'),
                    'no_anggota' => User::generateNoAnggota(),
                    'status'     => 'aktif',
                ]
            );
            $user->assignRole('pengguna');
        }

        // ============================================================
        // 5. KATEGORI
        // ============================================================
        $kategoriList = [
            ['nama' => 'Fiksi',         'icon' => '📖', 'deskripsi' => 'Novel, cerpen, dan karya fiksi'],
            ['nama' => 'Sains',         'icon' => '🔬', 'deskripsi' => 'Ilmu pengetahuan alam dan sains'],
            ['nama' => 'Teknologi',     'icon' => '💻', 'deskripsi' => 'Komputer, IT, dan teknologi modern'],
            ['nama' => 'Sejarah',       'icon' => '🏛️', 'deskripsi' => 'Sejarah Indonesia dan dunia'],
            ['nama' => 'Filsafat',      'icon' => '🧠', 'deskripsi' => 'Filsafat, etika, dan pemikiran'],
            ['nama' => 'Ekonomi',       'icon' => '📊', 'deskripsi' => 'Ekonomi, bisnis, dan keuangan'],
            ['nama' => 'Psikologi',     'icon' => '🧩', 'deskripsi' => 'Psikologi dan ilmu perilaku'],
            ['nama' => 'Pendidikan',    'icon' => '🎓', 'deskripsi' => 'Buku teks dan pendidikan'],
            ['nama' => 'Seni & Budaya', 'icon' => '🎨', 'deskripsi' => 'Seni, budaya, dan kreativitas'],
            ['nama' => 'Agama',         'icon' => '☪️', 'deskripsi' => 'Buku agama dan spiritual'],
            ['nama' => 'Kesehatan',     'icon' => '🏥', 'deskripsi' => 'Kesehatan, kedokteran, dan gizi'],
            ['nama' => 'Sastra',        'icon' => '✍️', 'deskripsi' => 'Sastra Indonesia dan dunia'],
        ];

        foreach ($kategoriList as $k) {
            Kategori::firstOrCreate(
                ['nama' => $k['nama']],
                ['slug' => \Str::slug($k['nama']), 'icon' => $k['icon'], 'deskripsi' => $k['deskripsi']]
            );
        }

        // ============================================================
        // 6. BUKU (sample data)
        // ============================================================
        $this->call(BukuSeeder::class);

        // ============================================================
        // 7. SAMPLE PEMINJAMAN
        // ============================================================
        $this->call(PeminjamanSeeder::class);
    }

    private function seedProductionAdmin(): void
    {
        $hasAdmin = User::role('admin')->exists();
        $email = (string) env('ADMIN_EMAIL', '');
        $password = (string) env('ADMIN_PASSWORD', '');

        if ($email === '' || $password === '') {
            if ($hasAdmin) {
                $this->command?->warn('Production seed skipped admin creation because an admin already exists.');
                return;
            }

            throw new \RuntimeException('Set ADMIN_EMAIL and ADMIN_PASSWORD before running production seed.');
        }

        if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new \RuntimeException('ADMIN_EMAIL must be a valid email address.');
        }

        if (strlen($password) < 12) {
            throw new \RuntimeException('ADMIN_PASSWORD must be at least 12 characters for production.');
        }

        $admin = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => env('ADMIN_NAME', 'Administrator MyPerpus'),
                'password' => Hash::make($password),
                'no_anggota' => 'ADMIN001',
                'status' => 'aktif',
            ]
        );

        if (! $admin->hasRole('admin')) {
            $admin->assignRole('admin');
        }

        $this->command?->info('Production roles and admin account are ready.');
    }
}
