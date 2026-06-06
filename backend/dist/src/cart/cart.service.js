"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_prisma_1 = require("nestjs-prisma");
let CartService = class CartService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCart(userId) {
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
    async addItem(userId, productId, variantId, quantity = 1) {
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product || !product.isActive)
            throw new common_1.NotFoundException('Product not found');
        if (variantId) {
            const variant = await this.prisma.productVariant.findUnique({ where: { id: variantId } });
            if (!variant || !variant.isActive)
                throw new common_1.NotFoundException('Variant not found');
            if (variant.stock < quantity)
                throw new common_1.BadRequestException('Insufficient stock');
        }
        let cart = await this.prisma.cart.findUnique({ where: { userId } });
        if (!cart) {
            cart = await this.prisma.cart.create({ data: { userId } });
        }
        const existing = await this.prisma.cartItem.findFirst({
            where: { cartId: cart.id, productId, variantId: variantId ?? null },
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
    async updateItemQuantity(userId, itemId, quantity) {
        const item = await this.prisma.cartItem.findFirst({
            where: { id: itemId, cart: { userId } },
        });
        if (!item)
            throw new common_1.NotFoundException('Cart item not found');
        if (quantity <= 0) {
            return this.removeItem(userId, itemId);
        }
        return this.prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity },
            include: { product: { include: { images: { take: 1 } } }, variant: true },
        });
    }
    async removeItem(userId, itemId) {
        const item = await this.prisma.cartItem.findFirst({
            where: { id: itemId, cart: { userId } },
        });
        if (!item)
            throw new common_1.NotFoundException('Cart item not found');
        return this.prisma.cartItem.delete({ where: { id: itemId } });
    }
    async toggleSaveForLater(userId, itemId) {
        const item = await this.prisma.cartItem.findFirst({
            where: { id: itemId, cart: { userId } },
        });
        if (!item)
            throw new common_1.NotFoundException('Cart item not found');
        return this.prisma.cartItem.update({
            where: { id: itemId },
            data: { savedForLater: !item.savedForLater },
        });
    }
    async clearCart(userId) {
        const cart = await this.prisma.cart.findUnique({ where: { userId } });
        if (cart) {
            await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
    }
    async getCartCount(userId) {
        const cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: { items: { select: { quantity: true } } },
        });
        return cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_prisma_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map