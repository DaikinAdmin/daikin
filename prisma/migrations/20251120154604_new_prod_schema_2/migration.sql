/*
  Warnings:

  - Added the required column `locale` to the `product_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_items" ADD COLUMN     "locale" TEXT NOT NULL;
