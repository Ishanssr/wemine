import { Controller, Post, Get, Body, Param, Headers, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private payments: PaymentsService) {}

  @Post('stripe/create-intent/:orderId')
  async createStripeIntent(
    @CurrentUser('id') userId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.payments.createStripePaymentIntent(orderId, userId);
  }

  @Public()
  @Post('stripe/webhook')
  async stripeWebhook(@Req() req: any, @Headers('stripe-signature') sig: string) {
    return this.payments.handleStripeWebhook(req.rawBody, sig);
  }

  @Post('razorpay/create-order/:orderId')
  async createRazorpayOrder(
    @CurrentUser('id') userId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.payments.createRazorpayOrder(orderId, userId);
  }

  @Public()
  @Post('razorpay/verify')
  async verifyRazorpay(@Body() body: any) {
    return this.payments.verifyRazorpayPayment(body);
  }

  @Get('config')
  async getConfig() {
    return this.payments.getPaymentConfig();
  }
}
