
'use server';
import { generatePoemStyle, type GeneratePoemStyleInput, type GeneratePoemStyleOutput } from '@/ai/flows/generate-poem-style';

export async function generatePoemAction(input: GeneratePoemStyleInput): Promise<GeneratePoemStyleOutput | { error: string }> {
  try {
    // The GenAI flow might throw an error or return a specific error structure.
    // Assuming it throws for now.
    const result = await generatePoemStyle(input);
    return result;
  } catch (e: any) {
    console.error("Error generating poem in server action:", e);
    // Check if the error object has more specific details from Genkit/AI model
    let errorMessage = "Failed to generate poem due to an unexpected error.";
    if (e.message) {
        errorMessage = e.message;
    }
    // If the AI flow returns a structured error, you might parse it here.
    // For example, if e.details or e.response.data contains more info.
    return { error: errorMessage };
  }
}
