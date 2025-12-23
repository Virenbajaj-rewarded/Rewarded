/*
  Warnings:

  - You are about to drop the column `capPerTransaction` on the `reward_programs` table. All the data in the column will be lost.
  - Added the required column `maxDailyBudget` to the `reward_programs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reward_programs" DROP COLUMN "capPerTransaction",
ADD COLUMN     "maxDailyBudget" DECIMAL(12,2) NOT NULL;
