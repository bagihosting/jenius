
import type { Subject, SchoolType, Grade, Semester } from './types';

// Base subjects applicable to most grades and schools
const baseSubjects: Omit<Subject, 'content' | 'id'>[] = [
  { title: 'Pendidikan Pancasila', icon: 'Landmark' },
  { title: 'Bahasa Indonesia', icon: 'BookOpen' },
  { title: 'Matematika', icon: 'Calculator' },
  { title: 'Bahasa Inggris', icon: 'Languages' },
  { title: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)', icon: 'PersonStanding' },
  { title: 'Seni Budaya dan Prakarya (SBDP)', icon: 'Paintbrush' },
];

// Subjects that vary by school type
const religiousSubjects = {
  sdn_sdit: { title: 'Pendidikan Agama & Budi Pekerti', icon: 'HeartHandshake' },
  mi: [
    { title: 'Al-Qur\'an Hadis', icon: 'BookCopy' },
    { title: 'Akidah Akhlak', icon: 'HeartHandshake' },
    { title: 'Fikih', icon: 'Scale' },
    { title: 'Sejarah Kebudayaan Islam', icon: 'Landmark' },
    { title: 'Bahasa Arab', icon: 'Speech' },
  ]
};

const schoolTypeMap: Record<string, string> = {
  SDN: 'SD Negeri',
  SDIT: 'SD Islam Terpadu',
  MI: 'Madrasah Ibtidaiyah'
};

const semesterTopics: Record<Semester, Record<string, string[]>> = {
    '1': {
        'Matematika': ['Bilangan (Cacah, Bulat, Pecahan)', 'Penjumlahan dan Pengurangan', 'Bentuk Geometri Dasar', 'Pengukuran Panjang dan Berat'],
        'Bahasa Indonesia': ['Membaca dan Memahami Teks Narasi', 'Menulis Kalimat Efektif', 'Mengidentifikasi Ide Pokok'],
        'IPAS': ['Rangka dan Panca Indra Manusia', 'Ciri-ciri Makhluk Hidup', 'Wujud Benda dan Perubahannya'],
        'Ilmu Pengetahuan Alam (IPA)': ['Rangka dan Organ Manusia', 'Sifat-sifat Cahaya', 'Penyesuaian Diri Makhluk Hidup'],
        'Ilmu Pengetahuan Sosial (IPS)': ['Peninggalan Sejarah (Kerajaan Hindu-Buddha)', 'Kenampakan Alam', 'Kegiatan Ekonomi Berdasarkan Sumber Daya Alam'],
        'Pendidikan Pancasila': ['Makna dan Penerapan Sila Pancasila', 'Norma dan Aturan di Masyarakat'],
        'Pendidikan Agama & Budi Pekerti': ['Kisah Nabi Adam A.S.', 'Asmaul Husna', 'Tata Cara Wudhu'],
        'Bahasa Inggris': ['Greetings and Introductions', 'Things in the Classroom', 'Family Members'],
        'PJOK': ['Gerak Dasar Lokomotor', 'Permainan Bola Besar (Sepak Bola, Voli)'],
        'SBDP': ['Menggambar Ilustrasi', 'Lagu Wajib Nasional'],
        'Al-Qur\'an Hadis': ['Hafalan Surat-surat Pendek (An-Nasr, Al-Lahab)', 'Hukum Bacaan Nun Sukun/Tanwin'],
        'Akidah Akhlak': ['Asmaul Husna (Al-Malik, Al-Quddus)', 'Sifat Wajib dan Mustahil bagi Allah'],
        'Fikih': ['Thaharah (Wudhu, Tayammum)', 'Salat Fardhu dan Berjamaah'],
        'Sejarah Kebudayaan Islam': ['Masyarakat Arab Pra-Islam', 'Kelahiran dan Masa Kecil Nabi Muhammad SAW'],
        'Bahasa Arab': ['Perkenalan (Ta\'aruf)', 'Angka 1-20', 'Benda-benda di Sekolah'],
        'Bahasa Daerah': ['Menyimak cerita rakyat lokal', 'Kosakata tentang keluarga dan rumah'],
    },
    '2': {
        'Matematika': ['Perkalian dan Pembagian', 'Pecahan dan Desimal', 'Bangun Datar dan Ruang', 'Penyajian Data (Diagram Batang)'],
        'Bahasa Indonesia': ['Memahami Teks Deskripsi dan Prosedur', 'Menulis Puisi dan Surat Pribadi', 'Menyampaikan Kembali Isi Cerita'],
        'IPAS': ['Gaya dan Gerak', 'Sumber Energi dan Perubahannya', 'Siklus Air', 'Kearifan Lokal dan Budaya Daerah'],
        'Ilmu Pengetahuan Alam (IPA)': ['Sistem Tata Surya', 'Listrik dan Magnet', 'Sistem Pernapasan dan Pencernaan Manusia'],
        'Ilmu Pengetahuan Sosial (IPS)': ['Perjuangan Melawan Penjajah', 'Proklamasi Kemerdekaan', 'Koperasi dan Usaha Ekonomi'],
        'Pendidikan Pancasila': ['Bhinneka Tunggal Ika', 'Hak dan Kewajiban sebagai Warga Negara', 'Musyawarah untuk Mufakat'],
        'Pendidikan Agama & Budi Pekerti': ['Kisah Nabi Nuh A.S.', 'Iman kepada Malaikat', 'Tata Cara Shalat'],
        'Bahasa Inggris': ['Telling Time', 'Daily Activities', 'Describing Animals'],
        'PJOK': ['Senam Lantai', 'Permainan Bola Kecil (Kasti, Bulu Tangkis)'],
        'SBDP': ['Membuat Karya Montase dan Kolase', 'Lagu Daerah'],
        'Al-Qur\'an Hadis': ['Hafalan Surat-surat Pendek (Al-Kafirun, Al-Kautsar)', 'Hukum Bacaan Mim Sukun'],
        'Akidah Akhlak': ['Iman kepada Malaikat dan Kitab-kitab Allah', 'Adab terhadap Orang Tua dan Guru'],
        'Fikih': ['Puasa Ramadhan', 'Zakat Fitrah', 'Shalat Sunnah Rawatib'],
        'Sejarah Kebudayaan Islam': ['Dakwah Nabi Muhammad SAW di Mekah dan Madinah', 'Peristiwa Hijrah'],
        'Bahasa Arab': ['Warna-warna', 'Profesi', 'Aktivitas Sehari-hari'],
        'Bahasa Daerah': ['Berbicara menggunakan tingkatan bahasa (jika ada)', 'Menulis kalimat sederhana dengan aksara daerah'],
    }
};


/**
 * "Generates" subject content based on school, grade, and subject title.
 * This is a "genius" way to avoid hardcoding tons of content.
 * The AI will use this as a seed to generate specific details.
 */
function generateSubjectContent(school: SchoolType, grade: Grade, semester: Semester, title: string): string {
    const schoolName = schoolTypeMap[school] || 'sekolah';
    const gradeNumber = parseInt(grade, 10);
    const fase = gradeNumber <= 2 ? 'A' : gradeNumber <= 4 ? 'B' : 'C';

    const topicsForSemester = semesterTopics[semester][title] || semesterTopics[semester === '1' ? '2' : '1'][title] || ['Topik umum sesuai Kurikulum Merdeka'];
    const selectedTopics = topicsForSemester.slice(0, 3 + Math.floor(gradeNumber / 2)); // More topics for higher grades

    return `Materi pelajaran "${title}" untuk Semester ${semester}, Fase ${fase} (Kelas ${grade}) di ${schoolName}, sesuai Kurikulum Merdeka. Fokus utama mencakup: ${selectedTopics.join(', ')}. "Ayah Tirta" akan menggunakan ringkasan ini untuk membuat konten belajar yang lebih detail, dengan tingkat kesulitan yang disesuaikan untuk kelas ${grade}.`;
}


export function getSubjects(school: SchoolType, grade: Grade, semester: Semester): Subject[] {
  let subjectList: Omit<Subject, 'content'| 'id'>[] = [...baseSubjects];

  // Add Muatan Lokal (optional)
  subjectList.push({ title: 'Bahasa Daerah', icon: 'LanguageIcon' });

  // Logic for science subjects based on grade
  const gradeNum = parseInt(grade, 10);
  if (gradeNum >= 4) { // Kelas 4, 5, 6 (Fase C)
      subjectList.push({ title: 'Ilmu Pengetahuan Alam (IPA)', icon: 'Atom' });
      subjectList.push({ title: 'Ilmu Pengetahuan Sosial (IPS)', icon: 'Users' });
  } else { // Kelas 1, 2, 3 (Fase A & B)
      subjectList.push({ title: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)', icon: 'FlaskConical' });
  }

  // Logic for school type
  switch (school) {
    case 'SDN':
      subjectList.push(religiousSubjects.sdn_sdit);
      break;
    case 'SDIT':
       subjectList.push(religiousSubjects.sdn_sdit);
       subjectList.push({ title: 'Bahasa Arab', icon: 'Speech' });
       // SDIT often has more intensive Quran studies
       subjectList.push({ title: 'Al-Qur\'an Hadis', icon: 'BookCopy' });
      break;
    case 'MI':
      // MI has specific islamic subjects instead of the general one.
      subjectList.push(...religiousSubjects.mi);
      break;
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
