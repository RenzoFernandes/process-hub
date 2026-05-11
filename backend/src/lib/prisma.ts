import { PrismaClient } from "@prisma/client";

// Cliente unico do Prisma reutilizado pelos controllers para evitar conexoes duplicadas.
export const prisma = new PrismaClient();
