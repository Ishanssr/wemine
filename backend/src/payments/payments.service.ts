import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'nestjs-prisma';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private stripe: any;
  private razorpay: any;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
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

  async createStripePaymentIntent(orderId: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });
    if (!order) throw new BadRequestException('Order not found');

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

  async handleStripeWebhook(payload: any, signature: string) {
    const webhookSecret = this.config.get('STRIPE_WEBHOOK_SECRET');
    let event;
    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      throw new BadRequestException('Invalid webhook signature');
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

  async createRazorpayOrder(orderId: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });
    if (!order) throw new BadRequestException('Order not found');

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

  async verifyRazorpayPayment(body: any) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
    const crypto = require('crypto');
    const expected = crypto
      .createHmac('sha256', this.config.get('RAZORPAY_KEY_SECRET'))
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expected !== razorpay_signature) {
      throw new BadRequestException('Invalid payment signature');
    }

    await this.prisma.order.update({
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
}
