import Script from 'next/script';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/styles.css';

export const metadata = {
  title: 'SWC Technologies',
  description: 'Plataforma para continuidad operacional, trazabilidad y control de riesgos en terreno.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Script src="https://cdn.lordicon.com/lordicon.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
