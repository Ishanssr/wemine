import { PrismaService } from 'nestjs-prisma';
export declare class BlogService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: any): Promise<{
        posts: ({
            author: {
                firstName: string | null;
                lastName: string | null;
                avatarUrl: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            imageUrl: string | null;
            tags: string[];
            title: string;
            excerpt: string | null;
            content: string;
            authorId: string;
            isPublished: boolean;
            publishedAt: Date | null;
        })[];
        pagination: {
            page: any;
            limit: any;
            total: number;
            totalPages: number;
        };
    }>;
    findBySlug(slug: string): Promise<{
        author: {
            firstName: string | null;
            lastName: string | null;
            avatarUrl: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        imageUrl: string | null;
        tags: string[];
        title: string;
        excerpt: string | null;
        content: string;
        authorId: string;
        isPublished: boolean;
        publishedAt: Date | null;
    }>;
    create(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        imageUrl: string | null;
        tags: string[];
        title: string;
        excerpt: string | null;
        content: string;
        authorId: string;
        isPublished: boolean;
        publishedAt: Date | null;
    }>;
}
