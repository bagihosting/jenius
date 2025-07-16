
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
  { name: 'SDIT Al-Azhar BSD', type: 'SDIT', city: 'Tangerang' }, // Technically Tangsel, but often associated
  { name: 'SDIT Harapan Umat', type: 'SDIT', city: 'Tangerang' },
  { name: 'SDIT An-Nisa', type: 'SDIT', city: 'Tangerang' },
  { name: 'SDIT Al-Amanah', type: 'SDIT', city: 'Tangerang' },

  // MI di Tangerang
  { name: 'MIN 1 Tangerang', type: 'MI', city: 'Tangerang' },
  { name: 'MIN 2 Tangerang', type: 'MI', city: 'Tangerang' },
  { name: 'MIS Al-Hidayah', type: 'MI', city: 'Tangerang' },
  { name: 'MIS Nurul Islam', type: 'MI', city: 'Tangerang' },
  { name: 'MIS Al-Ikhlas', type: 'MI', city: 'Tangerang' },
  { name: 'MIS Miftahul Huda', type: 'MI', city: 'Tangerang' },
  { name: 'MIS Al-Barkah', type: 'MI', city: 'Tangerang' },
];

export function getSchoolsByCityAndType(city: string, type: SchoolType): School[] {
  return schools.filter(school => school.city === city && school.type === type);
}
