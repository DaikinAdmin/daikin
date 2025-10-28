import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/db";
import { Role } from "@prisma/client";

// GET search users by email (Admin and Employee only)
export const GET = async (req: Request) => {
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
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q") || "";

        if (query.length < 2) {
            return NextResponse.json([]);
        }

        // Search for users with USER role whose email contains the query
        const users = await prisma.user.findMany({
            where: {
                role: Role.USER,
                email: {
                    contains: query,
                    mode: "insensitive",
                },
            },
            select: {
                email: true,
                name: true,
            },
            take: 10,
            orderBy: {
                email: "asc",
            },
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error("Error searching users:", error);
        return NextResponse.json({ error: "Failed to search users" }, { status: 500 });
    }
};
