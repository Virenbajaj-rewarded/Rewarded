/*
  Warnings:

  - You are about to drop the column `attempts` on the `phone-verifications` table. All the data in the column will be lost.
  - You are about to drop the column `codeHash` on the `phone-verifications` table. All the data in the column will be lost.
  - You are about to drop the column `pendingPhone` on the `phone-verifications` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,code]` on the table `phone-verifications` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `phone-verifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "phone-verifications" DROP COLUMN "attempts",
DROP COLUMN "codeHash",
DROP COLUMN "pendingPhone",
ADD COLUMN     "code" VARCHAR(100) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "phone-verifications_userId_code_key" ON "phone-verifications"("userId", "code");
