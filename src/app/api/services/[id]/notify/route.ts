import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/db";
import { Role } from "@prisma/client";
import { sendEmail } from "@/helpers/email/resend";

// POST send service notification
export const POST = async (
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
        const { notificationType } = await req.json();

        // Get order details
        const order = await prisma.order.findUnique({
            where: { id },
            include: { products: true },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        if (!order.nextDateOfService) {
            return NextResponse.json({ error: "No service date scheduled" }, { status: 400 });
        }

        const now = new Date();
        const serviceDate = new Date(order.nextDateOfService);
        const daysUntil = Math.ceil((serviceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        // Validate notification type
        if (notificationType === "30days" && (daysUntil > 30 || daysUntil < 7)) {
            return NextResponse.json({ error: "Invalid notification timing" }, { status: 400 });
        }

        if (notificationType === "7days" && daysUntil >= 7) {
            return NextResponse.json({ error: "Invalid notification timing" }, { status: 400 });
        }

        // Check if notification already sent
        if (notificationType === "30days" && order.notificationSent30Days) {
            return NextResponse.json({ error: "Notification already sent" }, { status: 400 });
        }

        if (notificationType === "7days" && order.notificationSent7Days) {
            return NextResponse.json({ error: "Notification already sent" }, { status: 400 });
        }

        // Send email notification
        const productsList = order.products
            .map((p) => `- ${p.productDescription} (ID: ${p.productId})`)
            .join('\n');

        const emailHtml = `
            <h2>Service Reminder for Order ${order.orderId}</h2>
            <p>Dear Customer,</p>
            <p>This is a reminder that your Daikin products are due for service on <strong>${serviceDate.toLocaleDateString()}</strong> (${Math.abs(daysUntil)} ${daysUntil < 0 ? 'days overdue' : 'days from now'}).</p>
            
            <h3>Products requiring service:</h3>
            <pre>${productsList}</pre>
            
            <p>Please contact us to schedule your service appointment.</p>
            <p>Best regards,<br>Daikin Service Team</p>
        `;

        await sendEmail({
            to: order.customerEmail,
            subject: `Service Reminder: Order ${order.orderId}`,
            html: emailHtml,
        });

        // Update notification status
        const updateData = notificationType === "30days"
            ? { notificationSent30Days: true }
            : { notificationSent7Days: true };

        await prisma.order.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({ message: "Notification sent successfully" });
    } catch (error) {
        console.error("Error sending notification:", error);
        return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
    }
};
