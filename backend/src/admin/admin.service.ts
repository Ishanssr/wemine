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

    const products = [
      { name: 'Slate Frost T-Shirt', slug: 'slate-frost', price: 499, cat: 't-shirts', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600' },
      { name: 'Alpine Cabin T-Shirt', slug: 'alpine-cabin', price: 499, cat: 't-shirts', img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600' },
      { name: 'Glacier White T-Shirt', slug: 'glacier-white', price: 499, cat: 't-shirts', img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600' },
      { name: 'Peak Seeker Black T-Shirt', slug: 'peak-seeker-black', price: 549, cat: 't-shirts', img: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600' },
      { name: 'Summit Grey T-Shirt', slug: 'summit-grey', price: 499, cat: 't-shirts', img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600' },
      { name: 'Forest Trail Olive T-Shirt', slug: 'forest-trail-olive', price: 529, cat: 't-shirts', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600' },
      { name: 'Alpine Navy T-Shirt', slug: 'alpine-navy', price: 499, cat: 't-shirts', img: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600' },
      { name: 'Misty Morning Cream T-Shirt', slug: 'misty-morning-cream', price: 479, cat: 't-shirts', img: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc942d?w=600' },
      { name: 'Trailblazer Hoodie', slug: 'trailblazer-hoodie', price: 899, cat: 'hoodies', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600' },
      { name: 'Summit Cap', slug: 'summit-cap', price: 299, cat: 'accessories', img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600' },
      { name: 'Canvas Trail Tote', slug: 'canvas-trail-tote', price: 399, cat: 'accessories', img: 'https://images.unsplash.com/photo-1597484661643-2f5fef642dd1?w=600' },
      { name: 'Midnight Black Hoodie', slug: 'midnight-black-hoodie', price: 649, cat: 'hoodies', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600' },
      { name: 'Ridge Runner Heather Tee', slug: 'ridge-runner-heather', price: 449, cat: 't-shirts', img: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600' },
    ];

    for (const p of products) {
      const product = await this.prisma.product.upsert({
        where: { slug: p.slug },
        update: {},
        create: {
          name: p.name, slug: p.slug, description: p.name,
          basePrice: p.price, sku: p.slug.toUpperCase().replace(/-/g, '_'),
          isFeatured: true,
        },
      });
      await this.prisma.productCategory.upsert({
        where: { productId_categoryId: { productId: product.id, categoryId: cats[p.cat].id } },
        update: {},
        create: { productId: product.id, categoryId: cats[p.cat].id },
      });
      await this.prisma.productImage.upsert({
        where: { id: `${product.id}-main` },
        update: {},
        create: { productId: product.id, url: p.img, sortOrder: 0 },
      });
    }

    return { success: true, message: 'Database seeded successfully' };
  }
}
