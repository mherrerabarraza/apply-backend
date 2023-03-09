import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosError, AxiosResponse } from 'axios';
import { catchError, lastValueFrom, Observable } from 'rxjs';
import { Article } from 'src/entities/articles/article.entity';
import { Repository } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export type User = any;

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private readonly httpService: HttpService,
  ) {}

  private readonly users = [
    {
      userId: 1,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async getRecentArticles(): Promise<Article[]> {
    const response = await lastValueFrom(
      this.httpService
        .get('https://hn.algolia.com/api/v1/search_by_date?query=nodejs')
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.message);
            return new Observable<AxiosResponse<Article[]>>();
          }),
        ),
    );

    const articles = response.data.hits.map((hit: any) => {
      const article = new Article();
      article.title = hit.title;
      article.url = hit.url;
      article.author = hit.author;
      article.created_at = hit.created_at;
      article.story_id = hit.story_id;
      article.story_title = hit.story_title;
      article.story_url = hit.story_url;
      article.comment_text = hit.comment_text;
      article.num_comments = hit.num_comments;
      article.parent_id = hit.parent_id;
      article._tags = hit._tags;
      article._highlightResult = hit._highlightResult;
      return article;
    });
    return articles;
  }

  private async saveArticles(articles: Article[]): Promise<Article[]> {
    return this.articleRepository.save(articles);
  }

  @Cron(CronExpression.EVERY_HOUR, {
    name: 'scheduleArticlesUpdate',
    timeZone: 'America/Santiago',
  })
  async scheduleArticlesUpdate(): Promise<void> {
    this.logger.debug('Called every hour');
    this.logger.debug('Getting recent articles');
    const articles = await this.getRecentArticles();
    this.logger.debug('Saving articles');
    //save articles to database
    await this.saveArticles(articles);
    this.logger.debug('Articles saved');
  }

  async deleteArticle(id: number): Promise<void> {
    const article = await this.articleRepository.findOneBy({ id: id });
    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }
    await this.articleRepository.delete(id);
  }

  async getArticles(
    page = 1,
    limit = 5,
    author?: string,
    tags?: string[],
    title?: string,
    month?: string,
  ): Promise<Article[]> {
    let query = this.articleRepository
      .createQueryBuilder('article')
      .orderBy('article.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    switch (true) {
      case Boolean(author):
        query = query.andWhere('article.author = :author', { author });
        break;
      case Boolean(tags):
        query = query.andWhere(`article._tags && :tags`, { tags });
        break;
      case Boolean(title):
        query = query.andWhere(`article.title ILIKE :title`, {
          title: `%${title}%`,
        });
        break;
      case Boolean(month):
        query = query.andWhere(
          `to_char(article.created_at, 'Month') ILIKE :month`,
          {
            month: `%${month}%`,
          },
        );
        break;
      default:
        break;
    }

    return await query.getMany();
  }
}
