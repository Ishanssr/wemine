import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('coupons')
export class CouponsController {
  constructor(private coupons: CouponsService) {}

  @Post('validate')
  async validate(
    @Body() body: { code: string; orderValue: number },
    @CurrentUser('id') userId: string,
  ) {
    return this.coupons.validate(body.code, userId, body.orderValue);
  }

  @Post('apply')
  async apply(@Body() body: { code: string }, @CurrentUser('id') userId: string) {
    return this.coupons.apply(body.code, userId);
  }

  @Roles(Role.ADMIN)
  @Get()
  async findAll() {
    return this.coupons.findAll();
  }

  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() body: any) {
    return this.coupons.create(body);
  }

  @Roles(Role.ADMIN)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.coupons.update(id, body);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.coupons.delete(id);
  }
}
