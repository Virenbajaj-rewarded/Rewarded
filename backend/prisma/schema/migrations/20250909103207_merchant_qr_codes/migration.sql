-- CreateEnum
CREATE TYPE "public"."QrCodeType" AS ENUM ('EARN', 'REDEEM');

-- CreateEnum
CREATE TYPE "public"."QrCodeStatus" AS ENUM ('ACTIVE', 'REVOKED');

-- CreateTable
CREATE TABLE "public"."merchant_qr_codes" (
    "id" UUID NOT NULL,
    "merchantId" UUID NOT NULL,
    "type" "public"."QrCodeType" NOT NULL,
    "status" "public"."QrCodeStatus" NOT NULL DEFAULT 'ACTIVE',
    "code" VARCHAR(64) NOT NULL,
    "payload" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "signature" VARCHAR(128) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "merchant_qr_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "merchant_qr_codes_code_key" ON "public"."merchant_qr_codes"("code");

-- CreateIndex
CREATE INDEX "merchant_qr_codes_merchantId_type_status_idx" ON "public"."merchant_qr_codes"("merchantId", "type", "status");

-- AddForeignKey
ALTER TABLE "public"."merchant_qr_codes" ADD CONSTRAINT "merchant_qr_codes_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "public"."merchants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
