/**
 * Data ingestion API endpoint
 * This endpoint processes transcript data and uploads it to the vector database
 */

import { NextRequest, NextResponse } from 'next/server';
import { processEpisodes } from '@/lib/chunking';
import { batchGenerateEmbeddings } from '@/lib/embeddings';
import { upsertVectors, deleteAllVectors } from '@/lib/vectordb';
import type { Episode } from '@/lib/types';
import type { RecordMetadata } from '@pinecone-database/pinecone';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Delete all existing vectors first to ensure clean re-ingestion
    console.log('Deleting all existing vectors from Pinecone...');
    await deleteAllVectors();
    console.log('All vectors deleted successfully');

    // Load transcript data
    const transcriptPath = path.join(process.cwd(), 'data', 'transcripts.json');
    const transcriptData = await fs.readFile(transcriptPath, 'utf-8');
    const episodes: Episode[] = JSON.parse(transcriptData);

    // Process episodes into chunks
    console.log(`Processing ${episodes.length} episodes...`);
    const chunks = processEpisodes(episodes);
    console.log(`Created ${chunks.length} chunks`);

    // Generate embeddings for all chunks
    console.log('Generating embeddings...');
    const texts = chunks.map((chunk) => chunk.text);
    const embeddings = await batchGenerateEmbeddings(texts);
    console.log(`Generated ${embeddings.length} embeddings`);

    // Prepare vectors for Pinecone
    const vectors = chunks.map((chunk, index) => ({
      id: `episode-${chunk.metadata.episodeNumber}-chunk-${chunk.metadata.chunkIndex}`,
      values: embeddings[index],
      metadata: {
        ...chunk.metadata,
        text: chunk.text,
      } as RecordMetadata,
    }));

    // Upload to Pinecone in batches
    console.log('Uploading to Pinecone...');
    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);
      await upsertVectors(batch);
      console.log(`Uploaded batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(vectors.length / batchSize)}`);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully ingested ${episodes.length} episodes (${chunks.length} chunks)`,
      stats: {
        episodes: episodes.length,
        chunks: chunks.length,
        embeddings: embeddings.length,
      },
    });
  } catch (error) {
    console.error('Ingestion error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred during data ingestion' },
      { status: 500 }
    );
  }
}
