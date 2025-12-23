/*
  Warnings:

  - The values [FREE,PAID] on the enum `BalanceType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BalanceType_new" AS ENUM ('POINTS', 'USD', 'USDC');
ALTER TABLE "user-balances" ALTER COLUMN "type" TYPE "BalanceType_new" USING ("type"::text::"BalanceType_new");
ALTER TYPE "BalanceType" RENAME TO "BalanceType_old";
ALTER TYPE "BalanceType_new" RENAME TO "BalanceType";
DROP TYPE "public"."BalanceType_old";
COMMIT;
