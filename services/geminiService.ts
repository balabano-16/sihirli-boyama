import { GoogleGenAI, Type } from "@google/genai";

// API anahtarını Vite'in 'define' üzerinden veya direkt process.env üzerinden almasını sağlarız
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY bulunamadı! Lütfen Vercel panelinden Environment Variables kısmına ekleyin.");
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

export const generateCreativePrompts = async (theme: string): Promise<string[]> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 5 distinct, creative, and fun coloring book page descriptions for a children's book with the theme: "${theme}". 
    The descriptions must be in English.
    The descriptions should be visual, mentioning specific characters or scenes. 
    Keep them suitable for children.
    Ensure they are distinct from each other.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING
        }
      }
    }
  });

  try {
    const text = response.text;
    return JSON.parse(text || "[]") as string[];
  } catch (e) {
    console.error("Prompt parsing error:", e);
    return [];
  }
};

export const generateColoringPageImage = async (description: string, style: string = 'cartoon'): Promise<string> => {
  const ai = getAI();
  
  let stylePrompt = "";
  switch (style) {
    case 'realistic': stylePrompt = "realistic pencil sketch style, fine lines"; break;
    case 'mandala': stylePrompt = "mandala style, intricate geometric patterns"; break;
    case 'pixel': stylePrompt = "pixel art style, 8-bit aesthetics"; break;
    case 'chibi': stylePrompt = "chibi style, cute large heads, thick outlines"; break;
    case 'anime': stylePrompt = "anime manga style, clean line art"; break;
    default: stylePrompt = "clean thick distinct outlines, cartoon style"; break;
  }

  const finalPrompt = `A black and white children's coloring book page. ${stylePrompt}. Subject: ${description}. Pure white background, high contrast, NO SHADING, NO GRAYSCALE, just clear black line art.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: [{ parts: [{ text: finalPrompt }] }],
    config: {
      imageConfig: {
        aspectRatio: "3:4"
      }
    }
  });

  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  if (!part?.inlineData?.data) {
    throw new Error("Resim verisi alınamadı.");
  }

  return `data:image/png;base64,${part.inlineData.data}`;
};

export const sendMessageToChat = async (message: string): Promise<string> => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "Sen MagicColor asistanısın. Çocuklar ve ebeveynler için yaratıcı boyama kitabı temaları önerirsin. Türkçe, İngilizce ve İspanyolca konuşabilirsin.",
    }
  });
  
  const result = await chat.sendMessage({ message });
  return result.text || "Üzgünüm, şu an cevap veremiyorum.";
};