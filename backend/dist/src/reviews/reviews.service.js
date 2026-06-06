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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_prisma_1 = require("nestjs-prisma");
let ReviewsService = class ReviewsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, productId, data) {
        const existing = await this.prisma.review.findUnique({
            where: { userId_productId: { userId, productId } },
        });
        if (existing)
            throw new common_1.BadRequestException('You already reviewed this product');
        const review = await this.prisma.review.create({
            data: { userId, productId, ...data },
            include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
        });
        const stats = await this.prisma.review.aggregate({
            where: { productId },
            _avg: { rating: true },
            _count: true,
        });
        await this.prisma.product.update({
            where: { id: productId },
            data: { avgRating: stats._avg.rating || 0, reviewCount: stats._count },
        });
        return review;
    }
    async findByProduct(productId) {
        return this.prisma.review.findMany({
            where: { productId },
            include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async delete(userId, reviewId) {
        return this.prisma.review.delete({ where: { id: reviewId, userId } });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_prisma_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map