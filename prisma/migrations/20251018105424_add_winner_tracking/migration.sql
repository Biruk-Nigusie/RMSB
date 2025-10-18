-- AlterTable
ALTER TABLE "ekub_eddir" ADD COLUMN     "current_winner_id" TEXT,
ADD COLUMN     "last_winner_date" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "ekub_eddir" ADD CONSTRAINT "ekub_eddir_current_winner_id_fkey" FOREIGN KEY ("current_winner_id") REFERENCES "residents"("id") ON DELETE SET NULL ON UPDATE CASCADE;
