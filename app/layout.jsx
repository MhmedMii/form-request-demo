import './globals.css';
import '@fontsource-variable/manrope';
import '@fontsource/noto-sans-arabic/400.css';
import '@fontsource/noto-sans-arabic/600.css';
const DEVICE_PREFS_SCRIPT = `(function(){try{var d=document.documentElement;var l=localStorage.getItem('form-demo-locale')||((navigator.language||'').toLowerCase().startsWith('ar')?'ar':'en');var m=localStorage.getItem('form-demo-theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');d.lang=l;d.dir=l==='ar'?'rtl':'ltr';d.dataset.theme=m;}catch(e){}})();`;
export const metadata = {
  title: 'FORM — Employee request demo',
  description:
    'A bilingual employee request wizard with fictional profiles, sample documents, and simulated submissions. A public portfolio project.',
  robots: { index: true, follow: true },
};
export const viewport = { width: 'device-width', initialScale: 1 };
export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: DEVICE_PREFS_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
