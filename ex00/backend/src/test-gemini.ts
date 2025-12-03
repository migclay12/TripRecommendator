import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('❌ Error: GEMINI_API_KEY no está definida en .env');
  console.log('💡 Asegúrate de tener un archivo .env con: GEMINI_API_KEY=tu_clave_aqui');
  process.exit(1);
}

// Verificar formato de la API key
console.log('🔑 API Key detectada:', GEMINI_API_KEY.substring(0, 10) + '...' + GEMINI_API_KEY.substring(GEMINI_API_KEY.length - 5));
console.log('📏 Longitud de API Key:', GEMINI_API_KEY.length, '\n');

async function testGemini() {
  // Lista de modelos a probar (en orden de preferencia)
  const modelsToTry = [
    'gemini-2.5-flash',  // Más rápido y gratuito (recomendado)
  ];

  for (const modelName of modelsToTry) {
    try {
      console.log(`🔍 Probando con modelo: ${modelName}...\n`);

      // Inicializar el cliente de Gemini
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY as string);
      const model = genAI.getGenerativeModel({ model: modelName });

      // Hacer una pregunta simple de prueba
      const prompt = 'Responde en una sola frase: ¿Cuál es la capital de Francia?';
      
      console.log(`📝 Pregunta: ${prompt}\n`);
      console.log('⏳ Esperando respuesta de Gemini...\n');

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log('✅ ¡Conexión exitosa!\n');
      console.log(`✨ Modelo funcionando: ${modelName}\n`);
      console.log('📤 Respuesta de Gemini:');
      console.log('─'.repeat(50));
      console.log(text);
      console.log('─'.repeat(50));
      console.log('\n🎉 Tu API key funciona correctamente!');
      return; // Salir si funciona

    } catch (error: any) {
      console.error(`❌ Error con modelo ${modelName}:`);
      console.error('─'.repeat(50));
      
      // Mostrar información detallada del error
      if (error.message) {
        console.error(`Mensaje: ${error.message}`);
      }
      
      if (error.status) {
        console.error(`Status HTTP: ${error.status}`);
      }
      
      if (error.statusText) {
        console.error(`Status Text: ${error.statusText}`);
      }
      
      // Errores comunes y sus soluciones
      if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('401')) {
        console.error('\n💡 Problema: API Key inválida o incorrecta');
        console.error('   Solución: Verifica que la clave en .env sea correcta');
      } else if (error.message?.includes('MODEL_NOT_FOUND') || error.message?.includes('404')) {
        console.error('\n💡 Problema: Modelo no encontrado');
        console.error('   Solución: El modelo puede no estar disponible, probando siguiente...');
      } else if (error.message?.includes('API_KEY_NOT_FOUND')) {
        console.error('\n💡 Problema: API Key no encontrada');
        console.error('   Solución: Verifica que GEMINI_API_KEY esté en tu archivo .env');
      } else if (error.message?.includes('PERMISSION_DENIED') || error.message?.includes('403')) {
        console.error('\n💡 Problema: Permisos insuficientes');
        console.error('   Solución: La API de Gemini puede no estar habilitada en tu proyecto de Google Cloud');
        console.error('   Ve a: https://console.cloud.google.com/apis/library');
      }
      
      console.error('─'.repeat(50));
      console.log(''); // Línea en blanco
      
      // Si es el último modelo, salir
      if (modelName === modelsToTry[modelsToTry.length - 1]) {
        console.error('❌ Ningún modelo funcionó. Revisa los errores arriba.');
        process.exit(1);
      }
    }
  }
}

// Ejecutar la prueba
testGemini();