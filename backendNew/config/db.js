import { prisma } from "./prisma.js";

export const connectDB = async () => {
  try {
    await prisma.$connect();
    await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ PostgreSQL connected via Prisma");
  } catch (error) {
    console.error("❌ PostgreSQL connection failed:", error.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await prisma.$disconnect();
};
