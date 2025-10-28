import { auth } from "@/lib/auth";
import prisma from "@/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || session.user.role !== "USER") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { benefitId } = await request.json();

        if (!benefitId) {
            return NextResponse.json(
                { error: "Benefit ID is required" },
                { status: 400 }
            );
        }

        // Get the benefit details
        const benefit = await prisma.benefitDescription.findUnique({
            where: { id: benefitId },
        });

        if (!benefit) {
            return NextResponse.json(
                { error: "Benefit not found" },
                { status: 404 }
            );
        }

        if (!benefit.isActive) {
            return NextResponse.json(
                { error: "This benefit is no longer active" },
                { status: 400 }
            );
        }

        // Get user details
        const userDetails = await prisma.userDetails.findUnique({
            where: { userId: session.user.id },
        });

        if (!userDetails) {
            return NextResponse.json(
                { error: "User details not found" },
                { status: 404 }
            );
        }

        // Check if user has enough coins
        if (userDetails.daikinCoins < benefit.daikinCoins) {
            return NextResponse.json(
                { error: "Insufficient DaikinCoins" },
                { status: 400 }
            );
        }

        // Use transaction to ensure atomicity
        const result = await prisma.$transaction(async (tx: any) => {
            // Deduct coins from user
            await tx.userDetails.update({
                where: { userId: session.user.id },
                data: {
                    daikinCoins: {
                        decrement: benefit.daikinCoins,
                    },
                },
            });

            // Create redeemed benefit record
            const redeemedBenefit = await tx.benefits.create({
                data: {
                    userId: session.user.id,
                    benefitDescriptionId: benefitId,
                },
            });

            return redeemedBenefit;
        });

        return NextResponse.json({
            success: true,
            message: "Benefit redeemed successfully",
            redeemedBenefit: result,
        });
    } catch (error) {
        console.error("Error redeeming benefit:", error);
        return NextResponse.json(
            { error: "Failed to redeem benefit" },
            { status: 500 }
        );
    }
}
