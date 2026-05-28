import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('products')
export class ProductsController {
  constructor(private products: ProductsService) {}

  @Public()
  @Get()
  async findAll(@Query() query: any) {
    return this.products.findAll(query);
  }

  @Public()
  @Get('featured')
  async getFeatured() {
    return this.products.getFeatured();
  }

  @Public()
  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.products.findBySlug(slug);
  }

  @Public()
  @Get(':id/related')
  async getRelated(@Param('id') id: string) {
    return this.products.getRelated(id);
  }

  @Roles(Role.ADMIN, Role.VENDOR)
  @Post()
  async create(@Body() body: any) {
    return this.products.create(body);
  }

  @Roles(Role.ADMIN, Role.VENDOR)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.products.update(id, body);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.products.delete(id);
  }
}
