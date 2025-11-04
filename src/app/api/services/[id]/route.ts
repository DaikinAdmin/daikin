import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/db";
import { Role } from "@prisma/client";

// PUT - Update service status (Admin and Employee only)
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

    if (session.user.role !== "admin" && session.user.role !== "employee") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const { id } = await params;
        const { status, dateOfService } = await req.json();

        if (!status || !["APPROVED", "REJECTED", "PENDING"].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        // Get the service request
        const service = await prisma.service.findUnique({
            where: { id },
        });

        if (!service) {
            return NextResponse.json({ error: "Service request not found" }, { status: 404 });
        }

        // Update service status
        const updatedService = await prisma.service.update({
            where: { id },
            data: {
                status,
                dateOfService: status === "APPROVED" && dateOfService ? new Date(dateOfService) : service.dateOfService,
                updatedAt: new Date(),
            },
            include: {
                order: {
                    include: {
                        products: true,
                    },
                },
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return NextResponse.json(updatedService);
    } catch (error) {
        console.error("Error updating service status:", error);
        return NextResponse.json({ error: "Failed to update service status" }, { status: 500 });
    }
};
