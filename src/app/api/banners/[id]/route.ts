import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/db";
import { withPrisma } from "@/db/utils";

// GET single banner
export const GET = async (
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    return withPrisma(async () => {
        try {
            const { id } = await params;

            const banner = await prisma.banners.findUnique({
                where: { id },
            });

            if (!banner) {
                return NextResponse.json(
                    { error: "Banner not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json(banner, { status: 200 });
        } catch (error) {
            console.error("Error fetching banner:", error);
            return NextResponse.json(
                { error: "Failed to fetch banner" },
                { status: 500 }
            );
        }
    });
};

// PUT update banner (admin only)
export const PUT = async (
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    return withPrisma(async () => {
        try {
            const session = await auth.api.getSession({
                headers: await headers(),
            });

            if (!session || session.user.role !== "admin") {
                return NextResponse.json(
                    { error: "Unauthorized" },
                    { status: 401 }
                );
            }

            const { id } = await params;
            const body = await req.json();
            const { img, link, location, locale, isMobile, isActive } = body;

            const existingBanner = await prisma.banners.findUnique({
                where: { id },
            });

            if (!existingBanner) {
                return NextResponse.json(
                    { error: "Banner not found" },
                    { status: 404 }
                );
            }

            const banner = await prisma.banners.update({
                where: { id },
                data: {
                    ...(img !== undefined && { img }),
                    ...(link !== undefined && { link }),
                    ...(location !== undefined && { location }),
                    ...(locale !== undefined && { locale }),
                    ...(isMobile !== undefined && { isMobile }),
                    ...(isActive !== undefined && { isActive }),
                },
            });

            return NextResponse.json(banner, { status: 200 });
        } catch (error) {
            console.error("Error updating banner:", error);
            return NextResponse.json(
                { error: "Failed to update banner" },
                { status: 500 }
            );
        }
    });
};

// DELETE banner (admin only)
export const DELETE = async (
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    return withPrisma(async () => {
        try {
            const session = await auth.api.getSession({
                headers: await headers(),
            });

            if (!session || session.user.role !== "admin") {
                return NextResponse.json(
                    { error: "Unauthorized" },
                    { status: 401 }
                );
            }

            const { id } = await params;

            const existingBanner = await prisma.banners.findUnique({
                where: { id },
            });

            if (!existingBanner) {
                return NextResponse.json(
                    { error: "Banner not found" },
                    { status: 404 }
                );
            }

            await prisma.banners.delete({
                where: { id },
            });

            return NextResponse.json(
                { message: "Banner deleted successfully" },
                { status: 200 }
            );
        } catch (error) {
            console.error("Error deleting banner:", error);
            return NextResponse.json(
                { error: "Failed to delete banner" },
                { status: 500 }
            );
        }
    });
};
