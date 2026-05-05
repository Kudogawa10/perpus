<?php

namespace Database\Seeders;

use App\Models\{Buku, Kategori};
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BukuSeeder extends Seeder
{
    public function run(): void
    {
        $bukuData = [
            // FIKSI
            ['judul' => 'Bumi Manusia', 'penulis' => 'Pramoedya Ananta Toer', 'penerbit' => 'Lentera Dipantara', 'tahun' => 1980, 'kat' => 'Fiksi', 'cover' => 'covers/bumimanusia.jpeg', 'hal' => 360, 'stok' => 5, 'online' => true, 'isbn' => '978-979-97312-0-2'],
            ['judul' => 'Laskar Pelangi', 'penulis' => 'Andrea Hirata', 'penerbit' => 'Bentang Pustaka', 'tahun' => 2005, 'kat' => 'Fiksi', 'cover' => 'covers/laskarpelangi.jpeg', 'hal' => 529, 'stok' => 8, 'online' => true, 'isbn' => '978-979-1227-00-1'],
            ['judul' => 'Negeri 5 Menara', 'penulis' => 'Ahmad Fuadi', 'penerbit' => 'Gramedia', 'tahun' => 2009, 'kat' => 'Fiksi', 'cover' => 'covers/negeri5menara.jpeg', 'hal' => 423, 'stok' => 6, 'online' => false],
            ['judul' => 'Perahu Kertas', 'penulis' => 'Dee Lestari', 'penerbit' => 'Bentang', 'tahun' => 2009, 'kat' => 'Fiksi', 'cover' => 'covers/perahukertas.jpeg', 'hal' => 444, 'stok' => 4, 'online' => true],
            ['judul' => 'Cantik Itu Luka', 'penulis' => 'Eka Kurniawan', 'penerbit' => 'Gramedia', 'tahun' => 2002, 'kat' => 'Fiksi', 'cover' => 'covers/cantikituluka.jpeg', 'hal' => 505, 'stok' => 3, 'online' => false],

            ['judul' => 'Hujan', 'penulis' => 'Tere Liye', 'penerbit' => 'Gramedia', 'tahun' => 2016, 'kat' => 'Fiksi', 'cover' => 'covers/hujan.jpeg', 'hal' => 320, 'stok' => 6, 'online' => true],

            // TEKNOLOGI
            ['judul' => 'Clean Code', 'penulis' => 'Robert C. Martin', 'penerbit' => 'Prentice Hall', 'tahun' => 2008, 'kat' => 'Teknologi', 'cover' => 'covers/cleancode.jpeg', 'hal' => 464, 'stok' => 4, 'online' => true, 'isbn' => '978-0-13-235088-4'],
            ['judul' => 'The Pragmatic Programmer', 'penulis' => 'David Thomas, Andrew Hunt', 'penerbit' => 'Addison-Wesley', 'tahun' => 2019, 'kat' => 'Teknologi', 'cover' => 'covers/thepragmaticprogrammer.jpeg', 'hal' => 352, 'stok' => 3, 'online' => false],
            ['judul' => 'Desain Produk Digital', 'penulis' => 'Gideon Sumartono', 'penerbit' => 'Elex Media', 'tahun' => 2020, 'kat' => 'Teknologi', 'cover' => 'covers/desainprodukdigital.jpeg', 'hal' => 280, 'stok' => 5, 'online' => true],
['judul' => 'Kecerdasan Buatan untuk Pemula', 'penulis' => 'Yudi Wibisono', 'penerbit' => 'Andi', 'tahun' => 2021, 'kat' => 'Teknologi', 'cover' => 'covers/kecerdasanbuatanuntukpemula.jpg', 'hal' => 320, 'stok' => 6, 'online' => true],


            // SEJARAH
            ['judul' => 'Sejarah Indonesia Modern', 'penulis' => 'M.C. Ricklefs', 'penerbit' => 'Serambi', 'tahun' => 2008, 'kat' => 'Sejarah', 'cover' => 'covers/sejarahindonesiamodern.jpeg', 'hal' => 718, 'stok' => 3, 'online' => false],
            ['judul' => 'Revolusi Indonesia', 'penulis' => 'Ben Anderson', 'penerbit' => 'Komunitas Bambu', 'tahun' => 2018, 'kat' => 'Sejarah', 'cover' => 'covers/revolusiindonesia.png', 'hal' => 450, 'stok' => 4, 'online' => true],
            ['judul' => 'Soekarno: Biografi', 'penulis' => 'Cindy Adams', 'penerbit' => 'Gunung Agung', 'tahun' => 1966, 'kat' => 'Sejarah', 'cover' => 'covers/soekarno:biografi.jpeg', 'hal' => 381, 'stok' => 2, 'online' => false],
            ['judul' => 'Membaca Sejarah Nusantara', 'penulis' => 'Agus Aris Munandar', 'penerbit' => 'Kompas', 'tahun' => 2011, 'kat' => 'Sejarah', 'cover' => 'covers/membacasejarahnusantara.jpeg', 'hal' => 340, 'stok' => 5, 'online' => false],

            // EKONOMI
            ['judul' => 'Rich Dad Poor Dad', 'penulis' => 'Robert Kiyosaki', 'penerbit' => 'Gramedia', 'tahun' => 1997, 'kat' => 'Ekonomi', 'cover' => 'covers/richdadpoordad.jpeg', 'hal' => 336, 'stok' => 8, 'online' => true],
            ['judul' => 'Ekonomi Indonesia', 'penulis' => 'Sri Mulyani Indrawati', 'penerbit' => 'Kompas', 'tahun' => 2019, 'kat' => 'Ekonomi', 'cover' => 'covers/ekonomiindonesia.jpeg', 'hal' => 280, 'stok' => 4, 'online' => false],
            ['judul' => 'Investasi Saham untuk Pemula', 'penulis' => 'Lo Kheng Hong', 'penerbit' => 'Gramedia', 'tahun' => 2018, 'kat' => 'Ekonomi', 'cover' => 'covers/investasisahamuntukpemula.jpeg', 'hal' => 256, 'stok' => 6, 'online' => true],
            ['judul' => 'Thinking, Fast and Slow', 'penulis' => 'Daniel Kahneman', 'penerbit' => 'Gramedia', 'tahun' => 2011, 'kat' => 'Ekonomi', 'cover' => 'covers/thinkingfastandslow.jpeg', 'hal' => 499, 'stok' => 5, 'online' => false],

            // PSIKOLOGI
            ['judul' => 'Berani Tidak Disukai', 'penulis' => 'Fumitake Koga, Ichiro Kishimi', 'penerbit' => 'Gramedia', 'tahun' => 2013, 'kat' => 'Psikologi', 'cover' => 'covers/beranitidakdisukai.png', 'hal' => 360, 'stok' => 9, 'online' => true],
            ['judul' => 'Atomic Habits', 'penulis' => 'James Clear', 'penerbit' => 'Gramedia', 'tahun' => 2018, 'kat' => 'Psikologi', 'cover' => 'covers/atomichabits.jpeg', 'hal' => 320, 'stok' => 10, 'online' => true],
            ['judul' => 'Man\'s Search for Meaning', 'penulis' => 'Viktor Frankl', 'penerbit' => 'Noura', 'tahun' => 1946, 'kat' => 'Psikologi', 'cover' => 'covers/manssearchformeaning.jpeg', 'hal' => 165, 'stok' => 6, 'online' => true],
            ['judul' => 'Emotional Intelligence', 'penulis' => 'Daniel Goleman', 'penerbit' => 'Gramedia', 'tahun' => 1995, 'kat' => 'Psikologi', 'cover' => 'covers/emotionalintelligence.png', 'hal' => 352, 'stok' => 7, 'online' => false],

            // FILSAFAT
            ['judul' => 'Dunia Sophie', 'penulis' => 'Jostein Gaarder', 'penerbit' => 'Mizan', 'tahun' => 1991, 'kat' => 'Filsafat', 'cover' => 'covers/duniasophie.jpeg', 'hal' => 798, 'stok' => 4, 'online' => false],
            ['judul' => 'Filsafat Ilmu', 'penulis' => 'Jujun S. Suriasumantri', 'penerbit' => 'Sinar Harapan', 'tahun' => 1985, 'kat' => 'Filsafat', 'cover' => 'covers/filsafatilmu.jpeg', 'hal' => 350, 'stok' => 5, 'online' => true],
            ['judul' => 'Meditations', 'penulis' => 'Marcus Aurelius', 'penerbit' => 'Penguin', 'tahun' => 180, 'kat' => 'Filsafat', 'cover' => 'covers/meditations.jpeg', 'hal' => 256, 'stok' => 6, 'online' => true],

            // PENDIDIKAN
            ['judul' => 'Matematika Dasar', 'penulis' => 'Tim Kemdikbud', 'penerbit' => 'Balai Pustaka', 'tahun' => 2020, 'kat' => 'Pendidikan', 'cover' => 'covers/matematikadasar.jpeg', 'hal' => 420, 'stok' => 12, 'online' => false],
            ['judul' => 'Fisika Modern', 'penulis' => 'Serway & Jewett', 'penerbit' => 'Cengage', 'tahun' => 2018, 'kat' => 'Pendidikan', 'cover' => 'covers/fisikamodern.jpeg', 'hal' => 1056, 'stok' => 8, 'online' => false],
            ['judul' => 'Kimia Organik', 'penulis' => 'John McMurry', 'penerbit' => 'Cengage', 'tahun' => 2019, 'kat' => 'Pendidikan', 'cover' => 'covers/kimiaorganik.jpeg', 'hal' => 1200, 'stok' => 6, 'online' => false],

            // SAINS
            ['judul' => 'A Brief History of Time', 'penulis' => 'Stephen Hawking', 'penerbit' => 'Gramedia', 'tahun' => 1988, 'kat' => 'Sains', 'cover' => 'covers/abriefhistoryoftime.jpeg', 'hal' => 212, 'stok' => 5, 'online' => true],
            ['judul' => 'The Selfish Gene', 'penulis' => 'Richard Dawkins', 'penerbit' => 'Oxford', 'tahun' => 1976, 'kat' => 'Sains', 'cover' => 'covers/theselfishgene.jpeg', 'hal' => 360, 'stok' => 3, 'online' => false],
            ['judul' => 'Biologi Molekular', 'penulis' => 'Alberts et al.', 'penerbit' => 'Norton', 'tahun' => 2022, 'kat' => 'Sains', 'cover' => 'covers/biologimolekular.jpeg', 'hal' => 1464, 'stok' => 4, 'online' => false],

            // SENI & BUDAYA
            ['judul' => 'Batik: Warisan Nusantara', 'penulis' => 'Harini Muntasib', 'penerbit' => 'Balai Pustaka', 'tahun' => 2010, 'kat' => 'Seni & Budaya', 'cover' => 'covers/batikwarisannusantara.jpeg', 'hal' => 220, 'stok' => 4, 'online' => true],
            ['judul' => 'Wayang dan Filosofinya', 'penulis' => 'Dhanu Priyo Prabowo', 'penerbit' => 'Narasi', 'tahun' => 2015, 'kat' => 'Seni & Budaya', 'cover' => 'covers/wayangdanfilosofinya.jpeg', 'hal' => 190, 'stok' => 3, 'online' => false],

            // KESEHATAN
            ['judul' => 'Ilmu Gizi Modern', 'penulis' => 'Sunita Almatsier', 'penerbit' => 'Gramedia', 'tahun' => 2001, 'kat' => 'Kesehatan', 'cover' => 'covers/ilmugizimodern.jpeg', 'hal' => 316, 'stok' => 6, 'online' => false],
            ['judul' => 'Panduan Hidup Sehat', 'penulis' => 'dr. Tirta Prawita Sari', 'penerbit' => 'Gramedia', 'tahun' => 2020, 'kat' => 'Kesehatan', 'cover' => 'covers/panduanhidupsehat.jpeg', 'hal' => 240, 'stok' => 8, 'online' => true],
            ['judul' => 'Mental Health Awareness', 'penulis' => 'Nova Riyanti Yusuf', 'penerbit' => 'Gramedia', 'tahun' => 2019, 'kat' => 'Kesehatan', 'cover' => 'covers/mentalhealthawareness.jpeg', 'hal' => 200, 'stok' => 7, 'online' => true],

            // AGAMA
            ['judul' => 'Fikih Kontemporer', 'penulis' => 'Yusuf Qardawi', 'penerbit' => 'Pustaka Kautsar', 'tahun' => 1999, 'kat' => 'Agama', 'cover' => 'covers/fikihkontemporer.jpeg', 'hal' => 450, 'stok' => 5, 'online' => false],
            ['judul' => 'Ihya Ulumuddin', 'penulis' => 'Imam Al-Ghazali', 'penerbit' => 'Marja', 'tahun' => 1100, 'kat' => 'Agama', 'cover' => 'covers/ihyaulumuddin.jpeg', 'hal' => 820, 'stok' => 4, 'online' => false],

            // SASTRA
            ['judul' => 'Di Bawah Lindungan Kaabah', 'penulis' => 'Hamka', 'penerbit' => 'Bulan Bintang', 'tahun' => 1938, 'kat' => 'Sastra', 'cover' => 'covers/dibawahlindungankabah.jpeg', 'hal' => 150, 'stok' => 4, 'online' => true],
            ['judul' => 'Siti Nurbaya', 'penulis' => 'Marah Rusli', 'penerbit' => 'Balai Pustaka', 'tahun' => 1922, 'kat' => 'Sastra', 'cover' => 'covers/sitinurbaya.jpeg', 'hal' => 270, 'stok' => 5, 'online' => true],
            ['judul' => 'Ronggeng Dukuh Paruk', 'penulis' => 'Ahmad Tohari', 'penerbit' => 'Gramedia', 'tahun' => 1982, 'kat' => 'Sastra', 'cover' => 'covers/ronggengdukuhparuk.jpeg', 'hal' => 403, 'stok' => 4, 'online' => false],
        ];

        foreach ($bukuData as $data) {
            $kategori = Kategori::where('nama', $data['kat'])->first();
            if (! $kategori) {
                throw new \RuntimeException("Kategori '{$data['kat']}' tidak ditemukan untuk buku '{$data['judul']}'.");
            }

            // Prepare cover image: prefer existing files in storage/app/public/covers
            $coverPath = null;
            
            // 1) First, check if the cover path from data array exists in storage
            if (!empty($data['cover']) && Storage::disk('public')->exists($data['cover'])) {
                $coverPath = $data['cover'];
            }
            
            // 2) If not found, try slug-based lookup
            if (!$coverPath) {
                $slug = Str::slug($data['judul']);
                $extensions = ['jpg', 'jpeg', 'png', 'webp'];
                
                foreach ($extensions as $ext) {
                    $filename = $slug.'.'.$ext;
                    if (Storage::disk('public')->exists('covers/'.$filename)) {
                        $coverPath = 'covers/'.$filename;
                        break;
                    }
                }
            }

            // 3) Fallback: if not found in storage, look for seed images in repository and copy them into storage
            if (!$coverPath && !empty($data['cover'])) {
                $seedDir = database_path('seeders/seed_images/covers');
                $coverFileName = basename($data['cover']);
                $candidate = $seedDir.DIRECTORY_SEPARATOR.$coverFileName;
                if (file_exists($candidate)) {
                    try {
                        $contents = file_get_contents($candidate);
                        if ($contents !== false) {
                            Storage::disk('public')->put($data['cover'], $contents);
                            $coverPath = $data['cover'];
                        }
                    } catch (\Throwable $e) {
                        // ignore and continue (we'll leave cover null)
                    }
                }
            }

            Buku::updateOrCreate(
                ['judul' => $data['judul'], 'penulis' => $data['penulis']],
                [
                    'penerbit' => $data['penerbit'],
                    'tahun_terbit' => $data['tahun'],
                    'kategori_id' => $kategori->id,
                    'halaman' => $data['hal'],
                    'stok_total' => $data['stok'],
                    'stok_tersedia' => $data['stok'],
                    'bisa_online' => $data['online'],
                    'file_pdf' => $data['online']
                        ? 'sample-books/' . Str::slug($data['judul']) . '.pdf'
                        : null,
                    'isbn' => $data['isbn'] ?? null,
                    'bahasa' => 'Indonesia',
                    'deskripsi' => "Buku {$data['judul']} oleh {$data['penulis']} adalah salah satu karya penting dalam kategori {$data['kat']}.",
                    'cover' => $coverPath,
                ]
            );
        }
    }
}
