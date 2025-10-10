import OpenAI from 'openai';

let openai: OpenAI | null = null;

const getOpenAiClient = (): OpenAI => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("Nenhuma variável de ambiente de API Key (OPENAI_API_KEY) foi definida.");
    }
    if (!openai) {
        openai = new OpenAI({ apiKey });
    }
    return openai;
};

export const serverGenerateTextOpenAI = async (prompt: string, schema: any): Promise<any> => {
    const client = getOpenAiClient();
    const response = await client.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
            { role: "system", content: "You are a creative assistant for tabletop RPGs, generating content in the style of Demon Slayer (Kimetsu no Yaiba). Respond exclusively in valid JSON that conforms to the user-provided schema. The user's prompt contains the schema and instructions. Ensure the output is a JSON array." },
            { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.9,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
        throw new Error("A API da OpenAI não retornou conteúdo de texto.");
    }
    // The model might return a JSON object with a key holding the array. We need to find and return the array.
    const parsedContent = JSON.parse(content);
    const arrayKey = Object.keys(parsedContent).find(k => Array.isArray(parsedContent[k]));
    if (!arrayKey) {
        // If it's just a single object, wrap it in an array
        if(typeof parsedContent === 'object' && !Array.isArray(parsedContent)) {
            return [parsedContent];
        }
        throw new Error("A resposta da OpenAI não continha o array JSON esperado.");
    }
    
    return parsedContent[arrayKey];
};


export const serverGenerateImageOpenAI = async (prompt: string): Promise<string> => {
    const client = getOpenAiClient();
    const response = await client.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
        throw new Error('A API da OpenAI não retornou uma URL de imagem.');
    }
    return imageUrl;
};