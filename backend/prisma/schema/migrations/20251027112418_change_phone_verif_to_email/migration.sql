/*
  Warnings:

  - You are about to drop the column `isPhoneConfirmed` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `phone-verifications` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."phone-verifications" DROP CONSTRAINT "phone-verifications_userId_fkey";

-- DropIndex
DROP INDEX "public"."users_phone_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "isPhoneConfirmed",
ADD COLUMN     "isEmailConfirmed" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "public"."phone-verifications";

-- CreateTable
CREATE TABLE "email-verifications" (
    "id" UUID NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "userId" UUID NOT NULL,

    CONSTRAINT "email-verifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "email-verifications_userId_expiresAt_idx" ON "email-verifications"("userId", "expiresAt");

-- CreateIndex
CREATE INDEX "email-verifications_userId_consumedAt_idx" ON "email-verifications"("userId", "consumedAt");

-- CreateIndex
CREATE UNIQUE INDEX "email-verifications_userId_code_key" ON "email-verifications"("userId", "code");

-- AddForeignKey
ALTER TABLE "email-verifications" ADD CONSTRAINT "email-verifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
