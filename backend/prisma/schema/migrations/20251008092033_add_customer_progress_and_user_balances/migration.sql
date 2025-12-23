/*
  Warnings:

  - You are about to drop the `consumer_balances` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "BalanceType" AS ENUM ('FREE', 'PAID');

-- DropForeignKey
ALTER TABLE "public"."consumer_balances" DROP CONSTRAINT "consumer_balances_consumerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."consumer_balances" DROP CONSTRAINT "consumer_balances_merchantId_fkey";

-- DropTable
DROP TABLE "public"."consumer_balances";

-- CreateTable
CREATE TABLE "customer-progresses" (
    "merchantId" UUID NOT NULL,
    "consumerId" UUID NOT NULL,
    "programId" UUID NOT NULL,
    "accumulatedCents" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer-progresses_pkey" PRIMARY KEY ("merchantId","consumerId","programId")
);

-- CreateTable
CREATE TABLE "user-balances" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" "BalanceType" NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user-balances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user-balances_userId_idx" ON "user-balances"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user-balances_userId_type_key" ON "user-balances"("userId", "type");

-- AddForeignKey
ALTER TABLE "customer-progresses" ADD CONSTRAINT "customer-progresses_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer-progresses" ADD CONSTRAINT "customer-progresses_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer-progresses" ADD CONSTRAINT "customer-progresses_programId_fkey" FOREIGN KEY ("programId") REFERENCES "reward_programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user-balances" ADD CONSTRAINT "user-balances_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
