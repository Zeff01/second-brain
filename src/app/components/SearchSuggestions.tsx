'use client';

import { Sparkles } from 'lucide-react';

interface SearchSuggestionsProps {
  onSelectSuggestion: (query: string) => void;
  show: boolean;
}

const SUGGESTIONS = [
  "What was discussed about DeepSeek?",
  "Tell me about AI prompting frameworks",
  "What are the key insights from Vayner Media episodes?",
  "How can I use AI for my business?",
  "What was covered about three waves of scale?",
  "Explain the value alignment problem",
  "What was said about reasoning models?",
];

export function SearchSuggestions({ onSelectSuggestion, show }: SearchSuggestionsProps) {
  if (!show) return null;

  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
      <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
        <Sparkles className="h-4 w-4" />
        <span className="font-medium">Try asking:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelectSuggestion(suggestion)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-sm transition-all duration-200 cursor-pointer"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
