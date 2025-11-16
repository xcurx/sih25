-- CreateTable
CREATE TABLE "public"."Faculty" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "department" TEXT,
    "phone" TEXT,
    "linkedin" TEXT,

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_email_key" ON "public"."Faculty"("email");
