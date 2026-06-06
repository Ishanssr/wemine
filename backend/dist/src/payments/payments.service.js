"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nestjs_prisma_1 = require("nestjs-prisma");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
        this.logger = new common_1.Logger(PaymentsService_1.name);
        if (this.config.get('STRIPE_SECRET_KEY')) {
            this.stripe = require('stripe')(this.config.get('STRIPE_SECRET_KEY'));
        }
        if (this.config.get('RAZORPAY_KEY_ID') && this.config.get('RAZORPAY_KEY_SECRET')) {
            this.razorpay = new (require('razorpay'))({
                key_id: this.config.get('RAZORPAY_KEY_ID'),
                key_secret: this.config.get('RAZORPAY_KEY_SECRET'),
            });
        }
    }
    async createStripePaymentIntent(orderId, userId) {
        const order = await this.prisma.order.findFirst({
            where: { id: orderId, userId },
        });
        if (!order)
            throw new common_1.BadRequestException('Order not found');
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: Math.round(order.total * 100),
            currency: 'inr',
            metadata: { orderId: order.id, orderNumber: order.orderNumber },
        });
        await this.prisma.order.update({
            where: { id: orderId },
            data: { stripePaymentIntentId: paymentIntent.id },
        });
        return { clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id };
    }
    async handleStripeWebhook(payload, signature) {
        const webhookSecret = this.config.get('STRIPE_WEBHOOK_SECRET');
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
        }
        catch (err) {
            throw new common_1.BadRequestException('Invalid webhook signature');
        }
        if (event.type === 'payment_intent.succeeded') {
            const { orderId } = event.data.object.metadata;
            await this.prisma.order.update({
                where: { id: orderId },
                data: {
                    paymentStatus: 'SUCCESSFUL',
                    paidAmount: event.data.object.amount / 100,
                    status: 'CONFIRMED',
                },
            });
        }
        if (event.type === 'payment_intent.payment_failed') {
            const { orderId } = event.data.object.metadata;
            await this.prisma.order.update({
                where: { id: orderId },
                data: { paymentStatus: 'FAILED' },
            });
        }
    }
    async createRazorpayOrder(orderId, userId) {
        const order = await this.prisma.order.findFirst({
            where: { id: orderId, userId },
        });
        if (!order)
            throw new common_1.BadRequestException('Order not found');
        const razorpayOrder = await this.razorpay.orders.create({
            amount: Math.round(order.total * 100),
            currency: 'INR',
            receipt: order.orderNumber,
        });
        await this.prisma.order.update({
            where: { id: orderId },
            data: { razorpayOrderId: razorpayOrder.id },
        });
        return {
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: this.config.get('RAZORPAY_KEY_ID'),
        };
    }
    async verifyRazorpayPayment(body) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
        const crypto = require('crypto');
        const expected = crypto
            .createHmac('sha256', this.config.get('RAZORPAY_KEY_SECRET'))
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');
        if (expected !== razorpay_signature) {
            throw new common_1.BadRequestException('Invalid payment signature');
        }
        await this.prisma.order.updateMany({
            where: { razorpayOrderId: razorpay_order_id },
            data: {
                paymentStatus: 'SUCCESSFUL',
                status: 'CONFIRMED',
            },
        });
        return { success: true };
    }
    async getPaymentConfig() {
        return {
            stripe: { publishableKey: this.config.get('STRIPE_PUBLISHABLE_KEY') },
            razorpay: { keyId: this.config.get('RAZORPAY_KEY_ID') },
        };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_prisma_1.PrismaService,
        config_1.ConfigService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map