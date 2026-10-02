import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

export const prisma = new PrismaClient({
  log: [] // Suppress verbose engine logs during network dropouts
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
    console.warn(`⚠️ Prisma AWS RDS MySQL connection attempt offline (${err.message}). Using hybrid data fallback layer.`);
    isConnected = false;
    return { success: false, isConnected: false, error: err.message };
  }
}

export function isDbConnected() {
  return isConnected;
}

export function setDbConnectedStatus(status) {
  isConnected = Boolean(status);
}

export default {
  prisma,
  initDatabase,
  isDbConnected,
  setDbConnectedStatus
};
