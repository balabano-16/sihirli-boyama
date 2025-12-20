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
    throw e;
  }
};

export const generateColoringPageImage = async (description: string, style: string = 'cartoon'): Promise<string> => {
  try {
    const ai = getAI();
    
    let stylePrompt = "simple clean thick black outlines, bold cartoon style, no shading, no colors, white background";
    if (style === 'realistic') stylePrompt = "realistic thin pencil sketch, white background";
    else if (style === 'mandala') stylePrompt = "intricate mandala line art, white background";
    else if (style === 'pixel') stylePrompt = "8-bit pixel art line art, white background";
    else if (style === 'chibi') stylePrompt = "cute chibi line art, thick outlines, white background";
    else if (style === 'anime') stylePrompt = "anime line art, white background";

    const finalPrompt = `Coloring book page for kids: ${description}. Style: ${stylePrompt}. Black and white only, pure white background.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: finalPrompt }] },
      config: { imageConfig: { aspectRatio: "3:4" } }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    const imagePart = parts?.find(p => p.inlineData?.data);
    
    if (imagePart?.inlineData?.data) {
      return `data:image/png;base64,${imagePart.inlineData.data}`;
    }
    
    throw new Error("IMAGE_NOT_FOUND");
  } catch (error: any) {
    // Kota hatası kontrolü
    if (error.message?.includes("429") || error.message?.includes("quota")) {
      throw new Error("QUOTA_EXCEEDED");
    }
    throw error;
  }
};

export const sendMessageToChat = async (message: string): Promise<string> => {
  try {
    const ai = getAI();
    const chat = ai.chats.create({ model: 'gemini-3-flash-preview' });
    const result = await chat.sendMessage({ message });
    return result.text || "";
  } catch (e) {
    return "Bağlantı hatası.";
  }
};