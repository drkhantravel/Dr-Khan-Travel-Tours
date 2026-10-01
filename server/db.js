import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
});

let isConnected = false;

export async function initDatabase() {
  console.log(`📡 Connecting Prisma ORM to AWS RDS MySQL Database...`);
  try {
    await prisma.$connect();
    console.log(`✅ Prisma ORM connected to AWS RDS MySQL successfully!`);
    isConnected = true;
    return { success: true, isConnected: true };
  } catch (err) {
    console.warn(`⚠️ Prisma AWS RDS MySQL connection attempt skipped or offline (${err.message}). Using hybrid data fallback layer.`);
    isConnected = false;
    return { success: false, isConnected: false, error: err.message };
  }
}

export function isDbConnected() {
  return isConnected;
}

export default {
  prisma,
  initDatabase,
  isDbConnected
};
