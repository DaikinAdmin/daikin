"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { 
  Snowflake, 
  Wind, 
  Zap, 
  Thermometer, 
  Award, 
  Clock,
  Tag,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const slideIcons = {
  snowflake: Snowflake,
  wind: Wind,
  zap: Zap,
  thermometer: Thermometer,
  award: Award,
};

export function HeroCarousel() {
  const t = useTranslations("home.hero");
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const slides = [
    {
      key: "slide1",
      icon: "snowflake",
      badge: t("slides.slide1.badge"),
      gradient: "from-blue-600 via-blue-500 to-cyan-400",
    },
    {
      key: "slide2",
      icon: "award",
      badge: t("slides.slide2.badge"),
      gradient: "from-purple-600 via-purple-500 to-pink-400",
    },
    {
      key: "slide3",
      icon: "zap",
      badge: t("slides.slide3.badge"),
      gradient: "from-green-600 via-emerald-500 to-teal-400",
    },
    {
      key: "slide4",
      icon: "thermometer",
      badge: t("slides.slide4.badge"),
      gradient: "from-orange-600 via-orange-500 to-amber-400",
    },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-10">
        <Carousel
          setApi={setApi}
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {slides.map((slide, index) => {
              const Icon = slideIcons[slide.icon as keyof typeof slideIcons];
              return (
                <CarouselItem key={index}>
                  <div className="relative">
                    <div className={`relative rounded-3xl bg-gradient-to-br ${slide.gradient} p-8 lg:p-16 shadow-2xl overflow-hidden`}>
                      {/* Decorative Elements */}
                      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                      
                      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Left Content */}
                        <div className="text-white space-y-6 lg:space-y-8">
                          {/* Badge */}
                          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                            <Tag className="h-4 w-4" />
                            <span className="text-sm font-medium">{slide.badge}</span>
                          </div>

                          {/* Title */}
                          <h1 className="text-h1-mobile lg:text-6xl font-bold leading-tight">
                            {t(`slides.${slide.key}.title`)}
                          </h1>

                          {/* Description */}
                          <p className="text-subtitle-mobile lg:text-xl text-white/90 leading-relaxed max-w-xl">
                            {t(`slides.${slide.key}.description`)}
                          </p>

                          {/* Features List */}
                          <ul className="space-y-3">
                            {[1, 2, 3].map((i) => (
                              <li key={i} className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-white/90 flex-shrink-0" />
                                <span className="text-white/90">
                                  {t(`slides.${slide.key}.features.${i}`)}
                                </span>
                              </li>
                            ))}
                          </ul>

                          {/* CTA Buttons */}
                          <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link
                              href="/products"
                              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                              {t("cta.explore")}
                              <ArrowRight className="h-5 w-5" />
                            </Link>
                            <Link
                              href="/contact"
                              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-200 font-semibold text-lg"
                            >
                              {t("cta.contact")}
                            </Link>
                          </div>
                        </div>

                        {/* Right Content - Icon/Visual */}
                        <div className="relative flex items-center justify-center lg:justify-end lg:mr-10">
                          <div className="relative">
                            {/* Main Icon Circle */}
                            <div className="relative w-64 h-64 lg:w-80 lg:h-80">
                              <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-full animate-pulse"></div>
                              <div className="absolute inset-4 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center">
                                <Icon className="w-32 h-32 lg:w-40 lg:h-40 text-white drop-shadow-2xl" />
                              </div>
                            </div>
                            
                            {/* Floating Stats */}
                            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 animate-bounce" style={{ animationDuration: '3s' }}>
                              <div className="flex items-center gap-2">
                                <Award className="h-6 w-6 text-yellow-500" />
                                <div className="text-left">
                                  <div className="text-2xl font-bold text-gray-900">
                                    {t(`slides.${slide.key}.stats.value`)}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {t(`slides.${slide.key}.stats.label`)}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Time Badge */}
                            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4">
                              <div className="flex items-center gap-2">
                                <Clock className="h-6 w-6 text-blue-500" />
                                <div className="text-sm font-semibold text-gray-900">
                                  {t(`slides.${slide.key}.time`)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          
          {/* Navigation Arrows */}
          <CarouselPrevious className="hidden lg:flex -left-4 h-12 w-12 border-2 border-white bg-white/90 hover:bg-white text-gray-900" />
          <CarouselNext className="hidden lg:flex -right-4 h-12 w-12 border-2 border-white bg-white/90 hover:bg-white text-gray-900" />
        </Carousel>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === current - 1
                  ? "w-8 bg-[#003D7A]"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
