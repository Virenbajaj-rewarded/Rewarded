-- CreateTable
CREATE TABLE "public"."UserStorePreference" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "merchantId" UUID NOT NULL,
    "removed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserStorePreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserStorePreference_userId_merchantId_key" ON "public"."UserStorePreference"("userId", "merchantId");

-- AddForeignKey
ALTER TABLE "public"."UserStorePreference" ADD CONSTRAINT "UserStorePreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserStorePreference" ADD CONSTRAINT "UserStorePreference_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "public"."merchants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
