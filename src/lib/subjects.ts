
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
        // SD Topics
        'Matematika': ['Bilangan Cacah hingga 10.000', 'Penjumlahan dan Pengurangan', 'Bentuk Geometri Dasar', 'Pengukuran Panjang dan Berat'],
        'Bahasa Indonesia': ['Membaca dan Memahami Teks Narasi', 'Menulis Kalimat Efektif', 'Mengidentifikasi Ide Pokok Paragraf'],
        'IPAS': ['Rangka dan Panca Indra Manusia', 'Ciri-ciri Makhluk Hidup', 'Wujud Benda dan Perubahannya', 'Kenampakan Alam dan Buatan'],
        'Pendidikan Pancasila': ['Makna dan Penerapan Sila Pancasila', 'Norma dan Aturan di Masyarakat', 'Gotong Royong'],
        'Pendidikan Agama & Budi Pekerti': ['Kisah Nabi Adam A.S. dan Nabi Idris A.S.', 'Mengenal Asmaul Husna', 'Tata Cara Wudhu dan Tayamum'],
        'Bahasa Inggris': ['Greetings and Introductions', 'Things in the Classroom', 'Family Members', 'Colors and Numbers'],
        'PJOK': ['Gerak Dasar Lokomotor (Jalan, Lari, Lompat)', 'Permainan Bola Besar (Sepak Bola, Voli)'],
        'Seni Budaya dan Prakarya (SBDP)': ['Menggambar Ilustrasi dan Dekoratif', 'Lagu Wajib Nasional', 'Membuat Kerajinan dari Bahan Alam'],
        'Bahasa Daerah': ['Menyimak cerita rakyat lokal', 'Kosakata tentang keluarga dan rumah', 'Unggah-ungguh basa (Sopan santun berbahasa)'],
        
        // SMP & MTs Topics (Fase D)
        'Ilmu Pengetahuan Alam (IPA)': ['Hakikat Ilmu Sains dan Metode Ilmiah', 'Zat dan Perubahannya (Unsur, Senyawa, Campuran)', 'Suhu, Kalor, dan Pemuaian', 'Gerak Lurus dan Gaya'],
        'Ilmu Pengetahuan Sosial (IPS)': ['Keruangan dan Interaksi Antarruang', 'Interaksi Sosial dan Lembaga Sosial', 'Kegiatan Ekonomi (Produksi, Distribusi, Konsumsi)'],
        'Prakarya': ['Kerajinan Serat dan Tekstil', 'Rekayasa Teknologi Konstruksi Miniatur Rumah', 'Budidaya Tanaman Sayuran'],

        // SMA & MA Topics (Fase E & F)
        'Fisika': ['Besaran, Satuan, dan Pengukuran', 'Analisis Vektor', 'Kinematika Gerak Lurus (GLB, GLBB)', 'Dinamika Partikel (Hukum Newton)'],
        'Kimia': ['Hakikat dan Peran Ilmu Kimia', 'Struktur Atom dan Sistem Periodik Unsur', 'Ikatan Kimia dan Bentuk Molekul', 'Stoikiometri (Konsep Mol)'],
        'Biologi': ['Ruang Lingkup Biologi dan Kerja Ilmiah', 'Keanekaragaman Hayati, Klasifikasi, dan Virus', 'Struktur dan Fungsi Sel'],
        'Ekonomi': ['Konsep Dasar Ilmu Ekonomi', 'Masalah Pokok Ekonomi dan Sistem Ekonomi', 'Peran Pelaku Ekonomi dalam Kegiatan Ekonomi', 'Permintaan, Penawaran, dan Keseimbangan Pasar'],
        'Geografi': ['Hakikat Ilmu Geografi', 'Dinamika Litosfer dan Dampaknya terhadap Kehidupan', 'Dinamika Atmosfer dan Dampaknya'],
        'Sosiologi': ['Fungsi Sosiologi sebagai Ilmu Mengkaji Gejala Sosial', 'Individu, Kelompok, dan Hubungan Sosial', 'Rancangan Penelitian Sosial Sederhana'],
        'Sejarah Indonesia': ['Pengantar Ilmu Sejarah', 'Asal-usul Nenek Moyang dan Jalur Rempah di Indonesia', 'Kerajaan Hindu-Buddha di Indonesia'],

        // Religious Subjects for MI, MTs, MA
        'Al-Qur\'an Hadis': ['Hukum Bacaan Nun Sukun/Tanwin dan Mim Sukun', 'Hafalan dan Pemahaman Surat-surat Pendek (An-Nas s/d Ad-Dhuha)', 'Hadis tentang Niat dan Ikhlas'],
        'Akidah Akhlak': ['Dasar dan Tujuan Akidah Islam', 'Asmaul Husna (Al-Alim, Al-Khabir, As-Sami, Al-Basir)', 'Sifat Wajib, Mustahil, dan Jaiz bagi Allah'],
        'Fikih': ['Thaharah (Bersuci dari Hadas dan Najis)', 'Salat Fardhu dan Berjamaah', 'Azan dan Iqamah'],
        'Sejarah Kebudayaan Islam': ['Misi dan Strategi Dakwah Nabi Muhammad SAW di Mekah', 'Kondisi Masyarakat Arab Pra-Islam'],
        'Bahasa Arab': ['Perkenalan (Ta\'aruf)', 'Angka 1-50', 'Benda-benda di Sekolah dan Rumah (Al-Adawat al-Madrasiyah wal-Baitiyah)'],
    },
    '2': {
        // SD Topics
        'Matematika': ['Perkalian dan Pembagian', 'Pecahan Senilai dan Desimal', 'Bangun Datar dan Ruang', 'Analisis dan Penyajian Data (Diagram Batang, Piktogram)'],
        'Bahasa Indonesia': ['Memahami Teks Deskripsi dan Prosedur', 'Menulis Puisi dan Surat Pribadi', 'Menyampaikan Kembali Isi Cerita dengan Efektif'],
        'IPAS': ['Gaya dan Pengaruhnya terhadap Benda', 'Sumber Energi dan Perubahannya', 'Siklus Air dan Dampaknya', 'Kearifan Lokal dan Kekayaan Budaya Indonesia'],
        'Pendidikan Pancasila': ['Makna Bhinneka Tunggal Ika', 'Hak dan Kewajiban sebagai Warga Negara', 'Praktik Musyawarah untuk Mufakat'],
        'Pendidikan Agama & Budi Pekerti': ['Kisah Nabi Nuh A.S. dan Nabi Ibrahim A.S.', 'Iman kepada Malaikat dan Kitab-kitab Allah', 'Tata Cara dan Bacaan Shalat'],
        'Bahasa Inggris': ['Telling Time and Daily Activities', 'Describing People and Animals', 'Public Places', 'Simple Present Tense'],
        'PJOK': ['Gerak Berirama (Senam Lantai)', 'Permainan Bola Kecil (Kasti, Bulu Tangkis)', 'Dasar-dasar Renang'],
        'Seni Budaya dan Prakarya (SBDP)': ['Membuat Karya Montase, Kolase, dan Mozaik', 'Lagu Daerah dan Alat Musik Tradisional', 'Membuat Produk Kerajinan dari Bahan Bekas'],
        'Bahasa Daerah': ['Berbicara menggunakan tingkatan bahasa (jika ada)', 'Menulis kalimat sederhana dengan aksara daerah (jika ada)'],

        // SMP & MTs Topics (Fase D)
        'Ilmu Pengetahuan Alam (IPA)': ['Sistem Organisasi Kehidupan dan Sistem Organ pada Manusia', 'Ekologi dan Interaksi Makhluk Hidup dengan Lingkungannya', 'Sistem Tata Surya dan Bumi sebagai Ruang Kehidupan', 'Getaran, Gelombang, dan Bunyi'],
        'Ilmu Pengetahuan Sosial (IPS)': ['Perubahan Sosial Budaya akibat Globalisasi', 'Sejarah Pergerakan Nasional menuju Kemerdekaan', 'Lembaga Keuangan dan Perdagangan Internasional'],
        'Prakarya': ['Pengolahan Bahan Pangan Setengah Jadi', 'Rekayasa Teknologi Alat Penjernih Air', 'Budidaya Ikan Konsumsi'],

        // SMA & MA Topics (Fase E & F)
        'Fisika': ['Gerak Melingkar Beraturan', 'Hukum Gravitasi Newton', 'Usaha dan Energi', 'Impuls dan Momentum Linier'],
        'Kimia': ['Termokimia dan Perubahan Entalpi', 'Laju Reaksi dan Faktor-faktor yang Mempengaruhi', 'Kesetimbangan Kimia', 'Larutan Asam Basa'],
        'Biologi': ['Struktur dan Fungsi Jaringan Tumbuhan dan Hewan', 'Sistem Gerak dan Sistem Sirkulasi pada Manusia', 'Ekosistem dan Aliran Energi'],
        'Ekonomi': ['Bank Sentral, Sistem Pembayaran, dan Alat Pembayaran', 'Lembaga Jasa Keuangan', 'Konsep Badan Usaha dan Koperasi', 'Manajemen'],
        'Geografi': ['Dinamika Hidrosfer dan Dampaknya', 'Dinamika Kependudukan di Indonesia', 'Keragaman Budaya dan Pembangunan Nasional', 'Mitigasi Bencana Alam'],
        'Sosiologi': ['Ragam Gejala Sosial dalam Masyarakat', 'Metode Penelitian Sosial', 'Konflik, Kekerasan, dan Perdamaian', 'Integrasi dan Reintegrasi Sosial'],
        'Sejarah Indonesia': ['Kerajaan Islam di Indonesia', 'Proses Masuk dan Berkembangnya Penjajahan Bangsa Eropa', 'Perlawanan Bangsa Indonesia terhadap Kolonialisme'],
        
        // Religious Subjects for MI, MTs, MA
        'Al-Qur\'an Hadis': ['Hukum Bacaan Mad Thabi\'i dan Mad Far\'i', 'Hafalan dan Pemahaman Surat-surat Pendek (Al-Insyirah s/d Al-Alaq)', 'Hadis tentang Kebersihan dan Menuntut Ilmu'],
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

    const topicsForSemester = semesterTopics[semester][title] || semesterTopics[semester === '1' ? '2' : '1'][title] || ['Topik umum sesuai Kurikulum Merdeka'];
    const selectedTopics = topicsForSemester.slice(0, 3 + Math.floor(parseInt(grade, 10) / 3)); // More topics for higher grades

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
  } else if (['SDIT'].includes(school)) {
    subjectList.push(religiousSubjects.sd_smp_sma);
    subjectList.push({ title: 'Bahasa Arab', icon: 'Speech' });
    subjectList.push({ title: 'Al-Qur\'an Hadis', icon: 'BookCopy' });
  } else if (['MI', 'MTs', 'MA'].includes(school)) {
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
