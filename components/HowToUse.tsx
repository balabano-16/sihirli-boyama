
import React from 'react';
import { Pencil, Wand2, Printer, Star, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const HowToUse: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: <Pencil className="text-pink-500" size={24} />,
      title: t.howTo.step1Title,
      description: t.howTo.step1Desc,
      bgColor: "bg-pink-50",
      visual: (
        <div className="w-full h-32 bg-slate-50 rounded-xl border border-slate-100 p-3 flex flex-col gap-2 overflow-hidden">
          <div className="h-3 w-1/3 bg-slate-200 rounded-full"></div>
          <div className="h-8 w-full bg-white rounded-lg border border-slate-200 shadow-sm flex items-center px-3">
            <div className="h-2 w-1/4 bg-slate-100 rounded-full"></div>
          </div>
          <div className="h-3 w-1/2 bg-slate-200 rounded-full mt-1"></div>
          <div className="h-8 w-full bg-white rounded-lg border border-slate-200 shadow-sm flex items-center px-3">
            <div className="h-2 w-1/2 bg-slate-100 rounded-full"></div>
          </div>
        </div>
      )
    },
    {
      icon: <Wand2 className="text-purple-500" size={24} />,
      title: t.howTo.step2Title,
      description: t.howTo.step2Desc,
      bgColor: "bg-purple-50",
      visual: (
        <div className="w-full h-32 bg-indigo-600 rounded-xl flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent animate-pulse"></div>
          <div className="flex flex-col items-center gap-2 z-10">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-spin duration-[3000ms]">
              <Sparkles className="text-white" size={20} />
            </div>
            <div className="h-2 w-20 bg-white/30 rounded-full"></div>
          </div>
        </div>
      )
    },
    {
      icon: <Printer className="text-indigo-500" size={24} />,
      title: t.howTo.step3Title,
      description: t.howTo.step3Desc,
      bgColor: "bg-indigo-50",
      visual: (
        <div className="w-full h-32 bg-slate-50 rounded-xl border border-slate-100 p-2 grid grid-cols-3 gap-1.5 overflow-hidden">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg border border-slate-200 shadow-sm p-1 flex flex-col gap-1">
              <div className="aspect-[3/4] bg-slate-50 rounded border border-slate-100 flex items-center justify-center">
                <div className="w-4 h-4 text-slate-200"><Star size={12} /></div>
              </div>
              <div className="h-1 w-full bg-slate-100 rounded-full"></div>
            </div>
          ))}
        </div>
      )
    }
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-4 mt-16 md:mt-24 mb-12 animate-fade-in-up">
      <div className="text-center mb-12">
        <h3 className="comic-font text-3xl font-bold text-slate-800 mb-4">{t.howTo.title}</h3>
        <div className="h-1.5 w-20 bg-indigo-500 mx-auto rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className="bg-white p-2 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 flex flex-col group"
          >
            <div className="p-4 flex flex-col items-center text-center">
              <div className={`w-12 h-12 ${step.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform duration-300`}>
                {step.icon}
              </div>
              <h4 className="font-bold text-slate-800 mb-2">{step.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed mb-6 px-2">
                {step.description}
              </p>
            </div>
            <div className="mt-auto p-2">
              {step.visual}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
