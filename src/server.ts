import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { handleAgentMessage } from './agent/agentCore';
import { initRAG } from './rag/ragEngine';

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.post('/agent/message', async (req, res) => {
  const { message, session_id } = req.body;
  if (!message || !session_id) {
    return res.status(400).json({ error: 'Missing message or session_id' });
  }
  try {
    const result = await handleAgentMessage(session_id, message);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Agent error', details: (err as Error).message });
  }
});

(async () => {
  await initRAG();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();