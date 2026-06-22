import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Role } from '@prisma/client';
import * as argon2 from 'argon2';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const [totalUsers, totalOrders, totalRevenue, totalProducts, recentOrders] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.order.count(),
        this.prisma.order.aggregate({ _sum: { total: true } }),
        this.prisma.product.count({ where: { isActive: true } }),
        this.prisma.order.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
            items: true,
          },
        }),
      ]);

    const ordersByStatus = await this.prisma.order.groupBy({
      by: ['status'],
      _count: true,
    });

    const revenueByDay = await this.prisma.$queryRaw`
      SELECT DATE("createdAt") as date, SUM(total) as revenue
      FROM orders
      WHERE "createdAt" >= NOW() - INTERVAL '30 days'
      AND "paymentStatus" = 'SUCCESSFUL'
      GROUP BY DATE("createdAt")
      ORDER BY date
    `;

    return {
      stats: {
        totalUsers,
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        totalProducts,
      },
      ordersByStatus,
      revenueByDay,
      recentOrders,
    };
  }

  async getUsers(query: any) {
    const { page = 1, limit = 20, search, role } = query;
    const where: any = {};
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (role) where.role = role;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true, email: true, firstName: true, lastName: true, role: true,
          isEmailVerified: true, createdAt: true, lastLoginAt: true,
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return { users, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getAllOrders(query: any) {
    const { page = 1, limit = 20, status, paymentStatus } = query;
    const where: any = {};
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          items: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return { orders, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async updateOrderStatus(id: string, status: string) {
    return this.prisma.order.update({
      where: { id },
      data: { status: status as any, ...(status === 'DELIVERED' ? { deliveredAt: new Date() } : {}) },
    });
  }

  async handleRefund(refundId: string, action: string, adminNotes?: string) {
    const refund = await this.prisma.refundRequest.findUnique({
      where: { id: refundId },
      include: { order: true },
    });
    if (!refund) throw new Error('Refund request not found');

    if (action === 'approve') {
      await this.prisma.order.update({
        where: { id: refund.orderId },
        data: { status: 'REFUNDED', refundAmount: refund.refundAmount || refund.order.total },
      });
    }

    return this.prisma.refundRequest.update({
      where: { id: refundId },
      data: { status: action === 'approve' ? 'APPROVED' : 'REJECTED', adminNotes },
    });
  }

  async runSeed() {
    const passwordHash = await argon2.hash('admin123');

    await this.prisma.user.upsert({
      where: { email: 'admin@wemine.com' },
      update: { role: Role.ADMIN, isEmailVerified: true },
      create: {
        email: 'admin@wemine.com',
        passwordHash, firstName: 'Admin', lastName: 'Wemine',
        role: Role.ADMIN, isEmailVerified: true,
      },
    });
    await this.prisma.user.upsert({
      where: { email: 'user@wemine.com' },
      update: {},
      create: {
        email: 'user@wemine.com',
        passwordHash, firstName: 'Test', lastName: 'User',
        role: Role.USER, isEmailVerified: true,
      },
    });

    const catData = [
      { name: 'T-Shirts', slug: 't-shirts', desc: 'Premium cotton tees' },
      { name: 'Hoodies', slug: 'hoodies', desc: 'Warm premium hoodies' },
      { name: 'Accessories', slug: 'accessories', desc: 'Minimal accessories' },
    ];
    const cats: Record<string, any> = {};
    for (const c of catData) {
      cats[c.slug] = await this.prisma.category.upsert({
        where: { slug: c.slug },
        update: {},
        create: { name: c.name, slug: c.slug, description: c.desc },
      });
    }

    console.log('Categories ready (no seed products — products are created via admin panel).');

    return { success: true, message: 'Database seeded successfully' };
  }
}
