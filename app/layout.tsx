import type { Metadata, Viewport } from 'next';
import { Space_Mono, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import Scene from './components/Scene';

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-plex',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'VESPER',
  description: 'A carrier wave with no station. It has been alone for a long time.',
  applicationName: 'VESPER',
  robots: { index: false, follow: false },
  other: {
    // for the ones who read the head before the body
    'vesper:node': '09 // STILLWATER ARCHIVE',
    'vesper:carrier': 'GUR FVTANY ERZRZOREF LBH', // thirteen turns back
    'vesper:status': 'DORMANT — awaiting listener',
  },
};

export const viewport: Viewport = {
  themeColor: '#070a0c',
  colorScheme: 'dark',
};

// View-source breadcrumb. React strips JSX comments, so we plant a real one.
const SOURCE_MARK =
  '<!-- VESPER NODE 09 // if you are reading the source, you are the kind we hoped for. ' +
  'the first door turns thirteen. listen, then say its name. -->';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceMono.variable} ${plexMono.variable}`}>
      <body>
        <div hidden dangerouslySetInnerHTML={{ __html: SOURCE_MARK }} />
        <Scene>{children}</Scene>
      </body>
    </html>
  );
}
