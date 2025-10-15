import { PrismaClient } from '@prisma/client';

// Use globalThis to handle hot-reloading in development
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma; // Store Prisma client globally only in development mode
}
