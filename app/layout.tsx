import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Persona AI - Stop Chatting. Start Deciding.",
  description: "GPTs give you options. Persona AI gives you answers. Simulate the minds of Musk, Naval, and Graham to make better decisions.",
  openGraph: {
    title: "Persona AI - Stop Chatting. Start Deciding.",
    description: "GPTs give you options. Persona AI gives you answers. Simulate the minds of Musk, Naval, and Graham to make better decisions.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Persona AI - Stop Chatting. Start Deciding.",
    description: "GPTs give you options. Persona AI gives you answers. Simulate the minds of Musk, Naval, and Graham to make better decisions.",
  },
  icons: {
    icon: '/logo.png',
  },
};

import { AuthProvider } from '@/src/contexts/AuthContext';
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
          style={{
            fontFamily: 'var(--font-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            background: 'var(--bg-base)',
            color: 'var(--text-primary)',
          }}
        >
          {/* Google Analytics */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-DGFC27782F"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-DGFC27782F');
            `}
          </Script>

          <AuthProvider>
            {children}
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
