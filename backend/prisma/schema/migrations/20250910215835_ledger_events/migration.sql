-- CreateEnum
CREATE TYPE "public"."LedgerEventType" AS ENUM ('EARN', 'REDEEM');

-- CreateTable
CREATE TABLE "public"."ledger_events" (
    "id" UUID NOT NULL,
    "merchantId" UUID NOT NULL,
    "consumerId" UUID NOT NULL,
    "type" "public"."LedgerEventType" NOT NULL,
    "points" INTEGER NOT NULL,
    "amountCents" INTEGER,
    "programId" UUID,
    "qrCodeId" UUID,
    "idempotencyKey" TEXT NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ledger_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."merchant_stats" (
    "merchantId" UUID NOT NULL,
    "issued" BIGINT NOT NULL DEFAULT 0,
    "redeemed" BIGINT NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merchant_stats_pkey" PRIMARY KEY ("merchantId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ledger_events_idempotencyKey_key" ON "public"."ledger_events"("idempotencyKey");

-- CreateIndex
CREATE INDEX "ledger_events_merchantId_consumerId_createdAt_idx" ON "public"."ledger_events"("merchantId", "consumerId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."ledger_events" ADD CONSTRAINT "ledger_events_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "public"."merchants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ledger_events" ADD CONSTRAINT "ledger_events_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."merchant_stats" ADD CONSTRAINT "merchant_stats_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "public"."merchants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
