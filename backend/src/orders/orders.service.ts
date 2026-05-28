import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: any) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true, variant: true },
          where: { savedForLater: false },
        },
      },
    });

    if (!cart?.items.length) throw new NotFoundException('Cart is empty');

    const subtotal = cart.items.reduce(
      (sum, item) => sum + (item.variant?.price || item.product.basePrice) * item.quantity,
      0,
    );

    const orderNumber = `WM-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        userId,
        subtotal,
        shippingCost: data.shippingCost || 0,
        taxAmount: data.taxAmount || 0,
        discountAmount: data.discountAmount || 0,
        total: subtotal + (data.shippingCost || 0) + (data.taxAmount || 0) - (data.discountAmount || 0),
        shippingAddressId: data.shippingAddressId,
        billingAddressId: data.billingAddressId,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            name: item.product.name,
            sku: item.variant?.sku || item.product.sku,
            price: item.variant?.price || item.product.basePrice,
            quantity: item.quantity,
            total: (item.variant?.price || item.product.basePrice) * item.quantity,
            imageUrl: item.product.images?.[0]?.url,
          })),
        },
      },
      include: { items: true, shippingAddress: true },
    });

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id, savedForLater: false },
    });

    return order;
  }

  async findAllByUser(userId: string, query: any) {
    const { page = 1, limit = 10, status } = query;
    const where: any = { userId };
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: { items: { include: { product: { include: { images: { take: 1 } } } } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: { include: { images: true } } } },
        shippingAddress: true,
        billingAddress: true,
        refundRequests: true,
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findByOrderNumber(orderNumber: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: { include: { product: { include: { images: true } } } },
        shippingAddress: true,
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.findById(id);
    return this.prisma.order.update({
      where: { id },
      data: {
        status,
        ...(status === 'DELIVERED' ? { deliveredAt: new Date() } : {}),
      },
    });
  }

  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus, paymentData?: any) {
    return this.prisma.order.update({
      where: { id },
      data: { paymentStatus, ...paymentData },
    });
  }

  async requestRefund(userId: string, orderId: string, data: any) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });
    if (!order) throw new NotFoundException('Order not found');

    return this.prisma.refundRequest.create({
      data: {
        orderId,
        userId,
        reason: data.reason,
        details: data.details,
      },
    });
  }

  async getRefundRequests(userId: string) {
    return this.prisma.refundRequest.findMany({
      where: { userId },
      include: { order: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
