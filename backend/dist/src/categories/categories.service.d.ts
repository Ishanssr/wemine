import { PrismaService } from 'nestjs-prisma';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        children: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
            imageUrl: string | null;
            parentId: string | null;
            isActive: boolean;
            sortOrder: number;
        }[];
        _count: {
            products: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string | null;
        imageUrl: string | null;
        parentId: string | null;
        isActive: boolean;
        sortOrder: number;
    })[]>;
    findBySlug(slug: string): Promise<({
        parent: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
            imageUrl: string | null;
            parentId: string | null;
            isActive: boolean;
            sortOrder: number;
        } | null;
        children: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
            imageUrl: string | null;
            parentId: string | null;
            isActive: boolean;
            sortOrder: number;
        }[];
        products: ({
            product: {
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
            };
        } & {
            categoryId: string;
            productId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string | null;
        imageUrl: string | null;
        parentId: string | null;
        isActive: boolean;
        sortOrder: number;
    }) | null>;
    create(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string | null;
        imageUrl: string | null;
        parentId: string | null;
        isActive: boolean;
        sortOrder: number;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string | null;
        imageUrl: string | null;
        parentId: string | null;
        isActive: boolean;
        sortOrder: number;
    }>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string | null;
        imageUrl: string | null;
        parentId: string | null;
        isActive: boolean;
        sortOrder: number;
    }>;
}
