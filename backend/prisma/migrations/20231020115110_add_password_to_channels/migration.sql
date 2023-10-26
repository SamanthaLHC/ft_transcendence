/*
  Warnings:

  - The primary key for the `UserChannel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserChannel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "password" TEXT;

-- AlterTable
ALTER TABLE "UserChannel" DROP CONSTRAINT "UserChannel_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "UserChannel_pkey" PRIMARY KEY ("channelId", "userId");
