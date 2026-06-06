import { CouponsService } from './coupons.service';
export declare class CouponsController {
    private coupons;
    constructor(coupons: CouponsService);
    validate(body: {
        code: string;
        orderValue: number;
    }, userId: string): Promise<{
        valid: boolean;
        discount: number;
        coupon: {
            code: string;
            discountType: string;
        };
    }>;
    apply(body: {
        code: string;
    }, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        code: string;
        discountType: string;
        discountValue: number;
        minOrderValue: number;
        maxDiscount: number | null;
        usageLimit: number | null;
        usedCount: number;
        perUserLimit: number;
        isGiftCard: boolean;
        startDate: Date;
        endDate: Date;
        userId: string | null;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        code: string;
        discountType: string;
        discountValue: number;
        minOrderValue: number;
        maxDiscount: number | null;
        usageLimit: number | null;
        usedCount: number;
        perUserLimit: number;
        isGiftCard: boolean;
        startDate: Date;
        endDate: Date;
        userId: string | null;
    }[]>;
    create(body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        code: string;
        discountType: string;
        discountValue: number;
        minOrderValue: number;
        maxDiscount: number | null;
        usageLimit: number | null;
        usedCount: number;
        perUserLimit: number;
        isGiftCard: boolean;
        startDate: Date;
        endDate: Date;
        userId: string | null;
    }>;
    update(id: string, body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        code: string;
        discountType: string;
        discountValue: number;
        minOrderValue: number;
        maxDiscount: number | null;
        usageLimit: number | null;
        usedCount: number;
        perUserLimit: number;
        isGiftCard: boolean;
        startDate: Date;
        endDate: Date;
        userId: string | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        code: string;
        discountType: string;
        discountValue: number;
        minOrderValue: number;
        maxDiscount: number | null;
        usageLimit: number | null;
        usedCount: number;
        perUserLimit: number;
        isGiftCard: boolean;
        startDate: Date;
        endDate: Date;
        userId: string | null;
    }>;
}
