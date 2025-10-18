-- AlterTable
ALTER TABLE "ekub_eddir" ADD COLUMN     "qr_code_path" TEXT,
ADD COLUMN     "telebirr_phone" TEXT;

-- AlterTable
ALTER TABLE "ekub_eddir_payments" ADD COLUMN     "proof_path" TEXT;
