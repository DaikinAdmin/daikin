"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Menu,
  X,
  LogOut,
  Settings,
  ChevronDown,
  LayoutDashboard,
  UserCircle,
  LogIn,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/language-switcher";
import { Link, useRouter } from "@/i18n/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Category } from "@/types/product";

// Helper function to get initials from name
function getInitials(name: string | null | undefined): string {
  if (!name) return "U";

  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
}

type HeaderProps = {
  currentCategorySlug?: string;
  currentProductSlug?: string;
  currentLocale?: string;
};

const Header: React.FC<HeaderProps> = (props) => {
  const locale = props.currentLocale ?? useLocale();
  const router = useRouter();
  const t = useTranslations("header");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/categories?locale=${locale}`);
        if (response.ok) {
          const data = await response.json();
          setCategories(
            data.filter((c: Category & { isActive: boolean }) => c.isActive)
          );
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [locale]);

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/signin");
        },
      },
    });
  };

  return (
    <>
      <header className="bg-white text-header shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link
                href="/"
                className="flex items-center space-x-2 sm:space-x-3"
                locale={locale}
              >
                <div className="w-48 h-48 sm:w-56 sm:h-56 relative select-none">
                  <Image
                    src="/daikin_logo_pl.png"
                    alt="Daikin AMM Project Salon Partnerski Logo"
                    fill
                    className="object-contain select-none"
                    priority
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    onContextMenu={(e) => e.preventDefault()}
                    onMouseDown={(e) => e.preventDefault()}
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {/* O nas */}
              <Link
                href="/about"
                className="px-4 py-2 hover:text-primary rounded-md transition-colors"
                locale={locale}
              >
                {t("nav.about")}
              </Link>

              {/* Produkty */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center px-4 py-2 hover:text-primary rounded-md transition-colors">
                  {t("nav.products")}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
                  {categories.map((cat) => (
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/products/${cat.slug}`}
                        className="cursor-pointer"
                        locale={locale}
                      >
                        {cat.categoryDetails[0].name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Usługi */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center px-4 py-2 hover:text-primary rounded-md transition-colors">
                  {t("nav.services")}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/services/installation"
                      className="cursor-pointer"
                      locale={locale}
                    >
                      {t("nav.installation")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/services/maintenance"
                      className="cursor-pointer"
                      locale={locale}
                    >
                      {t("nav.maintenance")}
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Wiadomości */}
              <Link
                href="/news"
                className="px-4 py-2 hover:text-primary rounded-md transition-colors"
                locale={locale}
              >
                {t("nav.news")}
              </Link>

              {/* Twoja wiedza */}
              <Link
                href="/knowledge"
                className="px-4 py-2 hover:text-primary rounded-md transition-colors"
                locale={locale}
              >
                {t("nav.knowledge")}
              </Link>

              {/* Realizację */}
              <Link
                href="/realizations"
                className="px-4 py-2 hover:text-primary rounded-md transition-colors"
                locale={locale}
              >
                {t("nav.realizations")}
              </Link>

              {/* Twoje konto */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center px-4 py-2 hover:text-primary rounded-md transition-colors">
                  {t("nav.account")}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  {session?.user ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/dashboard"
                          className="cursor-pointer"
                          locale={locale}
                        >
                          <LayoutDashboard className="h-4 w-4 mr-2" />
                          {t("auth.dashboard")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/dashboard/profile"
                          className="cursor-pointer"
                          locale={locale}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          {t("auth.settings")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {t("auth.signOut")}
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/signin"
                          className="cursor-pointer"
                          locale={locale}
                        >
                          <LogIn className="h-4 w-4 mr-2" />
                          {t("auth.signIn")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/signup"
                          className="cursor-pointer"
                          locale={locale}
                        >
                          <UserCircle className="h-4 w-4 mr-2" />
                          {t("auth.signUp")}
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Language Switcher and Mobile menu button */}
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="hidden sm:block lg:block">
                <LanguageSwitcher />
              </div>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-14 sm:top-16 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu Content */}
          <div className="absolute inset-0 bg-white overflow-y-auto shadow-lg mt-14">
            <div className="flex flex-col min-h-full">
              {/* User Profile Section - Top Priority */}
              {session?.user && (
                <div className="px-4 py-4 bg-primary text-white">
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="h-12 w-12 sm:h-14 sm:w-14 ring-2 ring-white">
                      <AvatarImage
                        src={session.user.image || undefined}
                        alt={session.user.name || "User"}
                      />
                      <AvatarFallback className="text-base bg-white text-primary">
                        {getInitials(session.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-base sm:text-lg font-semibold truncate">
                        {session.user.name}
                      </p>
                      <p className="text-xs sm:text-sm text-blue-100 truncate">
                        {session.user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href="/dashboard"
                      className="flex-1 px-3 py-2.5 text-sm sm:text-base bg-white text-primary rounded-lg hover:bg-blue-50 transition-colors font-medium text-center"
                      onClick={() => setIsMenuOpen(false)}
                      locale={locale}
                    >
                      {t("auth.dashboard")}
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className="flex-1 px-3 py-2.5 text-sm sm:text-base border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-medium text-center"
                      onClick={() => setIsMenuOpen(false)}
                      locale={locale}
                    >
                      {t("auth.settings")}
                    </Link>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                {/* O nas */}
                <Link
                  href="/about"
                  className="block px-4 py-3.5 text-h2-mobile hover:text-primary hover:bg-blue-50 rounded-lg font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                  locale={locale}
                >
                  {t("nav.about")}
                </Link>

                {/* Produkty */}
                <div className="space-y-1">
                  <div className="px-4 py-2 text-h2-mobile">
                    {t("nav.products")}
                  </div>
                  <div className="pl-4 space-y-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/products/${cat.slug}`}
                        className="block px-4 py-2.5 text-amm hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                        locale={locale}
                      >
                        {cat.categoryDetails[0].name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Usługi */}
                <div className="space-y-1">
                  <div className="px-4 py-2 text-h2-mobile">
                    {t("nav.services")}
                  </div>
                  <div className="pl-4 space-y-1">
                    <Link
                      href="/services/installation"
                      className="block px-4 py-2.5 text-amm hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                      locale={locale}
                    >
                      {t("nav.installation")}
                    </Link>
                    <Link
                      href="/services/maintenance"
                      className="block px-4 py-2.5 text-amm hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                      locale={locale}
                    >
                      {t("nav.maintenance")}
                    </Link>
                  </div>
                </div>

                {/* Wiadomości */}
                {/* <Link
                  href="/news"
                  className="block px-4 py-3.5 text-h2-mobile text-amm hover:text-primary hover:bg-gray-50 rounded-lg font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                  locale={locale}
                >
                  {t("nav.news")}
                </Link> */}

                {/* Twoja wiedza */}
                {/* <Link
                href="/knowledge"
                className="block px-4 py-3.5 text-h2-mobile text-amm hover:text-primary hover:bg-gray-50 rounded-lg font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
                locale={locale}
              >
                {t('nav.knowledge')}
              </Link> */}

                {/* Realizację */}
                {/* <Link
                href="/realizations"
                className="block px-4 py-3.5 text-h2-mobile text-amm hover:text-primary hover:bg-gray-50 rounded-lg font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
                locale={locale}
              >
                {t('nav.realizations')}
              </Link> */}
              </nav>

              {/* Bottom Section - Auth & Language */}
              <div className="px-4 py-4 border-t-2 border-gray-100 bg-gray-50 space-y-3">
                {session?.user ? (
                  <Button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleSignOut();
                    }}
                    variant="outline"
                    className="w-full py-3 border-2 border-red-600 text-red-600 hover:bg-red-50 hover:border-red-700 text-base font-medium"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    {t("auth.signOut")}
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/signin"
                      className="block px-4 py-3 bg-primary text-white rounded-full hover:bg-caring-blue transition-colors text-center"
                      onClick={() => setIsMenuOpen(false)}
                      locale={locale}
                    >
                      {t("auth.signIn")}
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-4 py-3 border-2 border-primary text-primary rounded-full hover:bg-blue-50 transition-colors font-medium text-center text-base"
                      onClick={() => setIsMenuOpen(false)}
                      locale={locale}
                    >
                      {t("auth.signUp")}
                    </Link>
                  </div>
                )}

                {/* Language Switcher */}
                <div className="pt-2 border-t border-gray-200">
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
