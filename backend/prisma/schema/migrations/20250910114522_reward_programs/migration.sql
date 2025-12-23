-- CreateEnum
CREATE TYPE "public"."RewardProgramStatus" AS ENUM ('PENDING', 'ACTIVE', 'PAUSED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "public"."RewardStrategy" AS ENUM ('PERCENT_BACK', 'SPEND_TO_EARN');

-- CreateTable
CREATE TABLE "public"."reward_programs" (
    "id" UUID NOT NULL,
    "merchantId" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "strategy" "public"."RewardStrategy" NOT NULL DEFAULT 'PERCENT_BACK',
    "percentBack" DECIMAL(5,2),
    "spendThreshold" DECIMAL(12,2),
    "rewardPercent" DECIMAL(5,2),
    "capPerTransaction" DECIMAL(12,2),
    "maxMonthlyBudget" DECIMAL(14,2),
    "status" "public"."RewardProgramStatus" NOT NULL DEFAULT 'PENDING',
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reward_programs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reward_programs_merchantId_status_idx" ON "public"."reward_programs"("merchantId", "status");

-- AddForeignKey
ALTER TABLE "public"."reward_programs" ADD CONSTRAINT "reward_programs_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "public"."merchants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
