'use client';

import { EpisodeCard } from './EpisodeCard';
import type { SearchResult } from '@/lib/types';

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
}

export function SearchResults({ results, query }: SearchResultsProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
        </h2>
      </div>
      <div className="space-y-4">
        {results.map((result, index) => (
          <EpisodeCard key={`${result.metadata.episodeNumber}-${result.metadata.chunkIndex}-${index}`} result={result} />
        ))}
      </div>
    </div>
  );
}
