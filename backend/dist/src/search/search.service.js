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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_prisma_1 = require("nestjs-prisma");
let SearchService = class SearchService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async search(query, filters) {
        const { page = 1, limit = 20, category, minPrice, maxPrice, sortBy = 'relevance', sizes, colors, } = filters;
        const where = {
            isActive: true,
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { tags: { hasSome: [query] } },
            ],
        };
        if (category)
            where.categories = { some: { category: { slug: category } } };
        if (minPrice)
            where.basePrice = { ...where.basePrice, gte: parseFloat(minPrice) };
        if (maxPrice)
            where.basePrice = { ...where.basePrice, lte: parseFloat(maxPrice) };
        if (sizes)
            where.variants = { some: { size: { in: Array.isArray(sizes) ? sizes : [sizes] } } };
        if (colors)
            where.variants = { ...where.variants, some: { color: { in: Array.isArray(colors) ? colors : [colors] } } };
        const orderBy = sortBy === 'price_asc'
            ? { basePrice: 'asc' }
            : sortBy === 'price_desc'
                ? { basePrice: 'desc' }
                : sortBy === 'newest'
                    ? { createdAt: 'desc' }
                    : sortBy === 'rating'
                        ? { avgRating: 'desc' }
                        : sortBy === 'popular'
                            ? { soldCount: 'desc' }
                            : [{ isFeatured: 'desc' }, { createdAt: 'desc' }];
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: {
                    images: { take: 1, where: { isPrimary: true } },
                    variants: { where: { isActive: true }, take: 3 },
                    categories: { include: { category: { select: { name: true, slug: true } } } },
                },
                orderBy,
                skip: (page - 1) * limit,
                take: limit + 1,
            }),
            this.prisma.product.count({ where }),
        ]);
        if (query) {
            await this.prisma.searchHistory.create({
                data: { query, userId: filters.userId },
            }).catch(() => { });
        }
        return {
            products,
            total,
            hasMore: products.length > limit,
            results: products.slice(0, limit),
            suggestions: await this.getSuggestions(query),
        };
    }
    async getSuggestions(query) {
        const products = await this.prisma.product.findMany({
            where: {
                isActive: true,
                name: { contains: query, mode: 'insensitive' },
            },
            select: { name: true, slug: true },
            take: 5,
        });
        return products.map((p) => p.name);
    }
    async getRecentSearches(userId) {
        const history = await this.prisma.searchHistory.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 10,
            distinct: ['query'],
        });
        return history.map((h) => h.query);
    }
    async clearSearchHistory(userId) {
        await this.prisma.searchHistory.deleteMany({ where: { userId } });
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_prisma_1.PrismaService])
], SearchService);
//# sourceMappingURL=search.service.js.map