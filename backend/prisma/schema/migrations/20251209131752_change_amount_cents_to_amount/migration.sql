/*
  Warnings:

  - You are about to drop the column `accumulatedCents` on the `customer-progresses` table. All the data in the column will be lost.
  - You are about to drop the column `amountCents` on the `ledger_events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "customer-progresses" DROP COLUMN "accumulatedCents",
ADD COLUMN     "accumulatedAmount" DECIMAL(14,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ledger_events" DROP COLUMN "amountCents",
ADD COLUMN     "amount" DECIMAL(14,2);
