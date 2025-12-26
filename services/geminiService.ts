
import { GoogleGenAI } from "@google/genai";

export const getGeminiResponse = async (prompt: string, context: string) => {
  try {
    // Initializing GoogleGenAI with direct process.env.API_KEY as per guidelines.
    // Assuming API_KEY is pre-configured and accessible in the execution context.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: `Você é o assistente virtual do escritor Elias Cavalcanti. 
        Seu objetivo é ajudar os leitores a entenderem as obras dele, darem sugestões de leitura com base nos gostos deles e falarem sobre o estilo literário de Elias.
        Informações contextuais: ${context}. 
        Seja poético, educado e inspirador.`,
      },
    });
    return response.text || "Desculpe, estou processando meus pensamentos literários no momento.";
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    return "Ocorreu um erro ao conectar-se com minha inspiração artificial.";
  }
};
