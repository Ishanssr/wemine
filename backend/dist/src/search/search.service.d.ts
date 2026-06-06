import { PrismaService } from 'nestjs-prisma';
export declare class SearchService {
    private prisma;
    constructor(prisma: PrismaService);
    search(query: string, filters: any): Promise<{
        products: ({
            categories: ({
                category: {
                    name: string;
                    slug: string;
                };
            } & {
                categoryId: string;
                productId: string;
            })[];
            variants: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
                sortOrder: number;
                sku: string;
                size: string | null;
                color: string | null;
                colorHex: string | null;
                price: number | null;
                stock: number;
                productId: string;
            }[];
            images: {
                id: string;
                createdAt: Date;
                sortOrder: number;
                url: string;
                altText: string | null;
                width: number | null;
                height: number | null;
                isPrimary: boolean;
                productId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string;
            isActive: boolean;
            comparePrice: number | null;
            isFeatured: boolean;
            shortDesc: string | null;
            basePrice: number;
            sku: string;
            tags: string[];
            totalStock: number;
            costPrice: number | null;
            barcode: string | null;
            weight: number | null;
            isBundle: boolean;
            allowBackorder: boolean;
            seoTitle: string | null;
            seoDesc: string | null;
            material: string | null;
            careInstructions: string | null;
            metaData: import("@prisma/client/runtime/library").JsonValue | null;
            reservedStock: number;
            soldCount: number;
            avgRating: number;
            reviewCount: number;
            vendorId: string | null;
        })[];
        total: number;
        hasMore: boolean;
        results: ({
            categories: ({
                category: {
                    name: string;
                    slug: string;
                };
            } & {
                categoryId: string;
                productId: string;
            })[];
            variants: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
                sortOrder: number;
                sku: string;
                size: string | null;
                color: string | null;
                colorHex: string | null;
                price: number | null;
                stock: number;
                productId: string;
            }[];
            images: {
                id: string;
                createdAt: Date;
                sortOrder: number;
                url: string;
                altText: string | null;
                width: number | null;
                height: number | null;
                isPrimary: boolean;
                productId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string;
            isActive: boolean;
            comparePrice: number | null;
            isFeatured: boolean;
            shortDesc: string | null;
            basePrice: number;
            sku: string;
            tags: string[];
            totalStock: number;
            costPrice: number | null;
            barcode: string | null;
            weight: number | null;
            isBundle: boolean;
            allowBackorder: boolean;
            seoTitle: string | null;
            seoDesc: string | null;
            material: string | null;
            careInstructions: string | null;
            metaData: import("@prisma/client/runtime/library").JsonValue | null;
            reservedStock: number;
            soldCount: number;
            avgRating: number;
            reviewCount: number;
            vendorId: string | null;
        })[];
        suggestions: string[];
    }>;
    getSuggestions(query: string): Promise<string[]>;
    getRecentSearches(userId: string): Promise<string[]>;
    clearSearchHistory(userId: string): Promise<void>;
}
