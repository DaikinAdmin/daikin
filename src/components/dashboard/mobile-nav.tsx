"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  User,
  ShoppingBag,
  Gift,
  Plus,
  Eye,
  MessageSquare,
  Users,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  Wrench,
  Layers,
  Sparkles,
  Package,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";

type UserRole = "user" | "employee" | "admin";

interface MobileNavProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string | null;
  };
}

const getRoleNavItems = (t: any): Record<UserRole, Array<{
  title: string;
  href: string;
  icon: any;
}>> => ({
  "user": [
    {
      title: t("sidebar.userProfile"),
      href: "/dashboard/profile",
      icon: User,
    },
    {
      title: t("sidebar.myOrders"),
      href: "/dashboard/orders",
      icon: ShoppingBag,
    },
    {
      title: t("sidebar.myServices"),
      href: "/dashboard/services",
      icon: Wrench,
    },
    {
      title: t("sidebar.myBenefits"),
      href: "/dashboard/benefits",
      icon: Gift,
    },
  ],
  "employee": [
    {
      title: "Create Order",
      href: "/dashboard/create-order",
      icon: Plus,
    },
    {
      title: "View Orders",
      href: "/dashboard/orders",
      icon: Eye,
    },
    {
      title: "Messages",
      href: "/dashboard/messages",
      icon: MessageSquare,
    },
  ],
  "admin": [
    {
      title: "Users",
      href: "/dashboard/users",
      icon: Users,
    },
    {
      title: "Orders",
      href: "/dashboard/orders",
      icon: ShoppingBag,
    },
    {
      title: "Services",
      href: "/dashboard/services",
      icon: Wrench,
    },
    {
      title: "Events",
      href: "/dashboard/events",
      icon: Calendar,
    },
    {
      title: "Categories",
      href: "/dashboard/categories",
      icon: Layers,
    },
    {
      title: "Products",
      href: "/dashboard/products",
      icon: Package,
    },
    {
      title: "Features",
      href: "/dashboard/features",
      icon: Sparkles,
    },
    {
      title: "Benefits",
      href: "/dashboard/benefits",
      icon: Gift,
    },
    {
      title: "Benefits Redeemed",
      href: "/dashboard/benefits-redeemed",
      icon: Gift,
    },
  ],
});

export function MobileNav({ user }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("dashboard");
  const navItems = getRoleNavItems(t)[user.role as UserRole];

  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile, fixed on bottom right */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#003D7A] hover:bg-[#0052CC] shadow-lg text-white transition-colors"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "md:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white border-r border-gray-200 shadow-lg z-50 transform transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold text-gray-900">{t("title")}</h1>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F8FF] flex-shrink-0">
              <User className="h-5 w-5 text-[#003D7A]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-xs font-medium bg-[#F5F8FF] text-[#003D7A]">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#F5F8FF] text-[#003D7A]"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
                locale={locale}
              >
                <Icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-3 space-y-1">
          <Link
            href="/dashboard/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            locale={locale}
          >
            <Settings className="h-5 w-5" />
            <span>{t("sidebar.settings")}</span>
          </Link>
          <form action="/api/auth/signout" method="POST">
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start px-3 py-2 h-auto text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5 mr-3" />
              {t("sidebar.signOut")}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}