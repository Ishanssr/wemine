import { LoyaltyService } from './loyalty.service';
export declare class LoyaltyController {
    private loyalty;
    constructor(loyalty: LoyaltyService);
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
}
