
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
        'Matematika': ['Bilangan (Cacah, Bulat, Pecahan)', 'Penjumlahan dan Pengurangan', 'Bentuk Geometri Dasar', 'Pengukuran Panjang dan Berat'],
        'Bahasa Indonesia': ['Membaca dan Memahami Teks Narasi', 'Menulis Kalimat Efektif', 'Mengidentifikasi Ide Pokok'],
        'IPAS': ['Rangka dan Panca Indra Manusia', 'Ciri-ciri Makhluk Hidup', 'Wujud Benda dan Perubahannya', 'Kenampakan Alam'],
        'Pendidikan Pancasila': ['Makna dan Penerapan Sila Pancasila', 'Norma dan Aturan di Masyarakat'],
        'Pendidikan Agama & Budi Pekerti': ['Kisah Nabi Adam A.S.', 'Asmaul Husna', 'Tata Cara Wudhu'],
        'Bahasa Inggris': ['Greetings and Introductions', 'Things in the Classroom', 'Family Members'],
        'PJOK': ['Gerak Dasar Lokomotor', 'Permainan Bola Besar (Sepak Bola, Voli)'],
        'Seni Budaya dan Prakarya (SBDP)': ['Menggambar Ilustrasi', 'Lagu Wajib Nasional'],
        'Al-Qur\'an Hadis': ['Hafalan Surat-surat Pendek (An-Nasr, Al-Lahab)', 'Hukum Bacaan Nun Sukun/Tanwin'],
        'Akidah Akhlak': ['Asmaul Husna (Al-Malik, Al-Quddus)', 'Sifat Wajib dan Mustahil bagi Allah'],
        'Fikih': ['Thaharah (Wudhu, Tayammum)', 'Salat Fardhu dan Berjamaah'],
        'Sejarah Kebudayaan Islam': ['Masyarakat Arab Pra-Islam', 'Kelahiran dan Masa Kecil Nabi Muhammad SAW'],
        'Bahasa Arab': ['Perkenalan (Ta\'aruf)', 'Angka 1-20', 'Benda-benda di Sekolah'],
        'Bahasa Daerah': ['Menyimak cerita rakyat lokal', 'Kosakata tentang keluarga dan rumah'],
        // SMP Topics
        'Ilmu Pengetahuan Alam (IPA)': ['Klasifikasi Makhluk Hidup', 'Zat dan Perubahannya (Unsur, Senyawa, Campuran)', 'Suhu dan Kalor', 'Gerak Lurus'],
        'Ilmu Pengetahuan Sosial (IPS)': ['Interaksi Sosial dan Lembaga Sosial', 'Kondisi Geografis Indonesia', 'Kegiatan Ekonomi (Produksi, Distribusi, Konsumsi)'],
        // SMA Topics
        'Fisika': ['Besaran dan Satuan', 'Vektor', 'Kinematika Gerak Lurus (GLB, GLBB)', 'Dinamika Partikel (Hukum Newton)'],
        'Kimia': ['Struktur Atom dan Sistem Periodik', 'Ikatan Kimia', 'Stoikiometri (Konsep Mol)'],
        'Biologi': ['Ruang Lingkup Biologi', 'Keanekaragaman Hayati', 'Virus dan Bakteri'],
        'Ekonomi': ['Konsep Dasar Ilmu Ekonomi', 'Masalah Ekonomi dan Sistem Ekonomi', 'Permintaan, Penawaran, dan Harga Keseimbangan'],
        'Geografi': ['Hakikat Geografi', 'Dinamika Litosfer', 'Atmosfer'],
        'Sosiologi': ['Fungsi Sosiologi sebagai Ilmu', 'Individu, Kelompok, dan Hubungan Sosial'],
        'Sejarah Indonesia': ['Konsep Berpikir Sejarah', 'Zaman Pra-Aksara di Indonesia'],
    },
    '2': {
        // SD Topics
        'Matematika': ['Perkalian dan Pembagian', 'Pecahan dan Desimal', 'Bangun Datar dan Ruang', 'Penyajian Data (Diagram Batang)'],
        'Bahasa Indonesia': ['Memahami Teks Deskripsi dan Prosedur', 'Menulis Puisi dan Surat Pribadi', 'Menyampaikan Kembali Isi Cerita'],
        'IPAS': ['Gaya dan Gerak', 'Sumber Energi dan Perubahannya', 'Siklus Air', 'Kearifan Lokal dan Budaya Daerah'],
        'Pendidikan Pancasila': ['Bhinneka Tunggal Ika', 'Hak dan Kewajiban sebagai Warga Negara', 'Musyawarah untuk Mufakat'],
        'Pendidikan Agama & Budi Pekerti': ['Kisah Nabi Nuh A.S.', 'Iman kepada Malaikat', 'Tata Cara Shalat'],
        'Bahasa Inggris': ['Telling Time', 'Daily Activities', 'Describing Animals'],
        'PJOK': ['Senam Lantai', 'Permainan Bola Kecil (Kasti, Bulu Tangkis)'],
        'Seni Budaya dan Prakarya (SBDP)': ['Membuat Karya Montase dan Kolase', 'Lagu Daerah'],
        'Al-Qur\'an Hadis': ['Hafalan Surat-surat Pendek (Al-Kafirun, Al-Kautsar)', 'Hukum Bacaan Mim Sukun'],
        'Akidah Akhlak': ['Iman kepada Malaikat dan Kitab-kitab Allah', 'Adab terhadap Orang Tua dan Guru'],
        'Fikih': ['Puasa Ramadhan', 'Zakat Fitrah', 'Shalat Sunnah Rawatib'],
        'Sejarah Kebudayaan Islam': ['Dakwah Nabi Muhammad SAW di Mekah dan Madinah', 'Peristiwa Hijrah'],
        'Bahasa Arab': ['Warna-warna', 'Profesi', 'Aktivitas Sehari-hari'],
        'Bahasa Daerah': ['Berbicara menggunakan tingkatan bahasa (jika ada)', 'Menulis kalimat sederhana dengan aksara daerah'],
        // SMP Topics
        'Ilmu Pengetahuan Alam (IPA)': ['Sistem Organisasi Kehidupan', 'Ekologi dan Interaksi', 'Sistem Tata Surya', 'Listrik Statis'],
        'Ilmu Pengetahuan Sosial (IPS)': ['Perubahan Sosial Budaya (Globalisasi)', 'Masa Pergerakan Nasional', 'Lembaga Keuangan'],
         // SMA Topics
        'Fisika': ['Gerak Melingkar', 'Gravitasi Newton', 'Usaha dan Energi', 'Impuls dan Momentum'],
        'Kimia': ['Larutan Elektrolit dan Non-Elektrolit', 'Reaksi Redoks', 'Hidrokarbon dan Minyak Bumi'],
        'Biologi': ['Protista dan Fungi', 'Dunia Tumbuhan (Plantae)', 'Dunia Hewan (Animalia)', 'Ekosistem'],
        'Ekonomi': ['Peran Pelaku Ekonomi', 'Bank Sentral dan Sistem Pembayaran', 'Ketenagakerjaan'],
        'Geografi': ['Hidrosfer dan Dampaknya', 'Dinamika Kependudukan', 'Mitigasi Bencana Alam'],
        'Sosiologi': ['Ragam Gejala Sosial', 'Metode Penelitian Sosial', 'Konflik dan Integrasi Sosial'],
        'Sejarah Indonesia': ['Kerajaan Hindu-Buddha dan Islam di Indonesia', 'Proses Masuknya Penjajahan Bangsa Eropa'],
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
