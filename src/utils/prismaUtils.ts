import { PrismaClient } from '@prisma/client';

// Criando uma instância única do PrismaClient
const prisma = new PrismaClient();

// Exportando a instância para ser usada em outros lugares
export default prisma;