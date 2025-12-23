/*
  Warnings:

  - A unique constraint covering the columns `[businessEmail]` on the table `merchants` will be added. If there are existing duplicate values, this will fail.
  - Made the column `businessPhoneNumber` on table `merchants` required. This step will fail if there are existing NULL values in that column.
  - Made the column `businessAddress` on table `merchants` required. This step will fail if there are existing NULL values in that column.
  - Made the column `storeType` on table `merchants` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "merchants" ADD COLUMN     "location" geometry(Point,4326),
ALTER COLUMN "businessPhoneNumber" SET NOT NULL,
ALTER COLUMN "businessAddress" SET NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "storeType" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "merchants_businessEmail_key" ON "merchants"("businessEmail");
