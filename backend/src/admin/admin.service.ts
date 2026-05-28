import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

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
      SELECT DATE(created_at) as date, SUM(total) as revenue
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '30 days'
      AND payment_status = 'SUCCESSFUL'
      GROUP BY DATE(created_at)
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
}
