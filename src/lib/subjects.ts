import type { Subject } from './types';

export const subjects: Subject[] = [
  {
    id: 'matematika',
    title: 'Matematika',
    icon: 'Calculator',
    content: `Dalam Kurikulum Merdeka, Matematika kelas 5 mendalami bilangan cacah hingga 1.000.000, operasi hitung pecahan (termasuk desimal dan persen), serta menemukan Faktor Persekutuan Terbesar (FPB) dan Kelipatan Persekutuan Terkecil (KPK). Siswa juga belajar tentang sifat bangun datar dan bangun ruang, serta menghitung volume kubus dan balok.`,
  },
  {
    id: 'ipa',
    title: 'Ilmu Pengetahuan Alam & Sosial (IPAS)',
    icon: 'FlaskConical',
    content: `Dalam Kurikulum Merdeka, IPA dan IPS digabung menjadi IPAS. Siswa kelas 5 akan belajar tentang sifat cahaya dan bunyi, cara kerja organ pernapasan dan peredaran darah manusia, serta ekosistem dan jaring-jaring makanan. Selain itu, mereka akan mempelajari perjuangan pahlawan dalam meraih kemerdekaan dan mengenal keragaman budaya Indonesia.`,
  },
  {
    id: 'ips',
    title: 'Ilmu Pengetahuan Sosial',
    icon: 'Globe',
    content: `Dalam Kurikulum Merdeka, materi IPS kelas 5 terintegrasi dalam IPAS. Siswa mempelajari bagaimana manusia berinteraksi dengan lingkungan sekitarnya, sejarah perjuangan kemerdekaan Indonesia, serta menghargai keragaman budaya sebagai bagian dari identitas bangsa.`,
  },
  {
    id: 'bahasa-indonesia',
    title: 'Bahasa Indonesia',
    icon: 'BookOpen',
    content: `Fokus pelajaran Bahasa Indonesia kelas 5 Kurikulum Merdeka adalah meningkatkan literasi. Siswa berlatih membaca dan memahami teks informatif dan fiksi, menulis berbagai jenis teks seperti narasi dan argumentasi, serta menyajikan informasi secara lisan dengan efektif dan santun.`,
  },
  {
    id: 'bahasa-inggris',
    title: 'Bahasa Inggris',
    icon: 'Languages',
    content: `Bahasa Inggris kelas 5 sesuai Kurikulum Merdeka bertujuan agar siswa mampu mendeskripsikan orang, benda, dan tempat di sekitar mereka. Mereka akan belajar menggunakan "adjectives" dan "prepositions of place" dalam kalimat sederhana untuk berkomunikasi sehari-hari.`,
  },
  {
    id: 'quran-hadis',
    title: 'Al-Qur\'an Hadis',
    icon: 'BookCopy',
    content: `Mata pelajaran Al-Qur'an Hadis kelas 5 MI sesuai kurikulum terbaru menekankan pada pemahaman dan hafalan surat-surat pendek pilihan seperti At-Tin dan Al-Ma'un, serta mengaplikasikan hukum bacaan nun sukun/tanwin dan mim sukun. Siswa juga mempelajari hadis tentang pentingnya persatuan dan menghargai perbedaan.`,
  },
  {
    id: 'akidah-akhlak',
    title: 'Akidah Akhlak',
    icon: 'HeartHandshake',
    content: `Akidah Akhlak kelas 5 MI berfokus pada penguatan iman melalui pemahaman Asmaul Husna (Al-Qawiyy, Al-Qayyum) dan mengenal kitab-kitab Allah. Siswa juga dibimbing untuk menerapkan akhlak terpuji seperti tanggung jawab, adil, dan berbaik sangka, serta menjauhi akhlak tercela.`,
  },
  {
    id: 'fikih',
    title: 'Fikih',
    icon: 'Scale',
    content: `Pelajaran Fikih di kelas 5 MI membahas secara lebih rinci tentang ketentuan zakat, infak, dan sedekah sebagai bentuk kepedulian sosial. Siswa juga akan mempelajari tata cara ibadah kurban dan akikah, serta hikmah di baliknya.`,
  },
  {
    id: 'sejarah-kebudayaan-islam',
    title: 'Sejarah Kebudayaan Islam',
    icon: 'Landmark',
    content: `Sejarah Kebudayaan Islam (SKI) kelas 5 MI mengajak siswa meneladani ketabahan Nabi Muhammad SAW dan para sahabat dalam menghadapi kesulitan di awal dakwah Islam. Materi juga mencakup kisah hijrah ke Habasyah dan Madinah sebagai peristiwa penting dalam sejarah Islam.`,
  },
  {
    id: 'bahasa-arab',
    title: 'Bahasa Arab',
    icon: 'Speech',
    content: `Bahasa Arab untuk kelas 5 MI sesuai kurikulum terbaru fokus pada penggunaan bahasa dalam konteks kehidupan sehari-hari (الْحَيَاةُ الْيَوْمِيَّةُ) dan profesi (الْمِهْنَةُ). Siswa belajar menyusun kalimat sederhana menggunakan struktur kalimat dasar (jumlah ismiyyah dan fi'liyyah) untuk berkomunikasi.`,
  },
];

export const getSubjectById = (id: string): Subject | undefined => {
  return subjects.find((subject) => subject.id === id);
};
