import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = process.env.SEED_EMAIL!;

  const existingUser = await prisma.admin.findFirst({ where: { email } });

  if (existingUser) return;

  // // cleanup the existing database
  // await prisma.user.delete({ where: { email } }).catch(() => {
  //   // no worries if it doesn't exist yet
  // });

  const hashedPassword = await bcrypt.hash(process.env.SEED_PASSWORD!, 10);

  await prisma.admin.create({
    data: {
      email,
      username: process.env.SEED_USERNAME!,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
