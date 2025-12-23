/*
  Warnings:

  - You are about to drop the column `logoUrl` on the `merchants` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."merchants" DROP COLUMN "logoUrl",
ADD COLUMN     "logoKey" TEXT;
