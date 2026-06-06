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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_prisma_1 = require("nestjs-prisma");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { page = 1, limit = 20, search, category, minPrice, maxPrice, sortBy = 'createdAt', sortOrder = 'desc', tags, featured, vendorId, } = query;
        const where = { isActive: true };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { tags: { hasSome: [search] } },
            ];
        }
        if (category) {
            where.categories = { some: { category: { slug: category } } };
        }
        if (minPrice)
            where.basePrice = { ...where.basePrice, gte: parseFloat(minPrice) };
        if (maxPrice)
            where.basePrice = { ...where.basePrice, lte: parseFloat(maxPrice) };
        if (featured)
            where.isFeatured = true;
        if (vendorId)
            where.vendorId = vendorId;
        if (tags)
            where.tags = { hasSome: Array.isArray(tags) ? tags : [tags] };
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: {
                    images: { orderBy: { sortOrder: 'asc' }, take: 5 },
                    variants: { where: { isActive: true } },
                    categories: { include: { category: true } },
                    reviews: { take: 3, orderBy: { createdAt: 'desc' }, include: { user: true } },
                },
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findBySlug(slug) {
        const product = await this.prisma.product.findUnique({
            where: { slug },
            include: {
                images: { orderBy: { sortOrder: 'asc' } },
                variants: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
                categories: { include: { category: true } },
                reviews: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                    include: { user: true },
                },
                relatedProducts: {
                    include: {
                        related: {
                            include: { images: { take: 1 }, variants: { where: { isActive: true }, take: 1 } },
                        },
                    },
                },
            },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async findById(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                images: true,
                variants: true,
                categories: { include: { category: true } },
            },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async create(data) {
        const { categories, images, variants, ...productData } = data;
        const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return this.prisma.product.create({
            data: {
                ...productData,
                slug,
                categories: categories?.length
                    ? { create: categories.map((catId) => ({ category: { connect: { id: catId } } })) }
                    : undefined,
                images: images?.length
                    ? { create: images.map((img, idx) => ({ ...img, sortOrder: idx })) }
                    : undefined,
                variants: variants?.length
                    ? { create: variants.map((v, idx) => ({ ...v, sortOrder: idx })) }
                    : undefined,
            },
            include: { images: true, variants: true, categories: { include: { category: true } } },
        });
    }
    async update(id, data) {
        await this.findById(id);
        return this.prisma.product.update({
            where: { id },
            data,
            include: { images: true, variants: true, categories: { include: { category: true } } },
        });
    }
    async delete(id) {
        await this.findById(id);
        return this.prisma.product.delete({ where: { id } });
    }
    async getFeatured() {
        return this.prisma.product.findMany({
            where: { isActive: true, isFeatured: true },
            include: { images: { take: 1 }, variants: { where: { isActive: true }, take: 1 } },
            take: 20,
        });
    }
    async getRelated(productId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: {
                categories: true,
                relatedProducts: {
                    include: {
                        related: {
                            include: { images: { take: 1 }, variants: { where: { isActive: true }, take: 1 } },
                        },
                    },
                },
            },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        if (product.relatedProducts.length > 0) {
            return product.relatedProducts.map((rp) => rp.related);
        }
        const categoryIds = product.categories.map((c) => c.categoryId);
        return this.prisma.product.findMany({
            where: {
                isActive: true,
                id: { not: productId },
                categories: { some: { categoryId: { in: categoryIds } } },
            },
            include: { images: { take: 1 }, variants: { where: { isActive: true }, take: 1 } },
            take: 8,
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_prisma_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map