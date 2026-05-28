import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async validate(code: string, userId: string, orderValue: number) {
    const coupon = await this.prisma.coupon.findUnique({ where: { code } });
    if (!coupon || !coupon.isActive) throw new BadRequestException('Invalid coupon');
    if (coupon.endDate < new Date() || coupon.startDate > new Date()) {
      throw new BadRequestException('Coupon expired');
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException('Coupon usage limit reached');
    }
    if (orderValue < coupon.minOrderValue) {
      throw new BadRequestException(`Minimum order value of ₹${coupon.minOrderValue} required`);
    }

    let discount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discount = (orderValue * coupon.discountValue) / 100;
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      discount = coupon.discountValue;
    }

    if (userId && coupon.perUserLimit) {
      const userOrders = await this.prisma.order.count({
        where: { userId, couponCode: code },
      });
      if (userOrders >= coupon.perUserLimit) {
        throw new BadRequestException('Coupon already used');
      }
    }

    return { valid: true, discount, coupon: { code: coupon.code, discountType: coupon.discountType } };
  }

  async apply(code: string, userId: string) {
    const coupon = await this.prisma.coupon.findUnique({ where: { code } });
    if (!coupon) throw new BadRequestException('Invalid coupon');

    await this.prisma.coupon.update({
      where: { id: coupon.id },
      data: { usedCount: { increment: 1 } },
    });

    return coupon;
  }

  async findAll() {
    return this.prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async create(data: any) {
    return this.prisma.coupon.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.coupon.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.coupon.delete({ where: { id } });
  }
}
