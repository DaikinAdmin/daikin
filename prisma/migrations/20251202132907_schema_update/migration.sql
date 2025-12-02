/*
  Warnings:

  - You are about to drop the column `url` on the `product_images` table. All the data in the column will be lost.
  - You are about to drop the column `locale` on the `product_items` table. All the data in the column will be lost.
  - You are about to drop the column `subtitle` on the `product_items` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `feature` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `product_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `feature` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `product_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "feature" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "product_images" DROP COLUMN "url";

-- AlterTable
ALTER TABLE "product_items" DROP COLUMN "locale",
DROP COLUMN "subtitle",
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "product_items_translation" (
    "id" TEXT NOT NULL,
    "productItemId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "product_items_translation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_items_translation_productItemId_locale_key" ON "product_items_translation"("productItemId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "feature_slug_key" ON "feature"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "product_items_slug_key" ON "product_items"("slug");

-- AddForeignKey
ALTER TABLE "product_items_translation" ADD CONSTRAINT "product_items_translation_productItemId_fkey" FOREIGN KEY ("productItemId") REFERENCES "product_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
