import { UserRole } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

async function main() {
  console.log("Start seeding...");

  // 1. Seed EOS Users
  const eosUsers = [
    {
      name: "Muhammad Kormansyah Hadi",
      username: "kormansyah.hadi",
      email: "korman@example.com",
      role: UserRole.EOS,
      nip: "198801012010011001",
    },
    {
      name: "Budi Santoso",
      username: "budi.santoso",
      email: "budi@example.com",
      role: UserRole.EOS,
      nip: "199003152012011002",
    },
  ];

  for (const user of eosUsers) {
    await prisma.user.upsert({
      where: { username: user.username },
      update: {},
      create: user,
    });
  }

  // 2. Seed Supervisor Users
  const supervisors = [
    {
      name: "Riky Fran A.",
      username: "riky.fran",
      email: "riky@example.com",
      role: UserRole.SUPERVISOR,
      nip: "84041216",
    },
  ];

  for (const user of supervisors) {
    await prisma.user.upsert({
      where: { username: user.username },
      update: {},
      create: user,
    });
  }

  const floors = [
    { name: "Basement", slug: "basement", order: 0 },
    { name: "Floor 1", slug: "floor-1", order: 1 },
    { name: "Floor 2", slug: "floor-2", order: 2 },
    { name: "Floor 3", slug: "floor-3", order: 3 },
    { name: "Floor 4", slug: "floor-4", order: 4 },
    { name: "Floor 5", slug: "floor-5", order: 5 },
    { name: "Floor 6", slug: "floor-6", order: 6 },
    { name: "Floor 7", slug: "floor-7", order: 7 },
  ];

  for (const floor of floors) {
    await prisma.floor.upsert({
      where: { slug: floor.slug },
      update: {},
      create: floor,
    });
  }

  const devices = [
    { name: "Fire Alarm System", slug: "fire-alarm-system", order: 0 },
    { name: "Sound System", slug: "sound-system", order: 1 },
    { name: "CCTV System", slug: "cctv-system", order: 2 },
    { name: "Access Control System", slug: "access-control-system", order: 3 },
    { name: "Control Room", slug: "control-room", order: 4 },
  ];

  for (const device of devices) {
    await prisma.device.upsert({
      where: { slug: device.slug },
      update: {},
      create: device,
    });
  }

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
