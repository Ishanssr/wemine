import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { BlogService } from './blog.service';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('blog')
export class BlogController {
  constructor(private blog: BlogService) {}

  @Public()
  @Get()
  async findAll(@Query() query: any) {
    return this.blog.findAll(query);
  }

  @Public()
  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.blog.findBySlug(slug);
  }

  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() body: any) {
    return this.blog.create(body);
  }
}
