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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_prisma_1 = require("nestjs-prisma");
let CategoriesService = class CategoriesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.category.findMany({
            where: { isActive: true },
            include: { children: true, _count: { select: { products: true } } },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async findBySlug(slug) {
        return this.prisma.category.findUnique({
            where: { slug },
            include: {
                children: { where: { isActive: true } },
                parent: true,
                products: {
                    include: { product: { include: { images: { take: 1 }, variants: { where: { isActive: true }, take: 1 } } } },
                },
            },
        });
    }
    async create(data) {
        const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return this.prisma.category.create({ data: { ...data, slug } });
    }
    async update(id, data) {
        return this.prisma.category.update({ where: { id }, data });
    }
    async delete(id) {
        return this.prisma.category.delete({ where: { id } });
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_prisma_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map