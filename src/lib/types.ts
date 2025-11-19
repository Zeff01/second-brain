/**
 * Type definitions for the Second Brain application
 */

export interface TranscriptChunk {
  text: string;
  metadata: ChunkMetadata;
}

export interface ChunkMetadata {
  episodeNumber: number;
  episodeTitle: string;
  episodeDate: string;
  sourceUrl: string;
  chunkIndex: number;
  timestamp?: string;
}

export interface SearchResult {
  text: string;
  score: number;
  metadata: ChunkMetadata;
}

export interface SearchRequest {
  query: string;
  limit?: number;
}

export interface SearchResponse {
  results: SearchResult[];
}

export interface Episode {
  number: number;
  title: string;
  date: string;
  url: string;
  transcript: string;
}
