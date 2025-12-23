/*
  Warnings:

  - You are about to drop the column `shownToMerchant` on the `payment_requests` table. All the data in the column will be lost.
  - You are about to drop the column `shownToUser` on the `payment_requests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payment_requests" DROP COLUMN "shownToMerchant",
DROP COLUMN "shownToUser";
