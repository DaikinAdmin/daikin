import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/db";
import { withPrisma } from "@/db/utils";

// GET all specs for a product
export const GET = async (
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    return withPrisma(async () => {
        try {
            const { id } = await params;

            const specs = await prisma.productSpecs.findMany({
                where: { productId: id },
                orderBy: { title: "asc" },
            });

            return NextResponse.json(specs);
        } catch (error) {
            console.error("Error fetching product specs:", error);
            return NextResponse.json(
                { error: "Failed to fetch product specs" },
                { status: 500 }
            );
        }
    });
};

// POST create new spec for a product (Admin only)
export const POST = async (
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
            const { title, subtitle } = await req.json();

            if (!title) {
                return NextResponse.json(
                    { error: "Title is required" },
                    { status: 400 }
                );
            }

            // Verify product exists
            const product = await prisma.product.findUnique({
                where: { id },
            });

            if (!product) {
                return NextResponse.json(
                    { error: "Product not found" },
                    { status: 404 }
                );
            }

            const spec = await prisma.productSpecs.create({
                data: {
                    productId: id,
                    title,
                    subtitle: subtitle || null,
                },
            });

            return NextResponse.json(spec, { status: 201 });
        } catch (error) {
            console.error("Error creating product spec:", error);
            return NextResponse.json(
                { error: "Failed to create product spec" },
                { status: 500 }
            );
        }
    });
};
