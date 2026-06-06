import { Controller, Get, Delete, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Public()
  @Get()
  async search(@Query() query: any, @CurrentUser('id') userId?: string) {
    return this.searchService.search(query.q, { ...query, userId });
  }

  @Get('recent')
  async getRecent(@CurrentUser('id') userId: string) {
    return this.searchService.getRecentSearches(userId);
  }

  @Delete('history')
  async clearHistory(@CurrentUser('id') userId: string) {
    return this.searchService.clearSearchHistory(userId);
  }
}
