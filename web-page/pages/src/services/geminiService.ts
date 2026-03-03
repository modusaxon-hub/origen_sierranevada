import { GoogleGenAI, Type } from "@google/genai";

// We use a getter to ensure we always get the fresh key if updated via aistudio
const getAiClient = (apiKey?: string) => {
    const key = apiKey || process.env.API_KEY;
    if (!key) throw new Error("API Key not found");
    return new GoogleGenAI({ apiKey: key });
};

// 1. Chat Bot
export const sendChatMessage = async (history: { role: string; parts: { text: string }[] }[], newMessage: string, language: 'es' | 'en' = 'es') => {
    const ai = getAiClient();
    const model = "gemini-3-pro-preview";
    
    const instructions = {
        es: "Eres un barista experto de Origen Sierra Nevada. Conoces sobre orígenes de café, métodos de preparación (V60, Prensa Francesa, Espresso) y perfiles de sabor. Mantén las respuestas elegantes, concisas y útiles.",
        en: "You are an expert barista for Origen Sierra Nevada. You are knowledgeable about coffee origins, brewing methods (V60, French Press, Espresso), and flavor profiles. Keep answers elegant, concise, and helpful."
    };

    const chat = ai.chats.create({
        model: model,
        history: history,
        config: {
            systemInstruction: instructions[language],
        }
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text;
};

// 2. Image Analysis
export const analyzeImage = async (file: File, prompt: string) => {
    const ai = getAiClient();
    const model = "gemini-3-pro-preview";

    const base64Data = await fileToGenerativePart(file);

    const result = await ai.models.generateContent({
        model: model,
        contents: {
            parts: [
                { inlineData: { mimeType: file.type, data: base64Data } },
                { text: prompt || "Analyze this coffee related image and describe it in detail." }
            ]
        }
    });

    return result.text;
};

// 3. Generate Image (Nano Banana Pro)
export const generateImage = async (prompt: string, size: "1K" | "2K" | "4K", apiKey?: string) => {
    const ai = getAiClient(apiKey);
    const model = "gemini-3-pro-image-preview";

    const result = await ai.models.generateContent({
        model: model,
        contents: { parts: [{ text: prompt }] },
        config: {
            imageConfig: {
                imageSize: size,
                aspectRatio: "1:1" // Default square for social media/labels
            }
        }
    });

    for (const part of result.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
    }
    throw new Error("No image generated");
};

// 4. Edit Image (Nano Banana)
export const editImage = async (file: File, prompt: string) => {
    const ai = getAiClient();
    const model = "gemini-2.5-flash-image";

    const base64Data = await fileToGenerativePart(file);

    const result = await ai.models.generateContent({
        model: model,
        contents: {
            parts: [
                { inlineData: { mimeType: file.type, data: base64Data } },
                { text: prompt }
            ]
        }
    });

    for (const part of result.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
    }
    throw new Error("No edited image returned");
};

// 5. Generate Video (Veo)
export const generateVideo = async (
    prompt: string, 
    aspectRatio: "16:9" | "9:16", 
    imageFile?: File
) => {
    // Check for API key selection
    // We prioritize checking if an environment key is already present. 
    // Only if missing do we enforce the aistudio check.
    if (!process.env.API_KEY) {
        // @ts-ignore
        if (window.aistudio && !await window.aistudio.hasSelectedApiKey()) {
            throw new Error("API_KEY_REQUIRED");
        }
    }

    const ai = getAiClient(); 
    const model = "veo-3.1-fast-generate-preview";

    let requestConfig: any = {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio
    };

    let params: any = {
        model: model,
        prompt: prompt,
        config: requestConfig
    };

    if (imageFile) {
        const base64Data = await fileToGenerativePart(imageFile);
        params.image = {
            imageBytes: base64Data,
            mimeType: imageFile.type
        };
    }

    let operation = await ai.models.generateVideos(params);

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) throw new Error("Video generation failed");

    const response = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
};

// Helper
async function fileToGenerativePart(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            const base64Data = base64String.split(',')[1];
            resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
