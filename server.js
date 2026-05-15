import 'dotenv/config';
import express from 'express';
import OpenAI from 'openai';
import { createServer as createViteServer } from 'vite';
import questionBank from './questions.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const isCombinedDevServer = process.argv.includes('--with-vite');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const verdictSchema = {
  name: 'answer_verdict',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      result: {
        type: 'string',
        enum: ['correct', 'incorrect', 'not_applicable'],
      },
    },
    required: ['result'],
  },
};

const gradeAnswer = async (openai, question, answer) => {
  const response = await openai.responses.create({
    model: 'gpt-4o-mini',
    input: [
      {
        role: 'system',
        content: [
          'You grade short typed student answers for a board game.',
          'The expected student language is Vietnamese.',
          'Compare the student answer against the real answer semantically.',
          'Return only one result: correct, incorrect, or not_applicable.',
          'Use correct when the answer is meaningfully close, even if wording differs.',
          'Use incorrect when the answer attempts the question but is not close.',
          'Use not_applicable when the answer is empty, unrelated, unclear, or not an answer.',
        ].join(' '),
      },
      {
        role: 'user',
        content: [
          `Question: ${question.question}`,
          `Real answer: ${question.answer}`,
          `Important keywords: ${(question.keywords ?? []).join(', ')}`,
          `Student answer: ${answer}`,
        ].join('\n'),
      },
    ],
    text: {
      format: {
        type: 'json_schema',
        ...verdictSchema,
      },
    },
  });

  return JSON.parse(response.output_text);
};

const createOpenAiClient = () => new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());

app.get('/api/questions/:id', (req, res) => {
  const question = questionBank.find((item) => item.id === Number(req.params.id));

  if (!question) {
    res.status(404).json({ error: 'Không tìm thấy câu hỏi.' });
    return;
  }

  res.json({
    id: question.id,
    category: question.category,
    question: question.question,
  });
});

app.post('/api/evaluate-answer', async (req, res) => {
  try {
    console.log('[AI] Received answer evaluation request.');

    if (!process.env.OPENAI_API_KEY) {
      res.status(500).json({ error: 'Thiếu OPENAI_API_KEY trong .env.' });
      return;
    }

    const question = questionBank.find((item) => item.id === Number(req.body.questionId));

    if (!question) {
      res.status(404).json({ error: 'Không tìm thấy câu hỏi.' });
      return;
    }

    const answer = req.body.answer?.trim() ?? '';

    if (!answer) {
      res.status(400).json({ error: 'Cần có nội dung câu trả lời.' });
      return;
    }

    const openai = createOpenAiClient();
    const verdict = await gradeAnswer(openai, question, answer);
    console.log(`[AI] Verdict: ${verdict.result}`);

    res.json({
      question: {
        id: question.id,
        category: question.category,
        question: question.question,
        answer: question.answer,
      },
      answer,
      verdict,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Không chấm được câu trả lời.' });
  }
});

const startServer = async () => {
  if (isCombinedDevServer) {
    const vite = await createViteServer({
      appType: 'spa',
      server: {
        middlewareMode: true,
      },
    });

    app.use(vite.middlewares);
  }
  if (!isCombinedDevServer) {
    app.use(express.static(path.join(__dirname, 'dist')));

    app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
   });
  }
  const port = Number(isCombinedDevServer ? (process.env.DEV_PORT ?? 5173) : (process.env.PORT ?? 3001));
  const label = isCombinedDevServer ? 'App + API server' : 'API server';

  app.listen(port, '0.0.0.0', () => {
    console.log(`${label} running at http://0.0.0.0:${port}`);
    console.log(`OPENAI_API_KEY loaded: ${process.env.OPENAI_API_KEY ? 'yes' : 'no'}`);
  });
};

startServer();
