'use client';

import { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { SearchResults } from './components/SearchResults';
import { LoadingState } from './components/LoadingState';
import { EmptyState } from './components/EmptyState';
import { SearchSuggestions } from './components/SearchSuggestions';
import type { SearchResult } from '@/lib/types';

export default function Home() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentQuery(query);
    setHasSearched(true);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, limit: 5 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Search failed');
      }

      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
              <span className="text-white text-xl font-bold">SB</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Second Brain</h1>
              <p className="text-xs text-gray-500">AAI Episode Search</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <SearchBar
            onSearch={handleSearch}
            isLoading={isLoading}
            initialQuery={currentQuery}
          />
        </div>

        {/* Search Suggestions */}
        <SearchSuggestions
          onSelectSuggestion={handleSearch}
          show={!hasSearched && !isLoading}
        />

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              <h3 className="font-semibold mb-1">Error</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && <LoadingState />}

        {/* Results or Empty States */}
        {!isLoading && !error && (
          <>
            {hasSearched && results.length === 0 && (
              <EmptyState type="no-results" query={currentQuery} />
            )}
            {!hasSearched && <EmptyState type="initial" />}
            {results.length > 0 && (
              <SearchResults results={results} query={currentQuery} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>
            Powered by OpenAI Embeddings & Pinecone Vector Database
          </p>
        </div>
      </footer>
    </div>
  );
}
