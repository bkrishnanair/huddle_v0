import 'server-only';

import { GoogleGenerativeAI, type GenerationConfig } from '@google/generative-ai';

const MODEL_NAME = 'gemini-2.0-flash';

let genAIInstance: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAIInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    genAIInstance = new GoogleGenerativeAI(apiKey);
  }
  return genAIInstance;
}

/**
 * Generate free-form text from a prompt.
 */
export async function generateText(
  prompt: string,
  systemInstruction?: string,
  config?: Partial<GenerationConfig>
): Promise<string> {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    ...(systemInstruction && { systemInstruction }),
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
      ...config,
    },
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * Generate structured JSON output from a prompt using Gemini's JSON mode.
 */
export async function generateStructured<T>(
  prompt: string,
  systemInstruction?: string,
  config?: Partial<GenerationConfig>
): Promise<T> {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    ...(systemInstruction && { systemInstruction }),
    generationConfig: {
      temperature: 0.5,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json',
      ...config,
    },
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    return JSON.parse(text) as T;
  } catch {
    // Attempt to extract JSON from markdown code blocks
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      return JSON.parse(match[1].trim()) as T;
    }
    throw new Error(`Failed to parse Gemini response as JSON: ${text.slice(0, 200)}`);
  }
}
