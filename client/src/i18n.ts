import { getLocaleFromNavigator, init, register } from 'svelte-i18n';

register('en', () => import('./locales/en.json'));

void init({
  initialLocale: getLocaleFromNavigator(),
  fallbackLocale: 'en',
});
