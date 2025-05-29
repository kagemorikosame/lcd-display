import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// 環境変数が設定されていない場合、グローバル変数に保存
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
