import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/db";
import { withPrisma } from "@/db/utils";

// PUT update a spec (Admin only)
export const PUT = async (
    req: Request,
    { params }: { params: Promise<{ id: string; specId: string }> }
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
            const { specId } = await params;
            const { title, subtitle } = await req.json();

            if (!title) {
                return NextResponse.json(
                    { error: "Title is required" },
                    { status: 400 }
                );
            }

            const spec = await prisma.productSpecs.update({
                where: { id: specId },
                data: {
                    title,
                    subtitle: subtitle || null,
                },
            });

            return NextResponse.json(spec);
        } catch (error) {
            console.error("Error updating product spec:", error);
            return NextResponse.json(
                { error: "Failed to update product spec" },
                { status: 500 }
            );
        }
    });
};

// DELETE a spec (Admin only)
export const DELETE = async (
    req: Request,
    { params }: { params: Promise<{ id: string; specId: string }> }
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
            const { specId } = await params;

            await prisma.productSpecs.delete({
                where: { id: specId },
            });

            return NextResponse.json({ success: true });
        } catch (error) {
            console.error("Error deleting product spec:", error);
            return NextResponse.json(
                { error: "Failed to delete product spec" },
                { status: 500 }
            );
        }
    });
};
