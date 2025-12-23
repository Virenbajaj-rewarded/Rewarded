import { PrismaClient } from '@prisma/client';

export async function seedRoles(prisma: PrismaClient) {
  await prisma.$transaction(async (tx) => {
    const roles = [
      { name: 'USER', description: 'Regular user' },
      { name: 'MERCHANT', description: 'Business merchant' },
    ];

    for (const role of roles) {
      await tx.role.upsert({
        where: { name: role.name },
        update: { description: role.description },
        create: role,
      });
    }

    console.log('✅ Roles seeded successfully');
  });
}
