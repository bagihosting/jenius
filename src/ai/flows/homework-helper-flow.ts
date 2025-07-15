'use server';

/**
 * @fileOverview Provides homework help for 5th grade subjects.
 *
 * - answerHomework - A function that handles the homework question answering process.
 * - HomeworkHelpInput - The input type for the answerHomework function.
 * - HomeworkHelpOutput - The return type for the answerHomework function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const HomeworkHelpInputSchema = z.object({
  subject: z.string().describe('The school subject for the homework question.'),
  question: z.string().describe('The homework question to be answered.'),
});
export type HomeworkHelpInput = z.infer<typeof HomeworkHelpInputSchema>;

const HomeworkHelpOutputSchema = z.object({
  answer: z.string().describe('The explanation and answer to the homework question.'),
});
export type HomeworkHelpOutput = z.infer<typeof HomeworkHelpOutputSchema>;

export async function answerHomework(input: HomeworkHelpInput): Promise<HomeworkHelpOutput> {
  return homeworkHelperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'homeworkHelperPrompt',
  input: { schema: HomeworkHelpInputSchema },
  output: { schema: HomeworkHelpOutputSchema },
  prompt: `You are a friendly and encouraging teacher helping a 5th-grade student with their homework.
Your goal is to explain the concept and guide them to the answer, not just give the answer away.
The user will provide a subject and a question.

Subject: {{{subject}}}
Question: {{{question}}}

Please provide a step-by-step explanation that a 5th grader can understand.
Break down the problem, explain the key concepts, and then provide the final answer.
Use simple language and a positive tone.
`,
});

const homeworkHelperFlow = ai.defineFlow(
  {
    name: 'homeworkHelperFlow',
    inputSchema: HomeworkHelpInputSchema,
    outputSchema: HomeworkHelpOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
