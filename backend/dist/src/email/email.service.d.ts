import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private config;
    private readonly logger;
    private transporter;
    constructor(config: ConfigService);
    sendOtpEmail(email: string, otp: string): Promise<void>;
    sendPasswordResetEmail(email: string, resetUrl: string): Promise<void>;
    sendOrderConfirmation(email: string, orderNumber: string, items: any[], total: number): Promise<void>;
    sendShippingUpdate(email: string, orderNumber: string, trackingNumber: string): Promise<void>;
    sendWelcomeEmail(email: string, name: string): Promise<void>;
    private sendEmail;
    private template;
}
