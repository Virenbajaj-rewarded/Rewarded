/*
  Warnings:

  - You are about to drop the column `qrCodeId` on the `ledger_events` table. All the data in the column will be lost.
  - Made the column `programId` on table `ledger_events` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."ledger_events" DROP CONSTRAINT "ledger_events_consumerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ledger_events" DROP CONSTRAINT "ledger_events_merchantId_fkey";

-- AlterTable
ALTER TABLE "ledger_events" DROP COLUMN "qrCodeId",
ADD COLUMN     "comment" TEXT,
ALTER COLUMN "programId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ledger_events" ADD CONSTRAINT "ledger_events_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ledger_events" ADD CONSTRAINT "ledger_events_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ledger_events" ADD CONSTRAINT "ledger_events_programId_fkey" FOREIGN KEY ("programId") REFERENCES "reward_programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
