import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'nestjs-prisma';
export declare class PaymentsService {
    private prisma;
    private config;
    private readonly logger;
    private stripe;
    private razorpay;
    constructor(prisma: PrismaService, config: ConfigService);
    createStripePaymentIntent(orderId: string, userId: string): Promise<{
        clientSecret: any;
        paymentIntentId: any;
    }>;
    handleStripeWebhook(payload: any, signature: string): Promise<void>;
    createRazorpayOrder(orderId: string, userId: string): Promise<{
        razorpayOrderId: any;
        amount: any;
        currency: any;
        key: any;
    }>;
    verifyRazorpayPayment(body: any): Promise<{
        success: boolean;
    }>;
    getPaymentConfig(): Promise<{
        stripe: {
            publishableKey: any;
        };
        razorpay: {
            keyId: any;
        };
    }>;
}
