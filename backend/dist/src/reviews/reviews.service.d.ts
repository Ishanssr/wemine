import { PrismaService } from 'nestjs-prisma';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, productId: string, data: any): Promise<{
        user: {
            id: string;
            firstName: string | null;
            lastName: string | null;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isFeatured: boolean;
        images: string[];
        productId: string;
        userId: string;
        title: string | null;
        rating: number;
        body: string | null;
        isVerified: boolean;
        helpfulCount: number;
    }>;
    findByProduct(productId: string): Promise<({
        user: {
            id: string;
            firstName: string | null;
            lastName: string | null;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isFeatured: boolean;
        images: string[];
        productId: string;
        userId: string;
        title: string | null;
        rating: number;
        body: string | null;
        isVerified: boolean;
        helpfulCount: number;
    })[]>;
    delete(userId: string, reviewId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isFeatured: boolean;
        images: string[];
        productId: string;
        userId: string;
        title: string | null;
        rating: number;
        body: string | null;
        isVerified: boolean;
        helpfulCount: number;
    }>;
}
