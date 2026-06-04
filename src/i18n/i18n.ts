import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en/translation.json';
import ar from './locales/ar/translation.json';
import bg from './locales/bg/translation.json';
import cy from './locales/cy/translation.json';
import de from './locales/de/translation.json';
import el from './locales/el/translation.json';
import es from './locales/es/translation.json';
import fi from './locales/fi/translation.json';
import fr from './locales/fr/translation.json';
import gs from './locales/gs/translation.json';
import he from './locales/he/translation.json';
import is from './locales/is/translation.json';
import it from './locales/it/translation.json';
import iw from './locales/iw/translation.json';
import nl from './locales/nl/translation.json';
import pt from './locales/pt/translation.json';
import ro from './locales/ro/translation.json';
import sv from './locales/sv/translation.json';

// Create a separate i18n instance so ls-document-viewer doesn't conflict
// with the host app's i18n
const dvI18n = i18n.createInstance();

dvI18n.use(LanguageDetector).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
    bg: { translation: bg },
    cy: { translation: cy },
    de: { translation: de },
    el: { translation: el },
    es: { translation: es },
    fi: { translation: fi },
    fr: { translation: fr },
    gs: { translation: gs },
    he: { translation: he },
    is: { translation: is },
    it: { translation: it },
    iw: { translation: iw },
    nl: { translation: nl },
    pt: { translation: pt },
    ro: { translation: ro },
    sv: { translation: sv },
  },
  supportedLngs: [
    'en', 'ar', 'bg', 'cy', 'de', 'el', 'es', 'fi',
    'fr', 'gs', 'he', 'is', 'it', 'iw', 'nl', 'pt', 'ro', 'sv',
  ],
  fallbackLng: 'en',
  initAsync: false,
  debug: false,
  interpolation: {
    escapeValue: false,
  },
});

export default dvI18n;
export { dvI18n };
