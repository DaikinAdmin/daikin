import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/db";
import { Role } from "@prisma/client";

// GET single order (Admin and Employee see all, Users see their own)
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

    try {
        const { id } = await params;
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                products: true,
            },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Users can only view their own orders
        if (session.user.role === Role.USER && order.customerEmail !== session.user.email) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // For Admin and Employee, fetch user phone number
        let customerPhoneNumber = null;
        if (session.user.role === Role.ADMIN || session.user.role === Role.EMPLOYEE) {
            const user = await prisma.user.findUnique({
                where: { email: order.customerEmail },
                select: {
                    userDetails: {
                        select: {
                            phoneNumber: true,
                        },
                    },
                },
            });
            customerPhoneNumber = user?.userDetails?.phoneNumber || null;
        }

        return NextResponse.json({
            ...order,
            customerPhoneNumber,
        });
    } catch (error) {
        console.error("Error fetching order:", error);
        return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
    }
};

// PUT update order (Admin and Employee only)
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

    if (session.user.role !== Role.ADMIN && session.user.role !== Role.EMPLOYEE) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const { id } = await params;
        const { customerEmail, dateOfPurchase, nextDateOfService, daikinCoins, products } = await req.json();

        // Check if order exists
        const existingOrder = await prisma.order.findUnique({
            where: { id },
            include: { products: true },
        });

        if (!existingOrder) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Calculate total price from products
        const totalPrice = products ? products.reduce((sum: number, product: any) => {
            return sum + (product.totalPrice || 0);
        }, 0) : existingOrder.totalPrice;

        // Use the daikinCoins value from the order level (default to existing value if not provided)
        const orderDaikinCoins = daikinCoins !== undefined ? daikinCoins : existingOrder.daikinCoins;

        // Calculate the difference in daikinCoins
        const coinsDifference = orderDaikinCoins - existingOrder.daikinCoins;

        // Update user's daikinCoins if the customer exists, there's a difference, and user is USER role
        if (coinsDifference !== 0) {
            const user = await prisma.user.findUnique({
                where: { email: customerEmail || existingOrder.customerEmail },
                include: { userDetails: true },
            });

            // Only award coins to users with USER role
            if (user && user.role === Role.USER) {
                if (user.userDetails) {
                    // Update existing userDetails
                    await prisma.userDetails.update({
                        where: { userId: user.id },
                        data: {
                            daikinCoins: {
                                increment: coinsDifference,
                            },
                        },
                    });
                } else if (coinsDifference > 0) {
                    // Create userDetails if it doesn't exist and coins are positive
                    await prisma.userDetails.create({
                        data: {
                            userId: user.id,
                            daikinCoins: coinsDifference,
                        },
                    });
                }
            }
        }

        // Update order
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                customerEmail: customerEmail || existingOrder.customerEmail,
                dateOfPurchase: dateOfPurchase ? new Date(dateOfPurchase) : existingOrder.dateOfPurchase,
                nextDateOfService: nextDateOfService ? new Date(nextDateOfService) : existingOrder.nextDateOfService,
                totalPrice,
                daikinCoins: orderDaikinCoins,
            },
            include: {
                products: true,
            },
        });

        // Update products if provided
        if (products) {
            // Delete existing products
            await prisma.orderProduct.deleteMany({
                where: { orderId: id },
            });

            // Create new products
            await prisma.orderProduct.createMany({
                data: products.map((product: any) => ({
                    orderId: id,
                    productId: product.productId,
                    productDescription: product.productDescription,
                    warranty: product.warranty || null,
                    price: product.price,
                    quantity: product.quantity || 1,
                    totalPrice: product.totalPrice,
                })),
            });
        }

        // Fetch updated order with products
        const finalOrder = await prisma.order.findUnique({
            where: { id },
            include: { products: true },
        });

        return NextResponse.json(finalOrder);
    } catch (error) {
        console.error("Error updating order:", error);
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
};

// DELETE order (Admin only)
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

    if (session.user.role !== Role.ADMIN) {
        return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 });
    }

    try {
        const { id } = await params;

        // Check if order exists
        const order = await prisma.order.findUnique({
            where: { id },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Delete order (cascades to products)
        await prisma.order.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Order deleted successfully" });
    } catch (error) {
        console.error("Error deleting order:", error);
        return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
    }
};
