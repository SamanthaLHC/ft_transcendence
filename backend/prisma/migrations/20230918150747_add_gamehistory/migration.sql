-- CreateTable
CREATE TABLE "GameHistory" (
    "gameId" SERIAL NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gagnantId" INTEGER NOT NULL,
    "perdantId" INTEGER NOT NULL,
    "scoreGagnant" INTEGER NOT NULL,
    "scorePerdant" INTEGER NOT NULL,

    CONSTRAINT "GameHistory_pkey" PRIMARY KEY ("gameId")
);
