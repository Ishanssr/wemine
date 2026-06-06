import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private reviews;
    constructor(reviews: ReviewsService);
    create(userId: string, productId: string, body: any): Promise<{
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
    delete(userId: string, id: string): Promise<{
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
