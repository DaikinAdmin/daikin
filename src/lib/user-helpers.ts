import prisma from "@/db";

export async function getUserWithRole(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      emailVerified: true,
      twoFactorEnabled: true,
      userDetails: {
        select: {
          dateOfBirth: true,
          street: true,
          apartmentNumber: true,
          city: true,
          postalCode: true,
        },
      },
    },
  });
}