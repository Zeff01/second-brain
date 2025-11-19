/**
 * Script to process transcript text files into JSON format
 */

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const outputFile = path.join(dataDir, 'transcripts.json');

// Read all .txt files from data directory
const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.txt'));

console.log(`Found ${files.length} transcript files`);

const episodes = [];

files.forEach(file => {
  // Extract episode number from filename (e.g., "125.txt" or "128. Vayner Media.txt")
  const match = file.match(/^(\d+)/);
  if (!match) {
    console.log(`Skipping file: ${file} (no episode number found)`);
    return;
  }

  const episodeNumber = parseInt(match[1]);

  // Extract title if present (e.g., "128. Vayner Media.txt" -> "Vayner Media")
  const titleMatch = file.match(/^\d+\.\s*(.+)\.txt$/);
  const episodeTitle = titleMatch
    ? titleMatch[1].trim()
    : `AAI Episode ${episodeNumber}`;

  // Read the transcript content
  const filePath = path.join(dataDir, file);
  const transcript = fs.readFileSync(filePath, 'utf-8');

  // Create episode object
  episodes.push({
    number: episodeNumber,
    title: episodeTitle,
    date: "2024-01-01", // Placeholder date - you can update this manually if you have the real dates
    url: `https://youtube.com/watch?v=episode${episodeNumber}`, // Placeholder URL
    transcript: transcript.trim()
  });

  console.log(`Processed: Episode ${episodeNumber} - ${episodeTitle} (${transcript.length} chars)`);
});

// Sort episodes by number
episodes.sort((a, b) => a.number - b.number);

// Write to JSON file
fs.writeFileSync(outputFile, JSON.stringify(episodes, null, 2));

console.log(`\n✅ Successfully created ${outputFile}`);
console.log(`📊 Total episodes: ${episodes.length}`);
console.log(`📝 Total characters: ${episodes.reduce((sum, ep) => sum + ep.transcript.length, 0)}`);
