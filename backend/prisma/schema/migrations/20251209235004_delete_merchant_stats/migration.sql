/*
  Warnings:

  - You are about to drop the `merchant_stats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "merchant_stats" DROP CONSTRAINT "merchant_stats_merchantId_fkey";

-- DropTable
DROP TABLE "merchant_stats";
