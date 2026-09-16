import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";
import { rooms } from "../app/lib/rooms";
import { dinner, natureWalk } from "../app/lib/extras";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {

    await prisma.meal.upsert({
  where: {
    slug: "dinner",
  },
  update: {},
  create: {
    name: dinner.name,
    slug: "dinner",
    description: "Dinner for all guests on every night of your stay.",
    pricePerGuestPerNight: dinner.pricePerGuestPerNight,
  },
});

console.log("Meal ready: Dinner");

await prisma.activity.upsert({
  where: {
    slug: "guided-nature-walk",
  },
  update: {},
  create: {
    name: natureWalk.name,
    slug: "guided-nature-walk",
    description: "One guided nature walk session during your stay.",
    pricePerGuestPerSession: natureWalk.pricePerGuestPerSession,
  },
});

console.log("Activity ready: Guided nature walk");
  // දැනට තියෙන sample room වර්ග එකින් එක ලබාගන්නවා.
  for (const room of rooms) {
    const roomType = await prisma.roomType.upsert({
      where: {
        slug: room.slug,
      },
      update: {},
      create: {
        name: room.name,
        slug: room.slug,
        description: room.description,
        pricePerNight: room.price,
        capacity: room.capacity,
        image: room.image,
        breakfastIncluded: room.breakfastIncluded,
        amenities: room.amenities,
      },
    });

    console.log(`Room type ready: ${room.name}`);

    const roomNumbers =
  room.slug === "garden-deluxe"
    ? ["101", "102"]
    : room.slug === "mountain-suite"
      ? ["201"]
      : [];

for (const number of roomNumbers) {
  await prisma.room.upsert({
    where: { number },
    update: {},
    create: {
      number,
      roomTypeId: roomType.id,
    },
  });

  console.log(`Room ready: ${number} (${room.name})`);
}
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });