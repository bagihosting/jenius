import type { Subject, SchoolType, Grade } from './types';

// Base subjects applicable to most grades and schools
const baseSubjects: Omit<Subject, 'content' | 'id'>[] = [
  { title: 'Pendidikan Pancasila', icon: 'Landmark' },
  { title: 'Bahasa Indonesia', icon: 'BookOpen' },
  { title: 'Matematika', icon: 'Calculator' },
  { title: 'Bahasa Inggris', icon: 'Languages' },
  { title: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)', icon: 'PersonStanding' },
  { title: 'Seni Budaya dan Prakarya (SBDP)', icon: 'Paintbrush' },
  { title: 'Bahasa Daerah', icon: 'LanguageIcon' } // Muatan Lokal
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
    const gradeNumber = grade.toString();

    const commonTopics: { [key: string]: string[] } = {
        'Matematika': ['Bilangan dan Operasi Hitung', 'Geometri dan Pengukuran', 'Analisis Data dan Peluang'],
        'IPAS': ['Makhluk Hidup dan Lingkungannya', 'Zat dan Perubahannya', 'Bumi dan Alam Semesta', 'Keragaman Budaya dan Sejarah Lokal'],
        'Ilmu Pengetahuan Alam (IPA)': ['Rangka Manusia dan Hewan', 'Sistem Pernapasan', 'Sifat Benda', 'Gaya dan Gerak', 'Siklus Air'],
        'Ilmu Pengetahuan Sosial (IPS)': ['Kerajaan Hindu-Buddha dan Islam', 'Pahlawan Nasional', 'Kegiatan Ekonomi', 'Kenampakan Alam dan Buatan'],
        'Bahasa Indonesia': ['Membaca dan Memahami Teks', 'Menulis Kreatif dan Informatif', 'Berbicara dan Presentasi'],
        'Bahasa Inggris': ['Vocabulary and Simple Conversations', 'Basic Grammar', 'Reading Short Stories'],
        'Pendidikan Pancasila': ['Nilai-nilai Pancasila', 'Norma dan Aturan', 'Bhinneka Tunggal Ika', 'Hak dan Kewajiban'],
        'Pendidikan Agama & Budi Pekerti': ['Sejarah Nabi dan Rasul', 'Akhlak Mulia', 'Praktik Ibadah (sesuai agama masing-masing)'],
        'PJOK': ['Gerak Dasar Lokomotor', 'Non-lokomotor, dan Manipulatif', 'Permainan Bola Besar dan Kecil', 'Kebugaran Jasmani'],
        'SBDP': ['Menggambar dan Mewarnai', 'Seni Musik (Lagu Daerah & Nasional)', 'Kerajinan Tangan'],
        'Bahasa Daerah': ['Menyimak cerita lokal', 'Berbicara menggunakan undak-usuk basa', 'Menulis aksara daerah'],
        'Al-Qur\'an Hadis': ['Hafalan Surat Pendek', 'Hukum Bacaan (Tajwid)', 'Memahami Hadis Pilihan'],
        'Akidah Akhlak': ['Asmaul Husna', 'Iman kepada Kitab dan Rasul', 'Akhlak Terpuji dan Tercela'],
        'Fikih': ['Thaharah (Bersuci)', 'Salat Fardhu dan Sunnah', 'Puasa dan Zakat'],
        'Sejarah Kebudayaan Islam': ['Kisah Nabi Muhammad SAW', 'Kisah Para Sahabat', 'Sejarah Perkembangan Islam'],
        'Bahasa Arab': ['Mufradat (Kosakata)', 'Hiwar (Percakapan)', 'Qira\'ah (Membaca)'],
    };
    
    const topics = commonTopics[title] || ['Topik-topik dasar sesuai kurikulum'];
    return `Materi pelajaran "${title}" untuk kelas ${gradeNumber} di ${schoolName}, sesuai Kurikulum Merdeka. Fokus utama mencakup: ${topics.join(', ')}. "Ayah Tirta" akan menggunakan ringkasan ini untuk membuat konten belajar yang lebih detail.`;
}


export function getSubjects(school: SchoolType, grade: Grade): Subject[] {
  let subjectList: Omit<Subject, 'content'| 'id'>[] = [...baseSubjects];

  // Logic for science subjects based on grade
  const gradeNum = parseInt(grade, 10);
  if (gradeNum >= 4) { // Kelas 4, 5, 6
      subjectList.push({ title: 'Ilmu Pengetahuan Alam (IPA)', icon: 'Atom' });
      subjectList.push({ title: 'Ilmu Pengetahuan Sosial (IPS)', icon: 'Users' });
  } else { // Kelas 1, 2, 3
      subjectList.push({ title: 'Ilmu Pengetahuan Alam & Sosial (IPAS)', icon: 'FlaskConical' });
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
      // And often Pancasila is integrated differently or named PKn. We keep Pancasila for simplicity.
      subjectList.push(...religiousSubjects.mi);
      break;
    default:
      subjectList.push(religiousSubjects.sdn_sdit);
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
