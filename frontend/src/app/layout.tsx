import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import ThemeRegistry from './ThemeRegistry';
import ReactQueryProvider from './ReactQueryProvider';
import ReduxProvider from './ReduxProvider';
import { ToastProvider } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: { template: '%s | Payzo', default: 'Payzo — Smart Banking' },
  description: 'Payzo — modern secure banking platform',
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0 }} suppressHydrationWarning>
        <ReduxProvider>
          <ThemeRegistry>
            <ReactQueryProvider>
              <ToastProvider>{children}</ToastProvider>
            </ReactQueryProvider>
          </ThemeRegistry>
        </ReduxProvider>
      </body>
    </html>
  );
}