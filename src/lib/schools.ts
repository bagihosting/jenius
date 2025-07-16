
import type { SchoolType } from './types';

export interface School {
  name: string;
  type: SchoolType;
  city: string;
}

const schools: School[] = [
  // SDN di Tangerang
  { name: 'SDN Tangerang 1', type: 'SDN', city: 'Tangerang' },
  { name: 'SDN Tangerang 2', type: 'SDN', city: 'Tangerang' },
  { name: 'SDN Sukasari 1', type: 'SDN', city: 'Tangerang' },
  { name: 'SDN Karawaci 1', type: 'SDN', city: 'Tangerang' },
  { name: 'SDN Cibodas 1', type: 'SDN', city: 'Tangerang' },
  { name: 'SDN Larangan Utara 1', type: 'SDN', city: 'Tangerang' },
  { name: 'SDN Cipondoh 2', type: 'SDN', city: 'Tangerang' },
  { name: 'SDN Kunciran 3', type: 'SDN', city: 'Tangerang' },
  { name: 'SDN Poris Gaga 1', type: 'SDN', city: 'Tangerang' },
  { name: 'SDN Neglasari 1', type: 'SDN', city: 'Tangerang' },
  
  // SDIT di Tangerang
  { name: 'SDIT Asy-Syukriyyah', type: 'SDIT', city: 'Tangerang' },
  { name: 'SDIT Al-Husna', type: 'SDIT', city: 'Tangerang' },
  { name: 'SDIT Tarsisius Vireta', type: 'SDIT', city: 'Tangerang' },
  { name: 'SDIT Nurul Fikri', type: 'SDIT', city: 'Tangerang' },
  { name: 'SDIT Al-Azhar BSD', type: 'SDIT', city: 'Tangerang' },
  { name: 'SDIT Harapan Umat', type: 'SDIT', city: 'Tangerang' },
  { name: 'SDIT An-Nisa', type: 'SDIT', city: 'Tangerang' },
  { name: 'SDIT Al-Amanah', type: 'SDIT', city: 'Tangerang' },

  // MI di Tangerang
  { name: 'MIN 1 Tangerang', type: 'MI', city: 'Tangerang' },
  { name: 'MIN 2 Tangerang', type: 'MI', city: 'Tangerang' },
  { name: 'MIS Al-Hidayah Cipondoh', type: 'MI', city: 'Tangerang' },
  { name: 'MIS Nurul Islam', type: 'MI', city: 'Tangerang' },
  { name: 'MIS Al-Ikhlas', type: 'MI', city: 'Tangerang' },
  { name: 'MIS Miftahul Huda', type: 'MI', city: 'Tangerang' },
  { name: 'MIS Al-Barkah', type: 'MI', city: 'Tangerang' },

  // SDN di Jakarta
  { name: 'SDN Menteng 01', type: 'SDN', city: 'Jakarta' },
  { name: 'SDN Gondangdia 01', type: 'SDN', city: 'Jakarta' },
  { name: 'SDN Kebon Sirih 01', type: 'SDN', city: 'Jakarta' },
  { name: 'SDN Cikini 01', type: 'SDN', city: 'Jakarta' },
  { name: 'SDN Rawamangun 12', type: 'SDN', city: 'Jakarta' },

  // SDIT di Jakarta
  { name: 'SDIT Al-Kahfi', type: 'SDIT', city: 'Jakarta' },
  { name: 'SDIT Ar-Rahman', type: 'SDIT', city: 'Jakarta' },
  { name: 'SDIT Al-Mughni', type: 'SDIT', city: 'Jakarta' },

  // MI di Jakarta
  { name: 'MIN 1 Jakarta', type: 'MI', city: 'Jakarta' },
  { name: 'MIN 4 Jakarta', type: 'MI', city: 'Jakarta' },
  { name: 'MIS Al-Washliyah', type: 'MI', city: 'Jakarta' },

  // SDN di Bandung
  { name: 'SDN 200 Leuwipanjang', type: 'SDN', city: 'Bandung' },
  { name: 'SDN 061 Cijagra', type: 'SDN', city: 'Bandung' },
  { name: 'SDN 113 Banjarsari', type: 'SDN', city: 'Bandung' },

  // SDIT di Bandung
  { name: 'SDIT Mutiara Hati', type: 'SDIT', city: 'Bandung' },
  { name: 'SDIT Al-Fitrah', type: 'SDIT', city: 'Bandung' },

  // MI di Bandung
  { name: 'MIN 1 Kota Bandung', type: 'MI', city: 'Bandung' },
  { name: 'MIS Persis 76', type: 'MI', city: 'Bandung' },

  // SDN di Surabaya
  { name: 'SDN Komplek Kenjeran I', type: 'SDN', city: 'Surabaya' },
  { name: 'SDN Kaliasin I', type: 'SDN', city: 'Surabaya' },
  { name: 'SDN Dr. Soetomo V', type: 'SDN', city: 'Surabaya' },

  // SDIT di Surabaya
  { name: 'SDIT Al-Uswah', type: 'SDIT', city: 'Surabaya' },
  { name: 'SDIT Luqman Al Hakim', type: 'SDIT', city: 'Surabaya' },

  // MI di Surabaya
  { name: 'MIN 1 Kota Surabaya', type: 'MI', city: 'Surabaya' },
  { name: 'MIS Maarif NU', type: 'MI', city: 'Surabaya' },

  // SDN di Medan
  { name: 'SDN 060884 Medan', type: 'SDN', city: 'Medan' },
  { name: 'SDN 060925 Medan', type: 'SDN', city: 'Medan' },

  // SDIT di Medan
  { name: 'SDIT Al-Fityan School', type: 'SDIT', city: 'Medan' },

  // MI di Medan
  { name: 'MIN 1 Medan', type: 'MI', city: 'Medan' },
];

export function getSchoolsByCityAndType(city: string | null, type: SchoolType): School[] {
  if (!city) {
    return schools.filter(school => school.type === type);
  }
  return schools.filter(school => school.city === city && school.type === type);
}
