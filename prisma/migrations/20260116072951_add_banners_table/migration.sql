-- CreateTable
CREATE TABLE "banners" (
    "id" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "link" TEXT,
    "location" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);
