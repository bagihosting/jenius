'use client';

import { Calculator, FlaskConical, Globe, BookOpen, Languages, BookCopy, HeartHandshake, Scale, Landmark, Speech, Sprout, Paintbrush, Languages as LanguageIcon, LucideProps, PersonStanding, Atom, Users, Trophy } from 'lucide-react';
import type { FC } from 'react';

export const iconMap: { [key: string]: FC<LucideProps> } = {
  Calculator,
  FlaskConical,
  Globe,
  BookOpen,
  Languages,
  BookCopy,
  HeartHandshake,
  Scale,
  Landmark,
  Speech,
  Sprout,
  Paintbrush,
  PersonStanding, // PJOK
  Atom,           // IPA
  Users,          // IPS
  LanguageIcon,   // Bahasa Daerah
  Trophy,
};

export const getIcon = (name: string): FC<LucideProps> => {
    return iconMap[name] || BookOpen; // Return a default icon if not found
};
