import { PrismaClient, Role } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Nuke all old dummy products and banners using raw SQL (bypasses FK issues)
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE recently_viewed CASCADE`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE search_history CASCADE`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE wishlist_items CASCADE`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE cart_items CASCADE`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE order_items CASCADE`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE reviews CASCADE`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE flash_sale_items CASCADE`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE flash_sales CASCADE`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE product_variants CASCADE`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE product_images CASCADE`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE product_categories CASCADE`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE related_products CASCADE`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE products CASCADE`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE banners CASCADE`);
  console.log('Cleared old products and banners.');

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

  const coupon = await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      description: '10% off your first order',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      maxDiscount: 1000,
      minOrderValue: 999,
      usageLimit: 1000,
      isActive: true,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });

  const coupon2 = await prisma.coupon.upsert({
    where: { code: 'FREESHIP' },
    update: {},
    create: {
      code: 'FREESHIP',
      description: 'Free shipping on orders above ₹999',
      discountType: 'PERCENTAGE',
      discountValue: 100,
      maxDiscount: 100,
      minOrderValue: 999,
      usageLimit: 500,
      isActive: true,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('Seed complete! Supporting data (categories, users, coupons) created.');
  console.log('Admin: admin@wemine.com / admin123');
  console.log('User: user@wemine.com / admin123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
