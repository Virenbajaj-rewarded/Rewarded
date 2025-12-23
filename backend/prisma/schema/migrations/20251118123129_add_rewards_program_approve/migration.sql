-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "RewardProgramStatus" ADD VALUE 'PENDING';
ALTER TYPE "RewardProgramStatus" ADD VALUE 'APPROVED';
ALTER TYPE "RewardProgramStatus" ADD VALUE 'REFUNDED';

-- AlterTable
ALTER TABLE "reward_programs" ADD COLUMN     "approvedByAdminId" UUID,
ADD COLUMN     "refundedAmount" DECIMAL(14,2),
ADD COLUMN     "rejectedByAdminId" UUID;

-- DropEnum
DROP TYPE "AudienceType";

-- AddForeignKey
ALTER TABLE "reward_programs" ADD CONSTRAINT "reward_programs_approvedByAdminId_fkey" FOREIGN KEY ("approvedByAdminId") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reward_programs" ADD CONSTRAINT "reward_programs_rejectedByAdminId_fkey" FOREIGN KEY ("rejectedByAdminId") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
