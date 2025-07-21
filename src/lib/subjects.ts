
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
  mi_mts_ma: [
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
        // --- KELAS 1 (FASE A) ---
        'Pendidikan Pancasila': ['Aturan di Rumah dan di Sekolah', 'Penerapan Sila Pancasila dalam Kehidupan Sehari-hari', 'Simbol-simbol Pancasila'],
        'Bahasa Indonesia': ['Membaca dan Menulis Permulaan', 'Mengenal Huruf dan Suku Kata', 'Menyebutkan Benda-benda di Sekitar'],
        'Matematika': ['Bilangan Cacah sampai dengan 20', 'Penjumlahan dan Pengurangan Sederhana (di bawah 20)', 'Mengenal Bentuk Bangun Datar'],
        'IPAS': ['Anggota Tubuh dan Pancaindra', 'Benda Hidup dan Benda Tak Hidup di Sekitar Kita', 'Peristiwa Siang dan Malam'],
        'Pendidikan Agama & Budi Pekerti': ['Rukun Islam dan Dua Kalimat Syahadat', 'Mengenal Huruf Hijaiyah', 'Kisah Nabi Adam A.S.'],
        'Bahasa Inggris': ['Alphabets and Numbers', 'Greetings and Self-Introduction', 'Colors', 'Animals'],
        'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)': ['Gerak Dasar Lokomotor (Berjalan, Berlari, Melompat)', 'Permainan Sederhana Tanpa Alat', 'Menjaga Kebersihan Tubuh'],
        'Seni Budaya dan Prakarya (SBDP)': ['Menggambar Ekspresif', 'Mengenal Bunyi dan Irama', 'Membuat Karya dari Bahan Alam'],
        'Bahasa Daerah': ['Menyimak Dongeng Lokal', 'Menyebutkan Nama Anggota Keluarga dalam Bahasa Daerah', 'Ungkapan Sapaan Sederhana'],

        // --- KELAS 2 (FASE A) ---
        'Pendidikan Pancasila': [ 'Hak dan kewajiban di rumah dan sekolah', 'Aturan dan tata tertib', 'Kerja sama dan gotong royong', 'Menghargai perbedaan teman', 'Musyawarah sederhana'],
        'Bahasa Indonesia': [ 'Membaca lancar teks pendek', 'Menulis kalimat sederhana dengan huruf tegak bersambung', 'Menggunakan kata tanya (apa, siapa, di mana)', 'Menceritakan kembali isi dongeng'],
        'Matematika': [ 'Bilangan cacah sampai 500', 'Nilai tempat ratusan, puluhan, satuan', 'Penjumlahan dan pengurangan (dengan/tanpa meminjam)', 'Pengukuran waktu (jam, hari) dan panjang (cm, m)'],
        'IPAS': ['Wujud Benda (Padat, Cair, Gas)', 'Perubahan Wujud Benda (Mencair, Membeku)', 'Siklus Hidup Hewan (Kupu-kupu, Ayam)', 'Sumber Energi dan Kegunaannya'],
        'Pendidikan Agama & Budi Pekerti': [ 'Asmaul Husna (Ar-Rahman, Ar-Rahim)', 'Kisah Nabi Nuh A.S.', 'Belajar Wudu dengan Benar'],

        // --- KELAS 3 (FASE B) ---
        'Pendidikan Pancasila': ['Makna Simbol Sila-Sila Pancasila', 'Norma dan Aturan di Masyarakat', 'Pentingnya Persatuan dalam Keberagaman'],
        'Bahasa Indonesia': ['Mengidentifikasi Informasi dari Teks Narasi', 'Menulis Paragraf Sederhana', 'Menggunakan Tanda Baca (Titik, Koma)'],
        'Matematika': ['Bilangan Cacah sampai 1.000', 'Operasi Perkalian dan Pembagian Dasar', 'Satuan Baku (Berat: gram, kg; Waktu: menit, jam)'],
        'IPAS': ['Ciri-ciri Makhluk Hidup', 'Sistem Pencernaan Manusia secara Sederhana', 'Rangkaian Listrik Sederhana'],

        // --- KELAS 4 (FASE B) ---
        'Pendidikan Pancasila': ['Hak dan Kewajiban sebagai Warga Sekolah dan Masyarakat', 'Bentuk-bentuk Keragaman Suku, Agama, dan Budaya', 'Pentingnya Musyawarah Mufakat'],
        'Bahasa Indonesia': ['Menemukan Gagasan Pokok dalam Teks', 'Membuat Peta Pikiran (Mind Map)', 'Menulis Petunjuk Penggunaan Sesuatu'],
        'Matematika': ['Pecahan Senilai', 'Faktor dan Kelipatan Bilangan (FPB & KPK)', 'Bangun Datar (Segi Banyak Beraturan dan Tidak Beraturan)'],
        'IPAS': ['Gaya dan Gerak', 'Sifat-sifat Bunyi dan Cahaya', 'Bentuk-Bentuk Energi dan Perubahannya'],

        // --- KELAS 5 (FASE C) ---
        'Pendidikan Pancasila': ['Keutuhan Negara Kesatuan Republik Indonesia (NKRI)', 'Manfaat Gotong Royong dan Persatuan', 'Organisasi di Lingkungan Sekolah dan Masyarakat'],
        'Bahasa Indonesia': ['Mengidentifikasi Informasi dari Teks Iklan Media Cetak/Elektronik', 'Menulis Surat Resmi Sederhana', 'Membuat Ringkasan dari Teks Bacaan'],
        'Matematika': ['Operasi Hitung Pecahan (Penjumlahan, Pengurangan)', 'Skala dan Denah Sederhana', 'Volume Kubus dan Balok'],
        'IPAS': ['Sistem Pernapasan pada Manusia dan Hewan', 'Sistem Peredaran Darah Manusia', 'Siklus Air dan Ekosistem'],

        // --- KELAS 6 (FASE C) ---
        'Pendidikan Pancasila': ['Penerapan Nilai-nilai Pancasila dari Sila ke-1 sampai ke-5', 'Peran Indonesia dalam Lingkup ASEAN', 'Menghadapi Era Globalisasi'],
        'Bahasa Indonesia': ['Menyimpulkan Informasi dari Teks Laporan Hasil Pengamatan', 'Menulis Teks Pidato Singkat', 'Mengisi Formulir'],
        'Matematika': ['Bilangan Bulat (Penjumlahan, Pengurangan)', 'Luas dan Keliling Lingkaran', 'Penyajian dan Pengolahan Data (Mean, Modus, Median)'],
        'IPAS': ['Perkembangbiakan Tumbuhan dan Hewan', 'Sistem Tata Surya dan Planet', 'Ciri-ciri Pubertas pada Laki-laki dan Perempuan'],

        // --- KELAS 7 (FASE D) - SMP/MTs ---
        'Ilmu Pengetahuan Alam (IPA)': ['Hakikat Ilmu Sains dan Metode Ilmiah', 'Zat dan Perubahannya (Unsur, Senyawa, Campuran)', 'Suhu, Kalor, dan Pemuaian', 'Gerak Lurus dan Gaya'],
        'Ilmu Pengetahuan Sosial (IPS)': ['Keruangan dan Interaksi Antarruang', 'Interaksi Sosial dan Lembaga Sosial', 'Kegiatan Ekonomi (Produksi, Distribusi, Konsumsi)'],
        'Prakarya': ['Kerajinan Serat dan Tekstil', 'Rekayasa Teknologi Konstruksi Miniatur Rumah', 'Budidaya Tanaman Sayuran'],

        // --- KELAS 10 (FASE E) - SMA/MA ---
        'Fisika': ['Besaran, Satuan, dan Pengukuran', 'Analisis Vektor', 'Kinematika Gerak Lurus (GLB, GLBB)', 'Dinamika Partikel (Hukum Newton)'],
        'Kimia': ['Hakikat dan Peran Ilmu Kimia', 'Struktur Atom dan Sistem Periodik Unsur', 'Ikatan Kimia dan Bentuk Molekul', 'Stoikiometri (Konsep Mol)'],
        'Biologi': ['Ruang Lingkup Biologi dan Kerja Ilmiah', 'Keanekaragaman Hayati, Klasifikasi, dan Virus', 'Struktur dan Fungsi Sel'],
        'Ekonomi': ['Konsep Dasar Ilmu Ekonomi', 'Masalah Pokok Ekonomi dan Sistem Ekonomi', 'Peran Pelaku Ekonomi dalam Kegiatan Ekonomi', 'Permintaan, Penawaran, dan Keseimbangan Pasar'],
        'Geografi': ['Hakikat Ilmu Geografi', 'Dinamika Litosfer dan Dampaknya terhadap Kehidupan', 'Dinamika Atmosfer dan Dampaknya'],
        'Sosiologi': ['Fungsi Sosiologi sebagai Ilmu Mengkaji Gejala Sosial', 'Individu, Kelompok, dan Hubungan Sosial', 'Rancangan Penelitian Sosial Sederhana'],
        'Sejarah Indonesia': ['Pengantar Ilmu Sejarah', 'Asal-usul Nenek Moyang dan Jalur Rempah di Indonesia', 'Kerajaan Hindu-Buddha di Indonesia'],

        // --- Religious Subjects for MI, MTs, MA, SDIT ---
        'Al-Qur\'an Hadis': ['Membaca dan Menulis Huruf Hijaiyah', 'Hafalan Surat-surat Pendek (Al-Fatihah, An-Nas, Al-Falaq, Al-Ikhlas)', 'Hadis tentang Kebersihan'],
        'Akidah Akhlak': ['Dua Kalimat Syahadat', 'Asmaul Husna (Ar-Rahman, Ar-Rahim)', 'Akhlak Terpuji (Jujur, Disiplin)'],
        'Fikih': ['Rukun Islam', 'Bersuci (Istinja dan Wudu)', 'Praktik Gerakan dan Bacaan Salat'],
        'Sejarah Kebudayaan Islam': ['Masa Kanak-kanak Nabi Muhammad SAW', 'Peristiwa Sebelum Kenabian (Tahun Gajah)'],
        'Bahasa Arab': ['Perkenalan (Taaruf)', 'Angka 1-10 dalam Bahasa Arab', 'Benda-benda di Kelas'],
    },
    '2': {
        // --- KELAS 1 (FASE A) ---
        'Pendidikan Pancasila': ['Identitas Diri dan Keluarga', 'Menghargai Perbedaan Teman', 'Aturan Saat Bermain Bersama Teman'],
        'Bahasa Indonesia': ['Mendeskripsikan Benda Secara Lisan', 'Menulis Kalimat Tunggal Sederhana', 'Memahami Isi Puisi Anak'],
        'Matematika': ['Membandingkan dan Mengurutkan Bilangan', 'Pengenalan Pola Gambar dan Bilangan', 'Pengukuran Tidak Baku (Jengkal, Depa)'],
        'IPAS': ['Kegunaan Air, Api, dan Udara', 'Tempat Hidup Makhluk Hidup (Darat, Air)', 'Perubahan Cuaca (Cerah, Hujan)'],
        'Pendidikan Agama & Budi Pekerti': ['Rukun Iman', 'Adab Makan dan Minum', 'Kisah Nabi Idris A.S.'],
        'Bahasa Inggris': ['Family Members', 'Parts of the Body', 'Things in the House', 'Simple Commands (Sit down, Stand up)'],
        'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)': ['Gerak Dasar Non-Lokomotor (Memutar, Mengayun)', 'Permainan dengan Bola', 'Manfaat Istirahat dan Tidur'],
        'Seni Budaya dan Prakarya (SBDP)': ['Mewarnai Gambar', 'Menyanyikan Lagu Anak-anak Nasional', 'Membentuk dari Plastisin/Tanah Liat'],
        'Bahasa Daerah': ['Menyebutkan Nama-nama Hewan dalam Bahasa Daerah', 'Percakapan Singkat Jual Beli di Pasar'],
        
        // --- KELAS 2 (FASE A) ---
        'Pendidikan Pancasila': ['Lambang Negara Garuda Pancasila', 'Bhinneka Tunggal Ika', 'Menjaga Kebersihan Lingkungan', 'Contoh Perilaku Sesuai Sila Pancasila'],
        'Bahasa Indonesia': ['Menggunakan Huruf Kapital di Awal Kalimat dan Nama Diri', 'Menulis Cerita Pendek Berdasarkan Gambar', 'Membaca Puisi dengan Intonasi yang Tepat'],
        'Matematika': ['Perkalian dan Pembagian Bilangan sampai 100', 'Mengenal Satuan Berat (gram, ons, kg)', 'Mengenal Bangun Ruang (Kubus, Balok, Tabung, Bola)'],
        'IPAS': ['Bagian-bagian Tumbuhan dan Fungsinya', 'Kenampakan Alam (Gunung, Pantai, Sungai)', 'Pentingnya Air, Tanah, dan Matahari bagi Kehidupan'],
        'Pendidikan Agama & Budi Pekerti': ['Iman kepada Malaikat Allah', 'Kisah Nabi Ibrahim A.S.', 'Adab kepada Orang Tua dan Guru'],

        // --- KELAS 3 (FASE B) ---
        'Pendidikan Pancasila': ['Lambang dan Simbol Negara (Bendera, Bahasa, Lagu Kebangsaan)', 'Menghargai Jasa Pahlawan', 'Kerja Kelompok dan Tanggung Jawab'],
        'Bahasa Indonesia': ['Menulis Laporan Pengamatan Sederhana', 'Membaca Intensif Teks Informasi', 'Menggunakan Kalimat Efektif'],
        'Matematika': ['Pecahan Sederhana (1/2, 1/3, 1/4)', 'Diagram Gambar (Piktogram)', 'Sudut dan Alat Ukurnya (Busur Derajat)'],
        'IPAS': ['Perubahan Energi', 'Sifat-sifat Benda dan Kegunaannya', 'Daur Hidup Beberapa Jenis Makhluk Hidup'],

        // --- KELAS 4 (FASE B) ---
        'Pendidikan Pancasila': ['Pemerintahan Desa dan Kecamatan', 'Mengenal Lembaga-lembaga Negara', 'Cinta Produk Indonesia'],
        'Bahasa Indonesia': ['Menulis Teks Prosedur', 'Wawancara Sederhana', 'Membandingkan Informasi dari Dua Teks Berbeda'],
        'Matematika': ['Operasi Hitung Campuran', 'Keliling dan Luas Bangun Datar (Persegi, Persegi Panjang)', 'Pengolahan Data (Tabel, Diagram Batang)'],
        'IPAS': ['Keragaman Hayati Indonesia', 'Pelestarian Sumber Daya Alam', 'Kerajaan Hindu-Buddha di Indonesia'],

        // --- KELAS 5 (FASE C) ---
        'Pendidikan Pancasila': ['Peristiwa Proklamasi Kemerdekaan', 'Peran Tokoh-tokoh dalam Kemerdekaan', 'Tantangan dalam Menjaga Keutuhan NKRI'],
        'Bahasa Indonesia': ['Menganalisis Teks Paparan Iklan', 'Menulis Teks Narasi Sejarah', 'Berpidato dengan Percaya Diri'],
        'Matematika': ['Pecahan Desimal dan Persen', 'Jaring-jaring Kubus dan Balok', 'Kecepatan, Jarak, dan Waktu'],
        'IPAS': ['Organ-organ Penting dalam Tubuh Manusia', 'Adaptasi Makhluk Hidup', 'Perjuangan Melawan Penjajah'],

        // --- KELAS 6 (FASE C) ---
        'Pendidikan Pancasila': ['Sistem Pemerintahan Indonesia', 'Peran Indonesia di Dunia Internasional', 'Dampak Positif dan Negatif Kemajuan Teknologi'],
        'Bahasa Indonesia': ['Menulis Teks Eksplanasi', 'Membuat Kesimpulan dari Teks yang Didengar', 'Menyajikan Informasi dalam Bentuk Tabel dan Diagram'],
        'Matematika': ['Operasi Hitung Bilangan Bulat Negatif', 'Koordinat Kartesius', 'Volume Prisma dan Tabung'],
        'IPAS': ['Sistem Kelistrikan dan Magnet', 'Modernisasi dan Perubahan Sosial Masyarakat Indonesia', 'Bumi dan Perubahan Musim'],

        // --- KELAS 7 (FASE D) - SMP/MTs ---
        'Ilmu Pengetahuan Alam (IPA)': ['Sistem Organisasi Kehidupan dan Sistem Organ pada Manusia', 'Ekologi dan Interaksi Makhluk Hidup dengan Lingkungannya', 'Sistem Tata Surya dan Bumi sebagai Ruang Kehidupan', 'Getaran, Gelombang, dan Bunyi'],
        'Ilmu Pengetahuan Sosial (IPS)': ['Perubahan Sosial Budaya akibat Globalisasi', 'Sejarah Pergerakan Nasional menuju Kemerdekaan', 'Lembaga Keuangan dan Perdagangan Internasional'],
        'Prakarya': ['Pengolahan Bahan Pangan Setengah Jadi', 'Rekayasa Teknologi Alat Penjernih Air', 'Budidaya Ikan Konsumsi'],

        // --- KELAS 10 (FASE E) - SMA/MA ---
        'Fisika': ['Gerak Melingkar Beraturan', 'Hukum Gravitasi Newton', 'Usaha dan Energi', 'Impuls dan Momentum Linier'],
        'Kimia': ['Termokimia dan Perubahan Entalpi', 'Laju Reaksi dan Faktor-faktor yang Mempengaruhi', 'Kesetimbangan Kimia', 'Larutan Asam Basa'],
        'Biologi': ['Struktur dan Fungsi Jaringan Tumbuhan dan Hewan', 'Sistem Gerak dan Sistem Sirkulasi pada Manusia', 'Ekosistem dan Aliran Energi'],
        'Ekonomi': ['Bank Sentral, Sistem Pembayaran, dan Alat Pembayaran', 'Lembaga Jasa Keuangan', 'Konsep Badan Usaha dan Koperasi', 'Manajemen'],
        'Geografi': ['Dinamika Hidrosfer dan Dampaknya', 'Dinamika Kependudukan di Indonesia', 'Keragaman Budaya dan Pembangunan Nasional', 'Mitigasi Bencana Alam'],
        'Sosiologi': ['Ragam Gejala Sosial dalam Masyarakat', 'Metode Penelitian Sosial', 'Konflik, Kekerasan, dan Perdamaian', 'Integrasi dan Reintegrasi Sosial'],
        'Sejarah Indonesia': ['Kerajaan Islam di Indonesia', 'Proses Masuk dan Berkembangnya Penjajahan Bangsa Eropa', 'Perlawanan Bangsa Indonesia terhadap Kolonialisme'],
        
        // --- Religious Subjects for MI, MTs, MA ---
        'Al-Qur\'an Hadis': ['Hukum Bacaan Mad Thabi\'i dan Mad Far\'i', 'Hafalan dan Pemahaman Surat-surat Pendek (Al-Insyirah s/d Al-Alaq)', 'Hadis tentang Menuntut Ilmu'],
        'Akidah Akhlak': ['Iman kepada Rasul dan Hari Akhir', 'Akhlak Terpuji (Sabar, Syukur, Tawakal)', 'Menghindari Akhlak Tercela (Riya, Sombong, Hasad)'],
        'Fikih': ['Puasa (Wajib dan Sunnah)', 'Zakat (Fitrah dan Mal)', 'Shalat Sunnah Rawatib dan Shalat Id'],
        'Sejarah Kebudayaan Islam': ['Peristiwa Hijrah Nabi Muhammad SAW ke Madinah', 'Membangun Masyarakat melalui Piagam Madinah', 'Sejarah Khulafaur Rasyidin'],
        'Bahasa Arab': ['Warna-warna dan Sifat', 'Profesi dan Cita-cita', 'Aktivitas Sehari-hari (Al-Ansyithah al-Yaumiyah)'],
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
  } else if (['SDIT', 'MI', 'MTs', 'MA'].includes(school)) {
    // For Islamic schools, replace the general PAI with specific subjects.
    subjectList = subjectList.filter(s => s.title !== 'Pendidikan Agama & Budi Pekerti');
    subjectList.push(...religiousSubjects.mi_mts_ma);
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
