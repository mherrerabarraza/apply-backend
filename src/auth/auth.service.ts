import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ArticlesService } from 'src/articles/articles.service';

@Injectable()
export class AuthService {
  constructor(
    private articlesService: ArticlesService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.articlesService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
