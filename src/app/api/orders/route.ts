import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/db";
import { withPrisma } from "@/db/utils";

// GET all orders (Admin and Employee see all, Users see their own)
export const GET = async (req: Request) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return withPrisma(async () => {
        try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search") || "";

        // Build where clause based on user role
        let whereClause: any = {};

        if (session.user.role === "user") {
            // Users can only see their own orders
            whereClause.customerEmail = session.user.email;
            
            // If there's a search query, apply it to orderId only for users
            if (search) {
                whereClause.orderId = { contains: search, mode: "insensitive" };
            }
        } else if (session.user.role === "admin" || session.user.role === "employee") {
            // Admin and Employee can see all orders and search by orderId or email
            if (search) {
                whereClause.OR = [
                    { orderId: { contains: search, mode: "insensitive" } },
                    { customerEmail: { contains: search, mode: "insensitive" } },
                ];
            }
        } else {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const orders = await prisma.order.findMany({
            where: whereClause,
            include: {
                products: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(orders);
        } catch (error) {
            console.error("Error fetching orders:", error);
            return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
        }
    });
};

// POST create new order (Admin and Employee only)
export const POST = async (req: Request) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin" && session.user.role !== "employee") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return withPrisma(async () => {
        try {
        const { orderId, customerEmail, dateOfPurchase, nextDateOfService, daikinCoins, products } = await req.json();

        if (!orderId || !customerEmail || !products || products.length === 0) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if orderId already exists
        const existingOrder = await prisma.order.findUnique({
            where: { orderId },
        });

        if (existingOrder) {
            return NextResponse.json({ error: "Order ID already exists" }, { status: 400 });
        }

        // Calculate total price from products
        const totalPrice = products.reduce((sum: number, product: any) => {
            return sum + (product.totalPrice || 0);
        }, 0);

        // Use the daikinCoins value from the order level (default to 0 if not provided)
        const orderDaikinCoins = daikinCoins || 0;

        // Create order with products
        const order = await prisma.order.create({
            data: {
                orderId,
                customerEmail,
                dateOfPurchase: dateOfPurchase ? new Date(dateOfPurchase) : new Date(),
                nextDateOfService: nextDateOfService ? new Date(nextDateOfService) : null,
                totalPrice,
                daikinCoins: orderDaikinCoins,
                products: {
                    create: products.map((product: any) => ({
                        productSlug: product.productSlug,
                        warranty: product.warranty || null,
                        quantity: product.quantity || 1,
                        totalPrice: product.totalPrice,
                    })),
                },
            },
            include: {
                products: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        // Update user's daikinCoins if the customer exists in the system and is a user
        if (orderDaikinCoins > 0) {
            const user = await prisma.user.findUnique({
                where: { email: customerEmail },
                include: { userDetails: true },
            });

            // Only award coins to users with user role
            if (user && user.role === "user") {
                if (user.userDetails) {
                    // Update existing userDetails
                    await prisma.userDetails.update({
                        where: { userId: user.id },
                        data: {
                            daikinCoins: {
                                increment: orderDaikinCoins,
                            },
                        },
                    });
                } else {
                    // Create userDetails if it doesn't exist
                    await prisma.userDetails.create({
                        data: {
                            userId: user.id,
                            daikinCoins: orderDaikinCoins,
                        },
                    });
                }
            }
        }

        return NextResponse.json(order, { status: 201 });
        } catch (error) {
            console.error("Error creating order:", error);
            return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
        }
    });
};
