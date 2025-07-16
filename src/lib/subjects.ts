import type { Subject, SchoolType, Grade } from './types';

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

/**
 * "Generates" subject content based on school, grade, and subject title.
 * This is a "genius" way to avoid hardcoding tons of content.
 * The AI will use this as a seed to generate specific details.
 */
function generateSubjectContent(school: SchoolType, grade: Grade, title: string): string {
    const schoolName = schoolTypeMap[school] || 'sekolah';
    const gradeNumber = parseInt(grade, 10);
    const fase = gradeNumber <= 2 ? 'A' : gradeNumber <= 4 ? 'B' : 'C';

    // Topics for Lower Grades (Fase A & B)
    const lowerGradeTopics: { [key: string]: string[] } = {
        'Matematika': ['Bilangan cacah sampai 1.000', 'Penjumlahan & Pengurangan', 'Bentuk geometri dasar', 'Pengukuran panjang dan waktu'],
        'Bahasa Indonesia': ['Membaca dan menulis permulaan', 'Memahami isi bacaan sederhana', 'Menulis kalimat sederhana'],
        'IPAS': ['Bagian tubuh dan panca indra', 'Ciri-ciri makhluk hidup', 'Lingkungan sekitar', 'Perubahan wujud benda', 'Cerita dan kearifan lokal'],
        'Pendidikan Pancasila': ['Simbol-simbol Pancasila', 'Aturan di rumah dan sekolah', 'Menghargai perbedaan', 'Gotong royong'],
    };

    // Topics for Higher Grades (Fase C)
    const higherGradeTopics: { [key: string]: string[] } = {
        'Matematika': ['Bilangan cacah besar, pecahan, dan desimal', 'Operasi hitung campuran', 'Sifat-sifat bangun datar dan ruang', 'Analisis data (diagram batang & lingkaran)'],
        'Bahasa Indonesia': ['Memahami teks informasional dan fiksi', 'Menulis laporan dan teks argumentasi', 'Menyampaikan pendapat secara efektif'],
        'Ilmu Pengetahuan Alam (IPA)': ['Rangka dan organ tubuh', 'Sistem pernapasan dan pencernaan', 'Sifat benda dan perubahannya', 'Gaya, gerak, dan energi', 'Siklus air dan ekosistem'],
        'Ilmu Pengetahuan Sosial (IPS)': ['Kerajaan Hindu-Buddha dan Islam di Indonesia', 'Perjuangan pahlawan kemerdekaan', 'Kegiatan ekonomi dan sumber daya alam', 'Kenampakan alam dan sosial di Indonesia'],
        'Pendidikan Pancasila': ['Implementasi nilai-nilai Pancasila', 'Norma dan konstitusi', 'Bhinneka Tunggal Ika dalam masyarakat', 'Hak dan kewajiban sebagai warga negara'],
    };

    const commonTopics: { [key: string]: string[] } = {
        'Bahasa Inggris': ['Vocabulary and Simple Conversations', 'Basic Grammar', 'Reading Short Stories'],
        'PJOK': ['Gerak Dasar Lokomotor, Non-lokomotor, dan Manipulatif', 'Permainan Bola Besar dan Kecil', 'Kebugaran Jasmani'],
        'SBDP': ['Menggambar dan Mewarnai', 'Seni Musik (Lagu Daerah & Nasional)', 'Kerajinan Tangan dari bahan alam'],
        'Bahasa Daerah': ['Menyimak cerita lokal', 'Berbicara menggunakan undak-usuk basa (jika ada)', 'Menulis aksara daerah sederhana'],
        'Pendidikan Agama & Budi Pekerti': ['Sejarah Nabi dan Rasul', 'Akhlak Mulia', 'Praktik Ibadah (sesuai agama masing-masing)'],
        'Al-Qur\'an Hadis': ['Hafalan Surat Pendek pilihan', 'Hukum Bacaan (Tajwid dasar)', 'Memahami Hadis Pilihan tentang akhlak'],
        'Akidah Akhlak': ['Asmaul Husna', 'Iman kepada Kitab dan Rasul', 'Akhlak Terpuji dan Tercela dalam kehidupan sehari-hari'],
        'Fikih': ['Thaharah (Bersuci)', 'Salat Fardhu dan Sunnah', 'Puasa dan Zakat Fitrah'],
        'Sejarah Kebudayaan Islam': ['Kisah Nabi Muhammad SAW periode Mekkah dan Madinah', 'Kisah Para Sahabat Utama', 'Sejarah Perkembangan Islam di Nusantara'],
        'Bahasa Arab': school === 'MI' 
            ? ['Mufradat (Kosakata sehari-hari)', 'Hiwar (Percakapan sederhana)', 'Qira\'ah (Membaca teks pendek)', 'Kitabah (Menulis huruf hijaiyah sambung)']
            : ['Perkenalan diri (Ta\'aruf)', 'Kosakata benda di sekolah dan rumah', 'Ungkapan sederhana sehari-hari'],
    };
    
    let topics: string[];
    if (gradeNumber < 4) {
        topics = lowerGradeTopics[title] || commonTopics[title] || ['Topik-topik dasar sesuai kurikulum Fase A/B'];
    } else {
        topics = higherGradeTopics[title] || commonTopics[title] || ['Topik-topik lanjutan sesuai kurikulum Fase C'];
    }
    
    return `Materi pelajaran "${title}" untuk Fase ${fase} (Kelas ${grade}) di ${schoolName}, sesuai Kurikulum Merdeka. Fokus utama mencakup: ${topics.join(', ')}. "Ayah Tirta" akan menggunakan ringkasan ini untuk membuat konten belajar yang lebih detail.`;
}


export function getSubjects(school: SchoolType, grade: Grade): Subject[] {
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
      content: generateSubjectContent(school, grade, s.title)
    }))
    .filter((s, index, self) => 
        index === self.findIndex((t) => (
            t.id === s.id
        ))
    ); // Remove duplicates just in case
}

export const getSubjectById = (school: SchoolType, grade: Grade, id: string): Subject | undefined => {
  const subjects = getSubjects(school, grade);
  return subjects.find((subject) => subject.id === id);
};
