import { GoogleGenAI } from "@google/genai";
import { ScriptRequest } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateScriptStream = async (
  request: ScriptRequest,
  onChunk: (text: string) => void
): Promise<void> => {
  const ai = getClient();
  const model = "gemini-3-pro-preview";

  const prompt = `
    Atue como um roteirista profissional especialista em retenção de audiência.
    Sua missão é escrever um roteiro EXTREMAMENTE LONGO, PROFUNDO e CONTÍNUO sobre: "${request.topic}".
    
    Público-alvo: ${request.targetAudience}.
    Tom de voz: ${request.tone}.

    OBJETIVO DE TAMANHO: O roteiro deve ter APROXIMADAMENTE 5000 PALAVRAS.
    Não economize palavras. Explore cada subtópico ao máximo. Seja prolixo, detalhista e exaustivo.

    ESTRUTURA OBRIGATÓRIA (SIGA RIGOROSAMENTE AS METAS DE VOLUME):

    1. HOOK (300 palavras | 5 parágrafos):
       - Comece com uma história, mistério ou afirmação chocante.
       - Deve ser impossível de parar de ler.
    
    2. INTRODUÇÃO (300 palavras):
       - Apresente o tema.
       - CTA OBRIGATÓRIA: Peça explicitamente para se inscrever no canal, curtir o vídeo E comentar de qual cidade ou país estão assistindo.
    
    3. DESENVOLVIMENTO - 6 CAPÍTULOS PROFUNDOS (700 palavras CADA CAPÍTULO | 10 parágrafos por capítulo):
       - Desenvolva o tema em 6 ângulos ou subtemas diferentes.
       - Cada um dos 6 capítulos deve ser um mergulho profundo de 700 palavras.
       - Conecte os capítulos de forma fluida.
       - Total desta seção: ~4200 palavras.

    4. FECHAMENTO (200 palavras | 3 parágrafos):
       - Conclusão épica e memorável.
       - Reflexão final.

    REGRAS DE FORMATAÇÃO - TOLERÂNCIA ZERO:
    - O TEXTO DEVE SER 100% LIMPO: SEM TÍTULOS, SEM SUBTÍTULOS, SEM "CAPÍTULO 1", SEM "INTRODUÇÃO", SEM "#", SEM "**".
    - NÃO escreva "Hook Impactante" ou qualquer marcador.
    - O resultado deve ser um único fluxo de texto contínuo, separado apenas por quebras de linha entre parágrafos.
    - O texto deve parecer que foi extraído diretamente de um teleprompter.
    - Escreva em Português do Brasil.
  `;

  try {
    const streamResult = await ai.models.generateContentStream({
      model: model,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 8192 }, // High budget for planning the massive structure
      }
    });

    for await (const chunk of streamResult) {
      const text = chunk.text;
      if (text) {
        onChunk(text);
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};