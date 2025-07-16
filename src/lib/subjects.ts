import type { Subject, SchoolType, Grade } from './types';
import { getIcon } from './icons';

// Base subjects for public schools (SDN/SDIT)
const baseSubjectsSD: Omit<Subject, 'content' | 'id'>[] = [
  { title: 'Matematika', icon: 'Calculator' },
  { title: 'Ilmu Pengetahuan Alam & Sosial (IPAS)', icon: 'FlaskConical' },
  { title: 'Bahasa Indonesia', icon: 'BookOpen' },
  { title: 'Bahasa Inggris', icon: 'Languages' },
  { title: 'Pendidikan Pancasila', icon: 'Landmark' },
  { title: 'Pendidikan Agama & Budi Pekerti', icon: 'HeartHandshake' },
];

// Madrasah-specific subjects
const subjectsMI: Omit<Subject, 'content' | 'id'>[] = [
  { title: 'Al-Qur\'an Hadis', icon: 'BookCopy' },
  { title: 'Akidah Akhlak', icon: 'HeartHandshake' },
  { title: 'Fikih', icon: 'Scale' },
  { title: 'Sejarah Kebudayaan Islam', icon: 'Landmark' },
  { title: 'Bahasa Arab', icon: 'Speech' },
];

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
        'Bahasa Indonesia': ['Membaca dan Memahami Teks', 'Menulis Kreatif dan Informatif', 'Berbicara dan Presentasi'],
        'Bahasa Inggris': ['Vocabulary and Simple Conversations', 'Basic Grammar', 'Reading Short Stories'],
        'Pendidikan Pancasila': ['Nilai-nilai Pancasila', 'Norma dan Aturan', 'Bhinneka Tunggal Ika'],
        'Pendidikan Agama & Budi Pekerti': ['Sejarah Nabi dan Rasul', 'Akhlak Mulia', 'Praktik Ibadah (sesuai agama masing-masing)'],
        'Al-Qur\'an Hadis': ['Hafalan Surat Pendek', 'Hukum Bacaan (Tajwid)', 'Memahami Hadis Pilihan'],
        'Akidah Akhlak': ['Asmaul Husna', 'Iman kepada Kitab dan Rasul', 'Akhlak Terpuji dan Tercela'],
        'Fikih': ['Thaharah (Bersuci)', 'Salat Fardhu dan Sunnah', 'Puasa dan Zakat'],
        'SKI': ['Kisah Nabi Muhammad SAW', 'Kisah Para Sahabat', 'Sejarah Perkembangan Islam'],
        'Bahasa Arab': ['Mufradat (Kosakata)', 'Hiwar (Percakapan)', 'Qira\'ah (Membaca)'],
    };
    
    const topics = commonTopics[title] || ['Topik-topik dasar sesuai kurikulum'];
    return `Materi pelajaran "${title}" untuk kelas ${gradeNumber} di ${schoolName}, sesuai Kurikulum Merdeka. Fokus utama mencakup: ${topics.join(', ')}. "Ayah Tirta" akan menggunakan ringkasan ini untuk membuat konten belajar yang lebih detail.`;
}


export function getSubjects(school: SchoolType, grade: Grade): Subject[] {
  let subjectList: Omit<Subject, 'content'| 'id'>[] = [];

  switch (school) {
    case 'SDN':
      subjectList = baseSubjectsSD;
      break;
    case 'SDIT':
      // SDIT has base subjects + some religious subjects, often integrated
      subjectList = [
        ...baseSubjectsSD,
        { title: 'Al-Qur\'an dan Hadis', icon: 'BookCopy' },
        { title: 'Bahasa Arab', icon: 'Speech' },
      ].filter(s => s.title !== 'Pendidikan Agama & Budi Pekerti');
      break;
    case 'MI':
      // MI has some base subjects and replaces others with specific religious ones
      subjectList = [
        ...baseSubjectsSD.filter(s => 
          s.title !== 'Pendidikan Pancasila' && 
          s.title !== 'Pendidikan Agama & Budi Pekerti'
        ),
        ...subjectsMI
      ];
      break;
    default:
      subjectList = baseSubjectsSD;
  }
  
  return subjectList.map(s => ({
    ...s,
    id: s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    content: generateSubjectContent(school, grade, s.title)
  }));
}

export const getSubjectById = (school: SchoolType, grade: Grade, id: string): Subject | undefined => {
  const subjects = getSubjects(school, grade);
  return subjects.find((subject) => subject.id === id);
};
