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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_prisma_1 = require("nestjs-prisma");
let OrdersService = class OrdersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, data) {
        const cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { product: { include: { images: true } }, variant: true },
                    where: { savedForLater: false },
                },
            },
        });
        if (!cart?.items.length)
            throw new common_1.NotFoundException('Cart is empty');
        const subtotal = cart.items.reduce((sum, item) => sum + (item.variant?.price || item.product.basePrice) * item.quantity, 0);
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
    async findAllByUser(userId, query) {
        const { page = 1, limit = 10, status } = query;
        const where = { userId };
        if (status)
            where.status = status;
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
    async findById(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                items: { include: { product: { include: { images: true } } } },
                shippingAddress: true,
                billingAddress: true,
                refundRequests: true,
            },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async findByOrderNumber(orderNumber) {
        const order = await this.prisma.order.findUnique({
            where: { orderNumber },
            include: {
                items: { include: { product: { include: { images: true } } } },
                shippingAddress: true,
            },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async updateStatus(id, status) {
        const order = await this.findById(id);
        return this.prisma.order.update({
            where: { id },
            data: {
                status,
                ...(status === 'DELIVERED' ? { deliveredAt: new Date() } : {}),
            },
        });
    }
    async updatePaymentStatus(id, paymentStatus, paymentData) {
        return this.prisma.order.update({
            where: { id },
            data: { paymentStatus, ...paymentData },
        });
    }
    async requestRefund(userId, orderId, data) {
        const order = await this.prisma.order.findFirst({
            where: { id: orderId, userId },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return this.prisma.refundRequest.create({
            data: {
                orderId,
                userId,
                reason: data.reason,
                details: data.details,
            },
        });
    }
    async getRefundRequests(userId) {
        return this.prisma.refundRequest.findMany({
            where: { userId },
            include: { order: true },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_prisma_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map