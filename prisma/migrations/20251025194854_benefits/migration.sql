-- CreateTable
CREATE TABLE "benefit_description" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "daikinCoins" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "benefit_description_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benefits" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "redeemedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comment" TEXT,
    "benefitDescriptionId" TEXT NOT NULL,

    CONSTRAINT "benefits_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "benefits" ADD CONSTRAINT "benefits_benefitDescriptionId_fkey" FOREIGN KEY ("benefitDescriptionId") REFERENCES "benefit_description"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
