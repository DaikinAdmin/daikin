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
  Wrench,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { redirect } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { useUserRole } from "@/hooks/use-user-role";

type UserRole = "user" | "employee" | "admin";

const getRoleNavItems = (t: any): Record<UserRole, Array<{
  title: string;
  href: string;
  icon: any;
}>> => ({
  user: [
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
      href: "/dashboard/benefits/user",
      icon: Gift,
    },
  ],
  employee: [
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
  admin: [
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

export function Sidebar() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("dashboard");
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const role = useUserRole();
  const navItems = role ? getRoleNavItems(t)[role as UserRole] : [];

  // Don't render sidebar while session is loading
  if (isPending) {
    return null;
  }

  // If no session after loading, don't render (layout will handle redirect)
  if (!session) {
    return null;
  }

  return (
    <div className="hidden md:flex fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-gray-200 bg-white shadow-sm flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 lg:p-6">
        <h1 className="text-lg lg:text-xl font-bold text-gray-900">{t("title")}</h1>
        <div className="mt-3 lg:mt-4 flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F8FF] flex-shrink-0">
            <User className="h-5 w-5 text-[#003D7A]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user!.name}
            </p>
            <p className="text-xs text-gray-500 truncate">{user!.email}</p>
            <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-xs font-medium bg-[#F5F8FF] text-[#003D7A]">
              {role}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 lg:px-4 py-4 lg:py-6 space-y-1 lg:space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#F5F8FF] text-[#003D7A]"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-3 lg:p-4 space-y-1 lg:space-y-2">
        <Link
          href="/dashboard/settings"
          className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
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
  );
}