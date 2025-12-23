-- AlterTable
ALTER TABLE "merchants" ADD COLUMN     "description" TEXT,
ALTER COLUMN "businessEmail" DROP NOT NULL,
ALTER COLUMN "businessPhoneNumber" DROP NOT NULL;
