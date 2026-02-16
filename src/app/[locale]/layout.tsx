import type { Metadata } from "next";
import localFont from "next/font/local";
import { Montserrat } from "next/font/google";
import { Source_Sans_3 } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import "./globals.css";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { OrganizationSchema } from "@/components/structured-data";

// Google Font - Source Sans 3 as fallback
const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

// Myriad Pro fonts (if you have the font files)
const myriadPro = localFont({
  src: [
    {
      path: "./fonts/MyriadPro-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/MyriadPro-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-myriad-pro",
  fallback: ["Source Sans 3", "sans-serif"],
  display: "swap",
});

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const indexPl = locale === "pl";

  const keywords = [
    "Daikin Wrocław",
    "klimatyzatory Wrocław",
    "pompy ciepła Wrocław",
    "pompy ciepła Kobierzyce",
    "klimatyzacja Polska",
    "montaż klimatyzacji Wrocław",
    "serwis klimatyzacji Wrocław",
    "klimatyzacja Kobierzyce",
    "autoryzowany partner Daikin Wrocław",
    "HVAC Wrocław",
  ];

  return {
    metadataBase: new URL("https://daikinkobierzyce.pl"),
    title: {
      default:
        "Klimatyzacja Wrocław i Kobierzyce | Pompy Ciepła Daikin – Montaż i Serwis",
      template: "%s | Daikin Kobierzyce",
    },
    description:
      "Autoryzowany partner Daikin. Profesjonalny montaż klimatyzacji, pomp ciepła i oczyszczaczy powietrza we Wrocławiu i Kobierzycach. Serwis i doradztwo.",
    keywords,
    authors: [{ name: "AMM Salon Daikin" }],
    creator: "AMM Salon",
    publisher: "AMM Salon",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: "/favicon.png",
    },
    alternates: {
      canonical: "https://daikinkobierzyce.pl/pl",
    },
    openGraph: {
      type: "website",
      locale: "pl_PL",
      url: "https://daikinkobierzyce.pl/pl",
      siteName: "Daikin Kobierzyce",
      title:
        "Klimatyzacja i Pompy Ciepła Daikin – Wrocław i Kobierzyce",
      description:
        "Autoryzowany partner Daikin. Montaż i serwis klimatyzacji oraz pomp ciepła. Oczyszczacze powietrza Daikin we Wrocławiu i Kobierzycach.",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Klimatyzacja Daikin Wrocław",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title:
        "Klimatyzacja i Pompy Ciepła Daikin – Wrocław i Kobierzyce",
      description:
        "Autoryzowany partner Daikin. Montaż i serwis klimatyzacji oraz pomp ciepła. Oczyszczacze powietrza Daikin we Wrocławiu i Kobierzycach.",
      images: ["/og-image.jpg"],
    },
    robots: {
      index: indexPl,
      follow: indexPl,
      googleBot: {
        index: indexPl,
        follow: indexPl,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "verification_token",
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;

  // Get messages for client components
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${montserrat.variable} antialiased font-sans`}>
        <OrganizationSchema locale={locale} />
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
