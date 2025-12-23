import { PrismaClient } from '@prisma/client';
import { seedRoles } from './rolesSeeder';
import { seedAdmins } from './adminsSeeder';

const prisma = new PrismaClient();

async function main() {
  await seedRoles(prisma);
  await seedAdmins(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
