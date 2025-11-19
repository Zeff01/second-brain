'use client';

import { Search, Brain, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  type: 'initial' | 'no-results';
  query?: string;
}

export function EmptyState({ type, query }: EmptyStateProps) {
  if (type === 'no-results' && query) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-16 text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-gray-100 p-6">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No results found
        </h3>
        <p className="text-gray-600 mb-6">
          We couldn't find anything matching "{query}". Try different keywords or rephrase your question.
        </p>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-left">
          <h4 className="font-medium text-blue-900 mb-2">Search tips:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Try using different or more general keywords</li>
            <li>• Check for typos in your search query</li>
            <li>• Use complete questions for better results</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-16 text-center">
      <div className="flex justify-center mb-6">
        <div className="rounded-full bg-gradient-to-br from-blue-100 to-purple-100 p-6">
          <Brain className="h-12 w-12 text-blue-600" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        Your Second Brain for AAI Episodes
      </h2>
      <p className="text-gray-600 mb-8">
        Search through podcast transcripts using natural language. Ask questions and get relevant answers instantly.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        <div className="bg-gray-50 rounded-lg p-4">
          <Sparkles className="h-6 w-6 text-blue-600 mb-2" />
          <h3 className="font-semibold text-sm mb-1">Semantic Search</h3>
          <p className="text-xs text-gray-600">
            Find answers based on meaning, not just keywords
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <Brain className="h-6 w-6 text-purple-600 mb-2" />
          <h3 className="font-semibold text-sm mb-1">Smart Results</h3>
          <p className="text-xs text-gray-600">
            Get the most relevant content from episodes
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <Search className="h-6 w-6 text-green-600 mb-2" />
          <h3 className="font-semibold text-sm mb-1">Fast & Accurate</h3>
          <p className="text-xs text-gray-600">
            Instant search across all episodes
          </p>
        </div>
      </div>
    </div>
  );
}
