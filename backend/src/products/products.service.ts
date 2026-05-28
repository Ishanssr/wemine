import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      tags,
      featured,
      vendorId,
    } = query;

    const where: any = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } },
      ];
    }
    if (category) {
      where.categories = { some: { category: { slug: category } } };
    }
    if (minPrice) where.basePrice = { ...where.basePrice, gte: parseFloat(minPrice) };
    if (maxPrice) where.basePrice = { ...where.basePrice, lte: parseFloat(maxPrice) };
    if (featured) where.isFeatured = true;
    if (vendorId) where.vendorId = vendorId;
    if (tags) where.tags = { hasSome: Array.isArray(tags) ? tags : [tags] };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          images: { orderBy: { sortOrder: 'asc' }, take: 5 },
          variants: { where: { isActive: true } },
          categories: { include: { category: true } },
          reviews: { take: 3, orderBy: { createdAt: 'desc' }, include: { user: true } },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
        categories: { include: { category: true } },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { user: true },
        },
        relatedProducts: {
          include: {
            related: {
              include: { images: { take: 1 }, variants: { where: { isActive: true }, take: 1 } },
            },
          },
        },
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        variants: true,
        categories: { include: { category: true } },
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(data: any) {
    const { categories, images, variants, ...productData } = data;
    const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    return this.prisma.product.create({
      data: {
        ...productData,
        slug,
        categories: categories?.length
          ? { create: categories.map((catId: string) => ({ category: { connect: { id: catId } } })) }
          : undefined,
        images: images?.length
          ? { create: images.map((img: any, idx: number) => ({ ...img, sortOrder: idx })) }
          : undefined,
        variants: variants?.length
          ? { create: variants.map((v: any, idx: number) => ({ ...v, sortOrder: idx })) }
          : undefined,
      },
      include: { images: true, variants: true, categories: { include: { category: true } } },
    });
  }

  async update(id: string, data: any) {
    await this.findById(id);
    return this.prisma.product.update({
      where: { id },
      data,
      include: { images: true, variants: true, categories: { include: { category: true } } },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    return this.prisma.product.delete({ where: { id } });
  }

  async getFeatured() {
    return this.prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: { images: { take: 1 }, variants: { where: { isActive: true }, take: 1 } },
      take: 20,
    });
  }

  async getRelated(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        categories: true,
        relatedProducts: {
          include: {
            related: {
              include: { images: { take: 1 }, variants: { where: { isActive: true }, take: 1 } },
            },
          },
        },
      },
    });
    if (!product) throw new NotFoundException('Product not found');

    if (product.relatedProducts.length > 0) {
      return product.relatedProducts.map((rp: any) => rp.related);
    }

    const categoryIds = product.categories.map((c: any) => c.categoryId);
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        id: { not: productId },
        categories: { some: { categoryId: { in: categoryIds } } },
      },
      include: { images: { take: 1 }, variants: { where: { isActive: true }, take: 1 } },
      take: 8,
    });
  }
}
