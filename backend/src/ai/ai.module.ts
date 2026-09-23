import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AiMessages } from './entities/ai-messages';

import { UsersModule } from '../users/users.module';
import { SnippetModule } from '../snippet/snippet.module';
import { Snippet } from '../snippet/entities/snippet-entities';
import { SnippetVersions } from '../snippet/entities/snippet-versions-entities';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    SnippetModule,
    UsersModule,
    AuthModule,

    TypeOrmModule.forFeature([
        Snippet,
      SnippetVersions,
      AiMessages,
    ]),
  ],

  controllers: [AiController],

  providers: [AiService],
})
export class AiModule {}