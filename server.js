import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import OpenAI, { toFile } from 'openai';
import { createServer as createViteServer } from 'vite';
import questionBank from './questions.js';

const app = express();
const isCombinedDevServer = process.argv.includes('--with-vite');
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
});

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

app.post('/api/evaluate-answer', upload.single('audio'), async (req, res) => {
  try {
    console.log('[AI] Received answer evaluation request.');

    if (!process.env.OPENAI_API_KEY) {
      res.status(500).json({ error: 'Thiếu OPENAI_API_KEY trong .env.' });
      return;
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const question = questionBank.find((item) => item.id === Number(req.body.questionId));

    if (!question) {
      res.status(404).json({ error: 'Không tìm thấy câu hỏi.' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: 'Cần có bản ghi âm.' });
      return;
    }

    console.log(`[AI] Question ${question.id}: transcribing ${req.file.size} bytes of audio.`);

    const audioFile = await toFile(
      req.file.buffer,
      req.file.originalname || 'answer.webm',
      { type: req.file.mimetype || 'audio/webm' },
    );

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'gpt-4o-mini-transcribe',
    });

    const transcript = transcription.text?.trim() ?? '';
    console.log(`[AI] Transcript received: ${transcript || '(empty)'}`);
    console.log('[AI] Calling OpenAI model to judge answer.');

    const response = await openai.responses.create({
      model: 'gpt-4o-mini',
      input: [
        {
          role: 'system',
          content: [
            'You grade short spoken student answers for a board game.',
            'Return only one result: correct, incorrect, or not_applicable.',
            'Use correct when the answer is meaningfully close, even if wording differs.',
            'Use incorrect when the answer attempts the question but is not close.',
            'Use not_applicable when the transcript is empty, unrelated, unclear, or not an answer.',
          ].join(' '),
        },
        {
          role: 'user',
          content: [
            `Question: ${question.question}`,
            `Real answer: ${question.answer}`,
            `Important keywords: ${(question.keywords ?? []).join(', ')}`,
            `Student transcript: ${transcript}`,
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

    const verdict = JSON.parse(response.output_text);
    console.log(`[AI] Verdict: ${verdict.result}`);

    res.json({
      question: {
        id: question.id,
        category: question.category,
        question: question.question,
        answer: question.answer,
      },
      transcript,
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

  const port = Number(isCombinedDevServer ? (process.env.DEV_PORT ?? 5173) : (process.env.PORT ?? 3001));
  const label = isCombinedDevServer ? 'App + API server' : 'API server';

  app.listen(port, '127.0.0.1', () => {
    console.log(`${label} running at http://127.0.0.1:${port}`);
    console.log(`OPENAI_API_KEY loaded: ${process.env.OPENAI_API_KEY ? 'yes' : 'no'}`);
  });
};

startServer();
