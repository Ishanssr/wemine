import { BlogService } from './blog.service';
export declare class BlogController {
    private blog;
    constructor(blog: BlogService);
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
    create(body: any): Promise<{
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
