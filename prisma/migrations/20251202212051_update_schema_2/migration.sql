/*
  Warnings:

  - You are about to drop the column `categoryId` on the `category_translation` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `order_product` table. All the data in the column will be lost.
  - You are about to drop the column `productDescription` on the `order_product` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `order_product` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `product_images` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `product_items` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `product_specs` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `product_translation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[categorySlug,locale]` on the table `category_translation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productSlug,slug]` on the table `product_items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productSlug,locale]` on the table `product_translation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categorySlug` to the `category_translation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productSlug` to the `order_product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productSlug` to the `product_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productSlug` to the `product_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productSlug` to the `product_specs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productSlug` to the `product_translation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "category_translation" DROP CONSTRAINT "category_translation_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "order_product" DROP CONSTRAINT "order_product_productId_fkey";

-- DropForeignKey
ALTER TABLE "product_images" DROP CONSTRAINT "product_images_productId_fkey";

-- DropForeignKey
ALTER TABLE "product_items" DROP CONSTRAINT "product_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "product_specs" DROP CONSTRAINT "product_specs_productId_fkey";

-- DropForeignKey
ALTER TABLE "product_translation" DROP CONSTRAINT "product_translation_productId_fkey";

-- DropIndex
DROP INDEX "category_translation_categoryId_locale_key";

-- DropIndex
DROP INDEX "product_items_slug_key";

-- DropIndex
DROP INDEX "product_translation_productId_locale_key";

-- AlterTable
ALTER TABLE "category_translation" DROP COLUMN "categoryId",
ADD COLUMN     "categorySlug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "order_product" DROP COLUMN "price",
DROP COLUMN "productDescription",
DROP COLUMN "productId",
ADD COLUMN     "productSlug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "product_images" DROP COLUMN "productId",
ADD COLUMN     "productSlug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "product_items" DROP COLUMN "productId",
ADD COLUMN     "lookupItemId" TEXT,
ADD COLUMN     "productSlug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "product_specs" DROP COLUMN "productId",
ADD COLUMN     "productSlug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "product_translation" DROP COLUMN "productId",
ADD COLUMN     "productSlug" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "product_items_lookup" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "img" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_items_lookup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_items_lookup_translation" (
    "id" TEXT NOT NULL,
    "lookupItemId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "product_items_lookup_translation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_items_lookup_slug_key" ON "product_items_lookup"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "product_items_lookup_translation_lookupItemId_locale_key" ON "product_items_lookup_translation"("lookupItemId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "category_translation_categorySlug_locale_key" ON "category_translation"("categorySlug", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "product_items_productSlug_slug_key" ON "product_items"("productSlug", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "product_translation_productSlug_locale_key" ON "product_translation"("productSlug", "locale");

-- AddForeignKey
ALTER TABLE "order_product" ADD CONSTRAINT "order_product_productSlug_fkey" FOREIGN KEY ("productSlug") REFERENCES "product"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_translation" ADD CONSTRAINT "category_translation_categorySlug_fkey" FOREIGN KEY ("categorySlug") REFERENCES "category"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_specs" ADD CONSTRAINT "product_specs_productSlug_fkey" FOREIGN KEY ("productSlug") REFERENCES "product"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_productSlug_fkey" FOREIGN KEY ("productSlug") REFERENCES "product"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_translation" ADD CONSTRAINT "product_translation_productSlug_fkey" FOREIGN KEY ("productSlug") REFERENCES "product"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_items" ADD CONSTRAINT "product_items_productSlug_fkey" FOREIGN KEY ("productSlug") REFERENCES "product"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_items" ADD CONSTRAINT "product_items_lookupItemId_fkey" FOREIGN KEY ("lookupItemId") REFERENCES "product_items_lookup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_items_lookup_translation" ADD CONSTRAINT "product_items_lookup_translation_lookupItemId_fkey" FOREIGN KEY ("lookupItemId") REFERENCES "product_items_lookup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
