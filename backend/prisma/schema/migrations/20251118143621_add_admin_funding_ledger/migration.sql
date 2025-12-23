-- CreateEnum
CREATE TYPE "FundingLedgerType" AS ENUM ('FUND', 'REFUND');

-- CreateTable
CREATE TABLE "admin_program_funding_ledger" (
    "id" UUID NOT NULL,
    "programId" UUID NOT NULL,
    "adminId" UUID,
    "type" "FundingLedgerType" NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_program_funding_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "admin_program_funding_ledger_programId_idx" ON "admin_program_funding_ledger"("programId");

-- CreateIndex
CREATE INDEX "admin_program_funding_ledger_adminId_idx" ON "admin_program_funding_ledger"("adminId");

-- AddForeignKey
ALTER TABLE "admin_program_funding_ledger" ADD CONSTRAINT "admin_program_funding_ledger_programId_fkey" FOREIGN KEY ("programId") REFERENCES "reward_programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_program_funding_ledger" ADD CONSTRAINT "admin_program_funding_ledger_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
