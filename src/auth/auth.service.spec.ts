import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { ArticlesService } from '../articles/articles.service';

describe('AuthService', () => {
  let authService: AuthService;
  let articlesService: ArticlesService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ArticlesService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    articlesService = module.get<ArticlesService>(ArticlesService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return user if username and password are valid', async () => {
      const user = { username: 'apply', password: 'apply' };
      jest
        .spyOn(articlesService, 'findOne')
        .mockImplementation(async () => user);

      const result = await authService.validateUser(
        user.username,
        user.password,
      );

      expect(articlesService.findOne).toHaveBeenCalledWith(user.username);
      expect(result).toEqual({ username: 'apply' });
    });

    it('should return null if username or password is invalid', async () => {
      const user = { username: 'not-apply', password: 'not-apply' };
      jest
        .spyOn(articlesService, 'findOne')
        .mockImplementation(async () => null);

      const result = await authService.validateUser(
        user.username,
        user.password,
      );

      expect(articlesService.findOne).toHaveBeenCalledWith(user.username);
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const user = { username: 'apply', userId: 1 };
      const token = 'testtoken';
      jest.spyOn(jwtService, 'sign').mockImplementation(() => token);

      const result = await authService.login(user);

      expect(jwtService.sign).toHaveBeenCalledWith({
        username: user.username,
        sub: user.userId,
      });
      expect(result).toEqual({ access_token: token });
    });
  });
});
