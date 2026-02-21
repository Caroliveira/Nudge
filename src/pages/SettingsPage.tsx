import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SUPPORTED_LANGUAGES } from '../constants';
import CsvExport from '@/components/CsvExport';

const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <section className="w-full max-w-2xl mx-auto p-6 fade-in flex flex-col h-[85dvh]">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl serif text-text">{t('settings.title')}</h1>
        <nav aria-label="Settings Back Navigation">
          <button
            onClick={() => navigate(-1)}
            className="text-soft hover:text-accent transition-colors flex items-center gap-2 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="underline underline-offset-4">{t('settings.back')}</span>
          </button>
        </nav>
      </header>

      <div className="bg-surface/30 p-6 rounded-3xl border border-surface space-y-8">
        <section>
          <CsvExport />
        </section>
        <section>
          <h2 className="text-lg font-bold text-text mb-4">{t('settings.language.title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`p-4 rounded-xl border transition-all text-left ${i18n.resolvedLanguage === lang.code
                  ? 'bg-accent text-warm border-accent shadow-md'
                  : 'bg-surface hover:bg-surface/80 border-transparent text-text hover:shadow-sm'
                  }`}
              >
                <div className="font-bold">{lang.label}</div>
                {i18n.resolvedLanguage === lang.code && (
                  <div className="text-xs opacity-80 mt-1">{t('settings.language.current')}</div>
                )}
              </button>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};

export default SettingsPage;
