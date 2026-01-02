"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Icon } from "@iconify-icon/react";
import { Button } from "@/components/ui/button";

// Static responsive banner (no carousel for now)
export function HeroCarousel() {
	const t = useTranslations("home.hero.banner");

	const imageDesktop = "https://daikinkobierzyce.pl/api/images/banery/banner_desktop-1767173854537.png";
	const imageMobile = "https://daikinkobierzyce.pl/api/images/banery/banner_mobile-1767173882608.png";
	const imageAlt = t("imageAlt");
  const description = t("description");
  const shortDescription = t("shortDescription");

	return (
		<section className="bg-white mb-8 md:mb-0">
			{/* Banner image (desktop/mobile) */}
			<div className="relative w-full">
				<picture>
					<source media="(min-width: 768px)" srcSet={imageDesktop} />
					<img src={imageMobile} alt={imageAlt} className="w-full h-auto object-cover" />
				</picture>
			</div>

			{/* Banner content under image */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-4 grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-8 items-start">
				<div>
					<h1 className="text-h2-mobile md:text-h2 text-black mb-2">{t("title")}</h1>
					{/* Primary CTA under title on desktop */}
					<div className="hidden md:block mt-4">
						<Button asChild className="px-8 py-4 rounded-full transition-colors font-medium w-full md:w-3/4 mt-4">
							<Link href="https://bsi.gs-net.pl/kalkulator_na_strone/kalkulator/2398">{t("ctaPrimary")}</Link>
						</Button>
					</div>
				</div>
				<div className="flex flex-col gap-4 md:items-start">
					{/* Use shortDescription on mobile, full description on desktop */}
					<p className="hidden md:block text-main-text text-amm">{description}</p>
					<p className="block md:hidden text-main-text-mobile text-amm">{shortDescription}</p>
					<Link href="https://www.facebook.com/share/p/1HVaJP8XV4/?mibextid=wwXIfr" className="inline-flex items-center gap-2 text-primary hover:text-primary/80">
						<Icon icon="hugeicons:arrow-right-02" className="text-2xl" />
						{t("ctaSecondary")}
					</Link>
					{/* Primary CTA visible on mobile under description */}
					<Button asChild className="md:hidden px-8 py-4 rounded-full transition-colors font-medium w-full">
						<Link href="https://bsi.gs-net.pl/kalkulator_na_strone/kalkulator/2398">{t("ctaPrimary")}</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}

