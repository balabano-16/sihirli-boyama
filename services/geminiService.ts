
import { GoogleGenAI, Type, Schema, Chat } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// --- Image Generation Logic ---

export const generateCreativePrompts = async (theme: string): Promise<string[]> => {
  // We instruct Gemini to output descriptions in English to ensure the image generator (Imagen) works optimally,
  // even if the user provides the theme in another language.
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate 5 distinct, creative, and fun coloring book page descriptions for a children's book with the theme: "${theme}". 
    The descriptions must be in English, even if the theme is in another language.
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
      } as Schema
    }
  });

  const text = response.text;
  if (!text) return [];
  
  try {
    return JSON.parse(text) as string[];
  } catch (e) {
    console.error("Failed to parse prompts", e);
    return [];
  }
};

export const generateColoringPageImage = async (description: string, style: string = 'cartoon'): Promise<string> => {
  // Define style modifiers
  let stylePrompt = "";
  switch (style) {
    case 'realistic':
      stylePrompt = "realistic pencil sketch style, detailed fine lines, anatomical accuracy, naturalistic proportions";
      break;
    case 'mandala':
      stylePrompt = "mandala style, intricate geometric patterns, zentangle details, symmetry, meditative pattern";
      break;
    case 'pixel':
      stylePrompt = "pixel art style, 8-bit aesthetics, blocky edges, retro game style";
      break;
    case 'chibi':
      stylePrompt = "chibi style, super deformed, cute large heads, small bodies, kawai aesthetics";
      break;
    case 'anime':
      stylePrompt = "anime manga style, dynamic poses, expressive eyes, clean manga line art";
      break;
    case 'cartoon':
    default:
      stylePrompt = "clean thick distinct outlines, disney animation style, rounded shapes, simple details suitable for kids";
      break;
  }

  // We use imagen-4.0-generate-001 as requested for high quality images
  const finalPrompt = `A black and white children's coloring book page. ${stylePrompt}. Subject: ${description}. White background, high contrast, no shading, no grayscale filling, just clear line art, vector quality.`;

  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: finalPrompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio: '3:4', // Good for book pages
    },
  });

  const base64Image = response.generatedImages?.[0]?.image?.imageBytes;
  if (!base64Image) throw new Error("No image generated");
  
  return `data:image/jpeg;base64,${base64Image}`;
};

// --- Chat Logic ---

let chatSession: Chat | null = null;

export const initializeChat = () => {
  chatSession = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      // Updated instructions to use MagicColor name
      systemInstruction: "You are a friendly and enthusiastic assistant for a children's coloring book app called MagicColor. You help parents and kids come up with creative themes for their coloring books. You are encouraging, imaginative, and keep answers concise and helpful. You can speak English, Spanish, and Turkish. Detect the language the user is speaking and reply in that language. If the user's language is ambiguous, default to English.",
    }
  });
};

export const sendMessageToChat = async (message: string): Promise<string> => {
  if (!chatSession) initializeChat();
  
  const response = await chatSession!.sendMessage({
    message: message
  });

  return response.text || "I couldn't think of a response, sorry!";
};
