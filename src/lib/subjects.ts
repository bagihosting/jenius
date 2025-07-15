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
];

export const getSubjectById = (id: string): Subject | undefined => {
  return subjects.find((subject) => subject.id === id);
};
