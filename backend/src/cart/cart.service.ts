import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { images: { take: 1, where: { isPrimary: true } } },
            },
            variant: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: { items: { include: { product: { include: { images: { take: 1 } } }, variant: true } } },
      });
    }

    return cart;
  }

  async addItem(userId: string, productId: string, variantId?: string, quantity = 1) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.isActive) throw new NotFoundException('Product not found');

    if (variantId) {
      const variant = await this.prisma.productVariant.findUnique({ where: { id: variantId } });
      if (!variant || !variant.isActive) throw new NotFoundException('Variant not found');
      if (variant.stock < quantity) throw new BadRequestException('Insufficient stock');
    }

    let cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await this.prisma.cart.create({ data: { userId } });
    }

    const existing = await this.prisma.cartItem.findUnique({
      where: { cartId_productId_variantId: { cartId: cart.id, productId, variantId: variantId || null } },
    });

    if (existing) {
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { product: { include: { images: { take: 1 } } }, variant: true },
      });
    }

    return this.prisma.cartItem.create({
      data: { cartId: cart.id, productId, variantId: variantId || null, quantity },
      include: { product: { include: { images: { take: 1 } } }, variant: true },
    });
  }

  async updateItemQuantity(userId: string, itemId: string, quantity: number) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cart: { userId } },
    });
    if (!item) throw new NotFoundException('Cart item not found');

    if (quantity <= 0) {
      return this.removeItem(userId, itemId);
    }

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { product: { include: { images: { take: 1 } } }, variant: true },
    });
  }

  async removeItem(userId: string, itemId: string) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cart: { userId } },
    });
    if (!item) throw new NotFoundException('Cart item not found');
    return this.prisma.cartItem.delete({ where: { id: itemId } });
  }

  async toggleSaveForLater(userId: string, itemId: string) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cart: { userId } },
    });
    if (!item) throw new NotFoundException('Cart item not found');
    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { savedForLater: !item.savedForLater },
    });
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
  }

  async getCartCount(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { select: { quantity: true } } },
    });
    return cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }
}
