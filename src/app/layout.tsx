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

import ScrollToTop from "./ScrollToTop";
import ClientWrapper from "./ClientWrapper";
import { Providers } from "./provider";
import { ReactNode } from "react";

export const metadata = {
  title: "Healthy Eating - Färdiga Matlådor i Örebro",
  description: "Beställ nyttiga och färdiglagade matlådor från Healthy Eating. Perfekt för en aktiv livsstil – leverans direkt till dörren.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sv" className="light" style={{ colorScheme: "light" }}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <ClientWrapper>
            {/* ScrollToTop ser till att varje ny route börjar längst upp */}
            <ScrollToTop />
            {children}
          </ClientWrapper>
        </Providers>
      </body>
    </html>
  );
}
