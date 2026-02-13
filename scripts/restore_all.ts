import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  try {
    const backupPath = path.join(__dirname, "../backup_full_data.json");
    if (!fs.existsSync(backupPath)) {
      console.error(
        "Backup file not found! Jalankan 'npx ts-node scripts/backup_all.ts' terlebih dahulu.",
      );
      return;
    }

    const rawData = fs.readFileSync(backupPath, "utf-8");
    const backupData = JSON.parse(rawData);

    console.log("Starting full database restoration...");

    // 1. Restore Users
    console.log(`Restoring ${backupData.users.length} users...`);
    for (const user of backupData.users) {
      const { id, ...data } = user;
      await prisma.user.upsert({
        where: { username: user.username },
        update: data,
        create: data,
      });
    }

    // 2. Restore Places (with Details and Images)
    console.log(
      `Restoring ${backupData.places.length} places with relations...`,
    );
    for (const p of backupData.places) {
      const { id, detail, placeImages, createdAt, ...placeBase } = p;

      // Hapus data lama yang punya nama sama atau handle duplicate jika perlu
      // Untuk migrasi bersih, biasanya database sudah kosong (db push)

      await prisma.place.create({
        data: {
          ...placeBase,
          detail: detail
            ? {
                create: {
                  accessInfo: detail.accessInfo,
                  priceInfo: detail.priceInfo,
                  facilities: detail.facilities,
                  contactInfo: detail.contactInfo,
                  webUrl: detail.webUrl,
                },
              }
            : undefined,
          placeImages: {
            create: placeImages.map((img: any) => ({
              url: img.url,
            })),
          },
        },
      });
    }

    console.log("-----------------------------------------");
    console.log("Restoration completed successfully!");
    console.log("-----------------------------------------");
  } catch (e) {
    console.error("Restoration failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
