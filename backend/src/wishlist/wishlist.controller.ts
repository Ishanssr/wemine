import { Controller, Get, Post, Delete, Param } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('wishlist')
export class WishlistController {
  constructor(private wishlist: WishlistService) {}

  @Get()
  async getWishlist(@CurrentUser('id') userId: string) {
    return this.wishlist.getWishlist(userId);
  }

  @Post(':productId')
  async addItem(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.wishlist.addItem(userId, productId);
  }

  @Delete(':productId')
  async removeItem(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.wishlist.removeItem(userId, productId);
  }

  @Get('check/:productId')
  async checkItem(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.wishlist.checkItem(userId, productId);
  }
}
