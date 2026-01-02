"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Youtube, Instagram } from "lucide-react";
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  return (
    <footer className="bg-amm text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <img
                src="/logo_white.png"
                alt="Daikin"
                className="h-16 w-auto select-none"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
                onMouseDown={(e) => e.preventDefault()}
              />
            </div>
              <p className="text-white mb-6">
              {t('company')}
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/kobierzyce.daikin/"
                  className="text-white hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/amm-project-sp-z-o-o"
                  className="text-white hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/daikin_kobierzyce/"
                  className="text-white hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">{t('quickLinks')}</h3>
            <ul className="space-y-3">
              <li>
                  <Link href="/news" className="text-white hover:text-primary transition-colors">
                  {t('links.blog')}
                </Link>
              </li>
              <li>
                  <Link href="/benefits" className="text-white hover:text-primary transition-colors">
                  {t('links.benefits')}
                </Link>
              </li>
              <li>
                  <Link href="/about" className="text-white hover:text-primary transition-colors">
                  {t('links.about')}
                </Link>
              </li>
              <li>
                  <Link href="/dashboard" className="text-white hover:text-primary transition-colors">
                  {t('links.dashboard')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Products & Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">{t('products')}</h3>
            <ul className="space-y-3">
              <li>
                  <a href="products/air-conditioning" className="text-white hover:text-primary transition-colors">
                  {t('productLinks.airConditioning')}
                </a>
              </li>
              <li>
                  <a href="products/heat-pumps" className="text-white hover:text-primary transition-colors">
                  {t('productLinks.heatPumps')}
                </a>
              </li>
              <li>
                  <a href="products/air-purifiers" className="text-white hover:text-primary transition-colors">
                  {t('productLinks.airPurifiers')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">{t('contact')}</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white">{t('salesSupport')}</p>
                  <p className="text-white font-medium">+48 (690) 990 794</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white">{t('email')}</p>
                  <p className="text-white font-medium">a.ivanovic@ammproject.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white">{t('headquarters')}</p>
                  <p className="text-white font-medium">
                    Krótka 3, 55-040 <br /> 
                    Kobierzyce, Poland
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-blue-100 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-white text-sm mb-4 md:mb-0">
              {t('copyright')}
            </div>
            <div className="flex space-x-6 text-sm">
                <Link href="/privacy" className="text-white hover:text-primary transition-colors">
                {t('privacy')}
              </Link>
                <Link href="/terms" className="text-white hover:text-primary transition-colors">
                {t('terms')}
              </Link>
                <Link href="/cookies" className="text-white hover:text-primary transition-colors">
                {t('cookies')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}