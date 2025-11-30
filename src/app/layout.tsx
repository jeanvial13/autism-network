import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ChatInterface from "@/components/ai/ChatInterface";
import Navigation from "@/components/Navigation";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "T-Conecta Autismo - Global Autism Network",
  description: "A global, smart network connecting autistic individuals, families, and verified professionals with evidence-based information and trusted support.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.className} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navigation />
          {children}
          <ChatInterface />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
