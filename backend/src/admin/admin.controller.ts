import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private admin: AdminService) {}

  @Get('dashboard')
  async getDashboard() {
    return this.admin.getDashboard();
  }

  @Get('users')
  async getUsers(@Query() query: any) {
    return this.admin.getUsers(query);
  }

  @Get('orders')
  async getOrders(@Query() query: any) {
    return this.admin.getAllOrders(query);
  }

  @Put('orders/:id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.admin.updateOrderStatus(id, body.status);
  }

  @Post('refunds/:id/:action')
  async handleRefund(
    @Param('id') id: string,
    @Param('action') action: string,
    @Body() body: { adminNotes?: string },
  ) {
    return this.admin.handleRefund(id, action, body.adminNotes);
  }

  @Put('designs/:id/prebook')
  async toggleDesignPrebook(
    @Param('id') id: string,
    @Body() body: { isPrebook: boolean; prebookPrice?: number },
  ) {
    return this.admin.toggleDesignPrebook(id, body);
  }

  @Post('designs/:id/convert')
  async convertDesignToProduct(
    @Param('id') id: string,
    @Body() body: { name?: string; basePrice?: number },
  ) {
    return this.admin.convertDesignToProduct(id, body);
  }

  @Get('designs')
  async getDesigns(@Query() query: any) {
    return this.admin.getDesigns(query);
  }

  @Post('seed')
  async seed() {
    return this.admin.runSeed();
  }
}
