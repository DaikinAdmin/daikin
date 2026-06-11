"use client";

import { useState } from "react";
import Image from "next/image";
import { FadeIn } from "@/components/fade-in";

interface CertificateItem {
  id: string;
  title: string;
  subtitle?: string;
  imgSrc?: string;
  date?: string;
  details?: {
    text: string;
    date?: string;
  }[];
}

interface Section {
  id: string;
  label: string;
  layout?: "grid" | "list";
  items: CertificateItem[];
}

const sections: Section[] = [
  {
    id: "udt",
    label: "UDT / F-GAZY",
    layout: "list",
    items: [
      {
        id: "udt_zbiorniki",
        title: "Karta uprawnień napełnianie zbiorników przemysłowych",
        subtitle: "URZĄD DOZORU TECHNICZNEGO",
        date: "DATA WYDANIA: 18.03.2026",
        details: [
          {
            text: "NAPEŁNIANIE ZBIORNIKÓW PRZENOŚNYCH (NACZYŃ CIŚNIENIOWYCH) O POJEMNOŚCI POWYŻEJ 350 CM³ — GAZY SKROPLONE (CZYNNIKI CHŁODNICZE FGAZ I SZWO)",
          },
        ],
      },
      {
        id: "udt_fgazy",
        title: "Karta uprawnień F-GAZY",
        subtitle: "URZĄD DOZORU TECHNICZNEGO",
        date: "DATA WYDANIA: 19.03.2026",
        details: [
          {
            text: "Kontrola szczelności stacjonarnych urządzeń chłodniczych, klimatyzacyjnych i pomp ciepła oraz agregatów chłodniczych w samochodach ciężarowych chłodniach i przyczepach chłodniach, zawierających co najmniej 5 ton ekwiwalentu CO₂ fluorowanych gazów cieplarnianych lub co najmniej 3 kg substancji kontrolowanych oraz zawierających co najmniej 10 ton ekwiwalentu CO₂ fluorowanych gazów cieplarnianych lub co najmniej 6 kg substancji kontrolowanych w odpowiednio oznakowanych hermetycznie zamkniętych systemach.",
          },
          {
            text: "Instalacja, konserwacja lub serwisowanie, a także naprawa i likwidacja stacjonarnych urządzeń chłodniczych, klimatyzacyjnych i pomp ciepła oraz agregatów chłodniczych w samochodach ciężarowych chłodniach i przyczepach chłodniach, zawierających fluorowane gazy cieplarniane lub substancje kontrolowane, oraz odzysk fluorowanych gazów cieplarnianych lub substancji kontrolowanych ze stacjonarnych i ruchomych urządzeń chłodniczych, klimatyzacyjnych i pomp ciepła.",
          },
        ],
      },
    ],
  },
  {
    id: "daikin",
    label: "Daikin",
    items: [
      {
        id: "vrv5",
        title: "Montaż i uruchomienie VRV 5 HR",
        subtitle: "DAIKIN SZKOLENIE MONTAŻOWE",
        imgSrc:
          "https://daikinkobierzyce.pl/api/images/certificates/vrv_5_hr-1781167512085.jpg",
      },
      {
        id: "altherma",
        title: "DAIKIN ALTHERMA 3 i 4",
        subtitle: "DAIKIN SZKOLENIE MONTAŻOWE",
        imgSrc:
          "https://daikinkobierzyce.pl/api/images/certificates/altherma_3_4-1781167471974.jpg",
      },
      {
        id: "r32_split",
        title: "KLIMATYZATORY SPLIT / MULTI / SKY AIR NA CZYNNIK R32",
        subtitle: "DAIKIN SZKOLENIE MONTAŻOWE",
        imgSrc:
          "https://daikinkobierzyce.pl/api/images/certificates/r32-1781167496480.jpg",
      },
      {
        id: "rezydencyjne",
        title:
          "KLIMATYZATORY REZYDENCYJNE SZKOLENIE MONTAŻOWO-SERWISOWE DLA URZĄDZEŃ SPLIT I MULTISPLIT",
        subtitle: "DAIKIN SZKOLENIE MONTAŻOWE",
        imgSrc:
          "https://daikinkobierzyce.pl/api/images/certificates/split_multisplit-1781167502476.jpg",
      },
    ],
  },
  {
    id: "lutowanie",
    label: "Lutowanie twarde",
    items: [
      {
        id: "lutowanie",
        title: "Lutowanie twarde",
        imgSrc:
          "https://daikinkobierzyce.pl/api/images/certificates/LUTOWANIE_TWARDE-1781167487260.jpg",
      },
    ],
  },
];

function CertificateCard({
  cert,
  onImageClick,
}: {
  cert: CertificateItem;
  onImageClick: (src: string, title: string) => void;
}) {
  return (
    <div className="flex flex-col bg-white border border-caring-grey rounded-sm overflow-hidden h-full">
      {/* Image */}
      {cert.imgSrc && (
        <button
          onClick={() => onImageClick(cert.imgSrc!, cert.title)}
          className="relative w-full aspect-[4/3] overflow-hidden bg-caring-light-grey group cursor-zoom-in"
          aria-label={`Powiększ certyfikat: ${cert.title}`}
        >
          <Image
            src={cert.imgSrc}
            alt={
              cert.subtitle ? `${cert.title} – ${cert.subtitle}` : cert.title
            }
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </button>
      )}

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-2">
        <div>
          <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-1">
            {cert.subtitle ?? "\u00A0"}
          </p>
          <h3 className="text-h3-mobile lg:text-h3 leading-snug">
            {cert.title}
          </h3>
          {cert.date && (
            <p className="mt-2 text-xs font-semibold tracking-wide text-primary uppercase">
              {cert.date}
            </p>
          )}
        </div>

        {cert.details && cert.details.length > 0 && (
          <ol className="mt-3 flex flex-col gap-4 list-none">
            {cert.details.map((item, i) => (
              <li key={i} className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full border border-amm/40 text-amm flex items-center justify-center text-xs font-semibold mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-main-text-mobile lg:text-main-text text-amm leading-relaxed">
                    {item.text}
                  </p>
                </div>
                {item.date && (
                  <p className="ml-7 text-xs font-semibold tracking-wide text-primary uppercase">
                    {item.date}
                  </p>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

export function CertificatesGrid() {
  const [activeImage, setActiveImage] = useState<{
    src: string;
    title: string;
  } | null>(null);

  return (
    <>
      <div className="flex flex-col gap-16">
        {sections.map((section, sectionIndex) => (
          <section key={section.id}>
            <FadeIn delay={sectionIndex * 60}>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-h2-mobile lg:text-h2 whitespace-nowrap">
                  {section.label}
                </h2>
                <div className="flex-1 h-px bg-caring-grey" />
              </div>
            </FadeIn>

            {section.layout === "list" ? (
              <div className="flex flex-col gap-6">
                {section.items.map((cert, index) => (
                  <FadeIn key={cert.id} delay={sectionIndex * 60 + index * 80}>
                    <CertificateCard
                      cert={cert}
                      onImageClick={(src, title) =>
                        setActiveImage({ src, title })
                      }
                    />
                  </FadeIn>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {section.items.map((cert, index) => (
                  <FadeIn key={cert.id} delay={sectionIndex * 60 + index * 80}>
                    <CertificateCard
                      cert={cert}
                      onImageClick={(src, title) =>
                        setActiveImage({ src, title })
                      }
                    />
                  </FadeIn>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Lightbox */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute -top-10 right-0 text-white text-3xl leading-none hover:text-primary transition-colors"
              aria-label="Zamknij"
            >
              &times;
            </button>
            <div className="relative w-full max-h-[80vh]">
              <Image
                src={activeImage.src}
                alt={activeImage.title}
                width={1200}
                height={900}
                className="object-contain w-full h-auto max-h-[80vh] rounded-sm"
              />
            </div>
            <p className="mt-3 text-white text-sm text-center opacity-80">
              {activeImage.title}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
