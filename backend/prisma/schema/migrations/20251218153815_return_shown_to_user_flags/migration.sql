-- AlterTable
ALTER TABLE "payment_requests" ADD COLUMN     "shownToMerchant" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shownToUser" BOOLEAN NOT NULL DEFAULT false;
