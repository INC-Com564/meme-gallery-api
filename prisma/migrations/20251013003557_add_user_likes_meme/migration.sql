-- CreateTable
CREATE TABLE "UserLikesMeme" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "memeId" INTEGER NOT NULL,

    CONSTRAINT "UserLikesMeme_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserLikesMeme" ADD CONSTRAINT "UserLikesMeme_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikesMeme" ADD CONSTRAINT "UserLikesMeme_memeId_fkey" FOREIGN KEY ("memeId") REFERENCES "Meme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
