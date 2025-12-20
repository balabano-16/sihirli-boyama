
import React from 'react';
import { Generator } from './components/Generator';
import { ChatWidget } from './components/ChatWidget';
import { HowToUse } from './components/HowToUse';
import { useLanguage } from './contexts/LanguageContext';
import { Language } from './types';

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
