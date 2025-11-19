/**
 * Search API endpoint for semantic search
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateEmbedding } from '@/lib/embeddings';
import { queryVectors } from '@/lib/vectordb';
import type { SearchRequest, SearchResponse, SearchResult } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: SearchRequest = await request.json();
    const { query, limit = 5 } = body;

    // Validate input
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Generate embedding for the search query
    const queryEmbedding = await generateEmbedding(query);

    // Query Pinecone for similar vectors
    const results = await queryVectors(queryEmbedding, limit);

    // Log the raw results from Pinecone
    console.log('=== SEARCH QUERY ===');
    console.log('Query:', query);
    console.log('Total matches returned:', results.matches.length);
    console.log('\n=== RAW RESULTS FROM PINECONE ===');
    results.matches.forEach((match, index) => {
      console.log(`\n--- Result ${index + 1} ---`);
      console.log('Score:', match.score);
      console.log('Text preview:', (match.metadata?.text as string)?.substring(0, 200) + '...');
      console.log('Episode:', match.metadata?.episodeNumber);
      console.log('Full metadata:', match.metadata);
    });

    // Filter results by relevance threshold (0.3 = 30% match minimum)
    // This prevents showing irrelevant results for nonsense queries
    const RELEVANCE_THRESHOLD = 0.3;
    const filteredMatches = results.matches.filter(
      (match) => (match.score || 0) >= RELEVANCE_THRESHOLD
    );

    console.log('\n=== FILTERED RESULTS ===');
    console.log('Filtered matches count:', filteredMatches.length);
    console.log('Threshold applied:', RELEVANCE_THRESHOLD);

    // Format results
    const searchResults: SearchResult[] = filteredMatches.map((match) => ({
      text: (match.metadata?.text as string) || '',
      score: match.score || 0,
      metadata: {
        episodeNumber: (match.metadata?.episodeNumber as number) || 0,
        episodeTitle: (match.metadata?.episodeTitle as string) || '',
        episodeDate: (match.metadata?.episodeDate as string) || '',
        sourceUrl: (match.metadata?.sourceUrl as string) || '',
        chunkIndex: (match.metadata?.chunkIndex as number) || 0,
        timestamp: match.metadata?.timestamp as string | undefined,
      },
    }));

    const response: SearchResponse = {
      results: searchResults,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Search API error:', error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'API configuration error. Please check your environment variables.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'An error occurred while processing your search' },
      { status: 500 }
    );
  }
}
