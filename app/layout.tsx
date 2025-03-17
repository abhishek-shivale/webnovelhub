import "./globals.css";
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Sidebar from "@/components/sidebar";
import { Analytics } from '@vercel/analytics/next';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // Basic metadata
  title: "WebNovelHub - Discover Top Web Novels & Latest Chapters",
  description:
    "Explore the best web novels, latest chapters, and trending stories on WebNovelHub. Your ultimate destination for online web novel reading.",
  keywords: [
    "web novels",
    "online novels",
    "latest chapters",
    "fiction",
    "reading",
    "WebNovelHub",
    "light novels",
    "web fiction",
    "novel series",
    "novels online free",
    "best web novels",
    "read web novels",
    "novel updates",
    "novel recommendations",
    "romance web novels",
    "fantasy web novels",
    "thriller web novels",
    "novel genres",
    "novel books",
    "novel reviews",
    "new web novels",
    "novel ebooks",
    "action web novels",
    "mystery web novels",
    "web novel chapters",
    "fiction reading",
    "free web novels",
    "novel lovers",
    "novel community",
    "novel library",
    "novel database",
    "novel discussions",
    "novel reading sites",
    "web novel platform",
    "novel updates online",
    "popular web novels",
    "novel reading apps",
    "novels to read online",
    "novels for free",
    "light novels online",
    "best online novels",
    "romance novels online",
    "fantasy novels online",
    "web novel apps",
    "web fiction updates",
    "online reading platforms",
    "read light novels",
    "novels free to read",
    "fiction ebooks",
    "online fiction",
    "book novels",
    "novel community site",
    "top web novels",
    "novel fanbase",
    "novel forum",
    "novel discovery",
    "romantic novels online",
    "best novel recommendations",
    "new fiction releases",
    "novel discussions online",
    "read books online",
    "novel chapter updates",
    "fiction online platform",
    "listen to novels",
    "audiobook novels",
    "audiobook fiction",
    "listen to web novels",
    "novel audiobooks",
    "novel listening apps",
    "listen to light novels",
    "audiobook websites",
    "novels in audio format",
    "listen to fiction",
    "audio book platform",
    "free audiobooks online",
    "listen to novels online",
    "audiobook collection",
    "best audiobook novels",
    "novels for listening",
    "fiction audiobooks",
    "audio novels free",
    "web novels audiobook",
    "listen to stories",
    "novel audiobooks free",
    "audiobook reading apps",
    "audiobook chapters",
    "novel audio platforms",
  ],

  metadataBase: new URL("https://webnovelhub.online"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
      "ja-JP": "/ja-JP",
    },
  },

  openGraph: {
    title: "WebNovelHub - Discover Top Web Novels & Latest Chapters",
    description:
      "Explore the best web novels, latest chapters, and trending stories on WebNovelHub.",
    url: "https://webnovelhub.online",
    siteName: "WebNovelHub",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://webnovelhub.online/image.png",
        width: 1200,
        height: 630,
        alt: "WebNovelHub Preview",
      },
      {
        url: "https://webnovelhub.online/image.png",
        width: 800,
        height: 800,
        alt: "WebNovelHub Logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "WebNovelHub - Discover Top Web Novels & Latest Chapters",
    description:
      "Explore the best web novels, latest chapters, and trending stories on WebNovelHub.",
    creator: "@blackpearl_0001",
    images: ["https://webnovelhub.online/image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  applicationName: "WebNovelHub",
  appleWebApp: {
    title: "WebNovelHub",
    statusBarStyle: "black-translucent",
    capable: true,
  },

  // verification: {
  //   google: "google-site-verification-code",
  //   yandex: "yandex-verification-code",
  //   yahoo: "yahoo-verification-code",
  // },


  // Icons
  icons: {
    icon: [{ url: "/logo.png", type: "image/png", sizes: "192x192" }],
  },

  // Schema.org structured data
  other: {
    "format-detection": "telephone=no",
    "msapplication-TileColor": "#121212",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-4 md:p-6 pt-16 md:pt-6">{children}<Analytics /></main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
