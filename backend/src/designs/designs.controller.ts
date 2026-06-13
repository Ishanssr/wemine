import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { DesignsService } from './designs.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('designs')
export class DesignsController {
  constructor(private designs: DesignsService) {}

  @Public()
  @Get()
  async findAll(@Query() query: any) {
    return this.designs.findAll(query);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.designs.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() body: any, @CurrentUser('id') userId: string) {
    return this.designs.create(body, userId);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.designs.remove(id);
  }

  @Post(':id/rate')
  async rate(
    @Param('id') id: string,
    @Body() body: { score: number; comment?: string },
    @CurrentUser('id') userId: string,
  ) {
    return this.designs.rate(id, userId, body.score, body.comment);
  }
}
