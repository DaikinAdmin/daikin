/*
  Warnings:

  - You are about to drop the column `previewUrl` on the `products_carousel` table. All the data in the column will be lost.
  - Added the required column `iconUrl` to the `products_carousel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `products_carousel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleShort` to the `products_carousel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products_carousel" DROP COLUMN "previewUrl",
ADD COLUMN     "iconUrl" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "titleShort" TEXT NOT NULL;
