/*
  Warnings:

  - The values [PENDING,PAUSED,INACTIVE] on the enum `RewardProgramStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `endsAt` on the `reward_programs` table. All the data in the column will be lost.
  - You are about to drop the column `maxMonthlyBudget` on the `reward_programs` table. All the data in the column will be lost.
  - You are about to drop the column `startsAt` on the `reward_programs` table. All the data in the column will be lost.
  - Changed the type of `storeType` on the `merchants` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `budget` to the `reward_programs` table without a default value. This is not possible if the table is not empty.
  - Made the column `capPerTransaction` on table `reward_programs` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "StoreType" AS ENUM ('HAIR_SALON_BARBER_SHOP', 'NAIL_SALON_SPA', 'MASSAGE_THERAPY', 'TATTOO_PIERCING_STUDIO', 'PERSONAL_TRAINER_FITNESS_COACH', 'LIFE_COACH_BUSINESS_COACH', 'YOGA_PILATES_STUDIO', 'GYM_FITNESS_CENTER', 'PHOTOGRAPHY_VIDEOGRAPHY', 'EVENT_PLANNING_WEDDING_SERVICES', 'CLEANING_SERVICES', 'PEST_CONTROL', 'TAILORING_ALTERATIONS', 'LAUNDRY_DRY_CLEANING', 'PET_GROOMING_PET_SITTING', 'AUTO_DETAILING_CAR_WASH', 'MECHANICS_AUTO_REPAIR', 'MOVERS_TRANSPORTATION_SERVICES', 'MEDICAL_CLINIC_DOCTOR_OFFICE', 'DENTAL_CLINIC', 'PHYSIOTHERAPY_CHIROPRACTIC', 'OPTOMETRY_EYE_CLINIC', 'NUTRITIONIST_DIETITIAN', 'COUNSELING_MENTAL_HEALTH_SERVICES', 'TUTORING_TEST_PREP', 'LANGUAGE_SCHOOL', 'DRIVING_SCHOOL', 'MUSIC_DANCE_ART_LESSONS', 'VOCATIONAL_TRAINING', 'ONLINE_COURSES_E_LEARNING', 'PLUMBING', 'ELECTRICAL_SERVICES', 'LANDSCAPING_GARDENING', 'CONSTRUCTION_RENOVATION', 'INTERIOR_DESIGN', 'HOME_INSPECTION', 'REAL_ESTATE_AGENCY', 'PROPERTY_MANAGEMENT', 'IT_SUPPORT_COMPUTER_REPAIR', 'WEB_DEVELOPMENT_DESIGN', 'MARKETING_ADVERTISING_AGENCY', 'ACCOUNTING_BOOKKEEPING');

-- CreateEnum
CREATE TYPE "AudienceType" AS ENUM ('ALL', 'GROUP');

-- CreateEnum
CREATE TYPE "OfferType" AS ENUM ('POINTS_CASHBACK', 'FIXED_AMOUNT_POINTS');

-- AlterEnum
BEGIN;
CREATE TYPE "RewardProgramStatus_new" AS ENUM ('ACTIVE', 'DRAFT', 'STOPPED');
ALTER TABLE "public"."reward_programs" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "reward_programs" ALTER COLUMN "status" TYPE "RewardProgramStatus_new" USING ("status"::text::"RewardProgramStatus_new");
ALTER TYPE "RewardProgramStatus" RENAME TO "RewardProgramStatus_old";
ALTER TYPE "RewardProgramStatus_new" RENAME TO "RewardProgramStatus";
DROP TYPE "public"."RewardProgramStatus_old";
ALTER TABLE "reward_programs" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- AlterTable
ALTER TABLE "merchants" DROP COLUMN "storeType",
ADD COLUMN     "storeType" "StoreType" NOT NULL;

-- AlterTable
ALTER TABLE "reward_programs" DROP COLUMN "endsAt",
DROP COLUMN "maxMonthlyBudget",
DROP COLUMN "startsAt",
ADD COLUMN     "audienceType" "AudienceType" NOT NULL DEFAULT 'ALL',
ADD COLUMN     "budget" DECIMAL(14,2) NOT NULL,
ADD COLUMN     "customerSegmentId" UUID,
ADD COLUMN     "fundedAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
ADD COLUMN     "offerType" "OfferType" NOT NULL DEFAULT 'POINTS_CASHBACK',
ADD COLUMN     "spentAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
ALTER COLUMN "capPerTransaction" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- CreateTable
CREATE TABLE "customer_segments" (
    "id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_segments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_segments" (
    "userId" UUID NOT NULL,
    "segmentId" UUID NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_segments_pkey" PRIMARY KEY ("userId","segmentId")
);

-- AddForeignKey
ALTER TABLE "reward_programs" ADD CONSTRAINT "reward_programs_customerSegmentId_fkey" FOREIGN KEY ("customerSegmentId") REFERENCES "customer_segments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_segments" ADD CONSTRAINT "user_segments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_segments" ADD CONSTRAINT "user_segments_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "customer_segments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
