-- CreateEnum
CREATE TYPE "StatusModo" AS ENUM ('MEMBER', 'OWNER', 'ADMIN', 'BANNED');

-- AlterTable
ALTER TABLE "UserChannel" ADD COLUMN     "mutedUntil" TIMESTAMP(3),
ADD COLUMN     "status" "StatusModo" NOT NULL DEFAULT 'MEMBER';
