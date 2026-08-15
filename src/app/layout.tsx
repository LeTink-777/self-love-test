import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { EB_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import { PLAN_LIST } from "@/lib/plans";

const displayFont = EB_Garamond({
  variable: "--ff-display",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});
const bodyFont = Manrope({
  variable: "--ff-body",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s — ${SITE.productName}`,
  },
  description: SITE.description,
  keywords: SITE.keywords,
  applicationName: SITE.productName,
  authors: [{ name: SITE.owner.fullName }],
  creator: SITE.owner.fullName,
  publisher: SITE.owner.fullName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE.url,
    siteName: SITE.productName,
    title: SITE.title,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
  category: SITE.category,
};

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/*
 * No aggregateRating is emitted: there is no review data behind these products,
 * and review markup without real reviews breaks Google's structured-data policy.
 * The FAQ answers below are also rendered visibly on the page, which FAQPage
 * markup requires.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.productName,
      description: SITE.description,
      inLanguage: "ru-RU",
      publisher: { "@id": `${SITE.url}/#org` },
    },
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#org`,
      name: SITE.owner.fullName,
      url: SITE.url,
      email: SITE.owner.email,
      taxID: SITE.owner.inn,
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: SITE.owner.email,
          availableLanguage: ["Russian"],
        },
      ],
    },
    {
      "@type": "Product",
      "@id": `${SITE.url}/#product`,
      name: SITE.productName,
      description: SITE.description,
      category: SITE.category,
      brand: { "@type": "Brand", name: SITE.productName },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "RUB",
        lowPrice: Math.min(...PLAN_LIST.map((plan) => plan.price)),
        highPrice: Math.max(...PLAN_LIST.map((plan) => plan.price)),
        offerCount: PLAN_LIST.length,
        offers: PLAN_LIST.map((plan) => ({
          "@type": "Offer",
          name: plan.name,
          description: plan.yooDescription,
          price: plan.price,
          priceCurrency: "RUB",
          availability: "https://schema.org/InStock",
          url: SITE.url,
          seller: { "@id": `${SITE.url}/#org` },
        })),
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE.url}/#faq`,
      mainEntity: SITE.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-ink font-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
