import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/db";
import { Role } from "@prisma/client";

// GET all redeemed benefits (Admin only)
export const GET = async (req: Request) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== Role.ADMIN) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search") || "";

        const redeemedBenefits = await prisma.benefits.findMany({
            include: {
                benefitDescription: true,
            },
            orderBy: {
                redeemedAt: 'desc',
            },
        });

        // Filter on the client side if search is provided
        let filteredBenefits = redeemedBenefits;
        if (search) {
            filteredBenefits = redeemedBenefits.filter(benefit => 
                benefit.benefitDescription.title.toLowerCase().includes(search.toLowerCase())
            );
        }

        return NextResponse.json(filteredBenefits);
    } catch (error) {
        console.error("Error fetching redeemed benefits:", error);
        return NextResponse.json({ error: "Failed to fetch redeemed benefits" }, { status: 500 });
    }
};
