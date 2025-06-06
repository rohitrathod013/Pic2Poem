'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating poems based on an image and a specified style.
 *
 * The flow takes an image data URI and a poem style as input, analyzes the image,
 * and generates a poem in the requested style.
 *
 * @fileOverview
 * - generatePoemStyle: The main function to trigger the poem generation flow.
 * - GeneratePoemStyleInput: The input type for the generatePoemStyle function.
 * - GeneratePoemStyleOutput: The output type for the generatePoemStyle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePoemStyleInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo to generate a poem from, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' //keep the backslashes here, don't remove them.
    ),
  poemStyle: z
    .string()
    .describe(
      'The style of poem to generate. Examples: haiku, free verse, sonnet.'
    ),
});
export type GeneratePoemStyleInput = z.infer<typeof GeneratePoemStyleInputSchema>;

const GeneratePoemStyleOutputSchema = z.object({
  poem: z.string().describe('The generated poem.'),
});
export type GeneratePoemStyleOutput = z.infer<typeof GeneratePoemStyleOutputSchema>;

export async function generatePoemStyle(
  input: GeneratePoemStyleInput
): Promise<GeneratePoemStyleOutput> {
  return generatePoemStyleFlow(input);
}

const generatePoemStylePrompt = ai.definePrompt({
  name: 'generatePoemStylePrompt',
  input: {schema: GeneratePoemStyleInputSchema},
  output: {schema: GeneratePoemStyleOutputSchema},
  prompt: `You are a poet specializing in generating poems from images.

  Analyze the image and generate a poem in the style of {{{poemStyle}}}. Use related keywords to create the poem.

  Image: {{media url=photoDataUri}}
  Poem Style: {{{poemStyle}}}
  Poem:
  `,
});

const generatePoemStyleFlow = ai.defineFlow(
  {
    name: 'generatePoemStyleFlow',
    inputSchema: GeneratePoemStyleInputSchema,
    outputSchema: GeneratePoemStyleOutputSchema,
  },
  async input => {
    const {output} = await generatePoemStylePrompt(input);
    return output!;
  }
);
