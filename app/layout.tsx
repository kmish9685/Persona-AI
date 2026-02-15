import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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

// V4 suggests Auth0Provider or similar may be needed, OR UserProvider is in a different path?
// Error log: "Did you mean to import Auth0Provider?"
// import { UserProvider } from '@auth0/nextjs-auth0/client';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from '@vercel/analytics/next';



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
