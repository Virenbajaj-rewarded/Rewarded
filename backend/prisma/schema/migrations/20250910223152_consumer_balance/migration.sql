-- CreateTable
CREATE TABLE "public"."consumer_balances" (
    "merchantId" UUID NOT NULL,
    "consumerId" UUID NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consumer_balances_pkey" PRIMARY KEY ("merchantId","consumerId")
);

-- CreateIndex
CREATE INDEX "consumer_balances_consumerId_idx" ON "public"."consumer_balances"("consumerId");

-- AddForeignKey
ALTER TABLE "public"."consumer_balances" ADD CONSTRAINT "consumer_balances_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "public"."merchants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."consumer_balances" ADD CONSTRAINT "consumer_balances_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
