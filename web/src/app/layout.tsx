import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://rohan-2601.github.io/WebLoot";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "WebLoot — Web Asset Extractor",
    template: "%s | WebLoot",
  },
  description:
    "Paste any URL and instantly extract every image, icon, and video hidden inside the page source. A free, open-source web asset extraction tool.",
  keywords: [
    "web asset extractor",
    "image extractor",
    "icon extractor",
    "video extractor",
    "website scraper",
    "download website images",
    "web resources",
    "WebLoot",
  ],
  authors: [{ name: "Rohan Raj", url: "https://github.com/Rohan-2601" }],
  creator: "Rohan Raj",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "WebLoot",
    title: "WebLoot — Web Asset Extractor",
    description:
      "Paste any URL and instantly extract every image, icon, and video hidden inside the page source.",
    images: [
      {
        url: "/readme.png",
        width: 1456,
        height: 816,
        alt: "WebLoot — Web Asset Extractor screenshot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WebLoot — Web Asset Extractor",
    description:
      "Paste any URL and instantly extract every image, icon, and video hidden inside the page source.",
    creator: "@rjha72",
    images: ["/readme.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "WebLoot",
  url: siteUrl,
  description:
    "A free web asset extraction tool. Paste any URL to extract images, icons, and videos from any webpage.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "Rohan Raj",
    url: "https://github.com/Rohan-2601",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${outfit.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
