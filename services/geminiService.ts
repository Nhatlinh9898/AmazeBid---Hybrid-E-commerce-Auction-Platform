
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
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Có lỗi xảy ra khi kết nối với trí tuệ nhân tạo.";
  }
};

// --- New Content Creation Services ---

export const generateSEOContent = async (productName: string, keywords: string, tone: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Stronger model for writing
      contents: `Hãy viết một bài đăng blog chuẩn SEO chuyên nghiệp về sản phẩm: "${productName}".
      
      Yêu cầu:
      - Từ khóa cần tập trung: ${keywords}
      - Giọng văn: ${tone} (Ví dụ: Chuyên gia, Hài hước, Sang trọng, Thân thiện).
      - Tự động tìm kiếm thông tin về sản phẩm này trên internet để bài viết chính xác.
      - Cấu trúc bài viết: Tiêu đề bắt mắt, Mở bài thu hút, Các tính năng chính (dùng bullet points), Lợi ích người dùng, và Lời kêu gọi hành động (CTA).
      - Định dạng đầu ra: Markdown.`,
      config: {
        tools: [{googleSearch: {}}], // Enable Search Grounding
        responseMimeType: "text/plain",
      }
    });

    return response.text || "Không thể tạo nội dung lúc này.";
  } catch (error) {
    console.error("SEO Gen Error:", error);
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
