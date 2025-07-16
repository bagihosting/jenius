'use server';

/**
 * @fileOverview Finds schools in a given city based on school type.
 *
 * - findSchools - A function that handles the school finding process.
 * - FindSchoolsInput - The input type for the findSchools function.
 * - FindSchoolsOutput - The return type for the findSchools function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const schoolTypeMap = {
  'SDN': 'Sekolah Dasar Negeri (SDN)',
  'SDIT': 'Sekolah Dasar Islam Terpadu (SDIT)',
  'MI': 'Madrasah Ibtidaiyah (MI)',
};

export const FindSchoolsInputSchema = z.object({
  city: z.string().describe('The city in Indonesia to search for schools in.'),
  schoolType: z.enum(['SDN', 'SDIT', 'MI']).describe('The type of school.'),
});
export type FindSchoolsInput = z.infer<typeof FindSchoolsInputSchema>;

const FindSchoolsOutputSchema = z.object({
  schools: z.array(z.string()).describe('A list of school names.'),
});
export type FindSchoolsOutput = z.infer<typeof FindSchoolsOutputSchema>;

export async function findSchools(input: FindSchoolsInput): Promise<FindSchoolsOutput> {
  return findSchoolsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findSchoolsPrompt',
  input: { schema: FindSchoolsInputSchema },
  output: { schema: FindSchoolsOutputSchema },
  prompt: `Anda adalah asisten yang handal dan cerdas untuk informasi pendidikan di Indonesia.
Tugas Anda adalah untuk memberikan daftar nama sekolah berdasarkan kota dan jenis sekolah yang diberikan.

Berikan daftar 10-15 nama sekolah untuk jenis '{{{schoolType}}}' di kota {{{city}}}, Indonesia.
Pastikan nama sekolah yang diberikan adalah nama yang umum dan benar. Hanya berikan nama sekolahnya saja.

Jenis Sekolah: ${schoolTypeMap['{{{schoolType}}}']}
Kota: {{{city}}}
`,
});

const findSchoolsFlow = ai.defineFlow(
  {
    name: 'findSchoolsFlow',
    inputSchema: FindSchoolsInputSchema,
    outputSchema: FindSchoolsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("Gagal mengambil data sekolah dari AI.");
    }
    // Sort schools alphabetically for consistent output
    output.schools.sort();
    return output;
  }
);
