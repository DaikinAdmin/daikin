"use client";

import { useState } from "react";
import { Menu, X, LogOut, Settings } from "lucide-react";
import { useLocale, useTranslations } from 'next-intl';
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

// Helper function to get initials from name
function getInitials(name: string | null | undefined): string {
  if (!name) return "U";
  
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
}

export default function Header() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('header');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/signin');
        }
      }
    });
  };

  return (
    <>
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3" locale={locale}>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#003D7A] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-base sm:text-lg">D</span>
              </div>
              <span className="text-lg sm:text-2xl font-bold text-[#003D7A]">{t('logo')}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link
              href="/"
              className="text-sm xl:text-base text-gray-700 hover:text-[#003D7A] font-medium transition-colors"
              locale={locale}
            >
              {t('nav.blog')}
            </Link>
            <Link
              href="/benefits"
              className="text-sm xl:text-base text-gray-700 hover:text-[#003D7A] font-medium transition-colors"
              locale={locale}
            >
              {t('nav.benefits')}
            </Link>
            <Link
              href="/about"
              className="text-sm xl:text-base text-gray-700 hover:text-[#003D7A] font-medium transition-colors"
              locale={locale}
            >
              {t('nav.about')}
            </Link>
            <Link
              href="/contact"
              className="text-sm xl:text-base text-gray-700 hover:text-[#003D7A] font-medium transition-colors"
              locale={locale}
            >
              {t('nav.contact')}
            </Link>
            {session?.user && (
              <Link 
                href="/dashboard" 
                className="text-sm xl:text-base text-gray-700 hover:text-[#003D7A] font-medium transition-colors"
                locale={locale}
                data-testid="dashboard-link"
              >
                {t('auth.dashboard')}
              </Link>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            <LanguageSwitcher />
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:ring-offset-2 rounded-full">
                    <Avatar className="h-9 w-9 xl:h-10 xl:w-10">
                      <AvatarImage src={session.user.image || undefined} alt={session.user.name || "User"} />
                      <AvatarFallback className="text-sm">{getInitials(session.user.name)}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 sm:w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="w-full cursor-pointer text-sm" locale={locale}>
                      <Settings className="h-4 w-4 mr-2" />
                      {t('auth.settings')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('auth.signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/signin"
                className="px-3 xl:px-4 py-2 border border-[#003D7A] text-[#003D7A] rounded-md hover:bg-[#F5F8FF] transition-colors font-medium text-sm xl:text-base"
                locale={locale}
              >
                {t('auth.signIn')}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
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
        <div className="absolute inset-0 bg-white overflow-y-auto shadow-lg">
          <div className="flex flex-col min-h-full">
            {/* User Profile Section - Top Priority */}
            {session?.user && (
              <div className="px-4 py-4 bg-gradient-to-r from-[#003D7A] to-[#0052a3] text-white">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-12 w-12 sm:h-14 sm:w-14 ring-2 ring-white">
                    <AvatarImage src={session.user.image || undefined} alt={session.user.name || "User"} />
                    <AvatarFallback className="text-base bg-white text-[#003D7A]">{getInitials(session.user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-base sm:text-lg font-semibold truncate">{session.user.name}</p>
                    <p className="text-xs sm:text-sm text-blue-100 truncate">{session.user.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/dashboard"
                    className="flex-1 px-3 py-2.5 text-sm sm:text-base bg-white text-[#003D7A] rounded-lg hover:bg-blue-50 transition-colors font-medium text-center"
                    onClick={() => setIsMenuOpen(false)}
                    locale={locale}
                  >
                    {t('auth.dashboard')}
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="flex-1 px-3 py-2.5 text-sm sm:text-base border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-medium text-center"
                    onClick={() => setIsMenuOpen(false)}
                    locale={locale}
                  >
                    {t('auth.settings')}
                  </Link>
                </div>
              </div>
            )}
            
            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              <Link
                href="/"
                className="block px-4 py-3.5 text-base sm:text-lg text-gray-700 hover:text-[#003D7A] hover:bg-blue-50 rounded-lg font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
                locale={locale}
              >
                {t('nav.blog')}
              </Link>
              <Link
                href="/benefits"
                className="block px-4 py-3.5 text-base sm:text-lg text-gray-700 hover:text-[#003D7A] hover:bg-blue-50 rounded-lg font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
                locale={locale}
              >
                {t('nav.benefits')}
              </Link>
              <Link
                href="/about"
                className="block px-4 py-3.5 text-base sm:text-lg text-gray-700 hover:text-[#003D7A] hover:bg-blue-50 rounded-lg font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
                locale={locale}
              >
                {t('nav.about')}
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-3.5 text-base sm:text-lg text-gray-700 hover:text-[#003D7A] hover:bg-blue-50 rounded-lg font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
                locale={locale}
              >
                {t('nav.contact')}
              </Link>
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
                  {t('auth.signOut')}
                </Button>
              ) : (
                <Link
                  href="/signin"
                  className="block px-4 py-3 bg-[#003D7A] text-white rounded-lg hover:bg-[#002952] transition-colors font-medium text-center text-base"
                  onClick={() => setIsMenuOpen(false)}
                  locale={locale}
                >
                  {t('auth.signIn')}
                </Link>
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
}