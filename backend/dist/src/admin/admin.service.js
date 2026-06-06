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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_prisma_1 = require("nestjs-prisma");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboard() {
        const [totalUsers, totalOrders, totalRevenue, totalProducts, recentOrders] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.order.count(),
            this.prisma.order.aggregate({ _sum: { total: true } }),
            this.prisma.product.count({ where: { isActive: true } }),
            this.prisma.order.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { firstName: true, lastName: true, email: true } },
                    items: true,
                },
            }),
        ]);
        const ordersByStatus = await this.prisma.order.groupBy({
            by: ['status'],
            _count: true,
        });
        const revenueByDay = await this.prisma.$queryRaw `
      SELECT DATE(created_at) as date, SUM(total) as revenue
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '30 days'
      AND payment_status = 'SUCCESSFUL'
      GROUP BY DATE(created_at)
      ORDER BY date
    `;
        return {
            stats: {
                totalUsers,
                totalOrders,
                totalRevenue: totalRevenue._sum.total || 0,
                totalProducts,
            },
            ordersByStatus,
            revenueByDay,
            recentOrders,
        };
    }
    async getUsers(query) {
        const { page = 1, limit = 20, search, role } = query;
        const where = {};
        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (role)
            where.role = role;
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                select: {
                    id: true, email: true, firstName: true, lastName: true, role: true,
                    isEmailVerified: true, createdAt: true, lastLoginAt: true,
                    _count: { select: { orders: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.user.count({ where }),
        ]);
        return { users, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    async getAllOrders(query) {
        const { page = 1, limit = 20, status, paymentStatus } = query;
        const where = {};
        if (status)
            where.status = status;
        if (paymentStatus)
            where.paymentStatus = paymentStatus;
        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                include: {
                    user: { select: { firstName: true, lastName: true, email: true } },
                    items: true,
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.order.count({ where }),
        ]);
        return { orders, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    async updateOrderStatus(id, status) {
        return this.prisma.order.update({
            where: { id },
            data: { status: status, ...(status === 'DELIVERED' ? { deliveredAt: new Date() } : {}) },
        });
    }
    async handleRefund(refundId, action, adminNotes) {
        const refund = await this.prisma.refundRequest.findUnique({
            where: { id: refundId },
            include: { order: true },
        });
        if (!refund)
            throw new Error('Refund request not found');
        if (action === 'approve') {
            await this.prisma.order.update({
                where: { id: refund.orderId },
                data: { status: 'REFUNDED', refundAmount: refund.refundAmount || refund.order.total },
            });
        }
        return this.prisma.refundRequest.update({
            where: { id: refundId },
            data: { status: action === 'approve' ? 'APPROVED' : 'REJECTED', adminNotes },
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_prisma_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map