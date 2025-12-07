-- CreateTable
CREATE TABLE "MailInbox" (
    "id" TEXT NOT NULL,
    "inboxId" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MailInbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MailInbox_inboxId_key" ON "MailInbox"("inboxId");

-- CreateIndex
CREATE UNIQUE INDEX "MailInbox_emailAddress_key" ON "MailInbox"("emailAddress");
