import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class LoyaltyService {
  constructor(private prisma: PrismaService) {}

  async getPoints(userId: string) {
    const points = await this.prisma.loyaltyPoint.aggregate({
      where: { userId, expiresAt: { gte: new Date() } },
      _sum: { points: true },
    });
    return { totalPoints: points._sum.points || 0 };
  }

  async getHistory(userId: string) {
    return this.prisma.loyaltyPoint.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async addPoints(userId: string, points: number, type: string, reference?: string) {
    return this.prisma.loyaltyPoint.create({
      data: { userId, points, type, reference, description: `${points} points earned from ${type}` },
    });
  }
}
