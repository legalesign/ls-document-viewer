import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en/translation.json';

// Create a separate i18n instance so ls-document-viewer doesn't conflict
// with the host app's i18n
const dvI18n = i18n.createInstance();

dvI18n.use(LanguageDetector).init({
  resources: {
    en: { translation: en },
  },
  supportedLngs: ['en'],
  fallbackLng: 'en',
  initAsync: false,
  debug: false,
  interpolation: {
    escapeValue: false,
  },
});

export default dvI18n;
export { dvI18n };
