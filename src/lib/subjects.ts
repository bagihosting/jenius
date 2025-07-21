
import type { Subject, SchoolType, Grade, Semester } from './types';

// SD / MI Subjects (Fase A, B, C)
const elementarySubjects: Omit<Subject, 'content' | 'id'>[] = [
  { title: 'Pendidikan Pancasila', icon: 'Landmark' },
  { title: 'Bahasa Indonesia', icon: 'BookOpen' },
  { title: 'Matematika', icon: 'Calculator' },
  { title: 'Bahasa Inggris', icon: 'Languages' },
  { title: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)', icon: 'PersonStanding' },
  { title: 'Seni Budaya dan Prakarya (SBDP)', icon: 'Paintbrush' },
  { title: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)', icon: 'FlaskConical' },
  { title: 'Bahasa Daerah', icon: 'LanguageIcon' },
];

// SMP / MTs Subjects (Fase D)
const juniorHighSubjects: Omit<Subject, 'content' | 'id'>[] = [
  { title: 'Pendidikan Pancasila', icon: 'Landmark' },
  { title: 'Bahasa Indonesia', icon: 'BookOpen' },
  { title: 'Matematika', icon: 'Calculator' },
  { title: 'Bahasa Inggris', icon: 'Languages' },
  { title: 'Ilmu Pengetahuan Alam (IPA)', icon: 'Atom' }, // Terpadu: Fisika, Kimia, Biologi
  { title: 'Ilmu Pengetahuan Sosial (IPS)', icon: 'Users' }, // Terpadu: Sejarah, Geografi, Ekonomi, Sosiologi
  { title: 'PJOK', icon: 'PersonStanding' },
  { title: 'Seni Budaya', icon: 'Paintbrush' },
  { title: 'Prakarya', icon: 'Sprout' },
];

// SMA / MA Subjects (Fase E & F)
const seniorHighSubjects: Omit<Subject, 'content' | 'id'>[] = [
  { title: 'Pendidikan Pancasila', icon: 'Landmark' },
  { title: 'Bahasa Indonesia', icon: 'BookOpen' },
  { title: 'Matematika', icon: 'Calculator' },
  { title: 'Bahasa Inggris', icon: 'Languages' },
  { title: 'Sejarah Indonesia', icon: 'Landmark' },
  { title: 'PJOK', icon: 'PersonStanding' },
  { title: 'Seni Budaya', icon: 'Paintbrush' },
  // Peminatan IPA
  { title: 'Fisika', icon: 'Atom' },
  { title: 'Kimia', icon: 'FlaskConical' },
  { title: 'Biologi', icon: 'Sprout' },
  // Peminatan IPS
  { title: 'Ekonomi', icon: 'Scale' },
  { title: 'Geografi', icon: 'Globe' },
  { title: 'Sosiologi', icon: 'Users' },
];


// Subjects that vary by school type
const religiousSubjects = {
  sd_smp_sma: { title: 'Pendidikan Agama & Budi Pekerti', icon: 'HeartHandshake' },
  sdit_mi: [
    { title: 'Tahsin/Tahfidz', icon: 'BookCopy' },
    { title: 'Fiqh', icon: 'Scale' },
    { title: 'Aqidah Akhlak', icon: 'HeartHandshake' },
    { title: 'Bahasa Arab', icon: 'Speech' },
  ],
  mts_ma: [
    { title: 'Al-Qur\'an Hadis', icon: 'BookCopy' },
    { title: 'Akidah Akhlak', icon: 'HeartHandshake' },
    { title: 'Fikih', icon: 'Scale' },
    { title: 'Sejarah Kebudayaan Islam', icon: 'Landmark' },
    { title: 'Bahasa Arab', icon: 'Speech' },
  ]
};

const schoolTypeMap: Record<SchoolType, string> = {
  SDN: 'SD Negeri',
  SDIT: 'SD Islam Terpadu',
  MI: 'Madrasah Ibtidaiyah',
  SMP: 'SMP',
  MTs: 'Madrasah Tsanawiyah',
  SMA: 'SMA',
  MA: 'Madrasah Aliyah',
  AKADEMI: 'Akademi',
  UNIVERSITAS: 'Universitas'
};

const semesterTopics: Record<Semester, Record<string, string[]>> = {
    '1': {
        'Pendidikan Pancasila': [
            'Aturan di Rumah dan di Sekolah', 'Penerapan Sila Pancasila dalam Kehidupan Sehari-hari', 'Simbol-simbol Pancasila', // Kelas 1
            'Unit 1: Hak dan kewajiban di rumah, kerja sama dalam keluarga', 'Unit 2: Tata tertib di sekolah, musyawarah untuk keputusan bersama', 'Unit 3: Peduli terhadap lingkungan, tanggung jawab merawat makhluk hidup', 'Unit 4: Pentingnya menjaga kebersihan diri dan lingkungan, bahaya kuman, gotong royong membersihkan lingkungan.', // Kelas 2
            'Unit 1: Hak dan kewajiban terhadap lingkungan, gotong royong menjaga kebersihan lingkungan, pentingnya menjaga kelestarian alam.', 'Unit 2: Tanggung jawab dalam menggunakan teknologi, kerja sama dalam kelompok untuk menyelesaikan tugas menggunakan alat sederhana.', 'Unit 3: Menghargai keberagaman suku dan budaya, pentingnya toleransi, mencintai produk dalam negeri.', 'Unit 4: Pentingnya musyawarah dan mufakat, menaati peraturan di masyarakat, hak dan kewajiban warga negara.', // Kelas 3
            'Hak dan Kewajiban sebagai Warga Sekolah dan Masyarakat', 'Bentuk-bentuk Keragaman Suku, Agama, dan Budaya', 'Pentingnya Musyawarah Mufakat', // Kelas 4
            'Keutuhan Negara Kesatuan Republik Indonesia (NKRI)', 'Manfaat Gotong Royong dan Persatuan', 'Organisasi di Lingkungan Sekolah dan Masyarakat', // Kelas 5
            'Penerapan Nilai-nilai Pancasila dari Sila ke-1 sampai ke-5', 'Peran Indonesia dalam Lingkup ASEAN', 'Menghadapi Era Globalisasi', // Kelas 6
        ],
        'Bahasa Indonesia': [
            'Membaca dan Menulis Permulaan', 'Mengenal Huruf dan Suku Kata', 'Menyebutkan Benda-benda di Sekitar', // Kelas 1
            'Unit 1: Menceritakan pengalaman bersama keluarga, menulis kalimat sederhana, mengenali kata kerja dan kata sifat.', 'Unit 2: Memberi petunjuk arah di sekolah, menulis paragraf pendek tentang teman', 'Unit 3: Menulis laporan singkat hasil pengamatan tumbuhan/hewan, membaca informasi dari teks sederhana tentang tumbuhan/hewan.', 'Unit 4: Menulis daftar kegiatan menjaga kebersihan, membaca petunjuk penggunaan barang (misal: sabun), poster kesehatan.', // Kelas 2
            'Unit 1: Mengidentifikasi informasi dari teks tentang lingkungan, menulis ringkasan cerita atau informasi, menulis laporan sederhana hasil observasi.', 'Unit 2: Membaca dan memahami petunjuk penggunaan alat, menulis teks prosedur sederhana, menceritakan pengalaman menggunakan teknologi.', 'Unit 3: Menceritakan kembali isi teks tentang budaya, menulis deskripsi singkat tentang budaya daerah, mendengarkan cerita rakyat.', 'Unit 4: Menulis surat pribadi sederhana, menulis daftar kebutuhan, menceritakan pengalaman berinteraksi dengan orang lain.', // Kelas 3
            'Menemukan Gagasan Pokok dalam Teks', 'Membuat Peta Pikiran (Mind Map)', 'Menulis Petunjuk Penggunaan Sesuatu', // Kelas 4
            'Mengidentifikasi Informasi dari Teks Iklan Media Cetak/Elektronik', 'Menulis Surat Resmi Sederhana', 'Membuat Ringkasan dari Teks Bacaan', // Kelas 5
            'Menyimpulkan Informasi dari Teks Laporan Hasil Pengamatan', 'Menulis Teks Pidato Singkat', 'Mengisi Formulir', // Kelas 6
        ],
        'Matematika': [
            'Bilangan Cacah sampai dengan 20', 'Penjumlahan dan Pengurangan Sederhana (di bawah 20)', 'Mengenal Bentuk Bangun Datar', // Kelas 1
            'Unit 1: Mengenal bilangan cacah sampai 100, nilai tempat (puluhan dan satuan), penjumlahan dan pengurangan tanpa meminjam.', 'Unit 2: Pengukuran panjang dengan satuan baku (cm, meter), mengenal bangun datar dan bangun ruang sederhana (kubus, balok, bola).', 'Unit 3: Menyelesaikan masalah sehari-hari yang berkaitan dengan penjumlahan dan pengurangan (maksimal tiga angka), mengenal waktu (jam dan menit).', 'Unit 4: Mengenal pola bilangan, menyelesaikan soal cerita sederhana yang melibatkan uang (rupiah).', // Kelas 2
            'Unit 1: Penjumlahan dan pengurangan bilangan cacah sampai 1.000 (termasuk soal cerita), perkalian dan pembagian dasar (fakta dasar sampai 10x10).', 'Unit 2: Mengukur waktu (jam, menit, detik) dan jarak (meter, kilometer), menyelesaikan soal cerita yang berkaitan dengan waktu dan jarak.', 'Unit 3: Mengenal pecahan sederhana (setengah, sepertiga, seperempat) dalam konteks sehari-hari (misal: membagi makanan), membandingkan harga barang.', 'Unit 4: Data dan diagram batang sederhana, menghitung rata-rata sederhana, menyelesaikan soal cerita tentang pengukuran.', // Kelas 3
            'Pecahan Senilai', 'Faktor dan Kelipatan Bilangan (FPB & KPK)', 'Bangun Datar (Segi Banyak Beraturan dan Tidak Beraturan)', // Kelas 4
            'Operasi Hitung Pecahan (Penjumlahan, Pengurangan)', 'Skala dan Denah Sederhana', 'Volume Kubus dan Balok', // Kelas 5
            'Bilangan Bulat (Penjumlahan, Pengurangan)', 'Luas dan Keliling Lingkaran', 'Penyajian dan Pengolahan Data (Mean, Modus, Median)', // Kelas 6
        ],
        'IPAS': [
            'Anggota Tubuh dan Pancaindra', 'Benda Hidup dan Benda Tak Hidup di Sekitar Kita', 'Peristiwa Siang dan Malam', // Kelas 1
            'Wujud Benda (Padat, Cair, Gas)', 'Perubahan Wujud Benda (Mencair, Membeku)', 'Siklus Hidup Hewan (Kupu-kupu, Ayam)', 'Sumber Energi dan Kegunaannya', // Kelas 2
            'Ciri-ciri Makhluk Hidup', 'Sistem Pencernaan Manusia secara Sederhana', 'Rangkaian Listrik Sederhana', // Kelas 3
            'Gaya dan Gerak', 'Sifat-sifat Bunyi dan Cahaya', 'Bentuk-Bentuk Energi dan Perubahannya', // Kelas 4
            'Sistem Pernapasan pada Manusia dan Hewan', 'Sistem Peredaran Darah Manusia', 'Siklus Air dan Ekosistem', // Kelas 5
            'Perkembangbiakan Tumbuhan dan Hewan', 'Sistem Tata Surya dan Planet', 'Ciri-ciri Pubertas pada Laki-laki dan Perempuan', // Kelas 6
        ],
        'Pendidikan Agama & Budi Pekerti': [
            'Rukun Islam dan Dua Kalimat Syahadat', 'Mengenal Huruf Hijaiyah', 'Kisah Nabi Adam A.S.', // Kelas 1
            'Unit 1: Doa untuk orang tua, pentingnya berbakti', 'Unit 2: Adab berteman, menghargai teman yang berbeda agama/suku, doa belajar.', 'Unit 3: Mensyukuri nikmat Allah atas ciptaan-Nya (tumbuhan dan hewan), menjaga kebersihan dan kelestarian alam.', 'Unit 4: Pentingnya wudu dan salat sebagai bentuk kebersihan spiritual, menjaga kebersihan adalah sebagian dari iman.', // Kelas 2
            'Unit 1: Bersyukur atas nikmat alam, menjaga kebersihan adalah sebagian dari iman, pentingnya menjaga lingkungan sebagai titipan Tuhan.', 'Unit 2: Menggunakan teknologi secara bijak (misalnya, untuk kebaikan, bukan untuk hal negatif), mensyukuri kemudahan yang diberikan teknologi.', 'Unit 3: Toleransi antarumat beragama, pentingnya hidup rukun, mengenal tata cara beribadah agama lain secara umum.', 'Unit 4: Pentingnya saling menolong, berempati, menjenguk orang sakit, berkunjung ke tetangga.', // Kelas 3
        ],
        'Bahasa Inggris': [
            'Alphabets and Numbers', 'Greetings and Self-Introduction', 'Colors', 'Animals', // Kelas 1
        ],
        'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)': [
            'Gerak Dasar Lokomotor (Berjalan, Berlari, Melompat)', 'Permainan Sederhana Tanpa Alat', 'Menjaga Kebersihan Tubuh', // Kelas 1
            'Unit 1: Gerak dasar lokomotor (melompat, berlari) dan non-lokomotor (membungkuk, memutar) dalam permainan sederhana.', 'Unit 2: Permainan tradisional yang melibatkan kerjasama, senam irama dengan iringan musik.', 'Unit 3: Gerak menirukan gerakan hewan, menjaga kebugaran tubuh dengan gerakan sederhana.', 'Unit 4: Gerakan senam lantai dasar (misal: guling depan sederhana), pentingnya makanan sehat dan istirahat cukup.', // Kelas 2
            'Unit 1: Gerakan menjaga keseimbangan, senam irama dengan variasi gerak.', 'Unit 2: Gerakan dasar manipulatif (melempar, menangkap, menendang) dalam permainan yang melibatkan teknologi sederhana (misal: lempar ring ke tiang).', 'Unit 3: Permainan tradisional dari berbagai daerah, senam dengan iringan musik daerah.', 'Unit 4: Permainan kelompok yang melatih kerja sama, menjaga kebugaran tubuh melalui aktivitas fisik di luar ruangan.', // Kelas 3
        ],
        'Seni Budaya dan Prakarya (SBDP)': [
            'Menggambar Ekspresif', 'Mengenal Bunyi dan Irama', 'Membuat Karya dari Bahan Alam', // Kelas 1
            'Unit 1: Menggambar kegiatan keluarga, membuat kartu ucapan untuk keluarga, bernyanyi lagu tentang keluarga.', 'Unit 2: Membuat mading sederhana tentang sekolah, menggambar lingkungan sekolah, membuat hiasan kelas.', 'Unit 3: Membuat diorama kebun binatang/pertanian, menggambar dan mewarnai jenis-jenis tumbuhan/hewan.', 'Unit 4: Membuat poster kesehatan, membuat karya seni dari bahan daur ulang.', // Kelas 2
            'Unit 1: Membuat karya seni dari bahan alam (tanah liat, daun kering), menggambar pemandangan alam, membuat prakarya dari bahan daur ulang.', 'Unit 2: Membuat model teknologi sederhana dari kardus/barang bekas, menggambar alat teknologi, bernyanyi lagu tentang teknologi.', 'Unit 3: Menggambar dan mewarnai pakaian adat/rumah adat, meniru gerak tari daerah, membuat karya seni kolase dengan tema budaya.', 'Unit 4: Membuat poster kampanye sosial, menggambar aktivitas masyarakat, membuat cerita bergambar.', // Kelas 3
        ],
        'Bahasa Daerah': [
            'Menyimak Dongeng Lokal', 'Menyebutkan Nama Anggota Keluarga dalam Bahasa Daerah', 'Ungkapan Sapaan Sederhana', // Kelas 1
        ],
        'Tahsin/Tahfidz': [
            'Pengenalan Huruf Hijaiyah dan Harakat Dasar (Fathah, Kasrah, Dhammah)', 'Hafalan Surat An-Nas dan Al-Falaq', 'Doa Sebelum dan Sesudah Belajar', // Kelas 1
            'Peningkatan kemampuan membaca Al-Qur\'an (Iqra\'/Utsmani)', 'hafalan surat-surat pendek Juz Amma dan doa harian.', 'Doa untuk kedua orang tua', // Kelas 2
            'Peningkatan kemampuan membaca Al-Qur\'an dengan tajwid sederhana', 'hafalan surat-surat pendek Juz Amma dan doa harian yang lebih banyak.', // Kelas 3
        ],
        'Fiqh': [
            'Pengenalan Rukun Islam secara sederhana', 'Tata Cara Bersuci (Istinja)', 'Praktik Gerakan Shalat Fardu', // Kelas 1
            'Pengenalan rukun iman secara sederhana', 'tata cara bersuci (istinja, wudu)', 'dan praktik salat fardu.', // Kelas 2
            'Pengenalan tentang salat sunah', 'puasa wajib dan sunah', 'zakat fitrah', 'adab makan dan minum.', // Kelas 3
        ],
        'Aqidah Akhlak': [
            'Pengenalan Dua Kalimat Syahadat', 'Sifat Allah: Maha Pencipta (Al-Khaliq)', 'Akhlak Terpuji: Jujur dan Berterima Kasih', // Kelas 1
            'Pengenalan sifat wajib Allah', 'kisah keteladanan para Nabi dan Sahabat', 'akhlak terpuji (disiplin, mandiri, berani).', // Kelas 2
            'Pengenalan lebih dalam tentang nama-nama Allah dan sifat-Nya (Asmaul Husna)', 'kisah-kisah teladan para Sahabat Nabi', 'akhlak terpuji (amanah, rendah hati, pemaaf).', // Kelas 3
        ],
        'Bahasa Arab': [
            'Pengenalan kosakata benda-benda di sekolah', 'Pengenalan kosakata kegiatan sehari-hari', 'Percakapan sederhana (sapaan, menanyakan kabar)', // Kelas 2
            'Pengenalan struktur kalimat sederhana', 'kosakata tentang keluarga, profesi, dan kegiatan sehari-hari.', // Kelas 3
            'Perkenalan (Taaruf)', 'Angka 1-10 dalam Bahasa Arab', 'Benda-benda di Kelas', // Kelas 7
        ],
        'Ilmu Pengetahuan Alam (IPA)': [
            'Hakikat Ilmu Sains dan Metode Ilmiah', 'Zat dan Perubahannya (Unsur, Senyawa, Campuran)', 'Suhu, Kalor, dan Pemuaian', 'Gerak Lurus dan Gaya', // Kelas 7
        ],
        'Ilmu Pengetahuan Sosial (IPS)': [
            'Keruangan dan Interaksi Antarruang', 'Interaksi Sosial dan Lembaga Sosial', 'Kegiatan Ekonomi (Produksi, Distribusi, Konsumsi)', // Kelas 7
        ],
        'Prakarya': [
            'Kerajinan Serat dan Tekstil', 'Rekayasa Teknologi Konstruksi Miniatur Rumah', 'Budidaya Tanaman Sayuran', // Kelas 7
        ],
        'Al-Qur\'an Hadis': [
            'Membaca dan Menulis Huruf Hijaiyah', 'Hafalan Surat-surat Pendek (Al-Fatihah, An-Nas, Al-Falaq, Al-Ikhlas)', 'Hadis tentang Kebersihan', // Kelas 7
        ],
        'Fikih': [
            'Rukun Islam', 'Bersuci (Istinja dan Wudu)', 'Praktik Gerakan dan Bacaan Salat', // Kelas 7
        ],
        'Sejarah Kebudayaan Islam': [
            'Masa Kanak-kanak Nabi Muhammad SAW', 'Peristiwa Sebelum Kenabian (Tahun Gajah)', // Kelas 7
        ],
        'Fisika': [
            'Besaran, Satuan, dan Pengukuran', 'Analisis Vektor', 'Kinematika Gerak Lurus (GLB, GLBB)', 'Dinamika Partikel (Hukum Newton)', // Kelas 10
        ],
        'Kimia': [
            'Hakikat dan Peran Ilmu Kimia', 'Struktur Atom dan Sistem Periodik Unsur', 'Ikatan Kimia dan Bentuk Molekul', 'Stoikiometri (Konsep Mol)', // Kelas 10
        ],
        'Biologi': [
            'Ruang Lingkup Biologi dan Kerja Ilmiah', 'Keanekaragaman Hayati, Klasifikasi, dan Virus', 'Struktur dan Fungsi Sel', // Kelas 10
        ],
        'Ekonomi': [
            'Konsep Dasar Ilmu Ekonomi', 'Masalah Pokok Ekonomi dan Sistem Ekonomi', 'Peran Pelaku Ekonomi dalam Kegiatan Ekonomi', 'Permintaan, Penawaran, dan Keseimbangan Pasar', // Kelas 10
        ],
        'Geografi': [
            'Hakikat Ilmu Geografi', 'Dinamika Litosfer dan Dampaknya terhadap Kehidupan', 'Dinamika Atmosfer dan Dampaknya', // Kelas 10
        ],
        'Sosiologi': [
            'Fungsi Sosiologi sebagai Ilmu Mengkaji Gejala Sosial', 'Individu, Kelompok, dan Hubungan Sosial', 'Rancangan Penelitian Sosial Sederhana', // Kelas 10
        ],
        'Sejarah Indonesia': [
            'Pengantar Ilmu Sejarah', 'Asal-usul Nenek Moyang dan Jalur Rempah di Indonesia', 'Kerajaan Hindu-Buddha di Indonesia', // Kelas 10
        ],
    },
    '2': {
        'Pendidikan Pancasila': [
            'Identitas Diri dan Keluarga', 'Menghargai Perbedaan Teman', 'Aturan Saat Bermain Bersama Teman', // Kelas 1
            'Lambang Negara Garuda Pancasila', 'Bhinneka Tunggal Ika', 'Menjaga Kebersihan Lingkungan', 'Contoh Perilaku Sesuai Sila Pancasila', // Kelas 2
            'Menghargai keberagaman suku dan budaya', 'pentingnya toleransi', 'mencintai produk dalam negeri', // Kelas 3
            'Pemerintahan Desa dan Kecamatan', 'Mengenal Lembaga-lembaga Negara', 'Cinta Produk Indonesia', // Kelas 4
            'Peristiwa Proklamasi Kemerdekaan', 'Peran Tokoh-tokoh dalam Kemerdekaan', 'Tantangan dalam Menjaga Keutuhan NKRI', // Kelas 5
            'Sistem Pemerintahan Indonesia', 'Peran Indonesia di Dunia Internasional', 'Dampak Positif dan Negatif Kemajuan Teknologi', // Kelas 6
        ],
        'Bahasa Indonesia': [
            'Mendeskripsikan Benda Secara Lisan', 'Menulis Kalimat Tunggal Sederhana', 'Memahami Isi Puisi Anak', // Kelas 1
            'Menggunakan Huruf Kapital di Awal Kalimat dan Nama Diri', 'Menulis Cerita Pendek Berdasarkan Gambar', 'Membaca Puisi dengan Intonasi yang Tepat', // Kelas 2
            'Menulis Laporan Pengamatan Sederhana', 'Membaca Intensif Teks Informasi', 'Menggunakan Kalimat Efektif', // Kelas 3
            'Menulis Teks Prosedur', 'Wawancara Sederhana', 'Membandingkan Informasi dari Dua Teks Berbeda', // Kelas 4
            'Menganalisis Teks Paparan Iklan', 'Menulis Teks Narasi Sejarah', 'Berpidato dengan Percaya Diri', // Kelas 5
            'Menulis Teks Eksplanasi', 'Membuat Kesimpulan dari Teks yang Didengar', 'Menyajikan Informasi dalam Bentuk Tabel dan Diagram', // Kelas 6
        ],
        'Matematika': [
            'Membandingkan dan Mengurutkan Bilangan', 'Pengenalan Pola Gambar dan Bilangan', 'Pengukuran Tidak Baku (Jengkal, Depa)', // Kelas 1
            'Perkalian dan Pembagian Bilangan sampai 100', 'Mengenal Satuan Berat (gram, ons, kg)', 'Mengenal Bangun Ruang (Kubus, Balok, Tabung, Bola)', // Kelas 2
            'Pecahan Sederhana (1/2, 1/3, 1/4)', 'Diagram Gambar (Piktogram)', 'Sudut dan Alat Ukurnya (Busur Derajat)', // Kelas 3
            'Operasi Hitung Campuran', 'Keliling dan Luas Bangun Datar (Persegi, Persegi Panjang)', 'Pengolahan Data (Tabel, Diagram Batang)', // Kelas 4
            'Pecahan Desimal dan Persen', 'Jaring-jaring Kubus dan Balok', 'Kecepatan, Jarak, dan Waktu', // Kelas 5
            'Operasi Hitung Bilangan Bulat Negatif', 'Koordinat Kartesius', 'Volume Prisma dan Tabung', // Kelas 6
        ],
        'IPAS': [
            'Kegunaan Air, Api, dan Udara', 'Tempat Hidup Makhluk Hidup (Darat, Air)', 'Perubahan Cuaca (Cerah, Hujan)', // Kelas 1
            'Bagian-bagian Tumbuhan dan Fungsinya', 'Kenampakan Alam (Gunung, Pantai, Sungai)', 'Pentingnya Air, Tanah, dan Matahari bagi Kehidupan', // Kelas 2
            'Perubahan Energi', 'Sifat-sifat Benda dan Kegunaannya', 'Daur Hidup Beberapa Jenis Makhluk Hidup', // Kelas 3
            'Keragaman Hayati Indonesia', 'Pelestarian Sumber Daya Alam', 'Kerajaan Hindu-Buddha di Indonesia', // Kelas 4
            'Organ-organ Penting dalam Tubuh Manusia', 'Adaptasi Makhluk Hidup', 'Perjuangan Melawan Penjajah', // Kelas 5
            'Sistem Kelistrikan dan Magnet', 'Modernisasi dan Perubahan Sosial Masyarakat Indonesia', 'Bumi dan Perubahan Musim', // Kelas 6
        ],
        'Pendidikan Agama & Budi Pekerti': [
            'Rukun Iman', 'Adab Makan dan Minum', 'Kisah Nabi Idris A.S.', // Kelas 1
            'Iman kepada Malaikat Allah', 'Kisah Nabi Ibrahim A.S.', 'Adab kepada Orang Tua dan Guru', // Kelas 2
            'Iman kepada Rasul-rasul Allah', 'Kisah Nabi Musa A.S.', 'Sikap Toleransi dalam Kehidupan', // Kelas 3
        ],
        'Bahasa Inggris': [
            'Family Members', 'Parts of the Body', 'Things in the House', 'Simple Commands (Sit down, Stand up)', // Kelas 1
        ],
        'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)': [
            'Gerak Dasar Non-Lokomotor (Memutar, Mengayun)', 'Permainan dengan Bola', 'Manfaat Istirahat dan Tidur', // Kelas 1
        ],
        'Seni Budaya dan Prakarya (SBDP)': [
            'Mewarnai Gambar', 'Menyanyikan Lagu Anak-anak Nasional', 'Membentuk dari Plastisin/Tanah Liat', // Kelas 1
        ],
        'Bahasa Daerah': [
            'Menyebutkan Nama-nama Hewan dalam Bahasa Daerah', 'Percakapan Singkat Jual Beli di Pasar', // Kelas 1
        ],
        'Tahsin/Tahfidz': [
            'Membaca kata dengan harakat sukun dan tasydid', 'Hafalan Surat Al-Kafirun dan Al-Kautsar', 'Doa Masuk dan Keluar Rumah', // Kelas 1
            'Pengenalan hukum bacaan dasar (Iqlab, Idgham)', 'Hafalan surat-surat pendek (Al-Maun, Al-Quraisy, Al-Fil)', 'Doa ketika hujan', // Kelas 2
        ],
        'Fiqh': [
            'Pengenalan Adzan dan Iqamah', 'Niat dan Syarat Sah Shalat', 'Praktek Dzikir setelah Shalat', // Kelas 1
            'Hal-hal yang Membatalkan Wudu dan Shalat', 'Shalat Berjamaah', 'Pengenalan Puasa Ramadhan', // Kelas 2
        ],
        'Aqidah Akhlak': [
            'Sifat Allah: Maha Pengasih (Ar-Rahman) dan Penyayang (Ar-Rahim)', 'Kisah keteladanan Nabi Adam A.S.', 'Akhlak Terpuji: Hormat kepada Orang Tua dan Guru', // Kelas 1
            'Pengenalan Iman kepada Kitab-kitab Allah', 'Kisah keteladanan Nabi Ibrahim A.S.', 'Menghindari Akhlak Tercela (berbohong, malas)', // Kelas 2
            'Iman kepada Rasul dan Hari Akhir', 'Akhlak Terpuji (Sabar, Syukur, Tawakal)', 'Menghindari Akhlak Tercela (Riya, Sombong, Hasad)', // Kelas 7
        ],
        'Bahasa Arab': [
            'Angka 11-20 dalam Bahasa Arab', 'Warna-warna', 'Anggota tubuh', // Kelas 2
            'Warna-warna dan Sifat', 'Profesi dan Cita-cita', 'Aktivitas Sehari-hari (Al-Ansyithah al-Yaumiyah)', // Kelas 7
        ],
        'Ilmu Pengetahuan Alam (IPA)': [
            'Sistem Organisasi Kehidupan dan Sistem Organ pada Manusia', 'Ekologi dan Interaksi Makhluk Hidup dengan Lingkungannya', 'Sistem Tata Surya dan Bumi sebagai Ruang Kehidupan', 'Getaran, Gelombang, dan Bunyi', // Kelas 7
        ],
        'Ilmu Pengetahuan Sosial (IPS)': [
            'Perubahan Sosial Budaya akibat Globalisasi', 'Sejarah Pergerakan Nasional menuju Kemerdekaan', 'Lembaga Keuangan dan Perdagangan Internasional', // Kelas 7
        ],
        'Prakarya': [
            'Pengolahan Bahan Pangan Setengah Jadi', 'Rekayasa Teknologi Alat Penjernih Air', 'Budidaya Ikan Konsumsi', // Kelas 7
        ],
        'Al-Qur\'an Hadis': [
            'Hukum Bacaan Mad Thabi\'i dan Mad Far\'i', 'Hafalan dan Pemahaman Surat-surat Pendek (Al-Insyirah s/d Al-Alaq)', 'Hadis tentang Menuntut Ilmu', // Kelas 7
        ],
        'Fikih': [
            'Puasa (Wajib dan Sunnah)', 'Zakat (Fitrah dan Mal)', 'Shalat Sunnah Rawatib dan Shalat Id', // Kelas 7
        ],
        'Sejarah Kebudayaan Islam': [
            'Peristiwa Hijrah Nabi Muhammad SAW ke Madinah', 'Membangun Masyarakat melalui Piagam Madinah', 'Sejarah Khulafaur Rasyidin', // Kelas 7
        ],
        'Fisika': [
            'Gerak Melingkar Beraturan', 'Hukum Gravitasi Newton', 'Usaha dan Energi', 'Impuls dan Momentum Linier', // Kelas 10
        ],
        'Kimia': [
            'Termokimia dan Perubahan Entalpi', 'Laju Reaksi dan Faktor-faktor yang Mempengaruhi', 'Kesetimbangan Kimia', 'Larutan Asam Basa', // Kelas 10
        ],
        'Biologi': [
            'Struktur dan Fungsi Jaringan Tumbuhan dan Hewan', 'Sistem Gerak dan Sistem Sirkulasi pada Manusia', 'Ekosistem dan Aliran Energi', // Kelas 10
        ],
        'Ekonomi': [
            'Bank Sentral, Sistem Pembayaran, dan Alat Pembayaran', 'Lembaga Jasa Keuangan', 'Konsep Badan Usaha dan Koperasi', 'Manajemen', // Kelas 10
        ],
        'Geografi': [
            'Dinamika Hidrosfer dan Dampaknya', 'Dinamika Kependudukan di Indonesia', 'Keragaman Budaya dan Pembangunan Nasional', 'Mitigasi Bencana Alam', // Kelas 10
        ],
        'Sosiologi': [
            'Ragam Gejala Sosial dalam Masyarakat', 'Metode Penelitian Sosial', 'Konflik, Kekerasan, dan Perdamaian', 'Integrasi dan Reintegrasi Sosial', // Kelas 10
        ],
        'Sejarah Indonesia': [
            'Kerajaan Islam di Indonesia', 'Proses Masuk dan Berkembangnya Penjajahan Bangsa Eropa', 'Perlawanan Bangsa Indonesia terhadap Kolonialisme', // Kelas 10
        ],
    }
};

function getFase(grade: Grade): string {
    const gradeNum = parseInt(grade, 10);
    if (gradeNum <= 2) return 'A';
    if (gradeNum <= 4) return 'B';
    if (gradeNum <= 6) return 'C';
    if (gradeNum <= 9) return 'D';
    if (gradeNum <= 10) return 'E';
    return 'F';
}

function generateSubjectContent(school: SchoolType, grade: Grade, semester: Semester, title: string): string {
    const schoolName = schoolTypeMap[school] || 'sekolah';
    const fase = getFase(grade);

    let topicsForSemester: string[] = [];
    if (semesterTopics[semester] && semesterTopics[semester][title]) {
        topicsForSemester = semesterTopics[semester][title];
    } else {
        const otherSemester = semester === '1' ? '2' : '1';
        if (semesterTopics[otherSemester] && semesterTopics[otherSemester][title]) {
            topicsForSemester = semesterTopics[otherSemester][title];
        } else {
            topicsForSemester = ['Topik umum sesuai Kurikulum Merdeka'];
        }
    }
    
    const selectedTopics = topicsForSemester.slice(0, 3 + Math.floor(parseInt(grade, 10) / 4)); // More topics for higher grades

    return `Materi pelajaran "${title}" untuk Semester ${semester}, Fase ${fase} (Kelas ${grade}) di ${schoolName}, sesuai Kurikulum Merdeka 2025. Fokus utama mencakup: ${selectedTopics.join(', ')}. "Ayah Jenius" akan menggunakan ringkasan ini untuk membuat konten belajar yang lebih detail, dengan tingkat kesulitan yang disesuaikan untuk kelas ${grade}.`;
}


export function getSubjects(school: SchoolType, grade: Grade, semester: Semester): Subject[] {
  let subjectList: Omit<Subject, 'content'| 'id'>[] = [];
  const gradeNum = parseInt(grade, 10);

  // Determine base subjects by grade level
  if (gradeNum <= 6) {
    subjectList = [...elementarySubjects];
  } else if (gradeNum <= 9) {
    subjectList = [...juniorHighSubjects];
  } else {
    subjectList = [...seniorHighSubjects];
  }
  
  // Add religious subjects based on school type
  if (['SDN', 'SMP', 'SMA'].includes(school)) {
    subjectList.push(religiousSubjects.sd_smp_sma);
  } else if (['SDIT', 'MI'].includes(school)) {
    // For Islamic elementary schools
    subjectList = subjectList.filter(s => s.title !== 'Pendidikan Agama & Budi Pekerti');
    subjectList.push(...religiousSubjects.sdit_mi);
  } else if (['MTs', 'MA'].includes(school)) {
     // For Islamic secondary/high schools
    subjectList = subjectList.filter(s => s.title !== 'Pendidikan Agama & Budi Pekerti');
    subjectList.push(...religiousSubjects.mts_ma);
  }
  
  return subjectList
    .map(s => ({
      ...s,
      id: s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      content: generateSubjectContent(school, grade, semester, s.title)
    }))
    .filter((s, index, self) => 
        index === self.findIndex((t) => (
            t.id === s.id
        ))
    ); // Remove duplicates just in case
}

export const getSubjectById = (school: SchoolType, grade: Grade, semester: Semester, id: string): Subject | undefined => {
  const subjects = getSubjects(school, grade, semester);
  return subjects.find((subject) => subject.id === id);
};
