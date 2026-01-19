import { NextResponse } from "next/server";
import prisma from "@/db";
import { withPrisma } from "@/db/utils";

// GET public banners (only active)
export const GET = async (req: Request) => {
    return withPrisma(async () => {
        try {
            const { searchParams } = new URL(req.url);
            const locale = searchParams.get("locale");
            const location = searchParams.get("location");
            const isMobile = searchParams.get("isMobile");

            console.log("Raw params:", { locale, location, isMobile, isMobileType: typeof isMobile });

            if (!locale) {
                return NextResponse.json(
                    { error: "Locale parameter is required" },
                    { status: 400 }
                );
            }

            const whereClause = {
                locale,
                ...(location && { location }),
                ...(isMobile !== null && isMobile !== undefined && { isMobile: isMobile === "true" }),
                isActive: true,
            };

            console.log("WHERE clause:", JSON.stringify(whereClause, null, 2));
            
            // Перевіримо всі банери без фільтрів
            const allBanners = await prisma.banners.findMany({
                select: {
                    id: true,
                    locale: true,
                    location: true,
                    isMobile: true,
                    isActive: true,
                    img: true,
                },
            });
            console.log("All banners in DB:", JSON.stringify(allBanners, null, 2));

            const banners = await prisma.banners.findMany({
                where: whereClause,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    img: true,
                    link: true,
                    location: true,
                    locale: true,
                    isMobile: true,
                },
            });

            console.log("Found banners:", banners.length);

            return NextResponse.json(banners, { status: 200 });
        } catch (error) {
            console.error("Error fetching public banners:", error);
            return NextResponse.json(
                { error: "Failed to fetch banners" },
                { status: 500 }
            );
        }
    });
};
