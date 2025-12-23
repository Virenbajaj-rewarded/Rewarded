-- CreateEnum
CREATE TYPE "VerificationType" AS ENUM ('EMAIL_VERIFICATION', 'FORGOT_PASSWORD');

-- AlterTable
ALTER TABLE "email-verifications" ADD COLUMN     "type" "VerificationType" NOT NULL DEFAULT 'EMAIL_VERIFICATION';
