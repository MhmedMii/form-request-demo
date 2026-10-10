import { useState, useEffect } from 'react';
import { t } from '@/lib/i18n';
export function useDevicePreferences() {
  const [locale, setLocale] = useState('en');
  const [theme, setTheme] = useState('light');
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let language, mode;
    try {
      language = localStorage.getItem('form-demo-locale');
      mode = localStorage.getItem('form-demo-theme');
    } catch {}
    setLocale(
      language === 'ar' || (!language && (navigator.language || '').startsWith('ar')) ? 'ar' : 'en',
    );
    setTheme(
      mode === 'dark' || (!mode && window.matchMedia?.('(prefers-color-scheme: dark)').matches)
        ? 'dark'
        : 'light',
    );
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = locale;
    document.documentElement.dir = t(locale).dir;
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('form-demo-locale', locale);
      localStorage.setItem('form-demo-theme', theme);
    } catch {}
  }, [locale, theme, ready]);
  return {
    locale,
    theme,
    toggleLocale: () => setLocale((value) => (value === 'ar' ? 'en' : 'ar')),
    toggleTheme: () => setTheme((value) => (value === 'dark' ? 'light' : 'dark')),
  };
}
