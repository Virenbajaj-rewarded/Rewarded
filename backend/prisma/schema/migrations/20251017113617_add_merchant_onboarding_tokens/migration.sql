-- CreateTable
CREATE TABLE "merchant_onboarding_tokens" (
    "id" UUID NOT NULL,
    "token" VARCHAR(64) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "merchantId" UUID NOT NULL,

    CONSTRAINT "merchant_onboarding_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "merchant_onboarding_tokens_token_key" ON "merchant_onboarding_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "merchant_onboarding_tokens_merchantId_key" ON "merchant_onboarding_tokens"("merchantId");

-- AddForeignKey
ALTER TABLE "merchant_onboarding_tokens" ADD CONSTRAINT "merchant_onboarding_tokens_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
