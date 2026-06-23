import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get('prebooks')
  async getPrebooks(@CurrentUser('id') userId: string) {
    return this.users.getPrebooks(userId);
  }

  @Get('addresses')
  async getAddresses(@CurrentUser('id') userId: string) {
    return this.users.getAddresses(userId);
  }

  @Post('addresses')
  async addAddress(@CurrentUser('id') userId: string, @Body() body: any) {
    return this.users.addAddress(userId, body);
  }

  @Patch('addresses/:id')
  async updateAddress(
    @CurrentUser('id') userId: string,
    @Param('id') addressId: string,
    @Body() body: any,
  ) {
    return this.users.updateAddress(userId, addressId, body);
  }

  @Delete('addresses/:id')
  async deleteAddress(
    @CurrentUser('id') userId: string,
    @Param('id') addressId: string,
  ) {
    return this.users.deleteAddress(userId, addressId);
  }
}
