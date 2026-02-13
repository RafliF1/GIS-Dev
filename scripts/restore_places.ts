import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  try {
    const backupPath = path.join(process.cwd(), "backup_places_data.json");
    if (!fs.existsSync(backupPath)) {
      console.error("Backup file not found!");
      return;
    }

    const rawData = fs.readFileSync(backupPath, "utf-8");
    const places = JSON.parse(rawData);

    for (const p of places) {
      try {
        // Explicitly destructure only the fields we WANT from the backup
        // or fields we want to EXCLUDE (like id, createdAt, updatedAt)
        const {
          id,
          placeImages,
          createdAt,
          updatedAt,
          is_recommended,
          ...cleanData
        } = p;

        console.log(`Restoring: ${p.name}`);

        await prisma.place.create({
          data: {
            name: cleanData.name,
            description: cleanData.description,
            address: cleanData.address,
            lat: cleanData.lat,
            lon: cleanData.lon,
            category: cleanData.category,
            createdAt: createdAt ? new Date(createdAt) : undefined,
            placeImages: {
              create: (placeImages || []).map((img: any) => ({
                url: img.url,
              })),
            },
          },
        });
      } catch (itemError: any) {
        console.error(
          `Failed to restore ${p.name}:`,
          itemError.message || itemError,
        );
      }
    }

    console.log("Restoration loop finished!");
  } catch (e: any) {
    if (e.code) {
      console.error(`Prisma Error [${e.code}]:`, e.message);
    } else {
      console.error("Restoration failed:", e);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
