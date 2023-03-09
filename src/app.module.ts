import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ArticlesModule } from './articles/articles.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { ArticlesService } from './articles/articles.service';
import { AppController } from './app.controller';
import { ArticlesController } from './articles/articles.controller';
import { HttpModule } from '@nestjs/axios';
import { DataSource } from 'typeorm';
import { Article } from './entities/articles/article.entity';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    // TypeORMConfiguration
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT) | 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [Article],
      synchronize: true,
    }),
    // JWT Configuration
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    // Schedule Configuration
    ScheduleModule.forRoot(),
    ArticlesModule,
    // HttpModule,
    HttpModule,
    AuthModule,
  ],
  controllers: [AppController, ArticlesController],
  providers: [AppService, ArticlesService],
})
export class AppModule {
  constructor(private readonly dataSource: DataSource) {}
}
