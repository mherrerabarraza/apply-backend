import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../entities/articles/article.entity';
import { HttpService } from '@nestjs/axios';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let repository: Repository<Article>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: getRepositoryToken(Article),
          useValue: {
            createQueryBuilder: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    repository = module.get<Repository<Article>>(getRepositoryToken(Article));
  });

  describe('getArticles', () => {
    it('should return an array of articles', async () => {
      const articles: Article[] = [
        {
          id: 1,
          created_at: new Date(),
          title: 'test title',
          url: 'test url',
          author: 'test author',
          points: 1,
          story_text: 'test story text',
          comment_text: 'test comment text',
          num_comments: 1,
          story_id: 1,
          story_title: 'test story title',
          story_url: 'test story url',
          parent_id: 1,
          created_at_i: 1,
          _tags: [],
          objectID: 'test object id',
          _highlightResult: { test: 'test' },
        },
      ];

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce(articles),
      } as any);

      const result = await service.getArticles();

      expect(repository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(articles);
    });

    it('should return an empty array if no articles match the query', async () => {
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce([]),
      } as any);

      const result = await service.getArticles(1, 5, 'test author');

      expect(repository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
