import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY is not defined in .env');
}

app.use(cors());
app.use(express.json());

// Extract JSON from AI response text
function extractJSON(text: string): string | null {
  let cleaned = text.trim();
  
  // Remove markdown code blocks
  cleaned = cleaned.replace(/```json\s*/gi, '').replace(/```\s*/g, '');
  
  // Find the first '[' indicating array start
  const arrayStart = cleaned.indexOf('[');
  if (arrayStart === -1) {
    return null;
  }
  
  // Find matching ']' by tracking brackets
  let bracketCount = 0;
  let inString = false;
  let escapeNext = false;
  
  for (let i = arrayStart; i < cleaned.length; i++) {
    const char = cleaned[i];
    
    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    
    if (char === '\\') {
      escapeNext = true;
      continue;
    }
    
    if (char === '"' && !escapeNext) {
      inString = !inString;
      continue;
    }
    
    if (!inString) {
      if (char === '[') {
        bracketCount++;
      } else if (char === ']') {
        bracketCount--;
        if (bracketCount === 0) {
          return cleaned.substring(arrayStart, i + 1);
        }
      }
    }
  }
  
  return null;
}

// Validate and clean destination data
function validateDestination(dest: any, index: number) {
  return {
    id: dest.id || String(index + 1),
    name: dest.name || 'Unknown',
    country: dest.country || 'Unknown',
    description: dest.description || 'No description available',
    lat: dest.lat && typeof dest.lat === 'number' && dest.lat >= -90 && dest.lat <= 90 
      ? dest.lat 
      : undefined,
    lng: dest.lng && typeof dest.lng === 'number' && dest.lng >= -180 && dest.lng <= 180 
      ? dest.lng 
      : undefined,
  };
}

// Generate prompt for AI
function generatePrompt(userMessage: string): string {
  return `Based on the following message: "${userMessage}", 
  return a JSON array of recommended destinations. 
  Each destination must have exactly this structure:
  {
    "id": "1",
    "name": "Place name",
    "country": "Country",
    "description": "2-3 line description of why this destination is recommended",
    "lat": 40.4168,
    "lng": -3.7038
  }
  
  IMPORTANT: 
  - "lat" must be the latitude of the place (decimal number between -90 and 90)
  - "lng" must be the longitude of the place (decimal number between -180 and 180)
  - Coordinates must be accurate and real for the mentioned place
  - Do NOT repeat destinations that were already recommended in previous messages
  - If the user is asking for something different or refining their request, provide new destinations accordingly
  - Return ONLY the JSON, no additional text, no markdown, no explanations
  - The format must be a valid JSON array
  - DO NOT include the word "json" before the array
  - DO NOT include any text before or after the JSON array`;
}

// Get error message based on error type
function getErrorMessage(error: any): { message: string; statusCode: number } {
  if (error?.status === 503) {
    return {
      message: 'The AI service is temporarily overloaded. Please try again in a few moments.',
      statusCode: 503,
    };
  }
  
  if (error?.status === 429) {
    return {
      message: 'Request limit exceeded. Please wait a moment before trying again.',
      statusCode: 429,
    };
  }
  
  if (error instanceof SyntaxError) {
    return {
      message: 'Error parsing AI response. Please try again.',
      statusCode: 500,
    };
  }
  
  return {
    message: error?.message ? `Error: ${error.message}` : 'Error processing request with AI',
    statusCode: 500,
  };
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.post('/echo', async (req, res) => {
  const userMessage = req.body.text;

  if (!userMessage || typeof userMessage !== 'string') {
    return res.status(400).json({
      error: 'Invalid request. Text field is required.',
      destinations: [],
    });
  }

  const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY as string);
      const model = genAI.getGenerativeModel({ model: modelName });
      const prompt = generatePrompt(userMessage);

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiResponse = response.text();

      console.log('AI raw response (first 500 chars):', aiResponse.substring(0, 500));

      const jsonString = extractJSON(aiResponse);
      
      if (!jsonString) {
        throw new Error('Could not extract valid JSON from response');
      }

      console.log('Extracted JSON length:', jsonString.length);

      const destinations = JSON.parse(jsonString);
    
      if (!Array.isArray(destinations)) {
        throw new Error('Response is not a valid array');
      }

      const validatedDestinations = destinations.map(validateDestination);

      console.log(`Successfully processed ${validatedDestinations.length} destinations`);

      return res.json({
        message: 'Text received correctly',
        receivedText: userMessage,
        destinations: validatedDestinations,
      });
    } catch (error: any) {
      lastError = error;
      console.error(`Error with model ${modelName}:`, error.message);
      
      // Try next model on specific errors
      if (error.status === 503 || error.status === 429) {
        console.log(`Model ${modelName} ${error.status === 503 ? 'overloaded' : 'rate limited'}, trying next model...`);
        continue;
      }
      
      if (error.status === 404) {
        console.log(`Model ${modelName} not found or unavailable, trying next model...`);
        continue;
      }
      
      if (error instanceof SyntaxError) {
        console.log(`Parsing error with ${modelName}, trying next model...`);
        continue;
      }
      
      // For other errors, stop trying models
      break;
    }
  }

  // All models failed
  console.error('All models failed. Last error:', lastError);
  const { message, statusCode } = getErrorMessage(lastError);

  return res.status(statusCode).json({
    error: message,
    destinations: [],
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
