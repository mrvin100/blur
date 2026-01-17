import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/provider/app.providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// meta data about authors, description and search result for SEO


export const metadata: Metadata = {
  title: "Blur App",
  description: "Gestion des évènements pour Blur Game | build by 48 Students",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
