import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/db";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

// GET all users (Admin only)
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
        const users = await prisma.user.findMany({
            include: {
                userDetails: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
};

// POST create new user (Admin only)
export const POST = async (req: Request) => {
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
        const { name, email, role } = await req.json();

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
        }

        // Hash default password
        const hashedPassword = await bcrypt.hash("P@ssw0rd", 10);

        // Create user with account
        const user = await prisma.user.create({
            data: {
                name,
                email,
                role: role || Role.USER,
                Account: {
                    create: {
                        accountId: email,
                        providerId: "credential",
                        password: hashedPassword,
                    },
                },
                userDetails: {
                    create: {
                        daikinCoins: 0,
                    },
                },
            },
            include: {
                userDetails: true,
            },
        });

        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
};
