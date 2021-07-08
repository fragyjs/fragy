const messages = {};

// eslint-disable-next-line no-undef
let locale = __FRAGY_LOCALE__;

function loadLocales() {
  const locales = require.context('../locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const localeName = matched[1];
      messages[localeName] = locales(key);
    }
  });
  if (!Object.keys(messages).includes(locale)) {
    locale = 'en';
  }
}

loadLocales();

export const getMessage = (key) => {
  const message = messages[locale][key];
  if (!message || typeof message !== 'string') {
    // eslint-disable-next-line no-console
    console.warn(`Cannot locate the string for '${key}'`);
    return key;
  }
  return message;
};
