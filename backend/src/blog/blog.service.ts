import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const { page = 1, limit = 10, tag } = query;
    const where: any = { isPublished: true };
    if (tag) where.tags = { hasSome: [tag] };

    const [posts, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        include: { author: { select: { firstName: true, lastName: true, avatarUrl: true } } },
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return { posts, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
      include: { author: { select: { firstName: true, lastName: true, avatarUrl: true } } },
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async create(data: any) {
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return this.prisma.blogPost.create({
      data: { ...data, slug, publishedAt: data.isPublished ? new Date() : null },
    });
  }
}
