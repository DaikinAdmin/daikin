import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import Header from "@/components/header";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  const session = use(
    auth.api.getSession({
      headers: use(headers()),
    })
  );

  if (!session) {
    redirect(`/signin`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header stays at the top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>
      
      <div className="flex pt-[140px]">
        {/* Sidebar - positioned below header, hidden on mobile */}
        <Sidebar/>
        
        {/* Mobile Navigation - only visible on mobile */}
        <MobileNav user={{
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          role: session.user.role,
          image: session.user.image,
        }} />
        
        {/* Main content area with left margin to account for fixed sidebar on desktop */}
        <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 mt-14">
          {children}
        </main>
      </div>
    </div>
  );
}
