
import type { SchoolType } from './types';

export interface School {
  name: string;
  type: SchoolType;
  city: string;
}

const schools: School[] = [
  // Tangerang
  { name: 'SDN Tangerang 1', type: 'SDN', city: 'Tangerang' },
  { name: 'SDN Tangerang 2', type: 'SDN', city: 'Tangerang' },
  { name: 'SDN Sukasari 1', type: 'SDN', city: 'Tangerang' },
  { name: 'SDN Karawaci 1', type: 'SDN', city: 'Tangerang' },
  { name: 'SDIT Asy-Syukriyyah', type: 'SDIT', city: 'Tangerang' },
  { name: 'SDIT Al-Husna', type: 'SDIT', city: 'Tangerang' },
  { name: 'MIN 1 Tangerang', type: 'MI', city: 'Tangerang' },
  { name: 'MIN 2 Tangerang', type: 'MI', city: 'Tangerang' },

  // Jakarta
  { name: 'SDN Menteng 01', type: 'SDN', city: 'Jakarta' },
  { name: 'SDN Gondangdia 01', type: 'SDN', city: 'Jakarta' },
  { name: 'SDN Rawamangun 12', type: 'SDN', city: 'Jakarta' },
  { name: 'SDIT Al-Kahfi', type: 'SDIT', city: 'Jakarta' },
  { name: 'SDIT Ar-Rahman', type: 'SDIT', city: 'Jakarta' },
  { name: 'MIN 1 Jakarta', type: 'MI', city: 'Jakarta' },
  { name: 'MIN 4 Jakarta', type: 'MI', city: 'Jakarta' },

  // Bandung
  { name: 'SDN 200 Leuwipanjang', type: 'SDN', city: 'Bandung' },
  { name: 'SDN 061 Cijagra', type: 'SDN', city: 'Bandung' },
  { name: 'SDIT Mutiara Hati', type: 'SDIT', city: 'Bandung' },
  { name: 'SDIT Al-Fitrah', type: 'SDIT', city: 'Bandung' },
  { name: 'MIN 1 Kota Bandung', type: 'MI', city: 'Bandung' },
  { name: 'MIS Persis 76', type: 'MI', city: 'Bandung' },

  // Surabaya
  { name: 'SDN Komplek Kenjeran I', type: 'SDN', city: 'Surabaya' },
  { name: 'SDN Kaliasin I', type: 'SDN', city: 'Surabaya' },
  { name: 'SDIT Al-Uswah', type: 'SDIT', city: 'Surabaya' },
  { name: 'SDIT Luqman Al Hakim', type: 'SDIT', city: 'Surabaya' },
  { name: 'MIN 1 Kota Surabaya', type: 'MI', city: 'Surabaya' },
  { name: 'MIS Maarif NU', type: 'MI', city: 'Surabaya' },

  // Medan
  { name: 'SDN 060884 Medan', type: 'SDN', city: 'Medan' },
  { name: 'SDN 060925 Medan', type: 'SDN', city: 'Medan' },
  { name: 'SDIT Al-Fityan School', type: 'SDIT', city: 'Medan' },
  { name: 'MIN 1 Medan', type: 'MI', city: 'Medan' },

  // Semarang
  { name: 'SDN Pendrikan Lor 01', type: 'SDN', city: 'Semarang' },
  { name: 'SDN Gisikdrono 01', type: 'SDN', city: 'Semarang' },
  { name: 'SDIT Bina Amal', type: 'SDIT', city: 'Semarang' },
  { name: 'SDIT Tunas Harapan', type: 'SDIT', city: 'Semarang' },
  { name: 'MIN 1 Kota Semarang', type: 'MI', city: 'Semarang' },
  { name: 'MIS Al Khoiriyyah 01', type: 'MI', city: 'Semarang' },

  // Yogyakarta
  { name: 'SDN Lempuyangwangi', type: 'SDN', city: 'Yogyakarta' },
  { name: 'SDN Ungaran 1', type: 'SDN', city: 'Yogyakarta' },
  { name: 'SDIT Luqman Al Hakim', type: 'SDIT', city: 'Yogyakarta' },
  { name: 'SDIT Salsabila', type: 'SDIT', city: 'Yogyakarta' },
  { name: 'MIN 1 Yogyakarta', type: 'MI', city: 'Yogyakarta' },
  { name: 'MIS Wahid Hasyim', type: 'MI', city: 'Yogyakarta' },

  // Makassar
  { name: 'SDN Kompleks Mangkura', type: 'SDN', city: 'Makassar' },
  { name: 'SDN Sudirman 1', type: 'SDN', city: 'Makassar' },
  { name: 'SDIT Al-Biruni', type: 'SDIT', city: 'Makassar' },
  { name: 'SDIT Wahdah Islamiyah', type: 'SDIT', city: 'Makassar' },
  { name: 'MIN 1 Kota Makassar', type: 'MI', city: 'Makassar' },
  { name: 'MIS Arifah', type: 'MI', city: 'Makassar' },

  // Palembang
  { name: 'SDN 117 Palembang', type: 'SDN', city: 'Palembang' },
  { name: 'SDN 45 Palembang', type: 'SDN', city: 'Palembang' },
  { name: 'SDIT Al-Furqon', type: 'SDIT', city: 'Palembang' },
  { name: 'SDIT Izzuddin', type: 'SDIT', city: 'Palembang' },
  { name: 'MIN 2 Palembang', type: 'MI', city: 'Palembang' },
  { name: 'MIS Al-Ittifaqiah', type: 'MI', city: 'Palembang' },

  // Denpasar
  { name: 'SDN 17 Dauh Puri', type: 'SDN', city: 'Denpasar' },
  { name: 'SDN 3 Sanur', type: 'SDN', city: 'Denpasar' },
  { name: 'SDIT Albanna', type: 'SDIT', city: 'Denpasar' },
  { name: 'SDIT Insan Mulia', type: 'SDIT', city: 'Denpasar' },
  { name: 'MIN 1 Denpasar', type: 'MI', city: 'Denpasar' },
  { name: 'MIS Al-Muhajirin', type: 'MI', city: 'Denpasar' },
];

export function getSchoolsByCityAndType(city: string | null, type: SchoolType): School[] {
  if (!city) {
    return schools.filter(school => school.type === type);
  }
  return schools.filter(school => school.city === city && school.type === type);
}
