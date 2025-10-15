import { PrismaClient } from '../prisma/app/generated/prisma/client';

// Minimal global singleton to avoid deep type instantiation issues
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}