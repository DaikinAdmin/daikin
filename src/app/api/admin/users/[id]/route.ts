import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/db";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

// GET single user (Admin only)
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

    if (session.user.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const { id } = await params;
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                userDetails: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
};

// PUT update user (Admin only)
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

    if (session.user.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const { id } = await params;
        const body = await req.json();
        const { role, email, emailVerified, twoFactorEnabled, userDetails, resetPassword } = body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id },
            include: { userDetails: true },
        });

        if (!existingUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // If email is being changed, check if new email is already taken
        if (email && email !== existingUser.email) {
            const emailTaken = await prisma.user.findUnique({
                where: { email },
            });

            if (emailTaken) {
                return NextResponse.json({ error: "Email already in use" }, { status: 400 });
            }
        }

        // Prepare user update data
        const updateData: any = {};
        if (role !== undefined) updateData.role = role;
        if (email !== undefined) updateData.email = email;
        if (emailVerified !== undefined) updateData.emailVerified = emailVerified;
        if (twoFactorEnabled !== undefined) updateData.twoFactorEnabled = twoFactorEnabled;

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
            include: { userDetails: true },
        });

        // Update user details if provided
        if (userDetails) {
            await prisma.userDetails.upsert({
                where: { userId: id },
                update: {
                    dateOfBirth: userDetails.dateOfBirth ? new Date(userDetails.dateOfBirth) : undefined,
                    street: userDetails.street,
                    apartmentNumber: userDetails.apartmentNumber,
                    city: userDetails.city,
                    postalCode: userDetails.postalCode,
                    daikinCoins: userDetails.daikinCoins !== undefined ? userDetails.daikinCoins : undefined,
                },
                create: {
                    userId: id,
                    dateOfBirth: userDetails.dateOfBirth ? new Date(userDetails.dateOfBirth) : null,
                    street: userDetails.street,
                    apartmentNumber: userDetails.apartmentNumber,
                    city: userDetails.city,
                    postalCode: userDetails.postalCode,
                    daikinCoins: userDetails.daikinCoins || 0,
                },
            });
        }

        // Reset password if requested
        if (resetPassword) {
            const hashedPassword = await bcrypt.hash("P@ssw0rd", 10);
            await prisma.account.updateMany({
                where: {
                    userId: id,
                    providerId: "credential",
                },
                data: {
                    password: hashedPassword,
                },
            });
        }

        // Fetch updated user with details
        const finalUser = await prisma.user.findUnique({
            where: { id },
            include: { userDetails: true },
        });

        return NextResponse.json(finalUser);
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
};

// DELETE user (Admin only)
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

    if (session.user.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const { id } = await params;

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Prevent deleting yourself
        if (user.id === session.user.id) {
            return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
        }

        // Delete user (cascades to related records)
        await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
};
