import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class DesignsService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  async findAll(query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const { category } = query;
    const cacheKey = `designs:list:${JSON.stringify({ page, limit, category })}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const where: any = { isActive: true };
    if (category) where.category = category;

    const [designs, total] = await Promise.all([
      this.prisma.design.findMany({
        where,
        include: {
          _count: { select: { ratings: true } },
          ratings: { select: { score: true } },
          createdBy: { select: { firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.design.count({ where }),
    ]);

    const items = designs.map((d) => {
      const avg = d.ratings.reduce((s, r) => s + r.score, 0) / (d.ratings.length || 1);
      const { ratings, ...rest } = d;
      return { ...rest, avgRating: d.ratings.length ? Math.round(avg * 10) / 10 : null, ratingCount: d._count.ratings };
    });

    const result = { designs: items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    await this.cache.set(cacheKey, result);
    return result;
  }

  async findOne(id: string) {
    const cacheKey = `designs:id:${id}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const design = await this.prisma.design.findUnique({
      where: { id },
      include: {
        ratings: {
          include: { user: { select: { firstName: true, lastName: true } } },
          orderBy: { createdAt: 'desc' },
        },
        createdBy: { select: { firstName: true, lastName: true } },
      },
    });
    if (!design) throw new NotFoundException('Design not found');
    await this.cache.set(cacheKey, design);
    return design;
  }

  async create(body: any, userId: string) {
    await this.cache.del('designs:*');
    return this.prisma.design.create({
      data: {
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl || '',
        imageBack: body.imageBack || '',
        imageModel: body.imageModel || '',
        imageFemaleFront: body.imageFemaleFront || '',
        imageFemaleBack: body.imageFemaleBack || '',
        category: body.category,
        createdById: userId,
      },
    });
  }

  async remove(id: string) {
    await this.cache.del('designs:*');
    await this.prisma.design.delete({ where: { id } });
    return { success: true };
  }

  async rate(designId: string, userId: string, score: number, comment?: string) {
    if (score < 0 || score > 10) throw new BadRequestException('Score must be between 0 and 10');
    const design = await this.prisma.design.findUnique({ where: { id: designId } });
    if (!design) throw new NotFoundException('Design not found');

    return this.prisma.designRating.upsert({
      where: { designId_userId: { designId, userId } },
      update: { score, comment },
      create: { designId, userId, score, comment },
    });
  }
}
