import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Article } from 'src/entities/articles/article.entity';
import { ArticlesService } from './articles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post('simulatecron')
  simulateCron(): Promise<void> {
    return this.articlesService.scheduleArticlesUpdate();
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('recent')
  getRecentArticles(): Promise<Article[]> {
    return this.articlesService.getRecentArticles();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiQuery({ name: 'author', required: false })
  @ApiQuery({ name: '_tags', required: false })
  @ApiQuery({ name: 'title', required: false })
  @ApiQuery({ name: 'month', required: false })
  async getArticles(
    @Query('page') page = 1,
    @Query('limit') limit = 5,
    @Query('author') author?: string,
    @Query('_tags') tags?: string,
    @Query('title') title?: string,
    @Query('month') month?: string,
  ): Promise<Article[]> {
    const parsedTags = tags ? tags.split(',') : undefined;

    return this.articlesService.getArticles(
      page,
      limit,
      author,
      parsedTags,
      title,
      month,
    );
  }
  @Delete(':id')
  async deleteArticle(@Param('id') id: number) {
    return this.articlesService.deleteArticle(id);
  }
}
