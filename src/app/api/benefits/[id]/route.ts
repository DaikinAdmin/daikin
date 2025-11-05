import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/db";

// GET single benefit (Admin only)
export const GET = async (
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

    try {
        const { id } = await params;
        const benefit = await prisma.benefitDescription.findUnique({
            where: { id },
        });

        if (!benefit) {
            return NextResponse.json({ error: "Benefit not found" }, { status: 404 });
        }

        return NextResponse.json(benefit);
    } catch (error) {
        console.error("Error fetching benefit:", error);
        return NextResponse.json({ error: "Failed to fetch benefit" }, { status: 500 });
    }
};

// PUT update benefit (Admin only)
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

    try {
        const { id } = await params;
        const { title, description, daikinCoins, isActive } = await req.json();

        const benefit = await prisma.benefitDescription.update({
            where: { id },
            data: {
                title,
                description,
                daikinCoins: parseInt(daikinCoins),
                isActive,
            },
        });

        return NextResponse.json(benefit);
    } catch (error) {
        console.error("Error updating benefit:", error);
        return NextResponse.json({ error: "Failed to update benefit" }, { status: 500 });
    }
};

// DELETE benefit (Admin only)
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
        return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 });
    }

    try {
        const { id } = await params;

        const benefit = await prisma.benefitDescription.findUnique({
            where: { id },
        });

        if (!benefit) {
            return NextResponse.json({ error: "Benefit not found" }, { status: 404 });
        }

        await prisma.benefitDescription.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Benefit deleted successfully" });
    } catch (error) {
        console.error("Error deleting benefit:", error);
        return NextResponse.json({ error: "Failed to delete benefit" }, { status: 500 });
    }
};
