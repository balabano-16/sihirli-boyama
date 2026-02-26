import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
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
          Return ONLY a JSON array of 5 strings.` 
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
    console.error("Prompts generation failed:", e);
    if (e.message?.includes("429") || e.message?.toLowerCase().includes("quota")) {
      throw new Error("QUOTA_EXCEEDED");
    }
    throw e;
  }
};

export const generateColoringPageImage = async (description: string, style: string = 'cartoon'): Promise<string> => {
  try {
    const ai = getAI();
    
    const modelName = 'gemini-2.5-flash-image';
    
    let stylePrompt = "simple clean thick black outlines, bold cartoon style, no shading, no colors, white background";
    if (style === 'realistic') stylePrompt = "realistic thin pencil sketch, white background";
    else if (style === 'mandala') stylePrompt = "intricate mandala line art, white background";
    else if (style === 'pixel') stylePrompt = "8-bit pixel art line art, white background";
    else if (style === 'chibi') stylePrompt = "cute chibi line art, thick outlines, white background";
    else if (style === 'anime') stylePrompt = "anime line art, white background";

    const finalPrompt = `Coloring book page for kids: ${description}. Style: ${stylePrompt}. Black and white only, pure white background. High contrast.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts: [{ text: finalPrompt }] },
      config: { 
        imageConfig: { 
          aspectRatio: "3:4"
        } 
      }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    const imagePart = parts?.find(p => p.inlineData?.data);
    
    if (imagePart?.inlineData?.data) {
      return `data:image/png;base64,${imagePart.inlineData.data}`;
    }
    
    throw new Error("IMAGE_NOT_FOUND");
  } catch (error: any) {
    console.error("Image generation failed:", error);
    if (error.message?.includes("429") || error.message?.toLowerCase().includes("quota")) {
      throw new Error("QUOTA_EXCEEDED");
    }
    throw error;
  }
};

export const sendMessageToChat = async (message: string): Promise<string> => {
  try {
    const ai = getAI();
    const chat = ai.chats.create({ model: 'gemini-3-flash-preview' });
    
    // Basit bir timeout mantığı
    const responsePromise = chat.sendMessage({ message });
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("TIMEOUT")), 15000)
    );

    const result = await Promise.race([responsePromise, timeoutPromise]) as any;
    return result.text || "";
  } catch (e: any) {
    console.error("Chat failed:", e);
    if (e.message === "API_KEY_MISSING") return "Hata: API anahtarı ayarlanmamış.";
    if (e.message === "TIMEOUT") return "Üzgünüm, cevap çok uzun sürdü. Lütfen tekrar deneyin.";
    if (e.message?.includes("429") || e.message?.toLowerCase().includes("quota")) {
      return "Üzgünüm, şu an çok fazla istek var (Kota doldu). Lütfen biraz bekleyip tekrar deneyin.";
    }
    return "Bağlantı hatası oluştu. Lütfen internetinizi ve API anahtarınızı kontrol edin.";
  }
};
