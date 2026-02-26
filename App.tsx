
import React from 'react';
import { Generator } from './components/Generator';
import { ChatWidget } from './components/ChatWidget';
import { HowToUse } from './components/HowToUse';
import { useLanguage } from './contexts/LanguageContext';
import { Language } from './types';
import { ExternalLink, Palette } from 'lucide-react';

const App: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 relative pb-20">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
              M
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 comic-font tracking-wide">
              {t.appTitle}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500 hidden md:block">
              {t.appSubtitle}
            </div>
            
            <div className="flex bg-slate-100 rounded-lg p-1">
              {(['en', 'es', 'tr'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    language === lang 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-500 hover:text-indigo-500'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Main generation form at the top */}
        <Generator />
        
        {/* Step-by-step guide section at the bottom */}
        <HowToUse />
      </main>

      {/* Chat Floating Widget */}
      <ChatWidget />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-12">
        <div className="max-w-5xl mx-auto px-4 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4">
            <Palette size={24} />
          </div>
          <h3 className="comic-font text-xl font-bold text-slate-800 mb-1">MagicColor</h3>
          <p className="text-sm text-slate-500 mb-6">{t.appSubtitle}</p>
          
          <div className="h-px w-16 bg-slate-200 mb-6"></div>
          
          <p className="text-slate-700 font-medium mb-4">
            {t.footer.madeBy} <span className="text-indigo-600 font-bold">Osman Balaban</span>
          </p>
          
          <a 
            href="https://www.behance.net/osmanbalaban" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md group"
          >
            <span>{t.footer.portfolio}</span>
            <ExternalLink size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
          
          <p className="mt-8 text-xs text-slate-400">
            © {new Date().getFullYear()} MagicColor. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Global Styles for Animations */}
      <style>{`
        @keyframes indeterminate-bar {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 50%; margin-left: 25%; }
          100% { width: 0%; margin-left: 100%; }
        }
        .animate-indeterminate-bar {
          animation: indeterminate-bar 2s infinite ease-in-out;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default App;
