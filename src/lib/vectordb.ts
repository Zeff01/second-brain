/**
 * Pinecone vector database client configuration and utilities
 */

import { Pinecone, type RecordMetadata } from '@pinecone-database/pinecone';
import type { ChunkMetadata } from './types';

// Initialize Pinecone client
let pineconeClient: Pinecone | null = null;

export function getPineconeClient(): Pinecone {
  if (!pineconeClient) {
    const apiKey = process.env.PINECONE_API_KEY;

    if (!apiKey) {
      throw new Error('PINECONE_API_KEY is not set in environment variables');
    }

    pineconeClient = new Pinecone({
      apiKey,
    });
  }

  return pineconeClient;
}

export async function getIndex() {
  const client = getPineconeClient();
  const indexName = process.env.PINECONE_INDEX_NAME || 'aai-transcripts';

  return client.index(indexName);
}

/**
 * Upsert vectors to Pinecone with metadata
 */
export async function upsertVectors(
  vectors: { id: string; values: number[]; metadata: RecordMetadata }[]
) {
  const index = await getIndex();

  await index.upsert(vectors);
}

/**
 * Query Pinecone for similar vectors
 */
export async function queryVectors(
  queryVector: number[],
  topK: number = 5
) {
  const index = await getIndex();

  const results = await index.query({
    vector: queryVector,
    topK,
    includeMetadata: true,
  });

  return results;
}
