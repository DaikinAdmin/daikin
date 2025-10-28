-- DropForeignKey
ALTER TABLE "user_details" DROP CONSTRAINT "user_details_userId_fkey";

-- AddForeignKey
ALTER TABLE "user_details" ADD CONSTRAINT "user_details_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
