/*
  Warnings:

  - The primary key for the `Relationships` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Relationships` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Relationships" DROP CONSTRAINT "Relationships_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Relationships_pkey" PRIMARY KEY ("userId", "targetId");
