import React, { useState } from 'react';
import { Download, Sparkles, Loader2, BookOpen, AlertCircle } from 'lucide-react';
import { generateCreativePrompts, generateColoringPageImage } from '../services/geminiService';
import { generatePDF } from '../utils/pdfGenerator';
import { GeneratedImage, GenerationStatus, ArtStyle } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

// Bekleme fonksiyonu
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const Generator: React.FC = () => {
  const { t } = useLanguage();
  const [theme, setTheme] = useState('');
  const [childName, setChildName] = useState('');
  const [artStyle, setArtStyle] = useState<ArtStyle>('cartoon');
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [progressMessage, setProgressMessage] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme || !childName) return;

    setStatus(GenerationStatus.PLANNING);
    setGeneratedImages([]);
    setProgressMessage(t.header.planningMsg);

    try {
      const prompts = await generateCreativePrompts(theme);
      
      if (prompts.length === 0) throw new Error("PROMPTS_EMPTY");

      setStatus(GenerationStatus.GENERATING);
      const newImages: GeneratedImage[] = [];
      
      for (let i = 0; i < prompts.length; i++) {
        // Kota hatasını önlemek için her resim arasında 2 saniye bekle
        if (i > 0) {
          setProgressMessage("API dinlendiriliyor... (Kota koruması)");
          await sleep(2000);
        }

        const progressMsg = t.header.drawingStatus
          .replace('{current}', (i + 1).toString())
          .replace('{total}', prompts.length.toString())
          .replace('{desc}', prompts[i].substring(0, 20));
          
        setProgressMessage(progressMsg);
        
        try {
          const base64 = await generateColoringPageImage(prompts[i], artStyle);
          const img: GeneratedImage = {
            id: crypto.randomUUID(),
            base64,
            prompt: prompts[i]
          };
          newImages.push(img);
          setGeneratedImages(prev => [...prev, img]);
        } catch (err: any) {
          if (err.message === "QUOTA_EXCEEDED") {
            setStatus(GenerationStatus.ERROR);
            setProgressMessage("Ücretsiz API kotası doldu. Lütfen 1-2 dakika bekleyip tekrar deneyin.");
            return; // İşlemi durdur
          }
          console.error(`Failed to generate image ${i + 1}`, err);
        }
      }

      if (newImages.length > 0) {
        setStatus(GenerationStatus.COMPLETED);
      } else {
        setStatus(GenerationStatus.ERROR);
        setProgressMessage(t.header.noImages);
      }

    } catch (error: any) {
      console.error(error);
      setStatus(GenerationStatus.ERROR);
      setProgressMessage(t.header.error);
    }
  };

  const handleDownload = () => {
    if (generatedImages.length === 0) return;
    generatePDF(childName, theme, generatedImages, t.pdf);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-indigo-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400"></div>
        
        <div className="text-center mb-8">
          <h2 className="comic-font text-3xl md:text-4xl font-bold text-slate-800 mb-2">{t.header.title}</h2>
          <p className="text-slate-500">{t.header.subtitle}</p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6 max-w-2xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">{t.header.childLabel}</label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder={t.header.childPlaceholder}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">{t.header.themeLabel}</label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder={t.header.themePlaceholder}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">{t.header.styleLabel}</label>
            <select
              value={artStyle}
              onChange={(e) => setArtStyle(e.target.value as ArtStyle)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all outline-none cursor-pointer"
            >
              <option value="cartoon">{t.styles.cartoon}</option>
              <option value="realistic">{t.styles.realistic}</option>
              <option value="mandala">{t.styles.mandala}</option>
              <option value="pixel">{t.styles.pixel}</option>
              <option value="chibi">{t.styles.chibi}</option>
              <option value="anime">{t.styles.anime}</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={status === GenerationStatus.PLANNING || status === GenerationStatus.GENERATING}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {status === GenerationStatus.PLANNING || status === GenerationStatus.GENERATING ? (
              <>
                <Loader2 className="animate-spin" />
                {status === GenerationStatus.PLANNING ? t.header.planning : t.header.generating}
              </>
            ) : (
              <>
                <Sparkles className="animate-pulse" />
                {t.header.generateBtn}
              </>
            )}
          </button>
        </form>

        {(status === GenerationStatus.PLANNING || status === GenerationStatus.GENERATING) && (
          <div className="mt-8 text-center animate-fade-in">
             <p className="text-indigo-600 font-medium">{progressMessage}</p>
             <div className="w-full max-w-md mx-auto h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
               <div className="h-full bg-indigo-500 rounded-full animate-indeterminate-bar"></div>
             </div>
          </div>
        )}
        
        {status === GenerationStatus.ERROR && (
          <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl text-center border border-red-100 flex items-center justify-center gap-2">
            <AlertCircle size={20} />
            {progressMessage}
          </div>
        )}
      </div>

      {generatedImages.length > 0 && (
        <div className="space-y-8 animate-fade-in-up">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="text-indigo-600" />
                {t.results.title}
              </h3>
              <p className="text-slate-500">{t.results.subtitle}</p>
            </div>
            {status === GenerationStatus.COMPLETED && (
              <button
                onClick={handleDownload}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold shadow-lg flex items-center gap-2 transition-colors"
              >
                <Download size={20} />
                {t.results.download}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedImages.map((img, idx) => (
              <div key={img.id} className="group relative bg-white p-4 rounded-2xl shadow-md border border-slate-100 hover:shadow-xl transition-all duration-300">
                <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-slate-50 border border-slate-100">
                  <img src={img.base64} alt={`Page ${idx + 1}`} className="w-full h-full object-contain" />
                </div>
                <div className="mt-4">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-slate-900 text-white text-xs font-bold rounded-full">
                    {idx + 1}
                  </span>
                  <p className="mt-2 text-xs text-slate-400 line-clamp-2">{img.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};