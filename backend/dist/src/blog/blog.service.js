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
exports.BlogService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_prisma_1 = require("nestjs-prisma");
let BlogService = class BlogService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { page = 1, limit = 10, tag } = query;
        const where = { isPublished: true };
        if (tag)
            where.tags = { hasSome: [tag] };
        const [posts, total] = await Promise.all([
            this.prisma.blogPost.findMany({
                where,
                include: { author: { select: { firstName: true, lastName: true, avatarUrl: true } } },
                orderBy: { publishedAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.blogPost.count({ where }),
        ]);
        return { posts, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    async findBySlug(slug) {
        const post = await this.prisma.blogPost.findUnique({
            where: { slug },
            include: { author: { select: { firstName: true, lastName: true, avatarUrl: true } } },
        });
        if (!post)
            throw new common_1.NotFoundException('Post not found');
        return post;
    }
    async create(data) {
        const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return this.prisma.blogPost.create({
            data: { ...data, slug, publishedAt: data.isPublished ? new Date() : null },
        });
    }
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_prisma_1.PrismaService])
], BlogService);
//# sourceMappingURL=blog.service.js.map