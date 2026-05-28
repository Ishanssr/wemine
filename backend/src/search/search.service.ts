import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(query: string, filters: any) {
    const {
      page = 1,
      limit = 20,
      category,
      minPrice,
      maxPrice,
      sortBy = 'relevance',
      sizes,
      colors,
    } = filters;

    const where: any = {
      isActive: true,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { tags: { hasSome: [query] } },
      ],
    };

    if (category) where.categories = { some: { category: { slug: category } } };
    if (minPrice) where.basePrice = { ...where.basePrice, gte: parseFloat(minPrice) };
    if (maxPrice) where.basePrice = { ...where.basePrice, lte: parseFloat(maxPrice) };
    if (sizes) where.variants = { some: { size: { in: Array.isArray(sizes) ? sizes : [sizes] } } };
    if (colors) where.variants = { ...where.variants, some: { color: { in: Array.isArray(colors) ? colors : [colors] } } };

    const orderBy: any = sortBy === 'price_asc'
      ? { basePrice: 'asc' }
      : sortBy === 'price_desc'
        ? { basePrice: 'desc' }
        : sortBy === 'newest'
          ? { createdAt: 'desc' }
          : sortBy === 'rating'
            ? { avgRating: 'desc' }
            : sortBy === 'popular'
              ? { soldCount: 'desc' }
              : [{ isFeatured: 'desc' }, { createdAt: 'desc' }];

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          images: { take: 1, where: { isPrimary: true } },
          variants: { where: { isActive: true }, take: 3 },
          categories: { include: { category: { select: { name: true, slug: true } } } },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit + 1,
      }),
      this.prisma.product.count({ where }),
    ]);

    if (query) {
      await this.prisma.searchHistory.create({
        data: { query, userId: filters.userId },
      }).catch(() => {});
    }

    return {
      products,
      total,
      hasMore: products.length > limit,
      results: products.slice(0, limit),
      suggestions: await this.getSuggestions(query),
    };
  }

  async getSuggestions(query: string) {
    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        name: { contains: query, mode: 'insensitive' },
      },
      select: { name: true, slug: true },
      take: 5,
    });
    return products.map((p: { name: string }) => p.name);
  }

  async getRecentSearches(userId: string) {
    const history = await this.prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      distinct: ['query'],
    });
    return history.map((h: { query: string }) => h.query);
  }

  async clearSearchHistory(userId: string) {
    await this.prisma.searchHistory.deleteMany({ where: { userId } });
  }
}
