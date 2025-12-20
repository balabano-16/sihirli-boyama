import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined") {
    console.error("API_KEY eksik! Lütfen Vercel ayarlarından API_KEY ekleyin ve projeyi yeniden derleyin (Redeploy).");
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

// Model bazen JSON'ı markdown blokları içinde döndürebilir, bunu temizleyen yardımcı fonksiyon
const cleanJsonString = (str: string): string => {
  return str.replace(/```json\n?|```/g, "").trim();
};

export const generateCreativePrompts = async (theme: string): Promise<string[]> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [{ 
          text: `Generate exactly 5 distinct, creative, and fun coloring book page descriptions for a children's book with the theme: "${theme}". 
          Each description should be a single sentence describing a scene.
          The response MUST be a pure JSON array of strings. 
          Example format: ["A happy astronaut cat floating near a smiling moon", "A robot dog playing fetch with a star"]` 
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
  } catch (e) {
    console.error("Prompts generation failed:", e);
    return [];
  }
};

export const generateColoringPageImage = async (description: string, style: string = 'cartoon'): Promise<string> => {
  const ai = getAI();
  
  let stylePrompt = "";
  switch (style) {
    case 'realistic': stylePrompt = "realistic thin pencil sketch style"; break;
    case 'mandala': stylePrompt = "intricate mandala patterns and geometric shapes"; break;
    case 'pixel': stylePrompt = "8-bit pixel art style, blocky outlines"; break;
    case 'chibi': stylePrompt = "cute chibi style, large eyes, thick outlines"; break;
    case 'anime': stylePrompt = "classic anime line art style"; break;
    default: stylePrompt = "simple clean thick black outlines, bold cartoon style"; break;
  }

  const finalPrompt = `A high-quality black and white children's coloring page. Subject: ${description}. Style: ${stylePrompt}. Pure white background, high contrast, no shading, no colors, no gray tones, just solid black lines.`;

  try {
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

    // Parçalar arasında inlineData (görsel verisi) olanı bul
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("Resim verisi yanıtta bulunamadı.");
  } catch (error) {
    console.error("Image generation error for prompt:", description, error);
    throw error;
  }
};

export const sendMessageToChat = async (message: string): Promise<string> => {
  const ai = getAI();
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "Sen MagicColor asistanısın. Çocuklar için boyama kitabı temaları öneren yaratıcı bir yardımcısın. Kısa ve neşeli cevaplar ver.",
      }
    });
    
    const result = await chat.sendMessage({ message });
    return result.text || "Üzgünüm, şu an bağlantı kuramıyorum.";
  } catch (e) {
    return "Bir hata oluştu, lütfen daha sonra tekrar deneyin.";
  }
};