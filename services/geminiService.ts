import { GoogleGenAI } from "@google/genai";
import { AppData } from "../types";

const getApiKey = () => {
  // In a real app, this would be securely handled.
  // For this demo, we assume process.env.API_KEY is available
  return process.env.API_KEY || '';
};

export const generateFinancialInsights = async (
  query: string,
  data: AppData,
  history: { role: string; text: string }[],
  useThinking: boolean
): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) return "Error: API Key is missing.";

  const ai = new GoogleGenAI({ apiKey });

  // Prepare context
  const dataContext = JSON.stringify(data, null, 2);
  const systemInstruction = `
    You are WealthOrbit AI, an expert financial analyst assistant integrated into a wealth management application.
    
    Here is the current database of clients and their investments in JSON format:
    ${dataContext}

    Your goal is to assist the user (a wealth manager or data analyst) by answering questions about this data.
    
    Guidelines:
    1. Be precise with numbers. Calculate totals if asked (e.g., "Total portfolio value for Alice").
    2. If the user asks for analysis (e.g., "Who has the riskiest portfolio?"), analyze the asset allocation (Crypto/Stock = High Risk, Bonds/Cash = Low Risk) and explain your reasoning.
    3. Keep responses professional, concise, and actionable.
    4. You can use Markdown to format tables or lists.
    5. Today's date is ${new Date().toLocaleDateString()}.
  `;

  // Model Selection & Config
  // Use gemini-3-pro-preview for complex queries especially when thinking is requested.
  // Otherwise gemini-2.5-flash is good for speed, but the prompt requires 3-pro for thinking.
  const model = useThinking ? 'gemini-3-pro-preview' : 'gemini-3-pro-preview'; // Defaulting to pro for this app as requested for the feature
  
  const config: any = {
    systemInstruction,
  };

  if (useThinking) {
    config.thinkingConfig = { thinkingBudget: 32768 };
    // Do NOT set maxOutputTokens when thinkingBudget is set, or ensure it allows enough room.
    // The prompt explicitly says "Do not set maxOutputTokens".
  } else {
      // For standard chat, we can set a reasonable limit if we wanted, but leaving it open is safer.
  }

  try {
    const chat = ai.chats.create({
      model,
      config,
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }],
      })),
    });

    const response = await chat.sendMessage({ message: query });
    return response.text || "I couldn't generate a response.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error processing your request. Please try again.";
  }
};