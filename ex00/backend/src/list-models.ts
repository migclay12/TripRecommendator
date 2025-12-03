import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('❌ Error: GEMINI_API_KEY no está definida en .env');
  process.exit(1);
}

async function listModels() {
  try {
    console.log('🔍 Listando modelos disponibles...\n');

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY as string);
    
    // Intentar listar modelos usando fetch directo
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        console.error('❌ Error 404: La API de Gemini no está habilitada en tu proyecto');
        console.error('\n💡 Solución:');
        console.error('   1. Ve a: https://console.cloud.google.com/apis/library');
        console.error('   2. Busca "Generative Language API"');
        console.error('   3. Haz clic en "HABILITAR" o "ENABLE"');
        console.error('   4. Espera 1-2 minutos y vuelve a intentar\n');
      } else {
        console.error(`❌ Error ${response.status}: ${response.statusText}`);
      }
      process.exit(1);
    }

    const data = await response.json() as any;
    
    console.log('✅ API habilitada correctamente!\n');
    console.log('📋 Modelos disponibles:\n');
    
    if (data.models && data.models.length > 0) {
      data.models.forEach((model: any) => {
        if (model.supportedGenerationMethods?.includes('generateContent')) {
          console.log(`   ✓ ${model.name}`);
          if (model.displayName) {
            console.log(`     ${model.displayName}`);
          }
        }
      });
    } else {
      console.log('   No se encontraron modelos');
    }

  } catch (error: any) {
    console.error('\n❌ Error al listar modelos:');
    console.error(error.message);
    
    if (error.message?.includes('404')) {
      console.error('\n💡 La API de Gemini no está habilitada. Sigue los pasos arriba.');
    }
    
    process.exit(1);
  }
}

listModels();