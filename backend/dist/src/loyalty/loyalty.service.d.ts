import { PrismaService } from 'nestjs-prisma';
export declare class LoyaltyService {
    private prisma;
    constructor(prisma: PrismaService);
    getPoints(userId: string): Promise<{
        totalPoints: number;
    }>;
    getHistory(userId: string): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        userId: string;
        expiresAt: Date | null;
        type: string;
        points: number;
        reference: string | null;
    }[]>;
    addPoints(userId: string, points: number, type: string, reference?: string): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        userId: string;
        expiresAt: Date | null;
        type: string;
        points: number;
        reference: string | null;
    }>;
}
