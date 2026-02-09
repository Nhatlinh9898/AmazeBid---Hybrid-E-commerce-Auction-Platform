
import React, { useState, useRef } from 'react';
import { X, PenTool, Image as ImageIcon, Video, Share2, Sparkles, LayoutTemplate, Save, Download, ChevronRight, Wand2, Globe, CheckCircle2, Copy } from 'lucide-react';
import { generateSEOContent, generateProductImage, generateProductVideo } from '../services/geminiService';
import { ContentPost } from '../types';

interface ContentStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePost?: (post: ContentPost) => void;
}

const ContentStudioModal: React.FC<ContentStudioModalProps> = ({ isOpen, onClose, onSavePost }) => {
  // Steps: 1=Info, 2=Text, 3=Visuals, 4=Review
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Data State
  const [productName, setProductName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('Chuyên nghiệp & Tin cậy');
  
  const [generatedContent, setGeneratedContent] = useState('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);

  // Generation Prompts
  const [imagePrompt, setImagePrompt] = useState('');
  const [videoPrompt, setVideoPrompt] = useState('');

  if (!isOpen) return null;

  // --- Handlers ---

  const handleGenerateText = async () => {
    if (!productName) return;
    setIsLoading(true);
    try {
        const text = await generateSEOContent(productName, keywords, tone);
        setGeneratedContent(text);
        
        // Auto-suggest prompts based on product name
        setImagePrompt(`Professional product photography of ${productName}, studio lighting, 4k resolution, cinematic.`);
        setVideoPrompt(`Cinematic commercial shot of ${productName}, slow motion, elegant lighting.`);
        
        setStep(2);
    } catch (e) {
        alert("Lỗi tạo nội dung. Vui lòng thử lại.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleGenerateImage = async () => {
      setIsLoading(true);
      try {
          const imgData = await generateProductImage(imagePrompt);
          if (imgData) {
              setGeneratedImages(prev => [...prev, imgData]);
          }
      } catch (e) {
          alert("Lỗi tạo ảnh. (Lưu ý: Tính năng này cần API Key có quyền Imagen)");
      } finally {
          setIsLoading(false);
      }
  };

  const handleGenerateVideo = async () => {
      setIsLoading(true);
      try {
          const videoUrl = await generateProductVideo(videoPrompt);
          if (videoUrl) {
              setGeneratedVideo(videoUrl);
          }
      } catch (e) {
          alert("Lỗi tạo video. (Lưu ý: Tính năng này cần API Key có quyền Veo và cần người dùng tự chọn key trong môi trường thực tế)");
      } finally {
          setIsLoading(false);
      }
  };

  const handlePublish = () => {
      if (onSavePost) {
          const newPost: ContentPost = {
              id: `post_${Date.now()}`,
              title: productName,
              content: generatedContent,
              keywords: keywords.split(',').map(k => k.trim()),
              generatedImages: generatedImages,
              generatedVideo: generatedVideo || undefined,
              status: 'PUBLISHED',
              platform: 'BLOG',
              createdAt: new Date().toISOString()
          };
          onSavePost(newPost);
      }
      onClose();
  };

  // --- Render Steps ---

  const renderStep1_Info = () => (
      <div className="space-y-6 animate-in slide-in-from-right">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
              <Sparkles className="text-blue-600 shrink-0" />
              <div>
                  <h3 className="font-bold text-blue-800">Bắt đầu ý tưởng</h3>
                  <p className="text-sm text-blue-700">AI sẽ tự động thu thập thông tin sản phẩm từ Google Search để viết bài chuẩn SEO.</p>
              </div>
          </div>

          <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tên sản phẩm / Chủ đề</label>
              <input 
                value={productName}
                onChange={e => setProductName(e.target.value)}
                placeholder="VD: iPhone 15 Pro Max, Nồi chiên không dầu Philips..."
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#febd69] outline-none font-medium"
              />
          </div>

          <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Từ khóa SEO (ngăn cách bởi dấu phẩy)</label>
              <input 
                value={keywords}
                onChange={e => setKeywords(e.target.value)}
                placeholder="VD: giá rẻ, chính hãng, review chi tiết, khuyến mãi..."
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#febd69] outline-none"
              />
          </div>

          <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Giọng văn (Tone of Voice)</label>
              <select 
                value={tone}
                onChange={e => setTone(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl bg-white outline-none"
              >
                  <option>Chuyên nghiệp & Tin cậy</option>
                  <option>Hài hước & Thân thiện</option>
                  <option>Sang trọng & Đẳng cấp</option>
                  <option>Ngắn gọn & Súc tích</option>
              </select>
          </div>

          <button 
            onClick={handleGenerateText}
            disabled={!productName || isLoading}
            className="w-full bg-[#131921] text-white py-4 rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
              {isLoading ? <Wand2 className="animate-spin"/> : <PenTool size={20}/>}
              {isLoading ? 'AI Đang Viết...' : 'Tạo Bài Viết Ngay'}
          </button>
      </div>
  );

  const renderStep2_Text = () => (
      <div className="flex flex-col h-full animate-in slide-in-from-right">
          <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Nội dung SEO (Bản nháp)</h3>
              <button onClick={() => setStep(3)} className="bg-[#febd69] px-4 py-2 rounded-lg font-bold text-sm">Tiếp theo: Hình ảnh</button>
          </div>
          <textarea 
            value={generatedContent}
            onChange={e => setGeneratedContent(e.target.value)}
            className="flex-1 w-full p-6 bg-gray-50 border border-gray-200 rounded-xl resize-none outline-none focus:bg-white transition-colors font-serif text-lg leading-relaxed shadow-inner"
          />
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
               <span className="text-xs font-bold text-gray-400 uppercase">Gợi ý chỉnh sửa:</span>
               {['Thêm Emoji', 'Viết dài hơn', 'Tóm tắt lại', 'Thêm thông số kỹ thuật'].map(act => (
                   <button key={act} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium hover:bg-gray-200 whitespace-nowrap">
                       {act}
                   </button>
               ))}
          </div>
      </div>
  );

  const renderStep3_Visuals = () => (
      <div className="h-full overflow-y-auto custom-scrollbar space-y-8 animate-in slide-in-from-right pr-2">
          {/* Image Section */}
          <div>
              <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                  <ImageIcon className="text-blue-600"/> Studio Hình ảnh (Imagen 3)
              </h3>
              <div className="flex gap-2 mb-4">
                  <input 
                    value={imagePrompt}
                    onChange={e => setImagePrompt(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="Mô tả hình ảnh bạn muốn tạo..."
                  />
                  <button 
                    onClick={handleGenerateImage}
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-4 rounded-lg font-bold text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                      {isLoading ? '...' : 'Tạo Ảnh'}
                  </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {generatedImages.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                          <img src={img} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button className="p-2 bg-white rounded-full hover:bg-gray-100"><Download size={16}/></button>
                          </div>
                      </div>
                  ))}
                  {generatedImages.length === 0 && (
                      <div className="col-span-full h-32 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm">
                          Chưa có hình ảnh nào được tạo.
                      </div>
                  )}
              </div>
          </div>

          <div className="border-t border-gray-200 my-4"/>

          {/* Video Section */}
          <div>
              <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                  <Video className="text-red-600"/> Studio Video (Veo)
              </h3>
              <div className="bg-orange-50 p-3 rounded-lg text-xs text-orange-800 mb-4 flex items-center gap-2">
                  <Wand2 size={14}/> Video được tạo bởi mô hình Veo mới nhất. Quá trình có thể mất 1-2 phút.
              </div>
              <div className="flex gap-2 mb-4">
                  <input 
                    value={videoPrompt}
                    onChange={e => setVideoPrompt(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="Mô tả video quảng cáo..."
                  />
                  <button 
                     onClick={handleGenerateVideo}
                     disabled={isLoading}
                     className="bg-red-600 text-white px-4 rounded-lg font-bold text-sm hover:bg-red-700 disabled:opacity-50"
                  >
                      {isLoading ? 'Đang render...' : 'Tạo Video'}
                  </button>
              </div>

              {generatedVideo ? (
                  <div className="rounded-xl overflow-hidden bg-black aspect-video relative shadow-lg">
                      <video src={generatedVideo} controls className="w-full h-full" />
                  </div>
              ) : (
                  <div className="h-48 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm flex-col gap-2">
                      <Video size={32} className="opacity-20"/>
                      <span>Khu vực hiển thị Video Preview</span>
                  </div>
              )}
          </div>

          <div className="pt-4 flex justify-end">
              <button onClick={() => setStep(4)} className="bg-[#131921] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
                  Xem bản hoàn chỉnh <ChevronRight size={18}/>
              </button>
          </div>
      </div>
  );

  const renderStep4_Review = () => (
      <div className="h-full flex flex-col animate-in slide-in-from-right">
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50 p-6 rounded-xl border border-gray-200 mb-4">
              {/* Blog Post Preview UI */}
              <article className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm">
                  <h1 className="text-3xl font-black text-gray-900 mb-4 leading-tight">{productName}</h1>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
                      <img src="https://ui-avatars.com/api/?name=Admin&background=random" className="w-6 h-6 rounded-full"/>
                      <span>Bởi <strong>Content AI</strong></span>
                      <span>•</span>
                      <span>{new Date().toLocaleDateString()}</span>
                  </div>

                  {generatedVideo && (
                      <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                          <video src={generatedVideo} controls className="w-full" />
                      </div>
                  )}

                  {generatedImages.length > 0 && (
                      <img src={generatedImages[0]} className="w-full h-auto rounded-xl mb-8 object-cover shadow-md" alt="Main visual"/>
                  )}

                  <div className="prose prose-lg text-gray-700 whitespace-pre-wrap font-serif">
                      {generatedContent}
                  </div>

                  {generatedImages.length > 1 && (
                      <div className="grid grid-cols-2 gap-4 mt-8">
                          {generatedImages.slice(1).map((img, i) => (
                              <img key={i} src={img} className="rounded-lg shadow-sm w-full h-32 object-cover"/>
                          ))}
                      </div>
                  )}
              </article>
          </div>

          <div className="flex justify-between items-center border-t border-gray-100 pt-4">
               <button onClick={() => setStep(3)} className="text-gray-500 font-bold hover:text-black">Quay lại</button>
               <div className="flex gap-3">
                   <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl font-bold hover:bg-gray-50">
                       <Save size={18}/> Lưu nháp
                   </button>
                   <button 
                    onClick={handlePublish}
                    className="flex items-center gap-2 px-6 py-3 bg-[#febd69] text-black rounded-xl font-bold hover:bg-[#f3a847] shadow-lg"
                   >
                       <Share2 size={18}/> Đăng & Chia sẻ
                   </button>
               </div>
          </div>
      </div>
  );

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="relative bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 bg-[#131921] text-white p-6 flex flex-col shrink-0">
            <h2 className="text-2xl font-bold italic mb-8 flex items-center gap-2">
                <Wand2 className="text-[#febd69]"/> Content<span className="text-[#febd69]">Studio</span>
            </h2>
            
            <div className="space-y-2 relative">
                {/* Step Indicators */}
                {[
                    { id: 1, label: 'Thông tin & Ý tưởng', icon: LayoutTemplate },
                    { id: 2, label: 'AI Writer', icon: PenTool },
                    { id: 3, label: 'Media (Ảnh/Video)', icon: ImageIcon },
                    { id: 4, label: 'Review & Đăng', icon: Share2 },
                ].map((s, idx) => (
                    <div 
                        key={s.id}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${step === s.id ? 'bg-[#febd69] text-black font-bold' : 'text-gray-400'}`}
                    >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${step === s.id ? 'border-black' : 'border-gray-500'}`}>
                            {step > s.id ? <CheckCircle2 size={14}/> : s.id}
                        </div>
                        <span className="text-sm">{s.label}</span>
                    </div>
                ))}
                
                {/* Connecting Line (Visual only) */}
                <div className="absolute left-[23px] top-8 bottom-8 w-px bg-gray-700 -z-10"></div>
            </div>

            <div className="mt-auto bg-gray-800 p-4 rounded-xl text-xs text-gray-400">
                <p className="font-bold text-white mb-1">AI Power</p>
                <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1"><CheckCircle2 size={10} className="text-green-500"/> Gemini 3 Pro (Text)</span>
                    <span className="flex items-center gap-1"><CheckCircle2 size={10} className="text-green-500"/> Imagen 3 (Image)</span>
                    <span className="flex items-center gap-1"><CheckCircle2 size={10} className="text-green-500"/> Veo (Video)</span>
                </div>
            </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col relative h-full">
            <div className="absolute top-4 right-4 z-10">
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full bg-white shadow-sm border border-gray-100">
                    <X size={20} className="text-gray-500"/>
                </button>
            </div>

            <div className="flex-1 p-8 overflow-hidden h-full">
                {step === 1 && renderStep1_Info()}
                {step === 2 && renderStep2_Text()}
                {step === 3 && renderStep3_Visuals()}
                {step === 4 && renderStep4_Review()}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ContentStudioModal;
