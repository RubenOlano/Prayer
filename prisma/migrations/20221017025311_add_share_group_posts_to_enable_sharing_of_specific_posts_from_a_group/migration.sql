-- CreateTable
CREATE TABLE "PostShare" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "shareGroupPostsId" TEXT,

    CONSTRAINT "PostShare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShareGroupPosts" (
    "id" TEXT NOT NULL,

    CONSTRAINT "ShareGroupPosts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PostShare" ADD CONSTRAINT "PostShare_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostShare" ADD CONSTRAINT "PostShare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostShare" ADD CONSTRAINT "PostShare_shareGroupPostsId_fkey" FOREIGN KEY ("shareGroupPostsId") REFERENCES "ShareGroupPosts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
