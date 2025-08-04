import { Configuration, OpenAIApi } from 'openai';
import { getRelevantChunks } from '../rag/ragEngine';
import { runPluginsIfNeeded } from '../plugins/pluginManager';

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

// In-memory session memory: { [sessionId]: Array<{ role: 'user'|'assistant', content: string }> }
const sessionMemory: Record<string, Array<{ role: 'user' | 'assistant', content: string }>> = {};

export async function handleAgentMessage(sessionId: string, message: string): Promise<{ reply: string, pluginName?: string, pluginOutput?: string }> {
  // Store user message
  if (!sessionMemory[sessionId]) sessionMemory[sessionId] = [];
  sessionMemory[sessionId].push({ role: 'user', content: message });

  // Get last 2 messages for memory
  const memory = sessionMemory[sessionId].slice(-2);

  // RAG: retrieve top 3 relevant chunks
  const relevantChunks = await getRelevantChunks(message, 3);
  const ragContext = relevantChunks.map(c => c.text).join('\n---\n');

  // Plugin: check and run if needed
  const pluginResult = await runPluginsIfNeeded(message);
  let pluginContext = '';
  if (pluginResult.output) {
    pluginContext = `\nPlugin (${pluginResult.pluginName}) output: ${pluginResult.output}`;
  }

  // Compose prompt
  const systemPrompt = `You are a helpful AI agent with access to conversation memory, relevant context, and plugin outputs.

MEMORY (Last 2 messages):
${memory.map(m => `${m.role}: ${m.content}`).join('\n')}

RELEVANT CONTEXT:
${ragContext}

${pluginContext ? `PLUGIN OUTPUT:
${pluginContext}` : ''}

INSTRUCTIONS:
- Use the memory and context to provide relevant, helpful responses
- If plugin output is provided, incorporate it naturally into your response
- Be concise and clear
- If you don't have relevant information, say so politely`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...memory,
  ];

  // Call OpenAI
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages,
  });
  const reply = completion.data.choices[0].message?.content || '';

  // Store assistant reply
  sessionMemory[sessionId].push({ role: 'assistant', content: reply });
  return { reply, pluginName: pluginResult.pluginName, pluginOutput: pluginResult.output };
}