import { Controller, Get } from '@nestjs/common';
import { LoyaltyService } from './loyalty.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('loyalty')
export class LoyaltyController {
  constructor(private loyalty: LoyaltyService) {}

  @Get('points')
  async getPoints(@CurrentUser('id') userId: string) {
    return this.loyalty.getPoints(userId);
  }

  @Get('history')
  async getHistory(@CurrentUser('id') userId: string) {
    return this.loyalty.getHistory(userId);
  }
}
