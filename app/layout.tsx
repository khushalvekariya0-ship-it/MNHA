import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RevealProvider from "@/components/RevealProvider";
import FxProvider from "@/components/FxProvider";
import ScrollProgress from "@/components/ScrollProgress";
import Preloader from "@/components/Preloader";
import CursorFx from "@/components/CursorFx";
import SmoothScroll from "@/components/SmoothScroll";
import FloatingDock from "@/components/FloatingDock";
import { themeScript } from "@/components/theme-script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "MNHA — Your Wealth | Simple, smart investing",
    template: "%s | MNHA",
  },
  description:
    "Invest in stocks, mutual funds, F&O and IPOs with MNHA. Zero commission, paperless KYC, and bank-grade security — all in one clean, powerful app.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // the theme script sets data-theme on <html> before React hydrates
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-screen flex-col">
        {/* safety net: reveal load-gated content even if hydration stalls */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "setTimeout(function(){document.body.classList.add('loaded')},4000)",
          }}
        />
        <noscript
          dangerouslySetInnerHTML={{
            __html:
              "<style>.preloader{display:none!important}[data-animate],[data-animate-stagger]>*,.hero-fade,.nav-item-in,.word-in-scroll{opacity:1!important;transform:none!important;filter:none!important;animation:none!important}.word-mask>span{transform:none!important}</style>",
          }}
        />
        <Preloader />
        <SmoothScroll />
        <CursorFx />
        <RevealProvider />
        <FxProvider />
        <ScrollProgress />
        <Header />
        {/* clip (not hidden) so reveal offsets never cause sideways scroll
            while position: sticky sections keep working */}
        <main className="flex-1 overflow-x-clip">{children}</main>
        <Footer />
        <FloatingDock />
      </body>
    </html>
  );
}
