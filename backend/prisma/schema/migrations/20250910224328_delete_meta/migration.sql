/*
  Warnings:

  - You are about to drop the column `meta` on the `ledger_events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ledger_events" DROP COLUMN "meta";
