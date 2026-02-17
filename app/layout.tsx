import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

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
        <head>
          {/* Fontshare CDN — Clash Display + Cabinet Grotesk */}
          <link
            href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@100,200,300,400,500,700,800,900&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="antialiased">
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
