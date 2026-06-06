import { PrismaService } from 'nestjs-prisma';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboard(): Promise<{
        stats: {
            totalUsers: number;
            totalOrders: number;
            totalRevenue: number;
            totalProducts: number;
        };
        ordersByStatus: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.OrderGroupByOutputType, "status"[]> & {
            _count: number;
        })[];
        revenueByDay: unknown;
        recentOrders: ({
            user: {
                email: string;
                firstName: string | null;
                lastName: string | null;
            };
            items: {
                id: string;
                createdAt: Date;
                name: string;
                imageUrl: string | null;
                sku: string;
                price: number;
                quantity: number;
                productId: string;
                variantId: string | null;
                total: number;
                orderId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            total: number;
            userId: string;
            orderNumber: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod | null;
            subtotal: number;
            shippingCost: number;
            taxAmount: number;
            discountAmount: number;
            couponCode: string | null;
            currency: string;
            paidAmount: number | null;
            notes: string | null;
            invoiceUrl: string | null;
            trackingNumber: string | null;
            courierName: string | null;
            deliveryEstimate: Date | null;
            deliveredAt: Date | null;
            refundAmount: number | null;
            refundReason: string | null;
            stripePaymentIntentId: string | null;
            razorpayOrderId: string | null;
            paypalOrderId: string | null;
            shippingAddressId: string | null;
            billingAddressId: string | null;
        })[];
    }>;
    getUsers(query: any): Promise<{
        users: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
            role: import(".prisma/client").$Enums.Role;
            isEmailVerified: boolean;
            lastLoginAt: Date | null;
            createdAt: Date;
            _count: {
                orders: number;
            };
        }[];
        pagination: {
            page: any;
            limit: any;
            total: number;
            totalPages: number;
        };
    }>;
    getAllOrders(query: any): Promise<{
        orders: ({
            user: {
                email: string;
                firstName: string | null;
                lastName: string | null;
            };
            items: {
                id: string;
                createdAt: Date;
                name: string;
                imageUrl: string | null;
                sku: string;
                price: number;
                quantity: number;
                productId: string;
                variantId: string | null;
                total: number;
                orderId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            total: number;
            userId: string;
            orderNumber: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod | null;
            subtotal: number;
            shippingCost: number;
            taxAmount: number;
            discountAmount: number;
            couponCode: string | null;
            currency: string;
            paidAmount: number | null;
            notes: string | null;
            invoiceUrl: string | null;
            trackingNumber: string | null;
            courierName: string | null;
            deliveryEstimate: Date | null;
            deliveredAt: Date | null;
            refundAmount: number | null;
            refundReason: string | null;
            stripePaymentIntentId: string | null;
            razorpayOrderId: string | null;
            paypalOrderId: string | null;
            shippingAddressId: string | null;
            billingAddressId: string | null;
        })[];
        pagination: {
            page: any;
            limit: any;
            total: number;
            totalPages: number;
        };
    }>;
    updateOrderStatus(id: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        total: number;
        userId: string;
        orderNumber: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod | null;
        subtotal: number;
        shippingCost: number;
        taxAmount: number;
        discountAmount: number;
        couponCode: string | null;
        currency: string;
        paidAmount: number | null;
        notes: string | null;
        invoiceUrl: string | null;
        trackingNumber: string | null;
        courierName: string | null;
        deliveryEstimate: Date | null;
        deliveredAt: Date | null;
        refundAmount: number | null;
        refundReason: string | null;
        stripePaymentIntentId: string | null;
        razorpayOrderId: string | null;
        paypalOrderId: string | null;
        shippingAddressId: string | null;
        billingAddressId: string | null;
    }>;
    handleRefund(refundId: string, action: string, adminNotes?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        orderId: string;
        userId: string;
        status: string;
        refundAmount: number | null;
        reason: string;
        details: string | null;
        adminNotes: string | null;
        processedAt: Date | null;
    }>;
}
