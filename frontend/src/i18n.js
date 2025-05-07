import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en/translation.json';
import translationRU from './locales/ru/translation.json';
import translationKZ from './locales/kz/translation.json';

const resources = {
  EN: { translation: translationEN },
  RU: { translation: translationRU },
  KZ: { translation: translationKZ }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'EN',
    fallbackLng: 'EN',
    interpolation: { escapeValue: false }
  });

export default i18n;
