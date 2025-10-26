import { auth } from "@/lib/auth";
import prisma from "@/db";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        twoFactorEnabled: true,
        userDetails: {
          select: {
            dateOfBirth: true,
            street: true,
            apartmentNumber: true,
            city: true,
            postalCode: true,
            phoneNumber: true,
            daikinCoins: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, dateOfBirth, street, apartmentNumber, city, postalCode, phoneNumber } = body;
    console.log("Received profile update data:", body);
    
    // Validate postal code format if provided
    if (postalCode && !/^\d{2}-\d{3}$/.test(postalCode)) {
      return NextResponse.json(
        { error: "Invalid postal code format. Use XX-XXX" },
        { status: 400 }
      );
    }

    // Validate phone number format if provided
    if (phoneNumber && !/^[1-9]\d{8}$/.test(phoneNumber)) {
      return NextResponse.json(
        { error: "Invalid phone number. Must be 9 digits and cannot start with 0" },
        { status: 400 }
      );
    }

    const updatedDetails = await prisma.userDetails.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        street: street ? street : null,
        apartmentNumber: apartmentNumber ? apartmentNumber : null,
        city: city ? city : null,
        postalCode: postalCode ? postalCode : null,
        phoneNumber: phoneNumber ? phoneNumber : null,
      },
      update: {
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        street: street ? street : null,
        apartmentNumber: apartmentNumber ? apartmentNumber : null,
        city: city ? city : null,
        postalCode: postalCode ? postalCode : null,
        phoneNumber: phoneNumber ? phoneNumber : null,
      },
      select: {
          userId: true,
          dateOfBirth: true,
          street: true,
          apartmentNumber: true,
          city: true,
          postalCode: true,
          phoneNumber: true,
          daikinCoins: true,
      }
    });
    const updatedName = await prisma.user.update({
      where: { id: session.user.id },
      data: { name: name ? name : null },
      select: { name: true },
    });

    return NextResponse.json({user_details: updatedDetails, user_name: updatedName });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
