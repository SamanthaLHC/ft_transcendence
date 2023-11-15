/*
  Warnings:

  - Added the required column `type` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Message_Type" AS ENUM ('MESSAGE', 'GAME');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "type" "Message_Type" NOT NULL;
