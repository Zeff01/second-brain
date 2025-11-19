/**
 * Text chunking utilities for processing transcripts
 */

import type { TranscriptChunk, ChunkMetadata, Episode } from './types';

/**
 * Split text into chunks with overlap
 * @param text - The text to chunk
 * @param chunkSize - Target size for each chunk in characters (default: 1500)
 * @param overlap - Number of characters to overlap between chunks (default: 200)
 */
export function chunkText(
  text: string,
  chunkSize: number = 1500,
  overlap: number = 200
): string[] {
  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    // Skip any leading whitespace at the start of this chunk
    while (startIndex < text.length && /\s/.test(text[startIndex])) {
      startIndex++;
    }

    if (startIndex >= text.length) break;

    // Get chunk
    let endIndex = startIndex + chunkSize;

    // If not at the end, try to break at a sentence boundary
    if (endIndex < text.length) {
      // Look for sentence endings near the chunk boundary
      const searchStart = Math.max(startIndex, endIndex - 100);
      const searchText = text.substring(searchStart, endIndex + 100);
      const sentenceEndings = ['. ', '! ', '? ', '.\n', '!\n', '?\n'];

      let bestBreak = -1;
      for (const ending of sentenceEndings) {
        const index = searchText.lastIndexOf(ending);
        if (index > bestBreak) {
          bestBreak = index;
        }
      }

      if (bestBreak !== -1) {
        endIndex = searchStart + bestBreak + 2; // Include the punctuation and space
      }
    }

    // Extract chunk
    const chunk = text.substring(startIndex, Math.min(endIndex, text.length));
    if (chunk.trim().length > 0) {
      chunks.push(chunk.trim());
    }

    // Move to next chunk with overlap, but find a good starting point
    let nextStart = endIndex - overlap;

    // Find the start of the next sentence within the overlap region
    // Look backwards from nextStart to find a sentence ending
    if (nextStart > startIndex && nextStart < text.length) {
      const overlapText = text.substring(nextStart - 50, nextStart + 50);
      const sentenceStarts = ['. ', '! ', '? ', '.\n', '!\n', '?\n'];

      let bestStart = -1;
      for (const ending of sentenceStarts) {
        const index = overlapText.indexOf(ending);
        if (index !== -1 && (bestStart === -1 || index < bestStart)) {
          bestStart = index;
        }
      }

      if (bestStart !== -1) {
        // Start after the sentence ending (skip punctuation and space)
        nextStart = nextStart - 50 + bestStart + 2;
      }
    }

    startIndex = nextStart;

    // Prevent infinite loop
    if (startIndex <= endIndex - chunkSize && endIndex < text.length) {
      startIndex = endIndex;
    }
  }

  return chunks;
}

/**
 * Process an episode into chunks with metadata
 */
export function processEpisode(episode: Episode): TranscriptChunk[] {
  const textChunks = chunkText(episode.transcript);

  return textChunks.map((text, index) => ({
    text,
    metadata: {
      episodeNumber: episode.number,
      episodeTitle: episode.title,
      episodeDate: episode.date,
      sourceUrl: episode.url,
      chunkIndex: index,
    },
  }));
}

/**
 * Process multiple episodes into chunks
 */
export function processEpisodes(episodes: Episode[]): TranscriptChunk[] {
  const allChunks: TranscriptChunk[] = [];

  for (const episode of episodes) {
    const chunks = processEpisode(episode);
    allChunks.push(...chunks);
  }

  return allChunks;
}
