import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  async findAll() {
    const cacheKey = 'categories:all';
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;
    const categories = await this.prisma.category.findMany({
      where: { isActive: true },
      include: { children: true, _count: { select: { products: true } } },
      orderBy: { sortOrder: 'asc' },
    });
    await this.cache.set(cacheKey, categories, 300);
    return categories;
  }

  async findBySlug(slug: string) {
    const cacheKey = `categories:slug:${slug}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        children: { where: { isActive: true } },
        parent: true,
        products: {
          include: { product: { include: { images: { take: 1 }, variants: { where: { isActive: true }, take: 1 } } } },
        },
      },
    });
    await this.cache.set(cacheKey, category);
    return category;
  }

  async create(data: any) {
    await this.cache.del('categories:*');
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return this.prisma.category.create({ data: { ...data, slug } });
  }

  async update(id: string, data: any) {
    await this.cache.del('categories:*');
    return this.prisma.category.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.cache.del('categories:*');
    return this.prisma.category.delete({ where: { id } });
  }
}
