import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/db";
import { withPrisma } from "@/db/utils";

// GET all benefits (Admin only)
export const GET = async (req: Request) => {
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
            const { searchParams } = new URL(req.url);
            const search = searchParams.get("search") || "";

            const benefits = await prisma.benefitDescription.findMany({
                where: search ? {
                    OR: [
                        { title: { contains: search, mode: "insensitive" } },
                        { description: { contains: search, mode: "insensitive" } },
                    ],
                } : {},
                orderBy: {
                    createdAt: 'desc',
                },
            });

            return NextResponse.json(benefits);
        } catch (error) {
            console.error("Error fetching benefits:", error);
            return NextResponse.json({ error: "Failed to fetch benefits" }, { status: 500 });
        }
    });
};

// POST create new benefit (Admin only)
export const POST = async (req: Request) => {
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
            const { title, description, daikinCoins, isActive } = await req.json();

            if (!title || !description || daikinCoins === undefined) {
                return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
            }

            const benefit = await prisma.benefitDescription.create({
                data: {
                    title,
                    description,
                    daikinCoins: parseInt(daikinCoins),
                    isActive: isActive !== undefined ? isActive : true,
                },
            });

            return NextResponse.json(benefit, { status: 201 });
        } catch (error) {
            console.error("Error creating benefit:", error);
            return NextResponse.json({ error: "Failed to create benefit" }, { status: 500 });
        }
    });
};
