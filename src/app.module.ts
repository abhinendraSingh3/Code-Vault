import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './users/entities/user.entity';
import { Snippet } from './snippet/entities/snippet-entities';

import { UsersModule } from './users/users.module';
import { SnippetModule } from './snippet/snippet.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ConfigService now usable anywhere, no need to re-import ConfigModule
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => { 
        return{
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT')?? '5432', 10),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'), 

        entities: [User, Snippet], 
        synchronize: true, // dev only — auto-creates tables from entities
        }
        
      },
      
    }),
    UsersModule,
    SnippetModule,
    AuthModule,
  ],

})
export class AppModule {}