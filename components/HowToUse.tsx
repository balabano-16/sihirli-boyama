
import React from 'react';
import { Pencil, Wand2, Printer } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const HowToUse: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: <Pencil className="text-pink-500" size={32} />,
      title: t.howTo.step1Title,
      description: t.howTo.step1Desc,
      bgColor: "bg-pink-50"
    },
    {
      icon: <Wand2 className="text-purple-500" size={32} />,
      title: t.howTo.step2Title,
      description: t.howTo.step2Desc,
      bgColor: "bg-purple-50"
    },
    {
      icon: <Printer className="text-indigo-500" size={32} />,
      title: t.howTo.step3Title,
      description: t.howTo.step3Desc,
      bgColor: "bg-indigo-50"
    }
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-4 mt-8 md:mt-12 animate-fade-in-up">
      <div className="text-center mb-8">
        <h3 className="comic-font text-2xl font-bold text-slate-800">{t.howTo.title}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center group"
          >
            <div className={`w-16 h-16 ${step.bgColor} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
              {step.icon}
            </div>
            <h4 className="font-bold text-slate-800 mb-2">{step.title}</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
