import type { Subject } from './types';

export const subjects: Subject[] = [
  {
    id: 'matematika',
    title: 'Matematika',
    icon: 'Calculator',
    content: `Pelajaran Matematika kelas 5 mencakup topik-topik seperti operasi hitung bilangan bulat dan pecahan, perbandingan dan skala, bangun datar dan bangun ruang, serta pengumpulan dan penyajian data. Siswa akan belajar menyelesaikan masalah sehari-hari yang berkaitan dengan konsep-konsep ini.`,
  },
  {
    id: 'ipa',
    title: 'Ilmu Pengetahuan Alam',
    icon: 'FlaskConical',
    content: `Ilmu Pengetahuan Alam (IPA) untuk kelas 5 membahas tentang organ tubuh manusia dan hewan, proses makan dan dimakan (rantai makanan), penyesuaian diri makhluk hidup dengan lingkungannya (adaptasi), serta sifat-sifat benda padat, cair, dan gas, dan perubahan wujud benda.`,
  },
  {
    id: 'ips',
    title: 'Ilmu Pengetahuan Sosial',
    icon: 'Globe',
    content: `Dalam pelajaran Ilmu Pengetahuan Sosial (IPS), siswa kelas 5 akan mempelajari tentang keragaman suku bangsa dan budaya di Indonesia, peninggalan sejarah dari masa Hindu-Buddha dan Islam, serta kegiatan ekonomi masyarakat seperti produksi, distribusi, dan konsumsi.`,
  },
  {
    id: 'bahasa-indonesia',
    title: 'Bahasa Indonesia',
    icon: 'BookOpen',
    content: `Bahasa Indonesia kelas 5 fokus pada peningkatan kemampuan membaca, menulis, menyimak, dan berbicara. Materi meliputi pemahaman bacaan, menulis karangan narasi dan deskripsi, serta menyampaikan kembali informasi dari teks yang didengar atau dibaca.`,
  },
  {
    id: 'bahasa-inggris',
    title: 'Bahasa Inggris',
    icon: 'Languages',
    content: `Pelajaran Bahasa Inggris untuk kelas 5 memperkenalkan kosakata dan percakapan sederhana terkait kegiatan sehari-hari, keluarga, hobi, dan lingkungan sekolah. Siswa akan belajar menyusun kalimat sederhana dan memahami instruksi dalam Bahasa Inggris.`,
  },
  {
    id: 'quran-hadis',
    title: 'Al-Qur\'an Hadis',
    icon: 'BookCopy',
    content: `Mata pelajaran Al-Qur'an Hadis untuk kelas 5 Madrasah Ibtidaiyah membahas tentang pemahaman surat-surat pendek dalam Al-Qur'an, hukum bacaan (tajwid), serta hadis-hadis pilihan tentang perilaku terpuji seperti hormat kepada orang tua dan guru.`,
  },
  {
    id: 'akidah-akhlak',
    title: 'Akidah Akhlak',
    icon: 'HeartHandshake',
    content: `Akidah Akhlak kelas 5 mempelajari tentang kalimat-kalimat thayyibah, mengenal nama-nama baik Allah (Asmaul Husna), dan membiasakan akhlak terpuji dalam kehidupan sehari-hari seperti amanah, jujur, dan istiqamah.`,
  },
  {
    id: 'fikih',
    title: 'Fikih',
    icon: 'Scale',
    content: `Pelajaran Fikih di kelas 5 membahas tentang ketentuan zakat fitrah dan zakat mal, ibadah puasa Ramadan, serta hal-hal yang berkaitan dengan ibadah haji dan umrah dalam tingkat dasar.`,
  },
  {
    id: 'sejarah-kebudayaan-islam',
    title: 'Sejarah Kebudayaan Islam',
    icon: 'Landmark',
    content: `Sejarah Kebudayaan Islam (SKI) kelas 5 menceritakan kisah-kisah teladan dari Nabi Muhammad SAW dan para sahabatnya, terutama pada periode Madinah, serta perjuangan dalam menyebarkan ajaran Islam.`,
  },
  {
    id: 'bahasa-arab',
    title: 'Bahasa Arab',
    icon: 'Speech',
    content: `Bahasa Arab untuk kelas 5 memperkenalkan kosakata (mufradat) dan percakapan (hiwar) sederhana tentang lingkungan sekolah, peralatan kelas, dan kegiatan sehari-hari, serta pengenalan dasar tata bahasa Arab.`,
  },
];

export const getSubjectById = (id: string): Subject | undefined => {
  return subjects.find((subject) => subject.id === id);
};
