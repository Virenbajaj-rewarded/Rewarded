/*
  Warnings:

  - A unique constraint covering the columns `[businessCode]` on the table `merchants` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "merchants" ADD COLUMN     "businessCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "merchants_businessCode_key" ON "merchants"("businessCode");
