// © Nathan 2025

import { GoogleGenAI, Type } from "@google/genai";
import { AiReadmeResult } from "./types";

const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey });

export async function generateReadme(packageJsonContent: string, mainFileContent: string): Promise<AiReadmeResult> {
  const prompt = `
    You are an expert technical writer specializing in open-source software documentation.
    Your task is to generate a comprehensive and professional README.md file content for a new NPM package.
    Analyze the provided 'package.json' and the main JavaScript file to understand the package's purpose, features, and usage.

    The README.md should include the following sections:
    - A clear and concise title.
    - A brief description of what the package does.
    - An "Installation" section with the correct npm install command.
    - A "Usage" section with a clear, commented code example demonstrating how to use the package's main functionality.
    - If applicable, infer and add other relevant sections like "API" or "Features".

    The entire response MUST be a single, valid JSON object adhering to the provided schema, containing the complete markdown content for the README.md file. Do not include any markdown formatting like \`\`\`json.

    package.json content:
    \`\`\`json
    ${packageJsonContent}
    \`\`\`

    Main file content:
    \`\`\`javascript
    ${mainFileContent}
    \`\`\`
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                readmeContent: {
                    type: Type.STRING,
                    description: "The complete markdown content for the README.md file."
                }
            },
            required: ["readmeContent"]
        }
      }
    });

    const parsedResponse = JSON.parse(response.text);
    return parsedResponse as AiReadmeResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Tidak dapat berkomunikasi dengan Gemini API.");
  }
}