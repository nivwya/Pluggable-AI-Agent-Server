# NOTES

## AI-Generated vs Human

**AI-Generated:**
- Project structure and folder setup
- Basic Express server setup
- OpenAI integration code
- RAG implementation with embeddings
- Plugin system architecture
- Prompt engineering structure
- README documentation

**Human:**
- Project requirements analysis
- Architecture decisions
- Testing and validation
- Deployment planning

## Bugs & Solutions

1. **Windows mkdir command syntax**
   - Issue: `mkdir -p` not supported on Windows
   - Solution: Used separate `mkdir` commands for each directory

2. **OpenAI API integration**
   - Issue: Need to handle async embedding calls
   - Solution: Proper async/await handling in RAG engine

3. **Plugin intent detection**
   - Issue: Regex patterns for weather/math detection
   - Solution: Simple but effective pattern matching

## Agent Routing & Context

**Plugin Routing:**
- Uses regex patterns to detect intent
- Weather: matches "weather in [location]"
- Math: matches "what is/calculate/solve [expression]"
- Extracts query and calls appropriate plugin

**Memory Management:**
- In-memory storage per session_id
- Stores last 2 messages for context
- Maintains conversation continuity

**RAG Context:**
- Chunks markdown files at startup
- Embeds all chunks using OpenAI
- Retrieves top 3 relevant chunks per query
- Uses cosine similarity for ranking
- Injects context into system prompt

**Prompt Structure:**
- Clear sections: Memory, Context, Plugin Output, Instructions
- Structured format for better LLM understanding
- Incorporates all available information sources