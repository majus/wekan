import I18N from 'meteor/ostrio:i18n';
import moment from 'moment/min/moment-with-locales';
import { vsprintf } from 'sprintf-js';
import { T9n } from 'meteor-accounts-t9n';
import languages from './languages';

/**
 * @private the actual i18n handler implementation
 */
const i18nImpl = new I18N({
  i18n: {
    settings: {
      defaultLocale: 'en',
      ...languages,
    },
  },
});

// TODO refactor to generic "i18n" name
export const TAPi18n = {
  getLanguage() {
    return i18nImpl.currentLocale.get();
  },
  loadLanguage(language) {
    if ('load' in languages[language]) {
      (async () => {
        const data = await languages[language].load();
        i18nImpl.addl10n({ [language]: data });
        i18nImpl.currentLocale.dep.changed();
      })();
    }
  },
  setLanguage(language) {
    const supported = Object.keys(languages);
    if (!supported.includes(language)) {
      // Fallback to general language locale
      language = language.split('-')[0];
      if (!supported.includes(language)) {
        throw new Error(`Language not supported: ${language}`);
      }
    }
    // In case of default locale, nothing needs to be loaded
    if (language === i18nImpl.defaultLocale) {
      i18nImpl.setLocale(language);
      moment.locale(language);
      T9n.setLanguage(language);
    } else {
      i18nImpl.setLocale(language);
      this.loadLanguage(language);
      // Update Moment.js translations
      try {
        moment.locale(language);
      } catch (err) {
        console.error(err);
      }
      // Update useraccounts:core translations
      try {
        T9n.setLanguage(language);
      } catch (err) {
        // Try to extract & set the language part only (e.g. "en" instead of "en-UK")
        try {
          T9n.setLanguage(language.split('-')[0]);
        } catch (err) {
          console.error(err);
          // Revert to default locale
          T9n.setLanguage(i18nImpl.defaultLocale);
        }
      }
    }
  },
  // Translate API from tap:i18n to ostrio:i18n
  __(key, options, language = this.getLanguage()) {
    let value = i18nImpl.get(language, key, options);
    if (options?.sprintf) {
      value = vsprintf(value, options.sprintf);
    }
    return value;
  }
};

// Dirty hakh to load the "current" language data
if (Meteor.isClient) {
  Meteor.startup(async () => {
    const language = i18nImpl.currentLocale.get();
    TAPi18n.loadLanguage(language);
  });
}
