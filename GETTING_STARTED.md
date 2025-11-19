# Getting Started - Second Brain Project

## Project Setup Complete!

Your Second Brain project structure has been initialized successfully.

## Next Steps

### 1. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your API keys:

```bash
cp .env.example .env.local
```

Then add your keys:
- `OPENAI_API_KEY` - Get from https://platform.openai.com/api-keys
- `PINECONE_API_KEY` - Get from https://app.pinecone.io/
- `PINECONE_ENVIRONMENT` - Your Pinecone environment (e.g., "us-east-1-aws")

### 2. Add Transcript Data

Replace the placeholder data in `data/transcripts.json` with actual transcript data from the last 20 AAI YouTube episodes.

### 3. Development Workflow

Start the development server:
```bash
npm run dev
```

The app will be available at http://localhost:3000

### 4. Implementation Order

Follow these steps to complete the implementation:

1. **Data Ingestion** - Create the ingestion script in `scripts/ingest.ts`
2. **Search API** - Implement the search endpoint in `src/app/api/search/route.ts`
3. **UI Components** - Build the search interface components
4. **Main Page** - Wire everything together in `src/app/page.tsx`

## Project Structure

```
second-brain/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── search/      # Search API endpoint
│   │   │   └── ingest/      # Data ingestion endpoint
│   │   ├── components/      # UI components (to be created)
│   │   ├── layout.tsx
│   │   └── page.tsx         # Main search interface
│   ├── components/ui/       # shadcn/ui components
│   └── lib/
│       ├── types.ts         # TypeScript type definitions
│       ├── vectordb.ts      # Pinecone client utilities
│       ├── embeddings.ts    # OpenAI embedding functions
│       └── chunking.ts      # Text chunking logic
├── data/
│   └── transcripts.json     # Episode transcript data
├── scripts/
│   └── ingest.ts            # Ingestion script (to be created)
└── .env.local              # Environment variables
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Pinecone Documentation](https://docs.pinecone.io/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
