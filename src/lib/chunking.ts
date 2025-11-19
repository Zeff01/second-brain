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
  // Clean the text first: replace tildes with spaces and normalize whitespace
  const cleanedText = text
    .replace(/~/g, ' ')
    .replace(/\\/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Split into sentences first
  const sentences = cleanedText.split(/(?<=[.!?])\s+/);

  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentLength = 0;

  for (const sentence of sentences) {
    const sentenceLength = sentence.length;

    // If adding this sentence would exceed chunk size and we have content
    if (currentLength + sentenceLength > chunkSize && currentChunk.length > 0) {
      // Save current chunk
      chunks.push(currentChunk.join(' '));

      // Start new chunk with overlap (last few sentences)
      const overlapSentences: string[] = [];
      let overlapLength = 0;

      // Take sentences from the end of current chunk for overlap
      for (let i = currentChunk.length - 1; i >= 0 && overlapLength < overlap; i--) {
        overlapSentences.unshift(currentChunk[i]);
        overlapLength += currentChunk[i].length + 1;
      }

      currentChunk = overlapSentences;
      currentLength = overlapLength;
    }

    // Add sentence to current chunk
    currentChunk.push(sentence);
    currentLength += sentenceLength + 1; // +1 for space
  }

  // Add the last chunk if it has content
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' '));
  }

  return chunks.filter(chunk => chunk.trim().length > 0);
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
