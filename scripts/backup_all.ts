import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Starting full database backup...");

    // Ambil data dari semua tabel
    const users = await prisma.user.findMany();
    const places = await prisma.place.findMany({
      include: {
        detail: true,
        placeImages: true,
      },
    });

    const backupData = {
      timestamp: new Date().toISOString(),
      users: users,
      places: places,
    };

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupDir = path.join(process.cwd(), "backups");

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    const backupPath = path.join(backupDir, `backup_full_${timestamp}.json`);
    const latestPath = path.join(process.cwd(), "backup_full_data.json");

    const jsonData = JSON.stringify(backupData, null, 2);
    fs.writeFileSync(backupPath, jsonData);
    fs.writeFileSync(latestPath, jsonData);

    console.log("-----------------------------------------");
    console.log(`Backup completed successfully!`);
    console.log(`- Users: ${users.length}`);
    console.log(`- Places: ${places.length}`);
    console.log(`- History saved to: backups/backup_full_${timestamp}.json`);
    console.log(`- Latest saved to: backup_full_data.json`);
    console.log("-----------------------------------------");
  } catch (e) {
    console.error("Backup failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
