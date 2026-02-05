import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Persona AI - Stop Getting Polite BS From AI. Get Brutal Truth.",
  description: "AI personas that think like real professionals. Brutally honest startup advice without the politeness filter. Try 10 free messages daily.",
  openGraph: {
    title: "Persona AI - Stop Getting Polite BS From AI. Get Brutal Truth.",
    description: "AI personas that think like real professionals. Brutally honest startup advice without the politeness filter. Try 10 free messages daily.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Persona AI - Stop Getting Polite BS From AI. Get Brutal Truth.",
    description: "AI personas that think like real professionals. Brutally honest startup advice without the politeness filter. Try 10 free messages daily.",
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
          <AuthProvider>
            {children}
          </AuthProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
