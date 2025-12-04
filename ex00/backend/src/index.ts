import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY no está definida en .env');
}

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.post('/echo', async (req, res) => {
  const receivedText = req.body.text;

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({model: 'gemini-2.5-flash'});

    const prompt = `Responde de manera amigable y breve (máximo 2-3 frases) al siguiente mensaje: "${receivedText}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();
  
    res.json({
      message: 'Text recived correctly',
      receivedText: receivedText,
      processedText: aiResponse
    });
  } catch (error: any) {
    console.error('Gemini error:', error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});