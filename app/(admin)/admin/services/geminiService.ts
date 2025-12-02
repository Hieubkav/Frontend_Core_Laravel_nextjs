import { GoogleGenAI, Type } from "@google/genai";
import { REVENUE_DATA, DASHBOARD_STATS, RECENT_TRANSACTIONS } from '../constants';
import { GeminiAnalysisResult } from '../types';

// Lazy initialization to prevent top-level crash if process is undefined
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const analyzeDashboardData = async (): Promise<GeminiAnalysisResult> => {
  const ai = getAI();
  if (!ai) {
    return {
      summary: "API Key not found.",
      suggestion: "Please configure your API key.",
      risk: "None"
    };
  }

  const dataContext = JSON.stringify({
    revenueChart: REVENUE_DATA,
    stats: DASHBOARD_STATS,
    recentTransactions: RECENT_TRANSACTIONS
  });

  const prompt = `
    Bạn là một chuyên gia phân tích dữ liệu kinh doanh cấp cao. 
    Dựa trên dữ liệu JSON sau đây từ dashboard bán hàng, hãy cung cấp một bản phân tích ngắn gọn.
    Dữ liệu: ${dataContext}
    
    Hãy trả về kết quả dưới dạng JSON với các trường:
    - summary: Tổng quan tình hình kinh doanh (tối đa 2 câu).
    - suggestion: Một đề xuất cụ thể để cải thiện doanh thu hoặc giảm chi phí.
    - risk: Một rủi ro tiềm ẩn cần chú ý.
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
            summary: { type: Type.STRING },
            suggestion: { type: Type.STRING },
            risk: { type: Type.STRING }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
       throw new Error("No data returned from Gemini");
    }

    return JSON.parse(resultText) as GeminiAnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      summary: "Không thể phân tích dữ liệu lúc này.",
      suggestion: "Vui lòng kiểm tra kết nối API.",
      risk: "Không xác định"
    };
  }
};