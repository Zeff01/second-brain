'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { SearchResult } from '@/lib/types';

interface EpisodeCardProps {
  result: SearchResult;
}

export function EpisodeCard({ result }: EpisodeCardProps) {
  const { text, score, metadata } = result;
  const { episodeNumber, episodeTitle, episodeDate, sourceUrl } = metadata;
  const [isExpanded, setIsExpanded] = useState(false);

  // Log the original text to see what we're receiving
  console.log('=== ORIGINAL TEXT FROM API ===');
  console.log('Episode:', episodeNumber);
  console.log('Raw text:', text);
  console.log('Text length:', text.length);
  console.log('First 200 chars:', text.substring(0, 200));

  // Clean up text by removing tilde characters, backslashes, and extra whitespace
  const cleanText = text
    .replace(/~/g, ' ')
    .replace(/\\/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  console.log('=== CLEANED TEXT ===');
  console.log('Cleaned text:', cleanText);
  console.log('Cleaned length:', cleanText.length);
  console.log('First 200 chars:', cleanText.substring(0, 200));

  // Format the score as a percentage
  const relevanceScore = Math.round(score * 100);

  // Check if text is long enough to need expansion
  const needsExpansion = cleanText.length > 400;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                Episode {episodeNumber}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {relevanceScore}% match
              </Badge>
            </div>
            <h3 className="font-semibold text-lg leading-tight">
              {episodeTitle}
            </h3>
          </div>
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
              title="View episode"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>{episodeDate}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <p className={`text-gray-700 leading-relaxed ${!isExpanded && needsExpansion ? 'line-clamp-6' : ''}`}>
            {cleanText}
          </p>
        </div>
        {needsExpansion && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 text-blue-600 hover:text-blue-800 p-0 h-auto font-normal cursor-pointer"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Read more
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
