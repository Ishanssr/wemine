import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviews: ReviewsService) {}

  @Post(':productId')
  async create(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
    @Body() body: any,
  ) {
    return this.reviews.create(userId, productId, body);
  }

  @Public()
  @Get('product/:productId')
  async findByProduct(@Param('productId') productId: string) {
    return this.reviews.findByProduct(productId);
  }

  @Delete(':id')
  async delete(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.reviews.delete(userId, id);
  }
}
