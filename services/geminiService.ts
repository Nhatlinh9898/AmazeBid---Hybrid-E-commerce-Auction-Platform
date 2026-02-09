
import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

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
