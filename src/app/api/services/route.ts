import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/db";
import { Role } from "@prisma/client";

// GET all services (Admin, Employee, and USER roles)
export const GET = async (req: Request) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search") || "";

        // Build where clause based on role
        let whereClause: any = {
            nextDateOfService: {
                not: null,
            },
        };

        // USER role: only see their own orders
        if (session.user.role === Role.USER) {
            whereClause.customerEmail = session.user.email;
        }

        // Add search filter for all roles
        if (search) {
            whereClause.AND = [
                whereClause,
                {
                    OR: [
                        { orderId: { contains: search, mode: "insensitive" } },
                        { customerEmail: { contains: search, mode: "insensitive" } },
                    ],
                },
            ];
            // Remove the top level nextDateOfService as it's now in AND
            delete whereClause.nextDateOfService;
            whereClause.AND.unshift({
                nextDateOfService: {
                    not: null,
                },
            });
        }

        const orders = await prisma.order.findMany({
            where: whereClause,
            include: {
                products: true,
                services: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 1, // Get the latest service request
                },
            },
            orderBy: {
                nextDateOfService: 'asc',
            },
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Error fetching services:", error);
        return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
    }
};

// POST create service request (USER role only)
export const POST = async (req: Request) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== Role.USER) {
        return NextResponse.json({ error: "Only users can request services" }, { status: 403 });
    }

    try {
        const { orderId, dateOfProposedService, serviceDetails } = await req.json();

        if (!orderId || !dateOfProposedService) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Verify the order belongs to the user
        const order = await prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        if (order.customerEmail !== session.user.email) {
            return NextResponse.json({ error: "Unauthorized to request service for this order" }, { status: 403 });
        }

        // Create service request
        const service = await prisma.service.create({
            data: {
                orderId,
                userId: session.user.id,
                dateOfProposedService: new Date(dateOfProposedService),
                serviceDetails: serviceDetails || "",
            },
        });

        return NextResponse.json(service, { status: 201 });
    } catch (error) {
        console.error("Error creating service request:", error);
        return NextResponse.json({ error: "Failed to create service request" }, { status: 500 });
    }
};
