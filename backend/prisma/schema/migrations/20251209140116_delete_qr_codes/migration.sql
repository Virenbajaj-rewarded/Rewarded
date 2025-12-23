/*
  Warnings:

  - You are about to drop the `merchant_qr_codes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "merchant_qr_codes" DROP CONSTRAINT "merchant_qr_codes_merchantId_fkey";

-- DropTable
DROP TABLE "merchant_qr_codes";

-- DropEnum
DROP TYPE "QrCodeStatus";

-- DropEnum
DROP TYPE "QrCodeType";
