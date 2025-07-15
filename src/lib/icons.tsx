'use client';

import { Calculator, FlaskConical, Globe, BookOpen, Languages, BookCopy, HeartHandshake, Scale, Landmark, Speech, LucideProps } from 'lucide-react';
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
};

export const getIcon = (name: string): FC<LucideProps> => {
    return iconMap[name] || BookOpen; // Return a default icon if not found
};
