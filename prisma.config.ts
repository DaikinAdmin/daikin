import type { PrismaConfig } from "prisma";

// Helper function to get environment variables
const env = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export default {
  schema: 'prisma/schema.prisma',
  migrations: { 
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: { 
    url: env("DATABASE_URL")
  },
  // seed: {
  //   command: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts'
  // }
} satisfies PrismaConfig;
