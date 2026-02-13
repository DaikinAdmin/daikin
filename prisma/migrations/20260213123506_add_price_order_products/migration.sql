/*
  Warnings:

  - Added the required column `price` to the `order_product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order_product" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

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
    "isMobile" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);
