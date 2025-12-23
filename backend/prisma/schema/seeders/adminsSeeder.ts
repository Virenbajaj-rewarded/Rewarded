import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

export async function seedAdmins(prisma: PrismaClient) {
  await prisma.$transaction(async (tx) => {
    const email = 'admin@gmail.com';
    const rawPassword = 'R3w@rded#Adm1n!';
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    await tx.admin.upsert({
      where: { email },
      update: { password: hashedPassword },
      create: {
        email,
        password: hashedPassword,
      },
    });

    console.log(`✅ Admin seeded successfully`);
    console.log(`📧 Email: ${email}`);
  });
}
