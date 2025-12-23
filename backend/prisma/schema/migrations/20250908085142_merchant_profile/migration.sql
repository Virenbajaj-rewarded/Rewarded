/*
  Warnings:

  - You are about to drop the column `address` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `businessName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `tgUsername` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `whatsppUsername` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."MerchantStatus" AS ENUM ('PENDING', 'APPROVED', 'SUSPENDED');

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "address",
DROP COLUMN "businessName",
DROP COLUMN "tgUsername",
DROP COLUMN "whatsppUsername";

-- CreateTable
CREATE TABLE "public"."merchants" (
    "id" UUID NOT NULL,
    "businessName" VARCHAR(255) NOT NULL,
    "businessEmail" VARCHAR(255) NOT NULL,
    "businessPhoneNumber" VARCHAR(20),
    "businessAddress" TEXT,
    "tgUsername" VARCHAR(50),
    "whatsppUsername" VARCHAR(50),
    "logoUrl" TEXT,
    "status" "public"."MerchantStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "merchants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "merchants_userId_key" ON "public"."merchants"("userId");

-- CreateIndex
CREATE INDEX "merchants_status_idx" ON "public"."merchants"("status");

-- AddForeignKey
ALTER TABLE "public"."merchants" ADD CONSTRAINT "merchants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
