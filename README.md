# Pluggable AI Agent Server (RAG + Plugins)

A TypeScript backend system that provides an AI agent with:
- **Session-based memory** for conversation continuity
- **RAG (Retrieval-Augmented Generation)** using document embeddings
- **Plugin system** for weather and math operations
- **OpenAI integration** for LLM responses

## Setup

1. Clone the repo
2. Run `npm install`
3. Create a `.env` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=your-openai-api-key-here
   PORT=3000
   ```
4. Run `npm run dev`

## API Endpoints

### POST /agent/message

Send a message to the AI agent.

**Request:**
```json
{
  "message": "Hello, who are you?",
  "session_id": "user123"
}
```

**Response:**
```json
{
  "reply": "Hello! I'm an AI agent...",
  "pluginName": "weather",
  "pluginOutput": "The weather in Bangalore is 28°C, partly cloudy."
}
```

## Architecture

- **Agent Core**: OpenAI integration with session memory
- **RAG Engine**: Document chunking, embedding, and retrieval
- **Plugin System**: Weather and math plugins with intent detection
- **Prompt Engineering**: Structured prompts with memory, context, and plugin outputs

## Usage Examples

### Basic Conversation
```bash
curl -X POST http://localhost:3000/agent/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "session_id": "test1"}'
```

### Weather Plugin
```bash
curl -X POST http://localhost:3000/agent/message \
  -H "Content-Type: application/json" \
  -d '{"message": "search weather in Bangalore", "session_id": "test1"}'
```

### Math Plugin
```bash
curl -X POST http://localhost:3000/agent/message \
  -H "Content-Type: application/json" \
  -d '{"message": "what is 2 + 2 * 5", "session_id": "test1"}'
```

## Features

- **Memory**: Maintains conversation history per session
- **RAG**: Retrieves relevant document chunks for context
- **Plugins**: Weather (mocked) and Math evaluator
- **Intent Detection**: Automatically triggers plugins based on message content
