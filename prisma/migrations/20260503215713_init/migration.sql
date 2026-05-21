-- CreateTable
CREATE TABLE "Visitor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "hostName" TEXT NOT NULL,
    "hostEmail" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "checkInAt" DATETIME NOT NULL,
    "checkOutAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
