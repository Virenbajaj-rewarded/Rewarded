/*
  Warnings:

  - The values [PENDING,APPROVED,REFUNDED] on the enum `RewardProgramStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `approvedByAdminId` on the `reward_programs` table. All the data in the column will be lost.
  - You are about to drop the column `refundedAmount` on the `reward_programs` table. All the data in the column will be lost.
  - You are about to drop the column `rejectedByAdminId` on the `reward_programs` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `user-balances` table. All the data in the column will be lost.
  - You are about to drop the `admin_program_funding_ledger` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `customer_segments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_segments` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `user-balances` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "LedgerEventType" ADD VALUE 'REFUND';
ALTER TYPE "LedgerEventType" ADD VALUE 'PROGRAM_REPLENISHMENT';

-- AlterEnum
BEGIN;
CREATE TYPE "RewardProgramStatus_new" AS ENUM ('ACTIVE', 'DRAFT', 'STOPPED');
ALTER TABLE "public"."reward_programs" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "reward_programs" ALTER COLUMN "status" TYPE "RewardProgramStatus_new" USING ("status"::text::"RewardProgramStatus_new");
ALTER TYPE "RewardProgramStatus" RENAME TO "RewardProgramStatus_old";
ALTER TYPE "RewardProgramStatus_new" RENAME TO "RewardProgramStatus";
DROP TYPE "public"."RewardProgramStatus_old";
ALTER TABLE "reward_programs" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- DropForeignKey
ALTER TABLE "admin_program_funding_ledger" DROP CONSTRAINT "admin_program_funding_ledger_adminId_fkey";

-- DropForeignKey
ALTER TABLE "admin_program_funding_ledger" DROP CONSTRAINT "admin_program_funding_ledger_programId_fkey";

-- DropForeignKey
ALTER TABLE "ledger_events" DROP CONSTRAINT "ledger_events_consumerId_fkey";

-- DropForeignKey
ALTER TABLE "reward_programs" DROP CONSTRAINT "reward_programs_approvedByAdminId_fkey";

-- DropForeignKey
ALTER TABLE "reward_programs" DROP CONSTRAINT "reward_programs_rejectedByAdminId_fkey";

-- DropForeignKey
ALTER TABLE "user_segments" DROP CONSTRAINT "user_segments_segmentId_fkey";

-- DropForeignKey
ALTER TABLE "user_segments" DROP CONSTRAINT "user_segments_userId_fkey";

-- DropIndex
DROP INDEX "user-balances_userId_idx";

-- DropIndex
DROP INDEX "user-balances_userId_type_key";

-- AlterTable
ALTER TABLE "ledger_events" ALTER COLUMN "consumerId" DROP NOT NULL,
ALTER COLUMN "idempotencyKey" DROP NOT NULL;

-- AlterTable
ALTER TABLE "reward_programs" DROP COLUMN "approvedByAdminId",
DROP COLUMN "refundedAmount",
DROP COLUMN "rejectedByAdminId";

-- AlterTable
ALTER TABLE "user-balances" DROP COLUMN "type",
ALTER COLUMN "balance" SET DEFAULT 0,
ALTER COLUMN "balance" SET DATA TYPE DECIMAL(14,2);

-- DropTable
DROP TABLE "admin_program_funding_ledger";

-- DropTable
DROP TABLE "customer_segments";

-- DropTable
DROP TABLE "user_segments";

-- DropEnum
DROP TYPE "BalanceType";

-- DropEnum
DROP TYPE "FundingLedgerType";

-- CreateIndex
CREATE UNIQUE INDEX "user-balances_userId_key" ON "user-balances"("userId");

-- AddForeignKey
ALTER TABLE "ledger_events" ADD CONSTRAINT "ledger_events_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
