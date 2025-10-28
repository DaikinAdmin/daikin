import { auth } from "@/lib/auth";
import { prisma } from "@/db";
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

        // Get user's redeemed benefits
        const redeemedBenefits = await prisma.benefits.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                benefitDescription: {
                    select: {
                        title: true,
                        description: true,
                        daikinCoins: true,
                    },
                },
            },
            orderBy: {
                redeemedAt: 'desc',
            },
        });

        // Transform data for frontend
        const formattedBenefits = redeemedBenefits.map((benefit) => ({
            id: benefit.id,
            benefitTitle: benefit.benefitDescription.title,
            benefitDescription: benefit.benefitDescription.description,
            daikinCoins: benefit.benefitDescription.daikinCoins,
            redeemedAt: benefit.redeemedAt.toISOString(),
        }));

        return NextResponse.json(formattedBenefits);
    } catch (error) {
        console.error("Error fetching redeemed benefits:", error);
        return NextResponse.json(
            { error: "Failed to fetch redeemed benefits" },
            { status: 500 }
        );
    }
}
