-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "parking_slots" ADD COLUMN     "qr_code_path" TEXT,
ADD COLUMN     "telebirr_phone" TEXT;

-- CreateTable
CREATE TABLE "parking_requests" (
    "id" TEXT NOT NULL,
    "resident_id" TEXT NOT NULL,
    "slot_id" TEXT,
    "requested_slot" TEXT,
    "message" TEXT,
    "document_path" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "admin_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3),

    CONSTRAINT "parking_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "parking_requests" ADD CONSTRAINT "parking_requests_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "residents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parking_requests" ADD CONSTRAINT "parking_requests_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "parking_slots"("id") ON DELETE SET NULL ON UPDATE CASCADE;
