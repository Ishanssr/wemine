import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { CartService } from './cart.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('cart')
export class CartController {
  constructor(private cart: CartService) {}

  @Get()
  async getCart(@CurrentUser('id') userId: string) {
    return this.cart.getCart(userId);
  }

  @Get('count')
  async getCount(@CurrentUser('id') userId: string) {
    return { count: await this.cart.getCartCount(userId) };
  }

  @Post('items')
  async addItem(
    @CurrentUser('id') userId: string,
    @Body() body: { productId: string; variantId?: string; quantity?: number },
  ) {
    return this.cart.addItem(userId, body.productId, body.variantId, body.quantity);
  }

  @Patch('items/:id')
  async updateItem(
    @CurrentUser('id') userId: string,
    @Param('id') itemId: string,
    @Body() body: { quantity: number },
  ) {
    return this.cart.updateItemQuantity(userId, itemId, body.quantity);
  }

  @Patch('items/:id/save')
  async toggleSave(
    @CurrentUser('id') userId: string,
    @Param('id') itemId: string,
  ) {
    return this.cart.toggleSaveForLater(userId, itemId);
  }

  @Delete('items/:id')
  async removeItem(
    @CurrentUser('id') userId: string,
    @Param('id') itemId: string,
  ) {
    return this.cart.removeItem(userId, itemId);
  }

  @Delete()
  async clearCart(@CurrentUser('id') userId: string) {
    return this.cart.clearCart(userId);
  }
}
