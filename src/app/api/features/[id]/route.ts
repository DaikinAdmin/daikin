import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/db";
import { withPrisma } from "@/db/utils";

// GET single feature
export const GET = async (
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    return withPrisma(async () => {
        try {
            const { id } = await params;
            const { searchParams } = new URL(req.url);
            const locale = searchParams.get("locale");

            const feature = await prisma.feature.findUnique({
                where: { id },
                include: {
                    featureDetails: locale
                        ? {
                              where: { locale, isActive: true },
                          }
                        : { where: { isActive: true } },
                    products: {
                        where: { isActive: true },
                        include: {
                            productDetails: locale
                                ? {
                                      where: { locale },
                                  }
                                : true,
                            category: {
                                include: {
                                    categoryDetails: locale
                                        ? {
                                              where: { locale, isActive: true },
                                          }
                                        : { where: { isActive: true } },
                                },
                            },
                        },
                    },
                },
            });

            if (!feature) {
                return NextResponse.json(
                    { error: "Feature not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json(feature);
        } catch (error) {
            console.error("Error fetching feature:", error);
            return NextResponse.json(
                { error: "Failed to fetch feature" },
                { status: 500 }
            );
        }
    });
};

// PUT update feature (Admin only)
export const PUT = async (
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return withPrisma(async () => {
        try {
            const { id } = await params;
            const { name, img, isActive, preview, translations } = await req.json();

            // Update feature
            const feature = await prisma.feature.update({
                where: { id },
                data: {
                    ...(name !== undefined && { name }),
                    ...(img !== undefined && { img }),
                    ...(isActive !== undefined && { isActive }),
                    ...(preview !== undefined && { preview }),
                },
            });

            // Handle translations if provided
            if (translations && Array.isArray(translations)) {
                // Delete existing translations and create new ones
                await prisma.featureTranslation.deleteMany({
                    where: { featureId: id },
                });

                await prisma.featureTranslation.createMany({
                    data: translations.map((t: any) => ({
                        featureId: id,
                        locale: t.locale,
                        name: t.name,
                        desc: t.desc || null,
                        isActive: t.isActive !== undefined ? t.isActive : true,
                    })),
                });
            }

            // Fetch updated feature with translations
            const updatedFeature = await prisma.feature.findUnique({
                where: { id },
                include: {
                    featureDetails: true,
                },
            });

            return NextResponse.json(updatedFeature);
        } catch (error) {
            console.error("Error updating feature:", error);
            return NextResponse.json(
                { error: "Failed to update feature" },
                { status: 500 }
            );
        }
    });
};

// DELETE feature (Admin only)
export const DELETE = async (
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
        return NextResponse.json(
            { error: "Forbidden - Admin only" },
            { status: 403 }
        );
    }

    return withPrisma(async () => {
        try {
            const { id } = await params;

            const feature = await prisma.feature.findUnique({
                where: { id },
                include: {
                    _count: {
                        select: { products: true },
                    },
                },
            });

            if (!feature) {
                return NextResponse.json(
                    { error: "Feature not found" },
                    { status: 404 }
                );
            }

            // Check if feature has products
            if (feature._count.products > 0) {
                return NextResponse.json(
                    {
                        error: "Cannot delete feature with associated products. Remove feature from products first or deactivate it.",
                    },
                    { status: 409 }
                );
            }

            await prisma.feature.delete({
                where: { id },
            });

            return NextResponse.json({
                message: "Feature deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting feature:", error);
            return NextResponse.json(
                { error: "Failed to delete feature" },
                { status: 500 }
            );
        }
    });
};
