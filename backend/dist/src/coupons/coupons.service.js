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
exports.CouponsService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_prisma_1 = require("nestjs-prisma");
let CouponsService = class CouponsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validate(code, userId, orderValue) {
        const coupon = await this.prisma.coupon.findUnique({ where: { code } });
        if (!coupon || !coupon.isActive)
            throw new common_1.BadRequestException('Invalid coupon');
        if (coupon.endDate < new Date() || coupon.startDate > new Date()) {
            throw new common_1.BadRequestException('Coupon expired');
        }
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            throw new common_1.BadRequestException('Coupon usage limit reached');
        }
        if (orderValue < coupon.minOrderValue) {
            throw new common_1.BadRequestException(`Minimum order value of ₹${coupon.minOrderValue} required`);
        }
        let discount = 0;
        if (coupon.discountType === 'PERCENTAGE') {
            discount = (orderValue * coupon.discountValue) / 100;
            if (coupon.maxDiscount)
                discount = Math.min(discount, coupon.maxDiscount);
        }
        else {
            discount = coupon.discountValue;
        }
        if (userId && coupon.perUserLimit) {
            const userOrders = await this.prisma.order.count({
                where: { userId, couponCode: code },
            });
            if (userOrders >= coupon.perUserLimit) {
                throw new common_1.BadRequestException('Coupon already used');
            }
        }
        return { valid: true, discount, coupon: { code: coupon.code, discountType: coupon.discountType } };
    }
    async apply(code, userId) {
        const coupon = await this.prisma.coupon.findUnique({ where: { code } });
        if (!coupon)
            throw new common_1.BadRequestException('Invalid coupon');
        await this.prisma.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } },
        });
        return coupon;
    }
    async findAll() {
        return this.prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    }
    async create(data) {
        return this.prisma.coupon.create({ data });
    }
    async update(id, data) {
        return this.prisma.coupon.update({ where: { id }, data });
    }
    async delete(id) {
        return this.prisma.coupon.delete({ where: { id } });
    }
};
exports.CouponsService = CouponsService;
exports.CouponsService = CouponsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_prisma_1.PrismaService])
], CouponsService);
//# sourceMappingURL=coupons.service.js.map