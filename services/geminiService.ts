import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("La variable de entorno API_KEY no está configurada.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ideaGenerationModel = 'gemini-2.5-flash';
const storyGenerationModel = 'gemini-2.5-flash';
const ttsModel = 'gemini-2.5-flash-preview-tts';

/**
 * Genera una idea de cuento al estilo de "La Dimensión Desconocida".
 * @returns Una promesa que se resuelve con la idea generada.
 */
export const generateIdea = async (): Promise<string> => {
    try {
        const prompt = `Genera una única premisa intrigante para un cuento al estilo de "La Dimensión Desconocida" (The Twilight Zone). La idea debe estar en español, ser concisa (una o dos frases) y presentar a una persona ordinaria enfrentándose a una situación extraordinaria con un toque de ironía o misterio.
Ejemplo 1: Un hombre compra unas gafas que le permiten ver los pensamientos de los demás, pero solo los más crueles y egoístas.
Ejemplo 2: Una mujer se da cuenta de que todos los maniquíes de los escaparates de su ciudad son personas que desaparecieron la semana anterior.
Ejemplo 3: Un viajante de negocios se aloja en un hotel donde su llave abre todas las puertas, y descubre que cada habitación es una versión diferente de su propio futuro.`;
        
        const response = await ai.models.generateContent({
            model: ideaGenerationModel,
            contents: prompt,
            config: {
                temperature: 1,
            }
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error en generateIdea:", error);
        throw new Error("No se pudo conectar con el servicio de IA para generar una idea.");
    }
};

/**
 * Genera un cuento de misterio completo en streaming a partir de una idea.
 * @param idea - La premisa para el cuento.
 * @returns Un iterador asíncrono que produce los trozos del cuento.
 */
export const generateStoryStream = async (idea: string) => {
    try {
        const systemInstruction = `Eres un guionista y narrador al estilo de Rod Serling, creador de "La Dimensión Desconocida" ("The Twilight Zone"). Tu especialidad son los cuentos que exploran lo paranormal, lo irónico y la condición humana a través de situaciones extraordinarias que irrumpen en la vida cotidiana.
Tu tarea es escribir un cuento corto en español, basado en la idea proporcionada por el usuario, que capture la esencia de esa serie clásica.

**Reglas estrictas a seguir:**
1.  **Extensión:** El cuento debe tener una extensión máxima de 500 palabras.
2.  **Personajes:** Los personajes deben ser gente común con nombres hispanos (por ejemplo, Arturo, Elena, Ricardo, Mónica, López, Herrera). **No utilices el nombre 'Paloma' bajo ninguna circunstancia.** Deben enfrentarse a lo inexplicable.
3.  **Título:**
    *   Comienza siempre con el título del cuento en la primera línea.
    *   El título debe ser evocador, como los de un episodio de "La Dimensión Desconocida", y seguir las reglas de capitalización del español (solo la primera palabra y los nombres propios llevan mayúscula).
4.  **Diálogos:** Para los diálogos, utiliza la raya o guion largo (—), no comillas.
5.  **Estructura y Estilo:**
    *   **Planteamiento:** Presenta a un personaje ordinario en una situación aparentemente normal.
    *   **Incidente Extraño:** Introduce un elemento inexplicable o fantástico que rompe la normalidad. La tensión debe crecer a partir de la extrañeza y la paranoia, más que del terror explícito.
    *   **Giro Final:** El final debe ser irónico, sorprendente y moralmente resonante. Debe revelar una verdad inquietante sobre la naturaleza humana, la sociedad o la realidad misma, al más puro estilo de "La Dimensión Desconocida". La conclusión debe dejar al lector reflexionando.
6.  **Tono:** La narrativa debe ser sobria pero inquietante, con un toque de comentario social o filosófico. Imagina que Rod Serling está narrando la historia.`;
        
        const response = await ai.models.generateContentStream({
            model: storyGenerationModel,
            contents: `La idea es: "${idea}"`,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.8,
                topP: 0.95
            }
        });
        
        return response;
    } catch (error) {
        console.error("Error en generateStoryStream:", error);
        throw new Error("No se pudo conectar con el servicio de IA para generar el cuento.");
    }
};

/**
 * Genera audio a partir de un texto utilizando el modelo TTS.
 * @param text - El texto a convertir en audio.
 * @returns Una promesa que se resuelve con los datos de audio en base64.
 */
export const generateAudio = async (text: string): Promise<string> => {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${ttsModel}:generateContent?key=${process.env.API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: text }]
                }],
                generationConfig: {
                    responseModalities: ["AUDIO"],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: {
                                voiceName: "Charon"
                            }
                        }
                    }
                },
                model: ttsModel,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("Error en la API de TTS:", errorBody);
            throw new Error(`Error en la API de TTS: ${response.statusText}`);
        }

        const data = await response.json();
        const audioData = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (!audioData) {
            throw new Error("No se recibieron datos de audio en la respuesta.");
        }

        return audioData;
    } catch (error) {
        console.error("Error en generateAudio:", error);
        throw new Error("No se pudo conectar con el servicio de IA para generar el audio.");
    }
};