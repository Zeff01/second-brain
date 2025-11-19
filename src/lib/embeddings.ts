/**
 * OpenAI embeddings generation utilities
 */

import OpenAI from 'openai';

// Initialize OpenAI client
let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }

    openaiClient = new OpenAI({
      apiKey,
    });
  }

  return openaiClient;
}

/**
 * Generate embedding for a single text string
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const client = getOpenAIClient();

  const response = await client.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
    dimensions: 1024,
  });

  return response.data[0].embedding;
}

/**
 * Generate embeddings for multiple text strings in batch
 */
export async function batchGenerateEmbeddings(
  texts: string[]
): Promise<number[][]> {
  const client = getOpenAIClient();

  // Process in batches of 100 (OpenAI limit)
  const batchSize = 100;
  const embeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);

    const response = await client.embeddings.create({
      model: 'text-embedding-3-small',
      input: batch,
      dimensions: 1024,
    });

    embeddings.push(...response.data.map((item) => item.embedding));
  }

  return embeddings;
}
