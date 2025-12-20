import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

const cleanJsonString = (str: string): string => {
  return str.replace(/```json\n?|```/g, "").trim();
};

export const generateCreativePrompts = async (theme: string): Promise<string[]> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [{ 
          text: `Generate exactly 5 short, simple coloring book page descriptions for children. Theme: "${theme}". 
          Return ONLY a JSON array of 5 strings.
          Example: ["A happy elephant with a balloon", "A sun wearing sunglasses"]` 
        }]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const cleanedText = cleanJsonString(response.text || "[]");
    const parsed = JSON.parse(cleanedText);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e: any) {
    if (e.message === "API_KEY_MISSING") {
      console.error("HATA: Vercel Dashboard üzerinde API_KEY tanımlanmamış!");
    }
    console.error("Prompts generation failed:", e);
    return [];
  }
};

export const generateColoringPageImage = async (description: string, style: string = 'cartoon'): Promise<string> => {
  try {
    const ai = getAI();
    
    let stylePrompt = "simple clean thick black outlines, bold cartoon style, no shading, no colors";
    switch (style) {
      case 'realistic': stylePrompt = "realistic thin pencil sketch style, white background, no color"; break;
      case 'mandala': stylePrompt = "intricate mandala patterns, geometric line art, white background"; break;
      case 'pixel': stylePrompt = "8-bit pixel art style, black outlines, white background"; break;
      case 'chibi': stylePrompt = "cute chibi style, thick black lines, white background"; break;
      case 'anime': stylePrompt = "anime line art, clean strokes, white background"; break;
    }

    const finalPrompt = `Children's coloring book page: ${description}. Style: ${stylePrompt}. High contrast, black and white only, pure white background, no grayscale.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: finalPrompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4"
        }
      }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      const imagePart = parts.find(p => p.inlineData?.data);
      if (imagePart?.inlineData?.data) {
        return `data:image/png;base64,${imagePart.inlineData.data}`;
      }
    }
    
    throw new Error("IMAGE_DATA_NOT_FOUND");
  } catch (error: any) {
    console.error("Görsel üretim hatası:", description, error);
    throw error;
  }
};

export const sendMessageToChat = async (message: string): Promise<string> => {
  try {
    const ai = getAI();
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "Sen MagicColor asistanısın. Çocuklar için boyama kitabı temaları öneren yaratıcı bir yardımcısın.",
      }
    });
    
    const result = await chat.sendMessage({ message });
    return result.text || "Şu an yanıt veremiyorum.";
  } catch (e) {
    return "Bağlantı hatası oluştu.";
  }
};