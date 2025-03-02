import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function dbDisconnector() {
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
  }
}


