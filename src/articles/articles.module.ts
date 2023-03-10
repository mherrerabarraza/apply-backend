import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from 'src/entities/articles/article.entity';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import * as dotenv from 'dotenv';
dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forFeature([Article]),
    HttpModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [ArticlesService],
  controllers: [ArticlesController],
  exports: [TypeOrmModule, ArticlesService],
})
export class ArticlesModule {}
