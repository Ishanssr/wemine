import { CartService } from './cart.service';
export declare class CartController {
    private cart;
    constructor(cart: CartService);
    getCart(userId: string): Promise<{
        items: ({
            product: {
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
            variant: {
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
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            quantity: number;
            savedForLater: boolean;
            cartId: string;
            productId: string;
            variantId: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    getCount(userId: string): Promise<{
        count: number;
    }>;
    addItem(userId: string, body: {
        productId: string;
        variantId?: string;
        quantity?: number;
    }): Promise<{
        product: {
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
        variant: {
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
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        savedForLater: boolean;
        cartId: string;
        productId: string;
        variantId: string | null;
    }>;
    updateItem(userId: string, itemId: string, body: {
        quantity: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        savedForLater: boolean;
        cartId: string;
        productId: string;
        variantId: string | null;
    }>;
    toggleSave(userId: string, itemId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        savedForLater: boolean;
        cartId: string;
        productId: string;
        variantId: string | null;
    }>;
    removeItem(userId: string, itemId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        savedForLater: boolean;
        cartId: string;
        productId: string;
        variantId: string | null;
    }>;
    clearCart(userId: string): Promise<void>;
}
