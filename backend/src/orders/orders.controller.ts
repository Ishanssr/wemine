import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private orders: OrdersService) {}

  @Post()
  async create(@CurrentUser('id') userId: string, @Body() body: any) {
    return this.orders.create(userId, body);
  }

  @Get()
  async findAll(@CurrentUser('id') userId: string, @Query() query: any) {
    return this.orders.findAllByUser(userId, query);
  }

  @Get(':id')
  async findById(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.orders.findById(id, userId);
  }

  @Get('number/:orderNumber')
  async findByOrderNumber(@CurrentUser('id') userId: string, @Param('orderNumber') orderNumber: string) {
    return this.orders.findByOrderNumber(orderNumber, userId);
  }

  @Post(':id/refund')
  async requestRefund(
    @CurrentUser('id') userId: string,
    @Param('id') orderId: string,
    @Body() body: any,
  ) {
    return this.orders.requestRefund(userId, orderId, body);
  }

  @Get('refunds/all')
  async getRefundRequests(@CurrentUser('id') userId: string) {
    return this.orders.getRefundRequests(userId);
  }
}
