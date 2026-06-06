import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private payments;
    constructor(payments: PaymentsService);
    createStripeIntent(userId: string, orderId: string): Promise<{
        clientSecret: any;
        paymentIntentId: any;
    }>;
    stripeWebhook(req: any, sig: string): Promise<void>;
    createRazorpayOrder(userId: string, orderId: string): Promise<{
        razorpayOrderId: any;
        amount: any;
        currency: any;
        key: any;
    }>;
    verifyRazorpay(body: any): Promise<{
        success: boolean;
    }>;
    getConfig(): Promise<{
        stripe: {
            publishableKey: any;
        };
        razorpay: {
            keyId: any;
        };
    }>;
}
