import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Heart, Star, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const SEOContent: React.FC = () => {
  const { language, t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const content = {
    tr: {
      title: "Boyama Yapmanın Çocuk Gelişimine Faydaları",
      intro: "Boyama yapmak, çocuklar için sadece eğlenceli bir aktivite değil, aynı zamanda gelişimlerini destekleyen çok yönlü bir öğrenme aracıdır. MagicColor olarak, çocukların hayal güçlerini kağıda dökmelerini sağlarken onların gelişimine nasıl katkıda bulunduğumuzu keşfedin.",
      benefit1Title: "1. İnce Motor Becerilerinin Gelişimi",
      benefit1Desc: "Boya kalemini tutmak, belirli bir alanı boyamak ve sınırların dışına çıkmamaya çalışmak, el-göz koordinasyonunu ve parmak kaslarını güçlendirir. Bu beceriler, ileride yazı yazma ve diğer hassas el işleri için temel oluşturur.",
      benefit2Title: "2. Odaklanma ve Sabır",
      benefit2Desc: "Bir boyama sayfasını tamamlamak zaman ve dikkat gerektirir. Çocuklar bir işe başlayıp onu bitirmenin önemini kavrar, dikkat sürelerini uzatır ve bir sonuca ulaşmak için sabretmeyi öğrenirler.",
      benefit3Title: "3. Yaratıcılık ve Kendini İfade Etme",
      benefit3Desc: "Renk seçimi, bir çocuğun o anki ruh halini ve hayal dünyasını yansıtır. MagicColor'ın sunduğu kişiselleştirilmiş temalar sayesinde çocuklar, kendi hayal ettikleri dünyaları boyayarak yaratıcılıklarını en üst seviyeye çıkarırlar.",
      whyTitle: "Neden MagicColor?",
      whyDesc: "Standart boyama kitapları sınırlı temalar sunar. MagicColor ise yapay zeka desteğiyle çocuğunuzun o anki ilgi alanına özel sayfalar üretir. Çocuğunuzun isminin kapakta yer aldığı bir kitap, ona kendini özel hissettirir.",
      readMore: "Devamını Oku",
      readLess: "Daha Az Göster"
    },
    en: {
      title: "Benefits of Coloring for Child Development",
      intro: "Coloring is not just a fun activity for children, but also a versatile learning tool that supports their development. Discover how MagicColor helps children express their imagination while contributing to their growth.",
      benefit1Title: "1. Fine Motor Skills Development",
      benefit1Desc: "Holding a crayon, coloring within a specific area, and trying not to go outside the lines strengthens hand-eye coordination and finger muscles. These skills form the basis for writing and other precise manual tasks.",
      benefit2Title: "2. Focus and Patience",
      benefit2Desc: "Completing a coloring page takes time and attention. Children understand the importance of starting and finishing a task, extend their attention spans, and learn to be patient to reach a result.",
      benefit3Title: "3. Creativity and Self-Expression",
      benefit3Desc: "Color choice reflects a child's current mood and imagination. With MagicColor's personalized themes, children can bring their own imaginary worlds to life, maximizing their creativity.",
      whyTitle: "Why MagicColor?",
      whyDesc: "Standard coloring books offer limited themes. MagicColor uses AI to generate pages specific to your child's current interests. A book with your child's name on the cover makes them feel special.",
      readMore: "Read More",
      readLess: "Show Less"
    },
    es: {
      title: "Beneficios de Colorear para el Desarrollo Infantil",
      intro: "Colorear no es solo una actividad divertida para los niños, sino también una herramienta de aprendizaje versátil que apoya su desarrollo. Descubre cómo MagicColor ayuda a los niños a expresar su imaginación mientras contribuye a su crecimiento.",
      benefit1Title: "1. Desarrollo de Habilidades Motoras Finas",
      benefit1Desc: "Sostener un crayón, colorear dentro de un área específica y tratar de no salirse de las líneas fortalece la coordinación mano-ojo y los músculos de los dedos. Estas habilidades forman la base para escribir y otras tareas manuales precisas.",
      benefit2Title: "2. Enfoque y Paciencia",
      benefit2Desc: "Completar una página para colorear requiere tiempo y atención. Los niños comprenden la importancia de comenzar ve terminar una tarea, extienden sus períodos de atención y aprenden a ser pacientes para lograr un resultado.",
      benefit3Title: "3. Creatividad y Autoexpresión",
      benefit3Desc: "La elección del color refleja el estado de ánimo y la imaginación actual del niño. Con los temas personalizados de MagicColor, los niños pueden dar vida a sus propios mundos imaginarios, maximizando su creatividad.",
      whyTitle: "¿Por qué MagicColor?",
      whyDesc: "Los libros para colorear estándar ofrecen temas limitados. MagicColor utiliza IA para generar páginas específicas para los intereses actuales de su hijo. Un libro con el nombre de su hijo en la portada lo hace sentir especial.",
      readMore: "Leer más",
      readLess: "Mostrar menos"
    }
  };

  const l = content[language as keyof typeof content] || content.en;

  return (
    <section className="max-w-4xl mx-auto px-4 py-12 border-t border-slate-100">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <BookOpen size={20} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 comic-font">{l.title}</h2>
        </div>

        <p className="text-slate-600 leading-relaxed mb-6">
          {l.intro}
        </p>

        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="space-y-8 pt-4">
            <div className="flex gap-4">
              <div className="mt-1 text-indigo-500"><Star size={20} /></div>
              <div>
                <h3 className="font-bold text-slate-800 mb-2">{l.benefit1Title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {l.benefit1Desc}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1 text-pink-500"><Heart size={20} /></div>
              <div>
                <h3 className="font-bold text-slate-800 mb-2">{l.benefit2Title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {l.benefit2Desc}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1 text-amber-500"><Sparkles size={20} /></div>
              <div>
                <h3 className="font-bold text-slate-800 mb-2">{l.benefit3Title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {l.benefit3Desc}
                </p>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-2xl p-6 mt-8">
              <h3 className="font-bold text-indigo-900 mb-3">{l.whyTitle}</h3>
              <p className="text-indigo-800 text-sm leading-relaxed">
                {l.whyDesc}
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-8 w-full flex items-center justify-center gap-2 py-3 px-6 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-xl transition-all border border-slate-200 group"
        >
          {isExpanded ? (
            <>
              <span>{l.readLess}</span>
              <ChevronUp size={18} className="group-hover:-translate-y-0.5 transition-transform" />
            </>
          ) : (
            <>
              <span>{l.readMore}</span>
              <ChevronDown size={18} className="group-hover:translate-y-0.5 transition-transform" />
            </>
          )}
        </button>
      </div>
    </section>
  );
};
