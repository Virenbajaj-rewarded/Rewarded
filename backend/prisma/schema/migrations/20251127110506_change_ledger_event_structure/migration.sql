/*
  Warnings:

  - You are about to drop the column `consumerId` on the `ledger_events` table. All the data in the column will be lost.
  - You are about to drop the column `merchantId` on the `ledger_events` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ledger_events" DROP CONSTRAINT "ledger_events_consumerId_fkey";

-- DropForeignKey
ALTER TABLE "ledger_events" DROP CONSTRAINT "ledger_events_merchantId_fkey";

-- DropForeignKey
ALTER TABLE "ledger_events" DROP CONSTRAINT "ledger_events_programId_fkey";

-- DropIndex
DROP INDEX "ledger_events_merchantId_consumerId_createdAt_idx";

-- AlterTable
ALTER TABLE "ledger_events" DROP COLUMN "consumerId",
DROP COLUMN "merchantId",
ADD COLUMN     "fromUserId" UUID,
ADD COLUMN     "toUserId" UUID,
ALTER COLUMN "programId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "ledger_events_fromUserId_toUserId_createdAt_idx" ON "ledger_events"("fromUserId", "toUserId", "createdAt");

-- AddForeignKey
ALTER TABLE "ledger_events" ADD CONSTRAINT "ledger_events_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ledger_events" ADD CONSTRAINT "ledger_events_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ledger_events" ADD CONSTRAINT "ledger_events_programId_fkey" FOREIGN KEY ("programId") REFERENCES "reward_programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
