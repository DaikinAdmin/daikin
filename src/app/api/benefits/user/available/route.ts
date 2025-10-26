import { auth } from "@/lib/auth";
import prisma from "@/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || session.user.role !== "USER") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Get only active benefits
        const benefits = await prisma.benefitDescription.findMany({
            where: {
                isActive: true,
            },
            select: {
                id: true,
                title: true,
                description: true,
                daikinCoins: true,
            },
            orderBy: {
                daikinCoins: 'asc',
            },
        });

        return NextResponse.json(benefits);
    } catch (error) {
        console.error("Error fetching available benefits:", error);
        return NextResponse.json(
            { error: "Failed to fetch benefits" },
            { status: 500 }
        );
    }
}
