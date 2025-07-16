import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Using gemini-1.5-flash-latest for higher quality generation
// suitable for educational content in Indonesian context.
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-1.5-flash-latest',
});
