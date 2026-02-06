-- CreateTable
CREATE TABLE "products_carousel" (
    "id" TEXT NOT NULL,
    "productSlug" TEXT NOT NULL,
    "previewUrl" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_carousel_pkey" PRIMARY KEY ("id")
);
