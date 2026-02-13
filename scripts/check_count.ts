import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.place.count();
    console.log(`TOTAL_DATA_COUNT: ${count}`);

    const categories = await prisma.place.groupBy({
      by: ["category"],
    });
    console.log(`TOTAL_CATEGORIES_COUNT: ${categories.length}`);
  } catch (e) {
    console.error("Check failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
