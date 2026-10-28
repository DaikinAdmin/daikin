"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { useTranslations } from "next-intl";
import { ArrowRight, MapPin } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "@/i18n/navigation";
import type { RealizationItemConfig } from "@/data/realizations";

function RealizationGallery({ title, images }: { title: string; images: string[] }) {
  const [index, setIndex] = useState(-1);
  if (!images.length) return null;
  const visible = images.slice(1, 4);
  return (
    <div className="min-w-0">
      <button type="button" onClick={() => setIndex(0)} aria-label={title} className="relative block aspect-[4/3] w-full overflow-hidden rounded-sm bg-container cursor-zoom-in">
        <Image src={images[0]} alt={title} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
      </button>
      {visible.length > 0 && (
        <div className="mt-2 grid grid-cols-3 gap-2">
          {visible.map((src, i) => (
            <button key={`${src}-${i}`} type="button" onClick={() => setIndex(i + 1)} aria-label={`${title} ${i + 2}`} className="relative aspect-[4/3] overflow-hidden rounded-sm bg-container cursor-zoom-in">
              <Image src={src} alt={`${title} ${i + 2}`} fill sizes="(min-width: 1024px) 15vw, 33vw" className="object-cover" />
              {i === visible.length - 1 && images.length > 4 && <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-medium text-white">+{images.length - 4}</span>}
            </button>
          ))}
        </div>
      )}
      <Lightbox open={index >= 0} index={index} close={() => setIndex(-1)} slides={images.map((src, i) => ({ src, alt: `${title} ${i + 1}` }))} plugins={[Thumbnails, Zoom]} />
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-gray-200 pt-5 first:border-t-0 first:pt-0">
      <h3 className="mb-2 border-l-2 border-[#0097E0] pl-3 text-base font-semibold text-black">{title}</h3>
      <div className="text-sm leading-7 text-gray-600">{children}</div>
    </section>
  );
}

export function RealizationAccordion({ groupId, items }: { groupId: string; items: RealizationItemConfig[] }) {
  const t = useTranslations("realizations");
  return (
    <Accordion type="single" collapsible defaultValue={items[0]?.id} className="divide-y divide-gray-200 border-y border-gray-200">
      {items.map((item) => {
        const base = `groups.${groupId}.items.${item.id}`;
        const has = (key: string) => t.has(`${base}.${key}`);
        const meta = has("meta") ? (t.raw(`${base}.meta`) as { label: string; value: string }[]) : [];
        const solutionList = has("solution.list") ? (t.raw(`${base}.solution.list`) as string[]) : [];
        const includes = has("cost.includes") ? (t.raw(`${base}.cost.includes`) as string[]) : [];
        const features = has("features") ? (t.raw(`${base}.features`) as { title: string; text: string }[]) : [];
        const beforeAfter = Boolean(item.beforeImage && item.afterImage);
        return (
          <AccordionItem key={item.id} value={item.id} className="border-0">
            <AccordionTrigger className="gap-5 py-6 text-left hover:no-underline [&>svg]:text-[#0097E0]">
              <div className="min-w-0 flex-1 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#0097E0]">{t(`${base}.tag`)}</p>
                <h2 className="text-lg font-semibold leading-snug text-black sm:text-xl">{t(`${base}.title`)}</h2>
                {has("location") && <p className="flex items-center gap-1.5 text-sm font-normal text-gray-500"><MapPin className="h-3.5 w-3.5" />{t(`${base}.location`)}</p>}
                {meta.length > 0 && <div className="flex flex-wrap gap-x-5 gap-y-1 pt-1 text-xs font-normal text-gray-500">{meta.map((entry) => <span key={entry.label}>{entry.label}: <strong className="font-semibold text-[#0097E0]">{entry.value}</strong></span>)}</div>}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-8 pt-1">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
                <div className="flex flex-col gap-5">
                  <DetailSection title={t(`${base}.building.title`)}><p>{t(`${base}.building.text`)}</p></DetailSection>
                  {has("needs.title") && <DetailSection title={t(`${base}.needs.title`)}><p>{t(`${base}.needs.text`)}</p></DetailSection>}
                  <DetailSection title={t(`${base}.solution.title`)}>
                    <p>{t(`${base}.solution.text`)}</p>
                    {solutionList.length > 0 && <ul className="mt-2 list-disc space-y-1 pl-5">{solutionList.map((entry) => <li key={entry}>{entry}</li>)}</ul>}
                  </DetailSection>
                  {has("cost.title") && <DetailSection title={t(`${base}.cost.title`)}>
                    <p className="text-2xl font-semibold tracking-tight text-[#0097E0]">{t(`${base}.cost.price`)}</p>
                    {has("cost.includes") && <div className="mt-3"><p className="font-medium text-gray-800">{t(`${base}.cost.includesTitle`)}</p><ul className="mt-1 list-disc space-y-1 pl-5">{includes.map((entry) => <li key={entry}>{entry}</li>)}</ul></div>}
                  </DetailSection>}
                </div>
                <RealizationGallery title={t(`${base}.title`)} images={[item.mainImage, ...item.thumbnails]} />
              </div>
              {beforeAfter && <div className="mt-9 grid gap-4 border-t border-gray-200 pt-7 sm:grid-cols-2">
                {([{ src: item.beforeImage!, label: t("booklet.before") }, { src: item.afterImage!, label: t("booklet.after") }]).map(({ src, label }) => <figure key={label}><div className="relative aspect-video overflow-hidden rounded-sm bg-container"><Image src={src} alt={`${label} – ${t(`${base}.title`)}`} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" /></div><figcaption className="mt-2 text-xs font-semibold uppercase tracking-wide text-[#0097E0]">{label}</figcaption></figure>)}
              </div>}
              {features.length > 0 && <div className="mt-9 grid gap-x-8 gap-y-5 border-t border-gray-200 pt-7 sm:grid-cols-2 lg:grid-cols-4">{features.map((feature) => <div key={feature.title}><h4 className="mb-1 text-sm font-semibold text-[#0097E0]">{feature.title}</h4><p className="text-sm leading-6 text-gray-600">{feature.text}</p></div>)}</div>}
              <div className="mt-8 flex justify-end"><Link href="/?visit=1" className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity">{t("booklet.contact")}<ArrowRight className="h-4 w-4" /></Link></div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
