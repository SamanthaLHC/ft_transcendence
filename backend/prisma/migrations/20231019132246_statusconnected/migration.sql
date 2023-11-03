/*
  Warnings:

  - The primary key for the `UserChannel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserChannel` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Status_connect" AS ENUM ('CONNECTED', 'DISCONNECTED', 'INGAME');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "Status_connect" NOT NULL DEFAULT 'CONNECTED';

-- AlterTable
ALTER TABLE "UserChannel" DROP CONSTRAINT "UserChannel_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "UserChannel_pkey" PRIMARY KEY ("channelId", "userId");
