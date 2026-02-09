
import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  
  interface Window {
    aistudio?: AIStudio;
  }
}

export const getShoppingAdvice = async (query: string, products: Product[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const productContext = products.map(p => 
    `- ${p.title} (${p.type === 'AUCTION' ? 'Đấu giá' : 'Mua ngay'}: ${p.price || p.currentBid} USD)`
  ).join('\n');

  const systemInstruction = `
    Bạn là một chuyên gia mua sắm thông minh cho trang web AmazeBid. 
    AmazeBid kết hợp giữa Amazon (mua ngay) và Yahoo Auctions (đấu giá).
    Nhiệm vụ của bạn:
    1. Giúp người dùng chọn sản phẩm phù hợp nhất từ danh sách hiện có.
    2. Giải thích sự khác biệt giữa mua ngay và đấu giá nếu cần.
    3. Trả lời bằng tiếng Việt thân thiện, chuyên nghiệp.
    
    Danh sách sản phẩm hiện có:
    ${productContext}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "Xin lỗi, tôi không thể xử lý yêu cầu này ngay bây giờ.";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    if (error?.status === 429 || error?.code === 429) {
        return "Hiện tại hệ thống đang quá tải. Vui lòng thử lại sau ít phút.";
    }
    return "Có lỗi xảy ra khi kết nối với trí tuệ nhân tạo.";
  }
};

// --- New Content Creation Services ---

export const generateKeywordSuggestions = async (productName: string, description: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Hãy đóng vai chuyên gia SEO. Dựa trên tên sản phẩm: "${productName}" và mô tả: "${description}".
      Hãy liệt kê chính xác 20 từ khóa SEO (keywords) có lưu lượng tìm kiếm cao, bao gồm cả từ khóa ngắn và từ khóa dài (long-tail).
      
      Yêu cầu định dạng trả về: Chỉ trả về một mảng JSON thuần túy chứa danh sách các chuỗi (strings). Không thêm markdown code block, không thêm giải thích.
      Ví dụ: ["từ khóa 1", "từ khóa 2", ...]`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    try {
        const text = response.text?.replace(/```json|```/g, '').trim();
        if (text) return JSON.parse(text) as string[];
        return [];
    } catch (e) {
        console.error("JSON Parse Error", e);
        return [];
    }
  } catch (error: any) {
    // Attempt fallback if rate limited
    if (error?.status === 429 || error?.code === 429 || error?.message?.includes('429')) {
        console.warn("Rate limit hit on primary model (Keyword Gen). Attempting fallback...");
        try {
             const response = await ai.models.generateContent({
                model: 'gemini-flash-latest', // Fallback to standard flash
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                }
            });
            const text = response.text?.replace(/```json|```/g, '').trim();
            if (text) return JSON.parse(text) as string[];
        } catch (fallbackError) {
            console.error("Fallback Keyword Gen Error:", fallbackError);
        }
    } else {
        console.error("Keyword Gen Error:", error);
    }
    return [];
  }
};

export const generateSEOContent = async (productName: string, keywords: string, tone: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Hãy viết một bài đăng blog chuẩn SEO chuyên nghiệp về sản phẩm: "${productName}".
      
      Yêu cầu:
      - Từ khóa cần tập trung: ${keywords}
      - Giọng văn: ${tone} (Ví dụ: Chuyên gia, Hài hước, Sang trọng, Thân thiện).
      - Tự động tìm kiếm thông tin về sản phẩm này trên internet để bài viết chính xác.
      - Cấu trúc bài viết: Tiêu đề bắt mắt, Mở bài thu hút, Các tính năng chính (dùng bullet points), Lợi ích người dùng, và Lời kêu gọi hành động (CTA).
      - Định dạng đầu ra: Markdown.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Stronger model for writing
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}], // Enable Search Grounding
        responseMimeType: "text/plain",
      }
    });

    return response.text || "Không thể tạo nội dung lúc này.";
  } catch (error: any) {
    console.error("SEO Gen Error:", error);
    
    // Fallback if 3-pro is rate limited
    if (error?.status === 429 || error?.code === 429) {
        console.warn("Rate limit hit on primary model (SEO Gen). Attempting fallback...");
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview', // Fallback to flash (no search grounding usually, or less expensive)
                // Note: Flash preview supports search grounding too, but might be on different quota.
                contents: prompt,
                config: {
                    tools: [{googleSearch: {}}],
                    responseMimeType: "text/plain",
                }
            });
            return response.text || "Không thể tạo nội dung lúc này (Fallback).";
        } catch (fbError) {
             return "Hệ thống AI đang bận. Vui lòng thử lại sau.";
        }
    }
    throw error;
  }
};

export const generateProductImage = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Model for image generation
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
            aspectRatio: "1:1"
            // imageSize is only supported for gemini-3-pro-image-preview
        }
      }
    });

    // Extract base64 image
    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};

export const generateProductVideo = async (prompt: string) => {
  // Ensure we have a paid key selected for Veo
  if (typeof window !== 'undefined' && window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
          await window.aistudio.openSelectKey();
      }
  }

  // Re-initialize with the potentially updated key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // 1. Start generation
    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: '16:9'
        }
    });

    // 2. Poll for completion
    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s
        operation = await ai.operations.getVideosOperation({operation: operation});
    }

    // 3. Get URL
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (downloadLink) {
        // In a real app, you would fetch this blob. 
        // For the demo, we return the URI. Note: Accessing this URI usually requires the API Key appended.
        return `${downloadLink}&key=${process.env.API_KEY}`;
    }
    return null;

  } catch (error) {
    console.error("Video Gen Error:", error);
    throw error;
  }
};
