const { PrismaClient, Role } = require('@prisma/client');
const argon2 = require('argon2');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminPassword = await argon2.hash('admin123');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@wemine.com' },
    update: {},
    create: {
      email: 'admin@wemine.com',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'Wemine',
      role: Role.ADMIN,
      isEmailVerified: true,
    },
  });
  console.log(`Created admin: ${admin.email}`);

  const user = await prisma.user.upsert({
    where: { email: 'user@wemine.com' },
    update: {},
    create: {
      email: 'user@wemine.com',
      passwordHash: adminPassword,
      firstName: 'Test',
      lastName: 'User',
      role: Role.USER,
      isEmailVerified: true,
    },
  });
  console.log(`Created user: ${user.email}`);

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 't-shirts' },
      update: {},
      create: { name: 'T-Shirts', slug: 't-shirts', description: 'Premium mountain-inspired t-shirts' },
    }),
    prisma.category.upsert({
      where: { slug: 'hoodies' },
      update: {},
      create: { name: 'Hoodies', slug: 'hoodies', description: 'Warm and stylish hoodies' },
    }),
    prisma.category.upsert({
      where: { slug: 'accessories' },
      update: {},
      create: { name: 'Accessories', slug: 'accessories', description: 'Complete your look' },
    }),
    prisma.category.upsert({
      where: { slug: 'new-arrivals' },
      update: {},
      create: { name: 'New Arrivals', slug: 'new-arrivals', description: 'Fresh from the peak' },
    }),
  ]);
  console.log('Categories created');

  console.log('Seed complete!');
  console.log('Admin: admin@wemine.com / admin123');
  console.log('User: user@wemine.com / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
