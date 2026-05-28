import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, productId: string, data: any) {
    const existing = await this.prisma.review.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (existing) throw new BadRequestException('You already reviewed this product');

    const review = await this.prisma.review.create({
      data: { userId, productId, ...data },
      include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
    });

    const stats = await this.prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: true,
    });

    await this.prisma.product.update({
      where: { id: productId },
      data: { avgRating: stats._avg.rating || 0, reviewCount: stats._count },
    });

    return review;
  }

  async findByProduct(productId: string) {
    return this.prisma.review.findMany({
      where: { productId },
      include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(userId: string, reviewId: string) {
    return this.prisma.review.delete({ where: { id: reviewId, userId } });
  }
}
