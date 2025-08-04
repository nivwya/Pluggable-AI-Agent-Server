import fs from 'fs';
import path from 'path';
import { Configuration, OpenAIApi } from 'openai';

const DOCS_DIR = path.join(__dirname, '../../data/docs');
const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

// Type for a document chunk
interface Chunk {
  id: string;
  text: string;
  embedding?: number[];
}

// Load and chunk all docs at startup
const chunks: Chunk[] = [];

function chunkText(text: string, chunkSize = 200): string[] {
  // Simple chunking by sentences, up to chunkSize chars
  const sentences = text.split(/(?<=[.!?])\s+/);
  const result: string[] = [];
  let current = '';
  for (const s of sentences) {
    if ((current + s).length > chunkSize && current) {
      result.push(current);
      current = '';
    }
    current += s + ' ';
  }
  if (current.trim()) result.push(current.trim());
  return result;
}

function loadDocs() {
  const files = fs.readdirSync(DOCS_DIR);
  let id = 0;
  for (const file of files) {
    const content = fs.readFileSync(path.join(DOCS_DIR, file), 'utf-8');
    for (const chunk of chunkText(content)) {
      chunks.push({ id: `${file}-${id++}`, text: chunk });
    }
  }
}

// Cosine similarity
function cosineSim(a: number[], b: number[]): number {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dot / (magA * magB);
}

// Embed all chunks at startup
async function embedAllChunks() {
  for (const chunk of chunks) {
    const resp = await openai.createEmbedding({
      model: 'text-embedding-ada-002',
      input: chunk.text,
    });
    chunk.embedding = resp.data.data[0].embedding;
  }
}

// Get top N relevant chunks for a query
export async function getRelevantChunks(query: string, topN = 3): Promise<Chunk[]> {
  const resp = await openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input: query,
  });
  const queryEmbedding = resp.data.data[0].embedding;
  const scored = chunks.map(chunk => ({
    chunk,
    score: chunk.embedding ? cosineSim(queryEmbedding, chunk.embedding) : -1,
  }));
  return scored.sort((a, b) => b.score - a.score).slice(0, topN).map(s => s.chunk);
}

// Initialize docs and embeddings at startup
loadDocs();
export async function initRAG() {
  await embedAllChunks();
}