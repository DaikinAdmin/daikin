import { PrismaClient } from "../../prisma/client"; // define your output folder here

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

process.on("beforeExit", (): void => {
  prisma.$disconnect();
});

export default prisma;