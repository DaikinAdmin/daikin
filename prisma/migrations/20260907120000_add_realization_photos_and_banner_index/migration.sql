-- CreateTable
CREATE TABLE "realization_photos" (
    "id" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "alt" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "realization_photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "realization_photos_sortOrder_idx" ON "realization_photos"("sortOrder");

-- CreateIndex
CREATE INDEX "banners_location_locale_isMobile_idx" ON "banners"("location", "locale", "isMobile");
