/*
  Warnings:

  - You are about to drop the column `audienceType` on the `reward_programs` table. All the data in the column will be lost.
  - You are about to drop the column `customerSegmentId` on the `reward_programs` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."reward_programs" DROP CONSTRAINT "reward_programs_customerSegmentId_fkey";

-- AlterTable
ALTER TABLE "reward_programs" DROP COLUMN "audienceType",
DROP COLUMN "customerSegmentId";
