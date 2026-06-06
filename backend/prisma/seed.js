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

  const categoryMap = {};
  for (const cat of categories) {
    categoryMap[cat.slug] = cat.id;
  }

  const products = [
    {
      name: 'Slate Frost T-Shirt',
      slug: 'slate-frost-t-shirt',
      description: 'Premium minimalist t-shirt featuring a subtle mountain graphic.',
      shortDesc: 'Minimalist mountain tee in slate grey',
      basePrice: 499, comparePrice: 599,
      sku: 'WM-TS-001',
      tags: ['t-shirt', 'slate', 'minimal', 'mountain'],
      isFeatured: true, totalStock: 150,
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
      categorySlug: 't-shirts',
    },
    {
      name: 'Alpine Cabin T-Shirt',
      slug: 'alpine-cabin-t-shirt',
      description: 'High-quality deep forest green t-shirt.',
      shortDesc: 'Forest green with cabin graphic',
      basePrice: 499,
      sku: 'WM-TS-002',
      tags: ['t-shirt', 'forest', 'cabin', 'green'],
      isFeatured: true, totalStock: 120,
      imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80',
      categorySlug: 't-shirts',
    },
    {
      name: 'Glacier White T-Shirt',
      slug: 'glacier-white-t-shirt',
      description: 'Crisp white premium t-shirt.',
      shortDesc: 'Essential white tee with peak detail',
      basePrice: 499, comparePrice: 549,
      sku: 'WM-TS-003',
      tags: ['t-shirt', 'white', 'essential', 'glacier'],
      isFeatured: true, totalStock: 200,
      imageUrl: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&q=80',
      categorySlug: 't-shirts',
    },
    {
      name: 'Peak Seeker Black T-Shirt',
      slug: 'peak-seeker-black-t-shirt',
      description: 'Bold black t-shirt with minimalist peak design.',
      shortDesc: 'Bold black with peak design',
      basePrice: 549,
      sku: 'WM-TS-004',
      tags: ['t-shirt', 'black', 'bold', 'peak'],
      totalStock: 180,
      imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80',
      categorySlug: 't-shirts',
    },
    {
      name: 'Summit Grey T-Shirt',
      slug: 'summit-grey-t-shirt',
      description: 'Versatile grey tee with subtle mountain silhouette.',
      shortDesc: 'Versatile grey with mountain silhouette',
      basePrice: 499,
      sku: 'WM-TS-005',
      tags: ['t-shirt', 'grey', 'summit', 'versatile'],
      totalStock: 160,
      imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80',
      categorySlug: 't-shirts',
    },
    {
      name: 'Forest Trail Olive T-Shirt',
      slug: 'forest-trail-olive-t-shirt',
      description: 'Earthy olive green tee inspired by mountain trails.',
      shortDesc: 'Earthy olive with trail graphic',
      basePrice: 499,
      sku: 'WM-TS-006',
      tags: ['t-shirt', 'olive', 'trail', 'forest'],
      totalStock: 90,
      imageUrl: 'https://images.unsplash.com/photo-1608236415053-f7f5d5b76af6?w=600&q=80',
      categorySlug: 't-shirts',
    },
    {
      name: 'Alpine Navy T-Shirt',
      slug: 'alpine-navy-t-shirt',
      description: 'Classic navy blue with clean mountain graphics.',
      shortDesc: 'Classic navy with mountain graphics',
      basePrice: 499,
      sku: 'WM-TS-007',
      tags: ['t-shirt', 'navy', 'classic', 'alpine'],
      totalStock: 140,
      imageUrl: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&q=80',
      categorySlug: 't-shirts',
    },
    {
      name: 'Misty Morning Cream T-Shirt',
      slug: 'misty-morning-cream-t-shirt',
      description: 'Soft cream colored tee capturing misty mountain mornings.',
      shortDesc: 'Soft cream capturing misty mornings',
      basePrice: 549,
      sku: 'WM-TS-008',
      tags: ['t-shirt', 'cream', 'misty', 'soft'],
      isFeatured: true, totalStock: 75,
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
      categorySlug: 't-shirts',
    },
    {
      name: 'Trailblazer Hoodie',
      slug: 'trailblazer-hoodie',
      description: 'Premium heavyweight hoodie with embroidered mountain logo.',
      shortDesc: 'Premium heavyweight hoodie',
      basePrice: 599, comparePrice: 699,
      sku: 'WM-HD-001',
      tags: ['hoodie', 'premium', 'heavyweight', 'logo'],
      isFeatured: true, totalStock: 60,
      imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
      categorySlug: 'hoodies',
    },
    {
      name: 'Summit Cap',
      slug: 'summit-cap',
      description: 'Clean structured cap with embroidered peak logo.',
      shortDesc: 'Structured cap with peak logo',
      basePrice: 299,
      sku: 'WM-AC-001',
      tags: ['cap', 'accessory', 'structured', 'peak'],
      isFeatured: true, totalStock: 120,
      imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80',
      categorySlug: 'accessories',
      sizes: ['OS'],
    },
    {
      name: 'Canvas Trail Tote',
      slug: 'canvas-trail-tote',
      description: 'Heavyweight canvas tote with mountain motif print.',
      shortDesc: 'Heavyweight canvas tote',
      basePrice: 399, comparePrice: 449,
      sku: 'WM-AC-002',
      tags: ['tote', 'canvas', 'accessory', 'mountain'],
      isFeatured: true, totalStock: 80,
      imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80',
      categorySlug: 'accessories',
      sizes: ['OS'],
    },
    {
      name: 'Midnight Black Hoodie',
      slug: 'midnight-black-hoodie',
      description: 'Sleek black pullover hoodie with tonal mountain embroidery.',
      shortDesc: 'Sleek black pullover hoodie',
      basePrice: 649,
      sku: 'WM-HD-002',
      tags: ['hoodie', 'black', 'fleece', 'tonal'],
      isFeatured: true, totalStock: 45,
      imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80',
      categorySlug: 'hoodies',
    },
    {
      name: 'Ridge Runner Heather Tee',
      slug: 'ridge-runner-heather-tee',
      description: 'Soft heather grey tee with a bold mountain ridge graphic.',
      shortDesc: 'Heather grey with ridge graphic',
      basePrice: 449,
      sku: 'WM-TS-009',
      tags: ['t-shirt', 'heather', 'ridge', 'graphic'],
      isFeatured: true, totalStock: 100,
      imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80',
      categorySlug: 't-shirts',
    },
  ];

  for (const productData of products) {
    const { imageUrl, categorySlug, sizes, ...data } = productData;
    const categoryId = categoryMap[categorySlug] || categories[0].id;
    const defaultSizes = sizes || ['S', 'M', 'L', 'XL'];
    await prisma.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        categories: { create: [{ categoryId }] },
        images: imageUrl ? { create: [{ url: imageUrl, isPrimary: true, sortOrder: 0 }] } : undefined,
        variants: {
          create: defaultSizes.map((size, idx) => ({
            name: size,
            size,
            sku: `${data.sku}-${size}`,
            stock: Math.floor(Math.random() * 50) + 10,
            sortOrder: idx,
          })),
        },
      },
    });
    console.log(`Created product: ${productData.name}`);
  }

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
